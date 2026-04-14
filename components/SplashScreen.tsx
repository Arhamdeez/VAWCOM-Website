'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent body scroll while splash screen is visible
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        onComplete();
      }, 320);
    }, 1300);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'linear' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.45, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.06 
            }}
            className="relative z-10"
          >
            {/* Logo with proper rendering */}
            <div className="relative">
              {/* Subtle glow effect behind logo */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 1.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute left-1/2 top-1/2 h-[min(78vw,18rem)] w-[min(78vw,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl sm:h-[20rem] sm:w-[20rem] md:h-[27rem] md:w-[27rem] lg:h-[30rem] lg:w-[30rem]"
              />

              {/* Logo — unoptimized avoids loader flicker on the splash overlay */}
              <div className="relative flex h-[15rem] w-[15rem] items-center justify-center sm:h-[17rem] sm:w-[17rem] md:h-[23rem] md:w-[23rem] lg:h-[26rem] lg:w-[26rem]">
                <Image
                  src="/logo.png"
                  alt="VAWCOM Logo"
                  width={512}
                  height={512}
                  priority
                  unoptimized
                  className="h-full w-full object-contain drop-shadow-2xl"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.28 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.55,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

