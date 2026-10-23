'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PillNav from '@/components/home/PillNav';
import CtaFooter from '@/components/home/CtaFooter';
import '@/components/home/home.css';
import { EASE, DUR } from '@/lib/motion';

const NAV_WIDE_KEY = 'vaw-nav-wide';
/** Viewport band the fixed pill sits in — anything dark here flips link color. */
const NAV_BAND_TOP = 8;
const NAV_BAND_BOTTOM = 96;

type Props = {
  children: React.ReactNode;
  nav?: 'services' | 'gallery' | 'about' | 'contact';
  footer?: boolean;
};

function navOverDark() {
  const nodes = document.querySelectorAll('[data-nav-contrast="dark"]');
  for (const node of nodes) {
    const r = node.getBoundingClientRect();
    if (r.bottom > NAV_BAND_TOP && r.top < NAV_BAND_BOTTOM) return true;
  }
  return false;
}

export default function CreamPage({ children, nav = 'services', footer = true }: Props) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [onDark, setOnDark] = useState(false);

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

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = 0;
      setOnDark((prev) => {
        const next = navOverDark();
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="vaw-home bg-[#f5f3ee]">
      <motion.div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-3 sm:px-4"
        initial={false}
        animate={{ top: expanded ? 64 : 20 }}
        transition={{ duration: reduce ? 0 : DUR.enter, ease: EASE }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav active={nav} expanded={expanded} embedded onDark={onDark} />
        </div>
      </motion.div>
      {children}
      {footer ? <CtaFooter /> : null}
    </div>
  );
}
