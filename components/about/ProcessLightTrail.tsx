'use client';

import { useId, useRef, useLayoutEffect, useState } from 'react';
import {
  Code2,
  Layers,
  LayoutTemplate,
  Lightbulb,
  ListChecks,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/process';

const ICONS: LucideIcon[] = [Lightbulb, ListChecks, LayoutTemplate, Layers, Code2, Rocket];

export default function ProcessLightTrail() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const listRef = useRef<HTMLOlElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [pathD, setPathD] = useState('');
  const [railH, setRailH] = useState(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const root = list.getBoundingClientRect();
      const centers = nodeRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return r.top - root.top + r.height / 2;
        })
        .filter((y): y is number => y != null);
      if (centers.length < 2) {
        setPathD('');
        setRailH(root.height);
        return;
      }
      const [first, ...rest] = centers;
      setPathD(`M12 ${first} ${rest.map((y) => `V${y}`).join(' ')}`);
      setRailH(root.height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pathId = `${uid}-rail`;

  return (
    <div className="relative mx-auto w-full max-w-[36rem]">
      <ol ref={listRef} className="relative m-0 list-none space-y-5 p-0 sm:space-y-6">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-[1.35rem] top-0 z-0 w-6 -translate-x-1/2 overflow-visible sm:left-[1.5rem]"
          width={24}
          height={Math.max(railH, 1)}
          viewBox={`0 0 24 ${Math.max(railH, 1)}`}
        >
          <defs>
            {pathD ? <path id={pathId} d={pathD} /> : null}
            <filter id={`${uid}-glow`} x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {pathD ? (
            <path
              d={pathD}
              fill="none"
              stroke="rgba(12,183,139,0.35)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          ) : null}
          {!reduce && pathD ? (
            <circle r={3.8} fill="#0cb78b" filter={`url(#${uid}-glow)`}>
              <animateMotion dur="4.5s" repeatCount="indefinite">
                <mpath xlinkHref={`#${pathId}`} href={`#${pathId}`} />
              </animateMotion>
            </circle>
          ) : null}
        </svg>

        {PROCESS_STEPS.map((step, i) => {
          const Icon = ICONS[i] ?? Lightbulb;
          return (
            <li key={step.title} className="relative z-[1] flex gap-4 sm:gap-5">
              <div className="flex w-[2.7rem] flex-none flex-col items-center sm:w-[3rem]">
                <span
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border border-[#0cb78b]/35 bg-[#f5f3ee] text-[#0cb78b] shadow-[0_0_0_4px_rgba(245,243,238,1),0_0_18px_rgba(12,183,139,0.28)] sm:h-12 sm:w-12"
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.85} />
                </span>
                <span className="mt-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#0cb78b]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="min-w-0 flex-1 rounded-[1.25rem] border border-black/[0.06] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(22,22,21,0.05)] sm:px-6 sm:py-5">
                <h3 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#161615] sm:text-[1.5rem]">
                  {step.title}
                </h3>
                <p className="mt-1.5 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
                  {step.line}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
