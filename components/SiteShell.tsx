'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';
import { ChatProvider } from '@/components/chat/SiteChat';
import CursorGlow from '@/components/CursorGlow';

const STANDALONE_PREFIXES = ['/hisaab/'];

function isStandalonePath(pathname: string) {
  return STANDALONE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* Cream routes own nav/footer/backdrop */
  if (
    pathname === '/' ||
    pathname === '/contact' ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/gallery')
  ) {
    return (
      <SplashScreenWrapper>
        <main className="relative min-h-0 w-full bg-[#0b0d0c] supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
          {children}
        </main>
      </SplashScreenWrapper>
    );
  }

  return (
    <SplashScreenWrapper>
      <Navbar />
      <main className="page-enter relative min-h-0 w-full overflow-x-hidden bg-[#050a14] supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
        {children}
      </main>
      <Footer />
    </SplashScreenWrapper>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isStandalonePath(pathname)) {
    return <StandaloneShell>{children}</StandaloneShell>;
  }

  return (
    <ChatProvider>
      <CursorGlow />
      <AppShell>{children}</AppShell>
    </ChatProvider>
  );
}
