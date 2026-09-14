'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './home.css';
import PillNav, { type NavOpen } from './PillNav';
import HeroSection, { HeroBanner } from './HeroSection';
import HeroFollowLine from './HeroFollowLine';
import ServicesSection from './ServicesSection';
import TechStackSection from './TechStackSection';
import WhyChooseUs from './WhyChooseUs';
import AiPromoSection from './AiPromoSection';
import CtaFooter from './CtaFooter';

function HomeChrome() {
  const [navOpen, setNavOpen] = useState<NavOpen>('full');
  const lastY = useRef(0);
  const modeRef = useRef<NavOpen>('full');
  const halfUntil = useRef(0);

  useEffect(() => {
    if (window.location.hash.slice(1) === 'services') {
      window.location.replace('/services');
      return;
    }
    lastY.current = window.scrollY;
    const apply = (next: NavOpen) => {
      if (modeRef.current === next) return;
      modeRef.current = next;
      sessionStorage.setItem('vaw-nav-wide', next === 'full' ? '1' : '0');
      setNavOpen(next);
    };
    apply(window.scrollY <= 20 ? 'full' : 'compact');
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      if (y <= 20) {
        apply('full');
        return;
      }
      if (dy < -4) {
        halfUntil.current = performance.now() + 2800;
        apply('half');
        return;
      }
      if (dy <= 4) return;
      // Leave half only after the hold, or a clear push down.
      if (modeRef.current === 'half') {
        if (performance.now() < halfUntil.current && dy < 28) return;
        if (dy < 14) return;
      }
      apply('compact');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const atTop = navOpen === 'full';

  return (
    <>
      <HeroBanner hidden={!atTop} />
      <motion.div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-3 sm:px-4"
        initial={false}
        animate={{ top: atTop ? 54 : 16 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav collapsible open={navOpen} active="home" embedded />
        </div>
      </motion.div>
    </>
  );
}

export default function HomePage() {
  const followSpanRef = useRef<HTMLDivElement>(null);
  const globeSlotRef = useRef<HTMLDivElement>(null);

  return (
    <div className="vaw-home">
      <HomeChrome />
      <div ref={followSpanRef} className="vaw-follow-span relative overflow-visible">
        <HeroFollowLine containerRef={followSpanRef} globeSlotRef={globeSlotRef} />
        <HeroSection />
        <ServicesSection />
        <TechStackSection />
        <WhyChooseUs slotRef={globeSlotRef} />
      </div>
      <AiPromoSection />
      <CtaFooter />
    </div>
  );
}
