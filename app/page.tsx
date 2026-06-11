import Hero from '@/components/Hero';
import HomeHashScroll from '@/components/HomeHashScroll';
import Services from '@/components/Services';
import TechMarquee from '@/components/TechMarquee';
import AdditionalServices from '@/components/AdditionalServices';

export default function Home() {
  return (
    <>
      <HomeHashScroll />
      {/* Full-bleed hero — standalone */}
      <Hero />

      {/* Tech strip — standalone */}
      <TechMarquee />

      {/* Interactive demos — feathered into #050a14 below (no divider strip) */}
      <Services />

      {/* And much more — matches feather end colour */}
      <AdditionalServices />
    </>
  );
}
