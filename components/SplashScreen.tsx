'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { easeSmooth, easeOut } from '@/lib/motion';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['800'],
  display: 'swap',
});

interface SplashScreenProps {
  onExiting: () => void;
  onComplete: () => void;
}

const FADE_MS = 280;
const HOLD_MS = 60;
const SPLIT_MS = 480;
const SIDES_MS = 280;
const LOGO_HOLD_MS = 160;
const EXIT_FALLBACK_MS = 550;

export default function SplashScreen({ onExiting, onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);
  const [split, setSplit] = useState(false);
  const [clearSides, setClearSides] = useState(false);
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

    const timers: ReturnType<typeof setTimeout>[] = [];

    const beginExit = () => {
      onExiting();
      setShow(false);
      exitFallbackRef.current = setTimeout(finishOnce, EXIT_FALLBACK_MS);
    };

    if (reduceMotion === true) {
      setSplit(true);
      setClearSides(true);
      timers.push(setTimeout(beginExit, 380));
    } else {
      const splitAt = FADE_MS + HOLD_MS;
      const sidesAt = splitAt + SPLIT_MS;
      const exitAt = sidesAt + SIDES_MS + LOGO_HOLD_MS;
      timers.push(setTimeout(() => setSplit(true), splitAt));
      timers.push(setTimeout(() => setClearSides(true), sidesAt));
      timers.push(setTimeout(beginExit, exitAt));
    }

    return () => {
      timers.forEach(clearTimeout);
      if (exitFallbackRef.current) {
        clearTimeout(exitFallbackRef.current);
        exitFallbackRef.current = null;
      }
      document.body.style.overflow = '';
    };
    // reduceMotion intentionally omitted — only read once per mount to avoid resetting timers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExiting, finishOnce]);

  const backdropExit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.15 } }
    : { opacity: 0, transition: { duration: 0.4, ease: easeOut } };

  const markExit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.15 } }
    : {
        opacity: 0,
        y: -6,
        transition: { duration: 0.35, ease: easeOut },
      };

  const splitTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: easeSmooth };

  const sidesTransition = reduceMotion
    ? { duration: 0 }
    : { duration: SIDES_MS / 1000, ease: easeSmooth };

  const knockTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.5, 0, 1, 1] as const, delay: split ? 0.02 : 0 };

  const dropTransition = reduceMotion
    ? { duration: 0 }
    : split
      ? { type: 'spring' as const, stiffness: 520, damping: 30, mass: 0.65, delay: 0.03 }
      : { duration: 0 };

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
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F5F3EE]"
          aria-label="VAWCOM"
          role="img"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={markExit}
            transition={reduceMotion ? { duration: 0 } : { duration: FADE_MS / 1000, ease: easeSmooth }}
            className={`${jakarta.className} relative z-10 flex items-center text-[clamp(2.6rem,8.5vw,5.25rem)] font-extrabold leading-none tracking-[-0.08em] text-[#161615]`}
          >
            <motion.span
              animate={{
                x: clearSides ? '-55vw' : split ? '-0.45em' : 0,
                opacity: clearSides ? 0 : 1,
              }}
              transition={clearSides ? sidesTransition : splitTransition}
              className="relative z-[1] -mr-[0.04em]"
            >
              VA
            </motion.span>
            <span className="relative z-[2] inline-block">
              <span className="invisible select-none" aria-hidden>
                W
              </span>
              <motion.span
                initial={false}
                animate={
                  split
                    ? { x: '-35%', y: '65vh', rotate: 20, opacity: 0 }
                    : { x: '-50%', y: '-50%', rotate: 0, opacity: 1 }
                }
                transition={knockTransition}
                className="absolute left-1/2 top-1/2"
              >
                W
              </motion.span>
              <motion.span
                initial={false}
                animate={
                  split
                    ? { x: '-50%', y: '-50%', scale: 2.2, opacity: 1 }
                    : { x: '-50%', y: '-48vh', scale: 1.35, opacity: 0 }
                }
                transition={dropTransition}
                className="absolute left-1/2 top-1/2 block"
                aria-hidden
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={512}
                  height={512}
                  priority
                  unoptimized
                  className="h-[1.2em] w-[1.2em] max-w-none object-contain"
                />
              </motion.span>
            </span>
            <motion.span
              animate={{
                x: clearSides ? '55vw' : split ? '0.45em' : 0,
                opacity: clearSides ? 0 : 1,
              }}
              transition={clearSides ? sidesTransition : splitTransition}
              className="relative z-[1] -ml-[0.04em]"
            >
              COM
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
