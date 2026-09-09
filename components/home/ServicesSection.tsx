'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SERVICE_TRACK } from '@/lib/services';
import LiquidLens from './LiquidLens';

const AUDIENCES = [
  {
    id: 'individuals',
    label: 'Individuals',
    blurb: 'Solo founders and creators who need a sharp product without a big team.',
  },
  {
    id: 'businesses',
    label: 'Businesses',
    blurb: 'Teams that need reliable sites, apps, and AI baked into how they work.',
  },
] as const;

export default function ServicesSection() {
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]['id']>('individuals');
  const [active, setActive] = useState<number | null>(null);
  const current = AUDIENCES.find((a) => a.id === audience)!;

  return (
    <section
      id="services"
      className="vaw-hero relative z-[2] overflow-visible border-t border-black/[0.06] pb-10 pt-14 sm:pb-12 sm:pt-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
            Services
          </p>
          <h2 className="vaw-display m-0 text-[clamp(2.1rem,4.8vw,3.75rem)] leading-[0.96] tracking-[-0.03em] text-[#161615]">
            What do you want to build?
          </h2>
          <p className="mx-auto mt-5 max-w-[34ch] text-[16px] leading-relaxed text-[#5c5a56]">
            {current.blurb}
          </p>

          <div
            className="mx-auto mt-7 inline-flex rounded-full border border-black/[0.08] bg-white/50 p-1"
            role="tablist"
            aria-label="Who we build for"
          >
            {AUDIENCES.map((a) => {
              const on = audience === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setAudience(a.id)}
                  className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                    on
                      ? 'bg-[#0cb78b] text-[#f5f3ee]'
                      : 'text-[#5c5a56] hover:text-[#161615]'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-0 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse 55% 80% at 12% 40%, rgba(12,183,139,0.28), transparent 72%), radial-gradient(ellipse 50% 70% at 88% 50%, rgba(184,217,60,0.24), transparent 72%), radial-gradient(ellipse 50% 60% at 50% 100%, rgba(232,103,74,0.16), transparent 78%)',
            }}
          />
          <div className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-2 md:pt-2 [&::-webkit-scrollbar]:hidden">
            {SERVICE_TRACK.map((svc, i) => {
              const open = active === i;
              return (
                <motion.div
                  key={svc.title}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className={`vaw-glass w-[min(78vw,20rem)] shrink-0 snap-center rounded-[1.75rem] md:w-auto ${
                    open ? 'is-liquid-hot' : ''
                  }`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-10 -z-[1] blur-3xl"
                    style={{
                      background: `radial-gradient(ellipse 80% 70% at 30% 25%, ${svc.color}55, transparent 70%)`,
                    }}
                  />
                  <LiquidLens active={open} />
                  <div className="vaw-glass-core relative z-[1] flex flex-col rounded-[1.35rem] p-6 text-left">
                    <span
                      className="mb-5 block h-1.5 w-10 rounded-full"
                      style={{ background: svc.color === '#429f7f' ? '#0cb78b' : svc.color }}
                      aria-hidden
                    />
                    <span className="vaw-display text-[1.35rem] leading-tight tracking-[-0.02em] text-[#161615] sm:text-[1.5rem]">
                      {svc.title}
                    </span>
                    <span
                      className={`mt-3 block text-[14.5px] leading-snug text-[#5c5a56] transition-opacity ${
                        open ? 'opacity-100' : 'opacity-75'
                      }`}
                    >
                      {svc.body}
                    </span>
                    <Link
                      href={svc.href}
                      className={`mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#0cb78b] transition-opacity hover:text-[#0a9d77] ${
                        open ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      See this service
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[12.5px] text-[#8a8882] md:hidden">
            Swipe to see all services
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#0cb78b] px-6 py-3 text-[14.5px] font-medium text-[#f5f3ee] hover:bg-[#0a9d77]"
          >
            Talk to us
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-[14.5px] font-medium text-[#161615] hover:text-[#0cb78b]"
          >
            All services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
