'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { easePage, ui } from '@/lib/motion';

/**
 * Route change: brief dip into deep shadow, then veil lifts while content rises in.
 * Avoids layout “black flash” (veil is intentional, same family as page bg).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="relative w-full">{children}</div>;
  }

  return (
    <motion.div key={pathname} className="relative w-full">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#010205]/95 via-[#050a14]/85 to-[#050a14]/25"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: ui.pageVeilMs,
          ease: easePage,
        }}
      />
      <motion.div
        className="relative z-[2]"
        initial={{ opacity: 0.08, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ui.pageContentMs,
          delay: ui.pageEnterDelay,
          ease: easePage,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
