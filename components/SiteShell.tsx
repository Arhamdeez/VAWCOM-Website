'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';
import { ChatProvider } from '@/components/chat/SiteChat';
import CursorGlow from '@/components/CursorGlow';

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
      '/gallery',
      '/about',
      '/contact',
    ];
    const id = window.setTimeout(() => {
      for (const href of routes) router.prefetch(href);
    }, 200);
    return () => window.clearTimeout(id);
  }, [router]);

  if (isStandalonePath(pathname)) {
    return <StandaloneShell>{children}</StandaloneShell>;
  }

  const cream = isCreamPath(pathname);

  return (
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
  );
}
