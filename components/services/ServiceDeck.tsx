'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SERVICES, type Service } from '@/lib/services';

type Tone = { bar: string; wash: string; chip: string; ink: string };

/** Cream + brand green family — same site palette, different weight per lane */
const TONE: Record<string, Tone> = {
  web: {
    bar: '#0cb78b',
    wash: 'linear-gradient(155deg, #e6faf3 0%, #f5f3ee 52%, #fbf6ec 100%)',
    chip: 'bg-[#0cb78b]/15 text-[#067a5a]',
    ink: '#0cb78b',
  },
  apps: {
    bar: '#429f7f',
    wash: 'linear-gradient(155deg, #e9f6f0 0%, #f5f3ee 52%, #fbf6ec 100%)',
    chip: 'bg-[#429f7f]/16 text-[#2a6b55]',
    ink: '#429f7f',
  },
  voice: {
    bar: '#0a9d77',
    wash: 'linear-gradient(155deg, #e4f7f0 0%, #f5f3ee 50%, #ffffff 100%)',
    chip: 'bg-[#0a9d77]/14 text-[#067055]',
    ink: '#0a9d77',
  },
  ai: {
    bar: '#0cb78b',
    wash: 'linear-gradient(155deg, #ddf5eb 0%, #f0f7f3 48%, #fbf6ec 100%)',
    chip: 'bg-[#0cb78b]/18 text-[#056b50]',
    ink: '#067a5a',
  },
  commerce: {
    bar: '#2dd4a8',
    wash: 'linear-gradient(155deg, #eefaf5 0%, #f5f3ee 55%, #fbf6ec 100%)',
    chip: 'bg-[#0cb78b]/12 text-[#0a7a5c]',
    ink: '#0cb78b',
  },
  care: {
    bar: '#429f7f',
    wash: 'linear-gradient(155deg, #f0f8f4 0%, #f5f3ee 50%, #fbf6ec 100%)',
    chip: 'bg-[#429f7f]/14 text-[#2f6b55]',
    ink: '#429f7f',
  },
};

/** Mix tall/short in each outer lane so the scale jump reads clearly */
const LANES: Service[][] = [
  [SERVICES[0], SERVICES[5]], // web tall + care short
  [SERVICES[2], SERVICES[4]], // voice short + commerce tall
  [SERVICES[1], SERVICES[3]], // apps mid + ai mid
];

type CardSize = 'tall' | 'mid' | 'short';

const SIZE: Record<string, CardSize> = {
  web: 'tall',
  apps: 'mid',
  voice: 'short',
  ai: 'mid',
  commerce: 'tall',
  care: 'short',
};

const SIZE_CLASS: Record<CardSize, string> = {
  tall: 'min-h-[28rem] p-7',
  mid: 'min-h-[17rem] p-5',
  short: 'min-h-[10rem] p-3.5',
};

const TITLE_CLASS: Record<CardSize, string> = {
  tall: 'text-[clamp(1.7rem,2.2vw,2.05rem)]',
  mid: 'text-[1.3rem]',
  short: 'text-[1.05rem]',
};

function TeaserCard({ service }: { service: Service }) {
  const tone = TONE[service.id] ?? TONE.web;
  const size = SIZE[service.id] ?? 'mid';
  const chips = size === 'tall' ? 3 : size === 'mid' ? 2 : 1;

  return (
    <Link
      id={service.id}
      href={`/services/${service.id}`}
      className={`vaw-svc-card scroll-mt-28 flex flex-col rounded-[1.4rem] border border-black/[0.05] shadow-[0_10px_28px_rgba(22,22,21,0.07)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(22,22,21,0.12)] ${SIZE_CLASS[size]}`}
      style={{ background: tone.wash }}
    >
      <span
        className={`rounded-full ${size === 'tall' ? 'h-2.5 w-14' : size === 'mid' ? 'h-2 w-11' : 'h-1.5 w-8'}`}
        style={{ background: tone.bar }}
        aria-hidden
      />
      <p
        className={`m-0 font-semibold uppercase tracking-[0.16em] ${size === 'short' ? 'mt-3 text-[10px]' : 'mt-4 text-[11px]'}`}
        style={{ color: tone.ink }}
      >
        {service.nav}
      </p>
      <h3
        className={`vaw-display mt-2 m-0 leading-[0.95] tracking-[-0.03em] text-[#161615] ${TITLE_CLASS[size]}`}
      >
        {service.title}
      </h3>
      {size === 'tall' ? (
        <p className="mt-3 mb-0 text-[14px] leading-relaxed text-[#3d3c39]">{service.lede}</p>
      ) : size === 'mid' ? (
        <p className="mt-2.5 mb-0 line-clamp-3 text-[13px] leading-snug text-[#3d3c39]">{service.lede}</p>
      ) : (
        <p className="mt-1.5 mb-0 line-clamp-2 text-[12px] leading-snug text-[#3d3c39]">{service.help}</p>
      )}
      <ul className="mt-auto mb-0 flex flex-wrap gap-1.5 pt-3 p-0">
        {service.extras.slice(0, chips).map((x) => (
          <li
            key={x}
            className={`rounded-full px-2.5 py-1 font-medium ${tone.chip} ${size === 'short' ? 'text-[10.5px]' : 'text-[11.5px]'}`}
          >
            {x}
          </li>
        ))}
      </ul>
      <span
        className={`mt-2.5 inline-flex items-center gap-1 font-semibold ${size === 'short' ? 'text-[12px]' : 'text-[13px]'}`}
        style={{ color: tone.ink }}
      >
        Full details
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function Lane({
  services,
  delay,
}: {
  services: Service[];
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={reduce ? false : { y: 48 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {services.map((s) => (
        <TeaserCard key={s.id} service={s} />
      ))}
    </motion.div>
  );
}

function FlattenDeck() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="grid w-full grid-cols-3 gap-5 py-2 pl-[4.75rem] pr-8"
      initial={reduce ? false : { rotateX: 18, scale: 1.04 }}
      whileInView={{ rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: '50% 0%' }}
    >
      <Lane services={LANES[0]} delay={0} />
      <Lane services={LANES[1]} delay={0.06} />
      <Lane services={LANES[2]} delay={0.12} />
    </motion.div>
  );
}

function Stack({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-4 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:pl-20 lg:pr-8">
      {services.map((s) => (
        <TeaserCard key={s.id} service={s} />
      ))}
    </div>
  );
}

export default function ServiceDeck() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (reduce || !wide) {
    return <Stack services={[...SERVICES]} />;
  }

  return <FlattenDeck />;
}
