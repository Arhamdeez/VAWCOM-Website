'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { RefObject } from 'react';

const AsciiGlobe = dynamic(() => import('./AsciiGlobe'), { ssr: false });

const POINTS = [
  {
    title: 'Founder-led',
    body: 'You work with the people who build the product.',
  },
  {
    title: 'One team, start to finish',
    body: 'Web, apps, and AI stay with the same team from the first call to launch.',
  },
] as const;

export default function WhyChooseUs({
  slotRef,
}: {
  slotRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      id="why"
      className="vaw-hero relative z-[2] overflow-visible border-t border-black/[0.06] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 xl:gap-12">
        <div
          ref={slotRef}
          data-globe-slot
          aria-hidden
          className="relative z-[3] mx-auto aspect-square w-[min(100%,22rem)] sm:w-[min(100%,28rem)] lg:w-full lg:max-w-[38rem]"
        >
          <AsciiGlobe />
        </div>

        <div className="relative z-[2]">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
            Why choose us
          </p>
          <div className="w-fit max-w-full">
            <h2 className="vaw-display m-0 text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[0.96] tracking-[-0.03em] text-[#161615]">
              We work across the map.
            </h2>
            <p className="mt-5 max-w-[36ch] text-[16px] leading-relaxed text-[#5c5a56]">
              Clients in France, Germany, Nigeria, and Pakistan, and we can take on every
              kind of global requirement. If you need it built for your market, we can do it.
            </p>
            <ul className="mt-8 w-[80%] space-y-3">
              {POINTS.map((p) => (
                <li key={p.title} className="vaw-glass rounded-[1.35rem]">
                  <div className="vaw-glass-core rounded-[1.15rem] px-5 py-4">
                    <p className="m-0 text-[14.5px] font-semibold tracking-[-0.01em] text-[#161615]">
                      {p.title}
                    </p>
                    <p className="mt-1 mb-0 text-[13.5px] leading-snug text-[#5c5a56]">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-5 py-3 text-[14px] font-medium text-[#f5f3ee] hover:bg-[#0a9d77]"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
