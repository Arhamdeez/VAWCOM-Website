'use client';

import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import TechMarquee from '@/components/TechMarquee';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <ScrollProgress />
      <Hero />
      <TechMarquee />
      <Services />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
