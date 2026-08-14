'use client';

import { SERVICE_TRACK } from './data';
import { jumpHomeTrack } from './useHomeMotion';
import type { RefObject } from 'react';

const DRIP_POS = [
  { left: '14%', top: '18%', size: 22 },
  { left: '82%', top: '26%', size: 16 },
  { left: '24%', top: '80%', size: 18 },
  { left: '76%', top: '84%', size: 26 },
  { left: '50%', top: '10%', size: 13 },
];

type Props = { rootRef: RefObject<HTMLElement | null> };

export default function ServicesTrack({ rootRef }: Props) {
  return (
    <section id="process" className="relative mt-0 bg-[#131816]">
      <div data-pin-wrap className="relative">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="relative mx-auto w-full max-w-[1440px] shrink-0 px-8 pt-20 pb-4">
            <h2 className="vaw-display m-0 max-w-[20ch] text-[clamp(38px,4.6vw,72px)] leading-[0.94] tracking-[-0.02em]">
              Everything else we cover
            </h2>
            <div className="mt-5 flex max-w-[560px] items-center gap-[18px]">
              <div className="flex gap-3.5">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => jumpHomeTrack(rootRef.current, -1)}
                  className="h-11 w-11 border-0 bg-transparent p-0 text-[17px] text-[rgba(236,233,227,0.4)] hover:text-[#ece9e3]"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => jumpHomeTrack(rootRef.current, 1)}
                  className="h-11 w-11 border-0 bg-transparent p-0 text-[17px] text-[rgba(236,233,227,0.4)] hover:text-[#ece9e3]"
                >
                  →
                </button>
              </div>
              <span className="relative block h-px flex-1 bg-[rgba(236,233,227,0.18)]">
                <span
                  data-progress
                  className="absolute left-0 top-0 block h-px w-0 bg-[#429f7f]"
                />
              </span>
              <span
                data-track-label
                className="whitespace-nowrap text-sm text-[rgba(236,233,227,0.55)]"
              />
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div
              data-track
              className="absolute left-0 top-0 flex h-full w-max items-center will-change-transform"
            >
              <span className="block w-[22vw]" />
              {SERVICE_TRACK.map((svc, i) => (
                <div
                  key={svc.title}
                  data-step={i}
                  className="relative flex h-full w-[min(440px,78vw)] flex-none flex-col justify-center px-8 pb-10 sm:px-10"
                >
                  <div
                    data-paint={i}
                    className="vaw-paint-mask pointer-events-none absolute left-1/2 top-[47%] z-0 w-[118%] origin-center -translate-x-1/2 -translate-y-1/2 scale-0 pb-[78%] opacity-0"
                    style={{ background: svc.color }}
                  />
                  {DRIP_POS.map((d, k) => (
                    <span
                      key={k}
                      data-drip={i}
                      data-k={k}
                      className="vaw-drop pointer-events-none absolute z-0 block scale-0 opacity-0"
                      style={{
                        left: d.left,
                        top: d.top,
                        width: d.size,
                        height: d.size,
                        background: svc.color,
                      }}
                    />
                  ))}
                  <h3 className="vaw-display relative z-[1] m-0 text-[clamp(34px,3.4vw,52px)] leading-none tracking-[-0.02em]">
                    {svc.title}
                  </h3>
                  <p className="relative z-[1] mt-[18px] max-w-[32ch] text-[17.5px] leading-normal text-[rgba(236,233,227,0.88)]">
                    {svc.body}
                  </p>
                </div>
              ))}
              <span className="block w-[34vw]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
