'use client';

import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import SplashScreen from './SplashScreen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

const SPLASH_FAILSAFE_MS = 3600;

function hasSeenSplash(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem('hasSeenSplash') === 'true';
  } catch {
    return true;
  }
}

function setSplashPending(pending: boolean) {
  const root = document.documentElement;
  root.classList.toggle('splash-pending', pending);
  if (pending) {
    root.classList.remove('splash-complete', 'splash-exiting');
  }
}

function setSplashExiting() {
  const root = document.documentElement;
  root.classList.remove('splash-pending');
  root.classList.add('splash-exiting');
}

function setSplashComplete() {
  const root = document.documentElement;
  root.classList.remove('splash-pending', 'splash-exiting', 'splash-react-ready');
  root.classList.add('splash-complete');
  document.body.style.overflow = '';
}

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
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
    const seen = hasSeenSplash();
    if (seen) {
      finishSplash();
      return;
    }

    setSplashPending(true);
    setShowSplash(true);

    const failsafe = window.setTimeout(finishSplash, SPLASH_FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, [finishSplash]);

  const handleSplashExiting = useCallback(() => {
    setSplashExiting();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050a14]">
      <div className="splash-boot" aria-hidden="true" />

      <div id="vawcom-app" className="relative">
        {children}
      </div>

      {showSplash ? (
        <SplashScreen onExiting={handleSplashExiting} onComplete={finishSplash} />
      ) : null}
    </div>
  );
}
