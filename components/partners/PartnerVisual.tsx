'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

/**
 * Hero illustration, drawn in code (no photo needed): your client -> your agency (front, white) ->
 * VAWCOM (behind, dark). Dashed lines flow between them and the two cards float gently.
 */
export default function PartnerVisual() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[5/4] w-full max-w-[34rem] select-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 55% at 55% 55%, rgba(12,183,139,0.16), transparent 70%)',
      }}
    >
      {/* flowing connectors */}
      <svg
        viewBox="0 0 500 400"
        className="absolute inset-0 z-0 h-full w-full"
        fill="none"
        strokeLinecap="round"
      >
        <path
          id="vaw-pv-a"
          d="M392 318 C392 250 330 244 286 214"
          stroke="#0cb78b"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="vaw-dash"
        />
        <path
          id="vaw-pv-b"
          d="M330 118 C384 112 410 86 428 52"
          stroke="#0cb78b"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="vaw-dash"
        />
        {!reduce && (
          <>
            <circle r="4.5" fill="#0cb78b">
              <animateMotion dur="2.6s" repeatCount="indefinite">
                <mpath href="#vaw-pv-a" />
              </animateMotion>
            </circle>
            <circle r="4.5" fill="#0cb78b">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.2s">
                <mpath href="#vaw-pv-b" />
              </animateMotion>
            </circle>
          </>
        )}
      </svg>

      {/* your client */}
      <div className="absolute right-[1%] top-[3%] z-10 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#161615] shadow-[0_10px_28px_rgba(22,22,21,0.1)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-[#0cb78b]" />
        </span>
        Your client
      </div>

      {/* your agency (front) */}
      <div className="vaw-float absolute left-[2%] top-[17%] z-10 w-[66%] rounded-[1.25rem] border border-black/[0.06] bg-white p-3.5 shadow-[0_24px_60px_rgba(22,22,21,0.14)]">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#e8674a]/70" />
          <span className="h-2 w-2 rounded-full bg-[#e0b73a]/80" />
          <span className="h-2 w-2 rounded-full bg-[#0cb78b]/80" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-black/[0.05]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-[5.25rem] flex-none items-center justify-center rounded-lg border border-dashed border-[#0cb78b]/60 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0a9d77]">
            Your brand
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-2 w-4/5 rounded-full bg-black/[0.08]" />
            <div className="h-2 w-3/5 rounded-full bg-black/[0.05]" />
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-3 gap-2">
          <div className="h-[3.1rem] rounded-lg bg-[#e6faf3]" />
          <div className="h-[3.1rem] rounded-lg bg-[#f5f3ee]" />
          <div className="h-[3.1rem] rounded-lg bg-[#e6faf3]" />
        </div>
        <div className="mt-3 h-6 w-24 rounded-full bg-[#0cb78b]" />
      </div>

      {/* VAWCOM (behind the scenes) */}
      <div
        className="vaw-float absolute bottom-[3%] right-[1%] z-10 w-[56%] rounded-[1.25rem] bg-[#161615] p-4 shadow-[0_24px_60px_rgba(22,22,21,0.28)]"
        style={{ animationDelay: '-3s', animationDuration: '8s' }}
      >
        <div className="flex items-center justify-between">
          <Image src="/logo-mark.png" alt="" width={69} height={37} className="h-4 w-auto" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Behind the scenes
          </span>
        </div>
        <div className="mt-3.5 space-y-2 font-mono">
          <div className="h-1.5 w-[85%] rounded-full bg-[#0cb78b]/70" />
          <div className="ml-4 h-1.5 w-[55%] rounded-full bg-white/20" />
          <div className="ml-4 h-1.5 w-[70%] rounded-full bg-white/15" />
          <div className="h-1.5 w-[40%] rounded-full bg-[#2dd4a8]/60" />
        </div>
      </div>
    </div>
  );
}
