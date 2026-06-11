import type { Transition } from 'framer-motion';

/** Smooth deceleration — enters, reveals, crossfades. */
export const easeSmooth = [0.22, 1, 0.36, 1] as const;

/** @deprecated Use easeSmooth — kept for existing imports. */
export const easeSnappy = easeSmooth;

/** Route / page content easing. */
export const easePage = [0.16, 1, 0.3, 1] as const;

/** Ambient loops — soft in-out between keyframes. */
export const easeAmbient = [0.45, 0, 0.55, 1] as const;

/** Fade-out and gentle exits. */
export const easeOut = [0.33, 1, 0.68, 1] as const;

export const spring = {
  hover: { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.85 },
  drawer: { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.9 },
  nav: { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.95 },
};

export const ui = {
  enter: 0.5,
  reveal: 0.45,
  crossfade: 0.38,
  exit: 0.42,
  stagger: 0.07,
  pageMs: 0.45,
  pageEnterDelay: 0.08,
  pageVeilMs: 0.48,
  pageContentMs: 0.5,
} as const;

export function tEnter(delay = 0): Transition {
  return { duration: ui.enter, delay, ease: easeSmooth };
}

export function tReveal(delay = 0): Transition {
  return { duration: ui.reveal, delay, ease: easeSmooth };
}

export function tStagger(index: number, base = 0): Transition {
  return { duration: ui.reveal, delay: base + index * ui.stagger, ease: easeSmooth };
}

export const tCrossfade: Transition = { duration: ui.crossfade, ease: easeSmooth };

export const tExit: Transition = { duration: ui.exit, ease: easeOut };

/** Splash logo enter — soft premium settle. */
export const tSplashEnter: Transition = { duration: 0.62, ease: easeSmooth };

/** Splash overlay exit — overlaps with app reveal. */
export const tSplashExit: Transition = { duration: 0.72, ease: easeOut };

/** App content reveal under splash. */
export const tSplashReveal: Transition = { duration: 0.78, ease: easePage };

export function tAmbient(duration: number, delay = 0): Transition {
  return { duration, delay, repeat: Infinity, ease: easeAmbient };
}

/** CSS cubic-bezier string — keep in sync with easeSmooth. */
export const cssEaseSmooth = 'cubic-bezier(0.22, 1, 0.36, 1)';
