'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onExiting: () => void;
  onComplete: () => void;
}

const FADE_IN_MS = 280;
const HOLD_MS = 320;
const FADE_OUT_MS = 280;

export default function SplashScreen({ onExiting, onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const [logoOn, setLogoOn] = useState(false);
  const finishedRef = useRef(false);

  const fadeIn = reduceMotion === true ? 80 : FADE_IN_MS;
  const hold = reduceMotion === true ? 200 : HOLD_MS;
  const fadeOut = reduceMotion === true ? 150 : FADE_OUT_MS;

  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    document.documentElement.classList.add('splash-react-ready');
    document.body.style.overflow = 'hidden';

    const inId = window.setTimeout(() => setLogoOn(true), 20);
    const outId = window.setTimeout(() => {
      onExiting();
      setLogoOn(false);
    }, fadeIn + hold);
    const doneId = window.setTimeout(finishOnce, fadeIn + hold + fadeOut + 40);

    return () => {
      window.clearTimeout(inId);
      window.clearTimeout(outId);
      window.clearTimeout(doneId);
      document.body.style.overflow = '';
    };
  }, [fadeIn, hold, fadeOut, onExiting, finishOnce]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F5F3EE]"
      aria-label="VAWCOM"
      role="img"
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={690}
        height={370}
        priority
        unoptimized
        className="h-auto w-[clamp(12rem,46vw,24rem)] object-contain"
        style={{
          opacity: logoOn ? 1 : 0,
          transition: `opacity ${logoOn ? fadeIn : fadeOut}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
}
