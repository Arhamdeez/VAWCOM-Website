'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onExiting: () => void;
  onComplete: () => void;
}

/** Shared with the server-rendered boot plate. */
export const SPLASH_LOGO_CLASS =
  'h-auto w-[clamp(10rem,min(70vw,46vw),22rem)] max-w-full object-contain';

/**
 * Drives the server-rendered `.splash-boot` plate (globals.css owns the visuals): holds it
 * until the page is ready, then flips `splash-exiting` so the logo and plate fade out.
 */
/** Logo out (300ms) overlapping plate fade (150ms delay + 500ms), see globals.css. */
const FADE_OUT_MS = 650;
/** Never hold the user longer than this, even if something never reports ready. */
const MAX_WAIT_MS = 6000;
/** Floor so a cached production load still leaves the mark readable. */
const MIN_VISIBLE_MS = 1400;

/** Webfonts + (on home) the measured scribble, then two frames so it has painted. */
function pageReady(): Promise<void> {
  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const scribble =
    !document.querySelector('.vaw-follow-span') || document.documentElement.dataset.scribble === 'ready'
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener('vaw:scribble-ready', () => r(), { once: true }));
  const painted = () =>
    new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  return Promise.race([
    Promise.all([fonts, scribble]).then(painted),
    new Promise<void>((r) => window.setTimeout(r, MAX_WAIT_MS)),
  ]);
}

/** Let the shared entrance finish so the splash never leaves on dots alone. */
function logoSettled(): Promise<void> {
  const logo = document.querySelector('.splash-boot img');
  const running = (logo?.getAnimations?.() ?? []).filter((a) => a.playState === 'running');
  return Promise.all(running.map((a) => a.finished.catch(() => undefined))).then(() => undefined);
}

export default function SplashScreen({ onExiting, onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const finishedRef = useRef(false);

  const fadeOut = reduceMotion === true ? 200 : FADE_OUT_MS;

  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('splash-react-ready', 'splash-locked');
    document.body.style.overflow = 'hidden';

    let cancelled = false;
    let doneId = 0;
    const started = performance.now();
    const minVisible = reduceMotion === true ? 500 : MIN_VISIBLE_MS;
    pageReady().then(logoSettled).then(() => {
      const remaining = Math.max(0, minVisible - (performance.now() - started));
      return new Promise<void>((resolve) => window.setTimeout(resolve, remaining));
    }).then(() => {
      if (cancelled) return;
      onExiting();
      document.body.style.overflow = '';
      doneId = window.setTimeout(finishOnce, fadeOut);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(doneId);
      root.classList.remove('splash-locked');
      document.body.style.overflow = '';
    };
  }, [fadeOut, onExiting, finishOnce]);

  return null;
}
