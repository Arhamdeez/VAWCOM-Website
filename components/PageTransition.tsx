'use client';

import { useReducedMotion } from 'framer-motion';

/** Lightweight wrapper — avoid remounting routes (prevents flash / blank states). */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="relative w-full">{children}</div>;
  }

  return <div className="page-enter relative w-full">{children}</div>;
}
