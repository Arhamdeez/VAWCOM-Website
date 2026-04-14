'use client';

import { motion } from 'framer-motion';

/**
 * Shared atmosphere for inner pages — matches home hero tones (emerald / teal / slate).
 * Parent must be `relative min-h-screen overflow-hidden`.
 */
export default function PremiumPageBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900"
        aria-hidden
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 left-[6%] h-[min(100vw,22rem)] w-[min(100vw,22rem)] rounded-full bg-emerald-500/14 blur-3xl will-change-transform md:h-[min(100vw,28rem)] md:w-[min(100vw,28rem)] md:bg-emerald-500/20"
          animate={{ scale: [1, 1.08, 1], x: [0, 22, 0], y: [0, 14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 right-[4%] h-[min(100vw,20rem)] w-[min(100vw,20rem)] rounded-full bg-teal-500/12 blur-3xl will-change-transform md:h-[min(100vw,26rem)] md:w-[min(100vw,26rem)] md:bg-teal-500/16"
          animate={{ scale: [1, 1.1, 1], x: [0, -28, 0], y: [0, -18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-[28%] h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl will-change-transform md:h-96 md:w-96 md:bg-cyan-500/12"
          animate={{ opacity: [0.28, 0.45, 0.28], scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.35] md:bg-[size:4rem_4rem] md:opacity-[0.45]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(16,185,129,0.1),transparent_55%)] md:bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(16,185,129,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/90"
        aria-hidden
      />
    </>
  );
}
