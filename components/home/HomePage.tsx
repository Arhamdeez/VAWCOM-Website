'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { motion } from 'framer-motion';
import './home.css';
import PillNav from './PillNav';
import HeroSection, { HeroBanner } from './HeroSection';
import HeroFollowLine from './HeroFollowLine';
import ServicesSection from './ServicesSection';
import TechStackSection from './TechStackSection';
import WhyChooseUs from './WhyChooseUs';
import { useHomeMotion } from './useHomeMotion';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

function HomeChrome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
    <div className={jakarta.className}>
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
    </div>
  );
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const followSpanRef = useRef<HTMLDivElement>(null);
  const globeSlotRef = useRef<HTMLDivElement>(null);
  useHomeMotion(rootRef);

  return (
    <div ref={rootRef} className={`vaw-home ${jakarta.variable} ${jakarta.className}`}>
      <HomeChrome />
      <div ref={followSpanRef} className="vaw-follow-span relative overflow-visible">
        <HeroFollowLine containerRef={followSpanRef} globeSlotRef={globeSlotRef} />
        <HeroSection />
        <ServicesSection />
        <TechStackSection />
        <WhyChooseUs slotRef={globeSlotRef} />
      </div>
    </div>
  );
}
