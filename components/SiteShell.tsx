'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffectWrapper from '@/components/BackgroundEffectWrapper';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';
import PageTransition from '@/components/PageTransition';

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

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isStandalonePath(pathname)) {
    return <StandaloneShell>{children}</StandaloneShell>;
  }

  /* Design home + contact own nav/footer/backdrop */
  if (pathname === '/' || pathname === '/contact') {
    return (
      <SplashScreenWrapper>
        {/* overflow visible so sticky zoom / services pin work */}
        <main className="relative min-h-0 w-full bg-[#0b0d0c] supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
          {children}
        </main>
      </SplashScreenWrapper>
    );
  }

  return (
    <SplashScreenWrapper>
      <BackgroundEffectWrapper />
      <Navbar />
      <main className="relative min-h-0 w-full overflow-x-hidden bg-[#050a14] supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </SplashScreenWrapper>
  );
}
