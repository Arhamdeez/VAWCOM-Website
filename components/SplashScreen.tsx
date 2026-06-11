'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { tAmbient, tEnter, tExit } from '@/lib/motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('splash-react-ready');
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, 420);
    }, 900);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={tExit}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={tEnter(0.08)}
            className="relative z-10"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.2, 0.38, 0.2],
                }}
                transition={tAmbient(2.4)}
                className="absolute left-1/2 top-1/2 h-[min(78vw,18rem)] w-[min(78vw,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl sm:h-[20rem] sm:w-[20rem] md:h-[27rem] md:w-[27rem] lg:h-[30rem] lg:w-[30rem]"
              />

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tEnter(0.35)}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.45, 1, 0.45],
                  }}
                  transition={tAmbient(0.9, i * 0.12)}
                  className="h-2 w-2 rounded-full bg-emerald-500"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
