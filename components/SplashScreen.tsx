'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { easeOut, tAmbient, tSplashEnter, tSplashExit } from '@/lib/motion';

interface SplashScreenProps {
  onExiting: () => void;
  onComplete: () => void;
}

const SPLASH_HOLD_MS = 1080;
const SPLASH_HOLD_REDUCED_MS = 380;
const EXIT_FALLBACK_MS = 900;

export default function SplashScreen({ onExiting, onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);
  const finishedRef = useRef(false);
  const exitFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (exitFallbackRef.current) {
      clearTimeout(exitFallbackRef.current);
      exitFallbackRef.current = null;
    }
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    document.documentElement.classList.add('splash-react-ready');
    document.body.style.overflow = 'hidden';

    const holdMs = reduceMotion === true ? SPLASH_HOLD_REDUCED_MS : SPLASH_HOLD_MS;
    const timer = setTimeout(() => {
      onExiting();
      setShow(false);
      exitFallbackRef.current = setTimeout(finishOnce, EXIT_FALLBACK_MS);
    }, holdMs);

    return () => {
      clearTimeout(timer);
      if (exitFallbackRef.current) {
        clearTimeout(exitFallbackRef.current);
        exitFallbackRef.current = null;
      }
      document.body.style.overflow = '';
    };
    // reduceMotion intentionally omitted — only read once per mount to avoid resetting the hold timer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExiting, finishOnce]);

  const backdropExit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.2 } }
    : { opacity: 0, scale: 1.015, transition: tSplashExit };

  const logoExit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.18 } }
    : {
        opacity: 0,
        scale: 0.94,
        y: -10,
        transition: { ...tSplashExit, duration: 0.58 },
      };

  return (
    <AnimatePresence onExitComplete={finishOnce}>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={backdropExit}
          onAnimationComplete={(definition) => {
            if (definition === 'exit') finishOnce();
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050a14]"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_40%,rgba(16,185,129,0.09)_0%,transparent_58%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(0,0,0,0.45)_0%,transparent_55%)]"
            aria-hidden
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={logoExit}
            transition={tSplashEnter}
            className="relative z-10"
          >
            <div className="relative">
              <motion.div
                animate={
                  reduceMotion
                    ? { opacity: 0.28 }
                    : {
                        scale: [1, 1.1, 1],
                        opacity: [0.18, 0.34, 0.18],
                      }
                }
                transition={reduceMotion ? { duration: 0 } : tAmbient(2.6)}
                className="absolute left-1/2 top-1/2 h-[min(78vw,18rem)] w-[min(78vw,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/22 to-teal-500/18 blur-3xl sm:h-[20rem] sm:w-[20rem] md:h-[27rem] md:w-[27rem] lg:h-[30rem] lg:w-[30rem]"
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.28, ease: easeOut } }}
            transition={{ ...tSplashEnter, delay: 0.22 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={
                    reduceMotion
                      ? { opacity: 0.7 }
                      : {
                          scale: [1, 1.12, 1],
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={reduceMotion ? { duration: 0 } : tAmbient(0.95, i * 0.14)}
                  className="h-2 w-2 rounded-full bg-emerald-500/90"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
