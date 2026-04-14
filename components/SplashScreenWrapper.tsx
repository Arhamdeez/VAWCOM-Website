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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Session storage is read after paint to avoid sync setState in the effect body (see react-hooks plugin).
    const id = requestAnimationFrame(() => {
      if (sessionStorage.getItem('hasSeenSplash')) {
        setShowSplash(false);
        document.body.classList.add('splash-complete');
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSplashComplete = () => {
    setIsTransitioning(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
      // Add class to body to allow scrolling
      document.body.classList.add('splash-complete');
    }, 100);
  };

  useEffect(() => {
    // Remove splash-complete class if showing splash
    if (showSplash && isClient) {
      document.body.classList.remove('splash-complete');
    }
  }, [showSplash, isClient]);

  if (!isClient) {
    // Show black screen while checking client-side state
    return (
      <div className="fixed inset-0 z-[9999] bg-black" />
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Splash screen - shows first, highest z-index */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      
      {/* Content - only renders after splash is done, fades in */}
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
      
      {/* Transition overlay - ensures smooth linear color transition from black to dark slate */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9998] bg-black pointer-events-none"
          onAnimationComplete={() => setIsTransitioning(false)}
        />
      )}
    </div>
  );
}

