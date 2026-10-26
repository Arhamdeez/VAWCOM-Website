'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { STEPS } from '@/lib/partners';
import { railBoltKeys } from '@/lib/motion';

/**
 * The five steps. Cards settle in on first view; on desktop a glowing bolt runs the rail between
 * the numbered nodes (same motion as About → Our process). Stacked below lg: number over card, no rail.
 */
export default function StepFlow() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [seen, setSeen] = useState(false);
  const [pathD, setPathD] = useState('');
  const [rail, setRail] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(id);
    }
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
        setSeen(true);
        window.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
      }
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const root = list.getBoundingClientRect();
      const points = nodeRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left - root.left + r.width / 2,
            y: r.top - root.top + r.height / 2,
          };
        })
        .filter((p): p is { x: number; y: number } => p != null);

      setRail({ w: root.width, h: root.height });

      if (points.length < 2) {
        setPathD('');
        return;
      }
      const [first, ...rest] = points;
      setPathD(
        `M${first.x} ${first.y} ${rest.map((p) => `L${p.x} ${p.y}`).join(' ')}`,
      );
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
  const bolt = railBoltKeys(STEPS.length);

  return (
    <ol
      ref={listRef}
      className="relative m-0 grid list-none gap-5 p-0 lg:grid-cols-5 lg:gap-4"
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 hidden overflow-visible lg:block"
        width={Math.max(rail.w, 1)}
        height={Math.max(rail.h, 1)}
        viewBox={`0 0 ${Math.max(rail.w, 1)} ${Math.max(rail.h, 1)}`}
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
            strokeLinejoin="round"
          />
        ) : null}
        {!reduce && pathD && bolt ? (
          <circle r={3.8} fill="#0cb78b" filter={`url(#${uid}-glow)`}>
            <animateMotion
              dur={bolt.dur}
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints={bolt.keyPoints}
              keyTimes={bolt.keyTimes}
            >
              <mpath xlinkHref={`#${pathId}`} href={`#${pathId}`} />
            </animateMotion>
          </circle>
        ) : null}
      </svg>

      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className="relative z-[1] flex flex-col items-center gap-3 lg:gap-5 lg:text-center"
        >
          <span
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            className="relative z-[1] flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#0cb78b]/40 bg-[#f5f3ee] font-mono text-[0.8125rem] font-semibold text-[#0a9d77] shadow-[0_0_0_0.3125rem_#f5f3ee,0_0_1.375rem_rgba(12,183,139,0.25)]"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div
            className={`w-full min-w-0 rounded-[1.25rem] bg-white px-5 py-4 text-left shadow-[0_0.625rem_1.75rem_rgba(22,22,21,0.05)] transition-[opacity,transform] duration-enter lg:text-center ${
              seen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: seen ? `${250 + i * 160}ms` : '0ms' }}
          >
            <h3 className="m-0 text-[0.9688rem] font-semibold tracking-[-0.01em] text-[#161615]">
              {step.title}
            </h3>
            <p className="mb-0 mt-1.5 text-[0.8438rem] leading-relaxed text-[#5c5a56]">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
