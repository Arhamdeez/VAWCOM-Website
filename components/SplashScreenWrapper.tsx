'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if splash screen has been shown before (using sessionStorage)
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setIsTransitioning(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 100);
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Content - always rendered, fades in when splash is done */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'linear' }}
        className="relative"
      >
        {children}
      </motion.div>
      
      {/* Splash screen - fades out */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      
      {/* Transition overlay - ensures smooth linear color transition from black to dark slate */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'linear' }}
          className="fixed inset-0 z-[9998] bg-black pointer-events-none"
          onAnimationComplete={() => setIsTransitioning(false)}
        />
      )}
    </div>
  );
}

