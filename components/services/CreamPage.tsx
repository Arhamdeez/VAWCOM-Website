'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PillNav, { type NavOpen } from '@/components/home/PillNav';
import CtaFooter from '@/components/home/CtaFooter';
import '@/components/home/home.css';
import { EASE, DUR } from '@/lib/motion';

const NAV_WIDE_KEY = 'vaw-nav-wide';
/** Viewport band the fixed pill sits in — anything dark here flips link color. */
const NAV_BAND_TOP = 8;
const NAV_BAND_BOTTOM = 96;
/** Sustained scroll before the pill morphs (ignores tiny flick jitter). */
const TRAVEL_PX = 48;

type Props = {
  children: React.ReactNode;
  nav?: 'services' | 'gallery' | 'about' | 'contact' | 'partners';
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
  const [navOpen, setNavOpen] = useState<NavOpen>('half');
  const [onDark, setOnDark] = useState(false);
  const lastY = useRef(0);
  const modeRef = useRef<NavOpen>('half');
  const travel = useRef(0);
  const dir = useRef(0);
  const landingMorph = useRef(false);

  useLayoutEffect(() => {
    const wide =
      !reduce &&
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(NAV_WIDE_KEY) === '1';
    if (wide) {
      landingMorph.current = true;
      sessionStorage.setItem(NAV_WIDE_KEY, '0');
      modeRef.current = 'full';
      setNavOpen('full');
      return;
    }
    const next: NavOpen = window.scrollY <= 20 ? 'half' : 'compact';
    modeRef.current = next;
    setNavOpen(next);
  }, [reduce]);

  // Brief full-width morph when arriving from the home bar, then settle.
  useEffect(() => {
    if (!landingMorph.current) return;
    landingMorph.current = false;
    const id = window.setTimeout(() => {
      const next: NavOpen = window.scrollY <= 20 ? 'half' : 'compact';
      modeRef.current = next;
      setNavOpen(next);
    }, 48);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;
    const apply = (next: NavOpen) => {
      if (modeRef.current === next) return;
      modeRef.current = next;
      setNavOpen(next);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      if (y <= 20) {
        travel.current = 0;
        dir.current = 0;
        apply('half');
        return;
      }
      if (dy === 0) return;
      const nextDir = dy > 0 ? 1 : -1;
      if (nextDir !== dir.current) {
        dir.current = nextDir;
        travel.current = 0;
      }
      travel.current += Math.abs(dy);
      if (travel.current < TRAVEL_PX) return;
      travel.current = 0;
      // Scroll up → half-open links; scroll down → compact logo + CTA.
      apply(nextDir < 0 ? 'half' : 'compact');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center pl-[max(var(--vaw-shell-pad),env(safe-area-inset-left))] pr-[max(var(--vaw-shell-pad),env(safe-area-inset-right))] pt-[env(safe-area-inset-top)]"
        initial={false}
        animate={{ top: navOpen === 'full' ? '4rem' : '1.25rem' }}
        transition={{ duration: reduce ? 0 : DUR.enter, ease: EASE }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav collapsible open={navOpen} active={nav} embedded onDark={onDark} />
        </div>
      </motion.div>
      {children}
      {footer ? <CtaFooter /> : null}
    </div>
  );
}
