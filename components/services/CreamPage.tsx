'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { Space_Grotesk, Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import { motion, useReducedMotion } from 'framer-motion';
import PillNav from '@/components/home/PillNav';
import CtaFooter from '@/components/home/CtaFooter';
import '@/components/home/home.css';

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const NAV_WIDE_KEY = 'vaw-nav-wide';

type Props = {
  children: React.ReactNode;
  nav?: 'services' | 'gallery';
  footer?: boolean;
};

export default function CreamPage({ children, nav = 'services', footer = true }: Props) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const wide =
      !reduce &&
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(NAV_WIDE_KEY) === '1';
    setExpanded(!!wide);
  }, [reduce]);

  useEffect(() => {
    if (!expanded) return;
    sessionStorage.setItem(NAV_WIDE_KEY, '0');
    const id = window.setTimeout(() => setExpanded(false), 48);
    return () => window.clearTimeout(id);
  }, [expanded]);

  return (
    <div
      className={`vaw-home ${space.variable} ${bricolage.variable} ${jakarta.variable} ${space.className}`}
    >
      <motion.div
        className={`${jakarta.className} pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-3 sm:px-4`}
        initial={false}
        animate={{ top: expanded ? 64 : 20 }}
        transition={{ duration: reduce ? 0 : 0.52, ease: [0.3, 0.9, 0.25, 1] }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav active={nav} expanded={expanded} embedded />
        </div>
      </motion.div>
      {children}
      {footer ? <CtaFooter /> : null}
    </div>
  );
}
