'use client';

import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';
import { clearSplashCookieHeader, splashCookieHeader } from '@/lib/splashBoot';

function wantsForcedSplash(pathname: string, search: string): boolean {
  if (pathname === '/splash') return true;
  return /(?:\?|&)splash(?:=|&|$)/.test(search);
}

function hasSeenSplash(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return document.cookie.split('; ').includes('vaw_splash=1');
  } catch {
    return true;
  }
}

function markSplashSeen() {
  try {
    document.cookie = splashCookieHeader();
  } catch {
    /* ignore */
  }
}

function clearSplashSeen() {
  try {
    document.cookie = clearSplashCookieHeader();
  } catch {
    /* ignore */
  }
}

function setSplashPending(pending: boolean) {
  const root = document.documentElement;
  root.classList.toggle('splash-pending', pending);
  if (pending) root.classList.remove('splash-complete', 'splash-exiting');
}

function setSplashExiting() {
  document.documentElement.classList.remove('splash-pending');
  document.documentElement.classList.add('splash-exiting');
}

function setSplashComplete() {
  const root = document.documentElement;
  root.classList.remove('splash-pending', 'splash-exiting', 'splash-react-ready');
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

  const finishSplash = useCallback(() => {
    markSplashSeen();
    // Stay on cream overlay until home is mounted. Unmounting on /splash
    // shows the navy html/body shell.
    if (forcedRef.current && window.location.pathname === '/splash') {
      router.replace('/');
      return;
    }
    if (completedRef.current) return;
    completedRef.current = true;
    setShowSplash(false);
    setSplashComplete();
  }, [router]);

  useLayoutEffect(() => {
    const forced = wantsForcedSplash(pathname, window.location.search);
    forcedRef.current = forced;

    if (forced) {
      completedRef.current = false;
      clearSplashSeen();
      setSplashPending(true);
      setShowSplash(true);
      const failsafe = window.setTimeout(finishSplash, 2200);
      return () => window.clearTimeout(failsafe);
    }

    if (completedRef.current) return;

    if (hasSeenSplash()) {
      finishSplash();
      return;
    }

    setSplashPending(true);
    setShowSplash(true);
    const failsafe = window.setTimeout(finishSplash, 2200);
    return () => window.clearTimeout(failsafe);
  }, [finishSplash, pathname]);

  return (
    <div className={`relative min-h-screen ${cream ? 'bg-[#f5f3ee]' : 'bg-[#050a14]'}`}>
      <div className="splash-boot" aria-hidden="true" />
      <div id="vawcom-app" className="relative">
        {children}
      </div>
      {showSplash ? (
        <SplashScreen onExiting={setSplashExiting} onComplete={finishSplash} />
      ) : null}
    </div>
  );
}
