'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';
import { ChatProvider } from '@/components/chat/SiteChat';
import CursorGlow from '@/components/CursorGlow';
import { SHOW_GALLERY } from '@/lib/site';

function isStandalonePath(pathname: string) {
  return pathname.startsWith('/hisaab/');
}

function isCreamPath(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/splash' ||
    pathname === '/contact' ||
    pathname === '/about' ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/gallery')
  );
}

function StandaloneShell({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('splash-complete');
    root.classList.remove('splash-pending', 'splash-exiting', 'splash-react-ready');
    document.body.style.overflow = '';
  }, []);

  return <div className="min-h-screen bg-[#050a14]">{children}</div>;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const routes = [
      '/',
      '/services',
      '/services/web',
      ...(SHOW_GALLERY ? ['/gallery'] : []),
      '/about',
      '/contact',
    ];
    // Idle, not +200ms: prefetching six routes mid-first-scroll competes with the main thread.
    const run = () => {
      for (const href of routes) router.prefetch(href);
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 1500);
    return () => window.clearTimeout(id);
  }, [router]);

  if (isStandalonePath(pathname)) {
    return (
      <MotionConfig reducedMotion="user">
        <StandaloneShell>{children}</StandaloneShell>
      </MotionConfig>
    );
  }

  const cream = isCreamPath(pathname);

  // reducedMotion="user": people who ask their OS for less motion get no transform/layout animation
  // from Framer anywhere on the site (opacity and colour still fade).
  return (
    <MotionConfig reducedMotion="user">
    <ChatProvider>
      <CursorGlow />
      <SplashScreenWrapper cream={cream}>
        <main
          className={`relative min-h-0 w-full supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))] ${
            cream ? 'bg-[#f5f3ee]' : 'overflow-x-hidden bg-[#050a14]'
          }`}
        >
          {children}
        </main>
      </SplashScreenWrapper>
    </ChatProvider>
    </MotionConfig>
  );
}
