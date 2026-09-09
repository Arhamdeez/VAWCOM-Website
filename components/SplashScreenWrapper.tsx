'use client';

import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import SplashScreen from './SplashScreen';

/** Failsafe lives in lib/splashBoot.ts (pre-paint). This only mounts the React splash. */

function hasSeenSplash(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    if (/(?:\?|&)splash(?:=|&|$)/.test(window.location.search)) {
      sessionStorage.removeItem('hasSeenSplash');
      return false;
    }
    return sessionStorage.getItem('hasSeenSplash') === 'true';
  } catch {
    return true;
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

export default function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const completedRef = useRef(false);

  const finishSplash = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setShowSplash(false);
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch {
      /* ignore */
    }
    setSplashComplete();
  }, []);

  useLayoutEffect(() => {
    if (hasSeenSplash()) {
      finishSplash();
      return;
    }
    setSplashPending(true);
    setShowSplash(true);
  }, [finishSplash]);

  return (
    <div className="relative min-h-screen bg-[#050a14]">
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
