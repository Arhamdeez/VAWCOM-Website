'use client';

import { useRef } from 'react';
import { Space_Grotesk, Bricolage_Grotesque } from 'next/font/google';
import './home.css';
import PillNav from './PillNav';
import HeroSection from './HeroSection';
import VoiceSection from './VoiceSection';
import AutomationSection from './AutomationSection';
import ServicesTrack from './ServicesTrack';
import AboutSection from './AboutSection';
import CtaFooter from './CtaFooter';
import { useHomeMotion } from './useHomeMotion';

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

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useHomeMotion(rootRef);

  return (
    <div
      ref={rootRef}
      className={`vaw-home ${space.variable} ${bricolage.variable} ${space.className}`}
    >
      <PillNav collapsible active="home" />
      <HeroSection />
      <VoiceSection />
      <AutomationSection />
      <ServicesTrack rootRef={rootRef} />
      <AboutSection />
      <CtaFooter />
    </div>
  );
}
