'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';

const clientSubscribe = () => () => {};
const isClientSnapshot = () => true;
const isServerSnapshot = () => false;

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  const isClient = useSyncExternalStore(clientSubscribe, isClientSnapshot, isServerSnapshot);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (sessionStorage.getItem('hasSeenSplash')) {
        setShowSplash(false);
        document.body.classList.add('splash-complete');
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
    document.body.classList.add('splash-complete');
  };

  useEffect(() => {
    if (showSplash && isClient) {
      document.body.classList.remove('splash-complete');
    }
  }, [showSplash, isClient]);

  if (!isClient) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050a14]" />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050a14]">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
