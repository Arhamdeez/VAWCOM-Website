'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import SplashScreen from './SplashScreen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

function hasSeenSplash(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem('hasSeenSplash') === 'true';
  } catch {
    return true;
  }
}

function setSplashClasses(pending: boolean) {
  const root = document.documentElement;
  root.classList.toggle('splash-pending', pending);
  root.classList.toggle('splash-complete', !pending);
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const seen = hasSeenSplash();
    setShowSplash(!seen);
    setSplashClasses(!seen);
    if (seen) {
      document.body.classList.add('splash-complete');
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch {
      /* ignore */
    }
    setSplashClasses(false);
    document.body.classList.add('splash-complete');
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050a14]">
      {/* Instant cover before React hydrates (hidden when splash-complete). */}
      <div className="splash-boot" aria-hidden="true" />

      <div id="vawcom-app" className="relative">
        {children}
      </div>

      {isClient && showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : null}
    </div>
  );
}
