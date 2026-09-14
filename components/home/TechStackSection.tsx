'use client';

import { useEffect, useRef } from 'react';
import { STACK_ICONS, stackIconUrl } from '@/lib/stackIcons';

type Tech = { name: string };

/** Client-facing stack — split across two opposing marquees */
const ROW_A: Tech[] = [
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'TypeScript' },
  { name: 'Node.js' },
  { name: 'Python' },
  { name: 'Flutter' },
  { name: 'React Native' },
  { name: 'Kotlin' },
  { name: 'Swift' },
  { name: 'Tailwind' },
];

const ROW_B: Tech[] = [
  { name: 'OpenAI' },
  { name: 'Claude' },
  { name: 'n8n' },
  { name: 'Twilio' },
  { name: 'AWS' },
  { name: 'Docker' },
  { name: 'Firebase' },
  { name: 'PostgreSQL' },
  { name: 'Django' },
  { name: 'Google Cloud' },
];

function TechPill({ tech }: { tech: Tech }) {
  const meta = STACK_ICONS[tech.name];
  const mask = meta ? `url(${stackIconUrl(meta.slug)})` : undefined;

  return (
    <div className="vaw-glass flex-none rounded-[1.75rem]">
      <div className="vaw-glass-core relative z-[1] flex items-center gap-2.5 rounded-[1.15rem] px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
        {meta ? (
          <span
            aria-hidden
            className="vaw-tech-icon h-6 w-6 flex-none sm:h-7 sm:w-7"
            style={{
              backgroundColor: meta.color,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          />
        ) : null}
        <span className="text-[13px] font-medium tracking-[-0.01em] text-[#161615] sm:text-[14px]">
          {tech.name}
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Tech[];
  direction: 'left' | 'right';
}) {
  const loop = [...items, ...items];

  return (
    <div className="vawcom-marquee">
      <div
        className={`vawcom-marquee-track gap-6 sm:gap-7 ${
          direction === 'left' ? 'vaw-tech-marquee-left' : 'vaw-tech-marquee-right'
        }`}
      >
        {loop.map((tech, i) => (
          <TechPill key={`${direction}-${tech.name}-${i}`} tech={tech} />
        ))}
      </div>
    </div>
  );
}

export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-offscreen', !entry.isIntersecting);
      },
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      aria-label="Technologies we work with"
      className="vaw-hero relative z-[2] overflow-hidden border-t border-black/[0.06] pb-12 pt-10 sm:pb-16 sm:pt-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(12,183,139,0.22), transparent 55%), radial-gradient(ellipse 50% 70% at 75% 40%, rgba(184,217,60,0.2), transparent 50%)',
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#f5f3ee] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-[#f5f3ee] to-transparent sm:w-24" />

      <div className="relative flex flex-col gap-4 sm:gap-5">
        <MarqueeRow items={ROW_A} direction="left" />
        <MarqueeRow items={ROW_B} direction="right" />
      </div>
    </section>
  );
}
