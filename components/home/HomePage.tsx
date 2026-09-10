'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './home.css';
import PillNav from './PillNav';
import HeroSection, { HeroBanner } from './HeroSection';
import HeroFollowLine from './HeroFollowLine';
import ServicesSection from './ServicesSection';
import TechStackSection from './TechStackSection';
import WhyChooseUs from './WhyChooseUs';
import CtaFooter from './CtaFooter';

function HomeChrome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (window.location.hash.slice(1) === 'services') {
      window.location.replace('/services');
      return;
    }
    const onScroll = () => {
      const next = window.scrollY > 20;
      sessionStorage.setItem('vaw-nav-wide', next ? '0' : '1');
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <HeroBanner hidden={scrolled} />
      <motion.div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-3 sm:px-4"
        initial={false}
        animate={{ top: scrolled ? 16 : 64 }}
        transition={{ duration: 0.52, ease: [0.3, 0.9, 0.25, 1] }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav collapsible expanded={!scrolled} active="home" embedded />
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
      <CtaFooter />
    </div>
  );
}
