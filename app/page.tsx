import Hero from '@/components/Hero';
import Services from '@/components/Services';
import TechMarquee from '@/components/TechMarquee';
import AdditionalServices from '@/components/AdditionalServices';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050a14]">
      {/* Full-bleed hero — standalone */}
      <Hero />

      {/* Tech strip — standalone */}
      <TechMarquee />

      {/* Interactive demos — feathered into #050a14 below (no divider strip) */}
      <Services />

      {/* And much more — matches feather end colour */}
      <AdditionalServices />
    </main>
  );
}
