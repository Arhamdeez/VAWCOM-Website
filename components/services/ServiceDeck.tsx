'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { SERVICES, type Service } from '@/lib/services';

type Tone = {
  wash: string;
  chip: string;
  ink: string;
  title?: string;
  body?: string;
};

/** Cream + brand green family — same site palette, different weight per lane */
const TONE: Record<string, Tone> = {
  web: {
    wash: '#000000',
    chip: 'bg-[#0cb78b]/20 text-[#2dd4a8]',
    ink: '#0cb78b',
    title: '#ece9e3',
    body: 'rgba(236,233,227,0.72)',
  },
  apps: {
    wash: '#000000',
    chip: 'bg-[#0cb78b]/20 text-[#2dd4a8]',
    ink: '#0cb78b',
    title: '#ece9e3',
    body: 'rgba(236,233,227,0.72)',
  },
  voice: {
    wash: 'linear-gradient(155deg, #e4f7f0 0%, #f5f3ee 50%, #ffffff 100%)',
    chip: 'bg-[#0a9d77]/14 text-[#067055]',
    ink: '#0a9d77',
  },
  ai: {
    wash: 'linear-gradient(155deg, #ddf5eb 0%, #f0f7f3 48%, #fbf6ec 100%)',
    chip: 'bg-[#0cb78b]/18 text-[#056b50]',
    ink: '#067a5a',
  },
  commerce: {
    wash: '#000000',
    chip: 'bg-[#0cb78b]/22 text-[#2dd4a8]',
    ink: '#0cb78b',
    title: '#ece9e3',
    body: 'rgba(236,233,227,0.72)',
  },
  care: {
    wash: 'linear-gradient(155deg, #f0f8f4 0%, #f5f3ee 50%, #fbf6ec 100%)',
    chip: 'bg-[#429f7f]/14 text-[#2f6b55]',
    ink: '#429f7f',
  },
  erp: {
    wash: 'linear-gradient(155deg, #e8f4ef 0%, #f5f3ee 52%, #ffffff 100%)',
    chip: 'bg-[#3d7a6a]/14 text-[#2a564a]',
    ink: '#3d7a6a',
  },
  crm: {
    wash: 'linear-gradient(155deg, #fbf0e8 0%, #f5f3ee 48%, #ffffff 100%)',
    chip: 'bg-[#e07a4a]/16 text-[#9a4a28]',
    ink: '#c45f2f',
  },
};

function svc(id: Service['id']) {
  return SERVICES.find((s) => s.id === id)!;
}

/** Mix tall/short in each outer lane so the scale jump reads clearly.
 *  ERP left column, CRM right column. */
const LANES: Service[][] = [
  [svc('web'), svc('erp')],
  [svc('voice'), svc('apps'), svc('care')],
  [svc('commerce'), svc('crm'), svc('ai')],
];

type CardSize = 'tall' | 'mid' | 'short';

const SIZE: Record<string, CardSize> = {
  web: 'tall',
  apps: 'tall',
  voice: 'short',
  ai: 'mid',
  commerce: 'mid',
  care: 'short',
  erp: 'mid',
  crm: 'mid',
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
  const titleColor = tone.title ?? '#161615';
  const bodyColor = tone.body ?? '#3d3c39';
  const isWeb = service.id === 'web';
  const isApps = service.id === 'apps';
  const darkCard = Boolean(tone.title);

  return (
    <Link
      id={service.id}
      href={`/services/${service.id}`}
      data-nav-contrast={darkCard ? 'dark' : undefined}
      className={`vaw-svc-card isolate scroll-mt-28 flex flex-col rounded-[1.4rem] border border-black/[0.05] shadow-[0_10px_28px_rgba(22,22,21,0.07)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(22,22,21,0.12)] ${SIZE_CLASS[size]} ${
        darkCard ? 'border-white/[0.06]' : ''
      }`}
      style={{ background: tone.wash }}
    >
      <p
        className={`relative m-0 font-semibold uppercase tracking-[0.16em] ${size === 'short' ? 'text-[10px]' : 'text-[11px]'}`}
        style={{ color: tone.ink }}
      >
        {service.nav}
      </p>
      <h3
        className={`vaw-display relative mt-2 m-0 leading-[0.95] tracking-[-0.03em] ${TITLE_CLASS[size]}`}
        style={{ color: titleColor }}
      >
        {service.title}
      </h3>
      {size === 'tall' ? (
        <p className="relative mt-3 mb-0 text-[14px] leading-relaxed" style={{ color: bodyColor }}>
          {service.lede}
        </p>
      ) : size === 'mid' ? (
        <p className="relative mt-2.5 mb-0 line-clamp-3 text-[13px] leading-snug" style={{ color: bodyColor }}>
          {service.lede}
        </p>
      ) : (
        <p className="relative mt-1.5 mb-0 line-clamp-2 text-[12px] leading-snug" style={{ color: bodyColor }}>
          {service.help}
        </p>
      )}
      {isWeb ? (
        <span
          className="relative my-auto flex min-h-[9rem] flex-1 items-center justify-center overflow-hidden py-2"
          aria-hidden
        >
          <Image
            src="/services/web-stack.png"
            alt=""
            width={1280}
            height={720}
            sizes="400px"
            className="pointer-events-none h-full max-h-[14rem] w-auto max-w-[100%] select-none object-contain object-center"
          />
        </span>
      ) : isApps ? (
        <span
          className="relative my-auto flex min-h-[9rem] flex-1 items-center justify-center overflow-hidden py-3"
          aria-hidden
        >
          <Image
            src="/appdev_card.png"
            alt=""
            width={1254}
            height={1254}
            sizes="220px"
            className="pointer-events-none h-full max-h-[11.5rem] w-auto max-w-[90%] select-none object-contain object-center"
          />
        </span>
      ) : (
        <span className="relative mt-auto" aria-hidden />
      )}
      <ul className="relative mt-4 mb-0 flex list-none flex-wrap gap-1.5 p-0">
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
        className={`relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0cb78b] font-semibold text-[#0b0d0c] ${
          size === 'short' ? 'px-3 py-1.5 text-[12px]' : 'px-3.5 py-2 text-[13px]'
        }`}
      >
        Full details
        <ArrowUpRight className={size === 'short' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </span>
    </Link>
  );
}

function Lane({
  services,
  progress,
  from,
}: {
  services: Service[];
  progress: MotionValue<number>;
  from: string;
}) {
  const y = useTransform(progress, [0, 0.55], [from, '0%']);
  return (
    <motion.div className="flex flex-col gap-5" style={{ y }}>
      {services.map((s) => (
        <TeaserCard key={s.id} service={s} />
      ))}
    </motion.div>
  );
}

function FlattenDeck({ progress }: { progress: MotionValue<number> }) {
  const rotateX = useTransform(progress, [0, 0.55], [34, 0]);

  return (
    <motion.div
      className="grid w-full grid-cols-3 items-start gap-5 will-change-transform"
      style={{
        rotateX,
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 0%',
      }}
    >
      <Lane services={LANES[0]} progress={progress} from="10%" />
      <Lane services={LANES[1]} progress={progress} from="4%" />
      <Lane services={LANES[2]} progress={progress} from="12%" />
    </motion.div>
  );
}

function Stack({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-4 px-5 sm:grid-cols-2 sm:gap-5 sm:px-8 lg:grid-cols-3 lg:pl-20 lg:pr-8">
      {services.map((s) => (
        <TeaserCard key={s.id} service={s} />
      ))}
    </div>
  );
}

function FlattenTrack() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={track} className="relative hidden h-[118vh] lg:block">
      <div
        className="sticky top-24 overflow-hidden py-4 pl-[4.75rem] pr-8"
        style={{ perspective: '1600px', perspectiveOrigin: '50% 12%' }}
      >
        <FlattenDeck progress={scrollYProgress} />
      </div>
    </div>
  );
}

export default function ServiceDeck() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Flatten scroll only when the jump rail exists (lg+) — md kept the 3-col
    // perspective with rail padding and looked shoved to one side.
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (desktop === null) return null;
  if (reduce || !desktop) return <Stack services={[...SERVICES]} />;
  return <FlattenTrack />;
}
