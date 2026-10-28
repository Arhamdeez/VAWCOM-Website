'use client';

import { useEffect, useRef, useState } from 'react';
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
  const travel = useRef(0);
  const dir = useRef(0);

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
        travel.current = 0;
        dir.current = 0;
        apply('full');
        return;
      }
      if (dy === 0) return;
      // A flick oscillates by a few pixels. Only a sustained direction changes the bar,
      // so one fast scroll settles on one size instead of restarting the morph.
      const next = dy > 0 ? 1 : -1;
      if (next !== dir.current) {
        dir.current = next;
        travel.current = 0;
      }
      travel.current += Math.abs(dy);
      if (travel.current < 56) return;
      travel.current = 0;
      apply(next < 0 ? 'half' : 'compact');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const atTop = navOpen === 'full';

  return (
    <>
      <HeroBanner hidden={!atTop} />
      <div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center pl-[max(var(--vaw-shell-pad),env(safe-area-inset-left))] pr-[max(var(--vaw-shell-pad),env(safe-area-inset-right))] transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          // 52px under the social buttons. 3rem higher once they hide, just below the status area.
          top: atTop
            ? 'calc(max(0.75rem, env(safe-area-inset-top)) + 3.25rem)'
            : 'calc(max(0.75rem, env(safe-area-inset-top)) + 0.25rem)',
        }}
      >
        <div className="pointer-events-auto flex w-full justify-center">
          <PillNav collapsible open={navOpen} active="home" embedded />
        </div>
      </div>
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
