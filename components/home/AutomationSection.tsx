'use client';

import { useEffect, useRef, useState } from 'react';
import { AUTOMATION_STEPS } from './data';

/** Visual automation walkthrough — colors/timing match VAWCOM Home.dc.html */
export default function AutomationSection() {
  const [step, setStep] = useState(0);
  const blotRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const blotAnim = useRef<Animation | null>(null);
  const bodyAnim = useRef<Animation | null>(null);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => {
      if (stepTimer.current) clearTimeout(stepTimer.current);
      blotAnim.current?.cancel();
      bodyAnim.current?.cancel();
    };
  }, []);

  const s = AUTOMATION_STEPS[step];
  const next = AUTOMATION_STEPS[(step + 1) % AUTOMATION_STEPS.length];

  const advance = (dir = 1) => {
    const to = Math.max(0, Math.min(AUTOMATION_STEPS.length - 1, step + dir));
    if (to === step) return;

    const blot = blotRef.current;
    const reduce = reduceRef.current;

    if (blotAnim.current) {
      try {
        blotAnim.current.cancel();
      } catch {
        /* ignore */
      }
      blotAnim.current = null;
    }
    if (stepTimer.current) clearTimeout(stepTimer.current);

    if (blot && !reduce) {
      blot.style.background = AUTOMATION_STEPS[to].bg;
      blotAnim.current = blot.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)' },
          { transform: 'translate(-50%, -50%) scale(1.06) rotate(26deg)' },
        ],
        { duration: 560, easing: 'cubic-bezier(.3,.9,.25,1)', fill: 'forwards' }
      );
    }

    stepTimer.current = setTimeout(
      () => {
        setStep(to);
        if (blotAnim.current) {
          try {
            blotAnim.current.cancel();
          } catch {
            /* ignore */
          }
          blotAnim.current = null;
        }
        if (blot) blot.style.transform = 'translate(-50%, -50%) scale(0)';

        const body = bodyRef.current;
        if (body && !reduce) {
          if (bodyAnim.current) {
            try {
              bodyAnim.current.cancel();
            } catch {
              /* ignore */
            }
          }
          bodyAnim.current = body.animate(
            [
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 440, easing: 'cubic-bezier(.2,1.2,.35,1)', fill: 'both' }
          );
        }
      },
      reduce ? 0 : 460
    );
  };

  return (
    <section id="flows" className="bg-[#0b0d0c] py-[104px] pb-[112px]">
      <div className="mx-auto max-w-[1440px] px-8">
        <h2 className="vaw-display m-0 max-w-[22ch] text-[clamp(34px,4.6vw,74px)] leading-[0.94] tracking-[-0.025em] text-[#ece9e3]">
          Automations for your business
        </h2>

        <div
          role="button"
          tabIndex={0}
          onClick={() => advance(1)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
              e.preventDefault();
              advance(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              advance(-1);
            }
          }}
          className="relative mt-9 h-[min(72vh,600px)] cursor-pointer overflow-hidden outline-none select-none"
          style={{
            backgroundColor: s.bg,
            transition: 'background-color 620ms cubic-bezier(.3,.9,.25,1)',
          }}
        >
          <div
            ref={blotRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 w-[180%]"
            style={{
              backgroundColor: next.bg,
              paddingBottom: '180%',
              borderRadius: '46% 54% 51% 49% / 49% 46% 54% 51%',
              transform: 'translate(-50%, -50%) scale(0)',
            }}
          />

          <div className="relative z-[1] flex h-full flex-col justify-between px-10 pb-[30px] pt-[34px]">
            <div className="flex items-start justify-end gap-6">
              <div className="flex gap-2">
                {AUTOMATION_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className="block h-1.5"
                    style={{
                      width: i === step ? 34 : 14,
                      backgroundColor: i <= step ? s.ink : s.inkSoft,
                      transition:
                        'width 420ms cubic-bezier(.3,.9,.25,1), background-color 420ms linear',
                    }}
                  />
                ))}
              </div>
            </div>

            <div ref={bodyRef} className="flex max-w-[22ch] flex-col gap-[22px]">
              <h3
                className="vaw-display m-0 text-[clamp(38px,6vw,96px)] leading-[0.88] tracking-[-0.03em]"
                style={{ color: s.ink }}
              >
                {s.head}
              </h3>
              <div
                className="max-w-[34ch] self-start px-[18px] py-3.5 text-[17.5px] leading-snug"
                style={{ backgroundColor: s.chip, color: s.ink }}
              >
                {s.proof}
              </div>
            </div>

            <div
              className="flex items-end justify-between gap-6 text-sm"
              style={{ color: s.inkSoft }}
            >
              <span>
                {step === AUTOMATION_STEPS.length - 1
                  ? 'That is the whole run'
                  : 'Tap anywhere for the next step'}
              </span>
              <button
                type="button"
                disabled={step === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  advance(-1);
                }}
                className="rounded-sm border bg-transparent px-3.5 py-2 text-[13.5px] disabled:cursor-default"
                style={{
                  borderColor: s.inkSoft,
                  color: s.ink,
                  opacity: step === 0 ? 0.35 : 1,
                }}
              >
                Back a step
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
