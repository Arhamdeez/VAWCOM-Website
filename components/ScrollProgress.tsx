'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 origin-left z-50" style={{ scaleX }} />

      <motion.div className="fixed bottom-8 right-8 z-50" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="8" />

          <motion.circle cx="50" cy="50" r="40" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" style={{ pathLength: scrollYProgress }} strokeDasharray="0 1" />

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }) }}>
          <motion.span className="text-emerald-400 text-xs">{Math.round(scrollYProgress.get() * 100)}%</motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}
