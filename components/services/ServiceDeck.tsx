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
  const titleColor = tone.title ?? '#161615';
  const bodyColor = tone.body ?? '#3d3c39';
  const isWeb = service.id === 'web';
  const isApps = service.id === 'apps';
  const isCommerce = service.id === 'commerce';
  const darkCard = Boolean(tone.title);

  return (
    <Link
      id={service.id}
      href={`/services/${service.id}`}
      className={`vaw-svc-card isolate scroll-mt-28 flex flex-col rounded-[1.4rem] border border-black/[0.05] shadow-[0_10px_28px_rgba(22,22,21,0.07)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(22,22,21,0.12)] ${
        isApps ? 'min-h-0 p-5' : SIZE_CLASS[size]
      } ${darkCard ? 'border-white/[0.06]' : ''} ${isCommerce ? 'relative overflow-hidden' : ''}`}
      style={{ background: tone.wash }}
    >
      {isCommerce ? (
        <>
          <Image
            src="/services/commerce-phone.png"
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="pointer-events-none object-cover object-center"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85"
            aria-hidden
          />
        </>
      ) : null}
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
            className="pointer-events-none h-full max-h-[14rem] w-auto max-w-[100%] select-none object-contain object-center"
          />
        </span>
      ) : isApps ? null : (
        <span className="relative mt-auto" aria-hidden />
      )}
      <ul className={`relative mb-0 flex list-none flex-wrap gap-1.5 p-0 ${isApps ? 'mt-3' : 'mt-4'}`}>
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
        className={`relative inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0cb78b] font-semibold text-[#0b0d0c] ${
          isApps ? 'mt-3' : 'mt-4'
        } ${size === 'short' ? 'px-3 py-1.5 text-[12px]' : 'px-3.5 py-2 text-[13px]'}`}
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
    <div className="grid gap-4 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:pl-20 lg:pr-8">
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
    layoutEffect: false,
  });

  return (
    <div ref={track} className="relative h-[118vh]">
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
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (wide === null) return null;
  if (reduce || !wide) return <Stack services={[...SERVICES]} />;
  return <FlattenTrack />;
}
