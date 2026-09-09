'use client';

import { useEffect, useRef, useState } from 'react';
import LiquidLens from './LiquidLens';

type Tech = {
  name: string;
  slug: string;
  color: string;
};

/** Client-facing stack — split across two opposing marquees */
const ROW_A: Tech[] = [
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', color: '#161615' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'Node.js', slug: 'nodedotjs', color: '#339933' },
  { name: 'Python', slug: 'python', color: '#3776AB' },
  { name: 'Flutter', slug: 'flutter', color: '#02569B' },
  { name: 'React Native', slug: 'react', color: '#61DAFB' },
  { name: 'Kotlin', slug: 'kotlin', color: '#7F52FF' },
  { name: 'Swift', slug: 'swift', color: '#F05138' },
  { name: 'Tailwind', slug: 'tailwindcss', color: '#06B6D4' },
];

const ROW_B: Tech[] = [
  { name: 'OpenAI', slug: 'openai', color: '#412991' },
  { name: 'Claude', slug: 'anthropic', color: '#D4A27F' },
  { name: 'n8n', slug: 'n8n', color: '#EA4B71' },
  { name: 'Twilio', slug: 'twilio', color: '#F22F46' },
  { name: 'AWS', slug: 'amazonaws', color: '#FF9900' },
  { name: 'Docker', slug: 'docker', color: '#2496ED' },
  { name: 'Firebase', slug: 'firebase', color: '#FFCA28' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
  { name: 'Django', slug: 'django', color: '#092E20' },
  { name: 'Google Cloud', slug: 'googlecloud', color: '#4285F4' },
];

const ICON_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons';

function TechPill({ tech }: { tech: Tech }) {
  const mask = `url(${ICON_BASE}/${tech.slug}.svg)`;

  return (
    <div className="vaw-glass flex-none rounded-[1.75rem]">
      <div className="vaw-glass-core relative z-[1] flex items-center gap-2.5 rounded-[1.15rem] px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
        <span
          aria-hidden
          className="vaw-tech-icon h-6 w-6 flex-none sm:h-7 sm:w-7"
          style={{
            backgroundColor: tech.color,
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        />
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const stuckRef = useRef<HTMLElement | null>(null);
  const [hot, setHot] = useState(false);
  const loop = [...items, ...items];

  useEffect(() => {
    if (!hot) return;
    let raf = 0;
    const STICK = 56;
    const PULL = 16;

    const tick = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const lens = lensRef.current;
      if (!wrap || !track || !lens) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const pills = track.querySelectorAll<HTMLElement>('.vaw-glass');
      const { x: mx, y: my } = mouseRef.current;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      pills.forEach((el) => {
        const r = el.getBoundingClientRect();
        let d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        if (el === stuckRef.current) d -= STICK;
        if (d < bestD) {
          bestD = d;
          best = el;
        }
      });
      stuckRef.current = best;

      if (best) {
        const wr = wrap.getBoundingClientRect();
        const pr = best.getBoundingClientRect();
        const cx = pr.left - wr.left + pr.width / 2;
        const cy = pr.top - wr.top + pr.height / 2;
        const pullX = Math.max(-PULL, Math.min(PULL, (mx - (pr.left + pr.width / 2)) * 0.22));
        lens.style.left = `${cx + pullX}px`;
        lens.style.top = `${cy}px`;
        lens.style.width = `${pr.width + 28}px`;
        lens.style.height = `${pr.height + 24}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hot]);

  return (
    <div
      ref={wrapRef}
      className="vawcom-marquee"
      onMouseEnter={() => setHot(true)}
      onMouseMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        if (!hot) setHot(true);
      }}
      onMouseLeave={() => {
        stuckRef.current = null;
        setHot(false);
      }}
    >
      <div
        ref={trackRef}
        className={`vawcom-marquee-track gap-6 sm:gap-7 ${
          direction === 'left' ? 'vaw-tech-marquee-left' : 'vaw-tech-marquee-right'
        }`}
      >
        {loop.map((tech, i) => (
          <TechPill key={`${direction}-${tech.name}-${i}`} tech={tech} />
        ))}
      </div>
      {hot ? (
        <div ref={lensRef} className="vaw-marquee-lens">
          <LiquidLens />
        </div>
      ) : null}
    </div>
  );
}

export default function TechStackSection() {
  return (
    <section
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
