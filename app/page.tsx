import Hero from '@/components/Hero';
import Services from '@/components/Services';
import TechMarquee from '@/components/TechMarquee';
import AdditionalServices from '@/components/AdditionalServices';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TechMarquee />

      <div className="site-bg">
        {/* Keep existing sections/components */}
        <Services />
        <AdditionalServices />
      </div>
    </div>
  );
}
