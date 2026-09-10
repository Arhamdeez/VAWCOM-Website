'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/process';

const PANELS = [
  { bg: '#0cb78b', ink: '#0b0d0c', muted: '#0b0d0c' },
  { bg: '#161615', ink: '#ece9e3', muted: '#c8c5bf' },
  { bg: '#ffffff', ink: '#161615', muted: '#5c5a56' },
  { bg: '#0a9d77', ink: '#0b0d0c', muted: '#0b0d0c' },
  { bg: '#0b0d0c', ink: '#ece9e3', muted: '#c8c5bf' },
  { bg: '#e6faf3', ink: '#161615', muted: '#5c5a56' },
] as const;

/** Horizontal accordion — LTR order; active expands, others collapse. */
export default function ProcessLightTrail() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div
      className="mx-auto flex h-[18rem] w-full max-w-[56rem] gap-2.5 sm:h-[20rem] sm:gap-3"
      role="list"
      aria-label="How we work, in order"
    >
      {PROCESS_STEPS.map((step, i) => {
        const on = i === active;
        const tone = PANELS[i]!;
        return (
          <motion.button
            key={step.title}
            type="button"
            role="listitem"
            aria-current={on ? 'step' : undefined}
            aria-expanded={on}
            onClick={() => setActive(i)}
            initial={false}
            animate={{
              flexGrow: on ? 5.5 : 0.85,
              flexBasis: on ? '48%' : '0%',
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }
            }
            className="relative flex h-full min-w-[3.75rem] flex-col overflow-hidden rounded-[1.25rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0cb78b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ee] sm:min-w-[4.25rem] sm:rounded-[1.35rem]"
            style={{ background: tone.bg, color: tone.ink, flexShrink: 1 }}
          >
            {/* Collapsed: vertical title */}
            <span
              aria-hidden={on}
              className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
                on ? 'opacity-0' : 'opacity-100 delay-100'
              }`}
            >
              <span
                className="text-[15px] font-semibold tracking-[-0.01em] sm:text-[16px]"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {step.title}
              </span>
            </span>

            {/* Expanded: title + line */}
            <span
              className={`relative z-[1] flex h-full flex-col justify-center px-6 py-6 transition-opacity duration-150 sm:px-8 sm:py-8 ${
                on ? 'opacity-100 delay-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <span className="vaw-display block text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.03em]">
                {step.title}
              </span>
              <span
                className="mt-4 block max-w-[26ch] text-[15px] font-medium leading-relaxed sm:text-[16px]"
                style={{ color: tone.muted }}
              >
                {step.line}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
