'use client';

import { motion } from 'framer-motion';

/**
 * Same atmosphere as the home hero: radial mint/teal spotlight, dust, vignette, soft motion orbs.
 * Parent must be `relative min-h-screen overflow-hidden`.
 */
export default function PremiumPageBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-slate-950" aria-hidden />

      {/* Radial spotlight — matches Hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_38%,rgba(45,212,191,0.26)_0%,rgba(52,211,153,0.14)_28%,rgba(6,78,59,0.22)_52%,rgba(15,23,42,0.92)_78%,rgb(2,6,23)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(167,243,208,0.08)_0%,transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(rgba(204,251,241,0.14)_1px,transparent_1px)] [background-size:22px_22px] sm:opacity-[0.38]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_105%_105%_at_50%_50%,transparent_32%,rgba(2,6,23,0.55)_100%)]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[14%] left-[6%] h-48 w-48 rounded-full bg-emerald-400/12 blur-3xl sm:h-64 sm:w-64 md:top-[18%] md:left-[10%] md:h-80 md:w-80 md:bg-emerald-400/15"
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 28, 0],
            y: [0, 18, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[8%] h-48 w-48 rounded-full bg-teal-400/12 blur-3xl sm:h-64 sm:w-64 md:bottom-[14%] md:right-[10%] md:h-80 md:w-80 md:bg-teal-400/15"
          animate={{
            scale: [1, 1.14, 1],
            x: [0, -28, 0],
            y: [0, -18, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-[36%] h-[min(52vw,24rem)] w-[min(120vw,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/10 blur-[80px] md:top-[40%] md:bg-teal-200/12"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.03, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </>
  );
}
