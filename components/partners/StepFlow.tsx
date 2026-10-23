'use client';

import { useEffect, useRef, useState } from 'react';
import { STEPS } from '@/lib/partners';

/**
 * The five steps. The line draws itself and the cards settle in one after another the first time the
 * block reaches the screen (scroll check, not IntersectionObserver, so a fast jump can't skip it).
 */
export default function StepFlow() {
  const ref = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  return (
    <ol
      ref={ref}
      className="relative m-0 grid list-none gap-5 p-0 lg:grid-cols-5 lg:gap-4"
    >
      {/* drawn line: vertical on phones, horizontal from lg up */}
      <span
        aria-hidden
        className={`absolute bottom-6 left-[1.35rem] top-6 w-0.5 origin-top rounded-full bg-gradient-to-b from-[#0cb78b] to-[#0cb78b]/20 transition-transform duration-[1400ms] ease-out lg:hidden ${
          seen ? 'scale-y-100' : 'scale-y-0'
        }`}
      />
      <span
        aria-hidden
        className={`absolute left-[10%] right-[10%] top-[1.35rem] hidden h-0.5 origin-left rounded-full bg-gradient-to-r from-[#0cb78b] to-[#0cb78b]/25 transition-transform duration-[1600ms] ease-out lg:block ${
          seen ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className={`relative flex gap-4 transition-[opacity,transform] duration-enter lg:flex-col lg:items-center lg:gap-5 lg:text-center ${
            seen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: seen ? `${250 + i * 160}ms` : '0ms' }}
        >
          <span className="relative z-[1] flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#0cb78b]/40 bg-[#f5f3ee] font-mono text-[13px] font-semibold text-[#0a9d77] shadow-[0_0_0_5px_#f5f3ee,0_0_22px_rgba(12,183,139,0.25)]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1 rounded-[1.25rem] bg-white px-5 py-4 text-left shadow-[0_10px_28px_rgba(22,22,21,0.05)] lg:w-full lg:flex-none lg:text-center">
            <h3 className="m-0 text-[15.5px] font-semibold tracking-[-0.01em] text-[#161615]">
              {step.title}
            </h3>
            <p className="mb-0 mt-1.5 text-[13.5px] leading-relaxed text-[#5c5a56]">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
