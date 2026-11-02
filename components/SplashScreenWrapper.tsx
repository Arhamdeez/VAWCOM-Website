'use client';

import { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen, { SPLASH_LOGO_CLASS } from './SplashScreen';
import { hasSeenSplash, markSplashSeen } from '@/lib/splashBoot';

function wantsForcedSplash(pathname: string, search: string): boolean {
  if (pathname === '/splash') return true;
  return /(?:\?|&)splash(?:=|&|$)/.test(search);
}

function setSplashPending(pending: boolean, forced = false) {
  const root = document.documentElement;
  root.classList.toggle('splash-pending', pending);
  root.classList.toggle('splash-forced', pending && forced);
  if (pending) root.classList.remove('splash-complete', 'splash-exiting');
}

function setSplashExiting() {
  // Keep splash-locked through the fade — unlocking mid-exit lets iOS
  // rubber-band and flash the navy/root background behind the plate.
  document.documentElement.classList.remove('splash-pending');
  document.documentElement.classList.add('splash-exiting');
}

function setSplashComplete() {
  const root = document.documentElement;
  root.classList.remove(
    'splash-pending',
    'splash-exiting',
    'splash-react-ready',
    'splash-locked',
    'splash-forced',
  );
  root.classList.add('splash-complete');
  document.body.style.overflow = '';
}

export default function SplashScreenWrapper({
  children,
  cream = false,
}: {
  children: React.ReactNode;
  cream?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const completedRef = useRef(false);
  const forcedRef = useRef(false);
  const activeRef = useRef(false);
  /** Forced /splash → / : keep the plate up through the replace. */
  const handingOffRef = useRef(false);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    // Stay on cream overlay until home is mounted. Unmounting on /splash
    // shows the navy html/body shell (the exit fade already ran via onExiting).
    if (forcedRef.current && window.location.pathname === '/splash') {
      handingOffRef.current = true;
      router.replace('/');
      return;
    }
    if (completedRef.current) {
      setSplashComplete();
      return;
    }
    completedRef.current = true;
    activeRef.current = false;
    handingOffRef.current = false;
    setShowSplash(false);
    setSplashComplete();
  }, [router]);

  useLayoutEffect(() => {
    const forced = wantsForcedSplash(pathname, window.location.search);
    forcedRef.current = forced;

    if (forced) {
      completedRef.current = false;
      handingOffRef.current = false;
      setSplashPending(true, true);
      setShowSplash(true);
      return;
    }

    // /splash → / handoff: cookie is set and the exit fade already played — settle once.
    if (handingOffRef.current) {
      handingOffRef.current = false;
      completedRef.current = true;
      activeRef.current = false;
      setShowSplash(false);
      setSplashComplete();
      return;
    }

    if (activeRef.current) return;
    if (hasSeenSplash() || completedRef.current) {
      completedRef.current = true;
      setShowSplash(false);
      setSplashComplete();
      return;
    }

    activeRef.current = true;
    setSplashPending(true);
    setShowSplash(true);
  }, [finishSplash, pathname]);

  // Last-resort if SplashScreen never settles (slow mobile, interrupted mount).
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!completedRef.current) finishSplash();
    }, 8000);
    return () => window.clearTimeout(id);
  }, [finishSplash]);

  return (
    <div className={`relative min-h-screen ${cream ? 'bg-[#f5f3ee]' : 'bg-[#050a14]'}`}>
      {/* Server-rendered twin of <SplashScreen>: the logo is on screen from the first paint. */}
      <div className="splash-boot" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" width={690} height={370} className={SPLASH_LOGO_CLASS} />
        <span className="splash-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div id="vawcom-app" className="relative">
        {children}
      </div>
      {showSplash ? (
        <SplashScreen onExiting={setSplashExiting} onComplete={finishSplash} />
      ) : null}
    </div>
  );
}
