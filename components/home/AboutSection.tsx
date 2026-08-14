'use client';

import Link from 'next/link';
import { FOUNDERS } from './data';

const STRIP = ['Design', 'Build', 'Voice', 'Automation', 'Launch'] as const;
const DOTS = ['#429f7f', '#cf6a2c', '#429f7f', '#6c4bb0', '#d9a961'] as const;

function StripOnce() {
  return (
    <span className="flex items-center gap-[54px]">
      {STRIP.flatMap((word, i) => [
        <span key={word}>{word}</span>,
        <span
          key={`${word}-dot`}
          className="block h-3 w-3 shrink-0"
          style={{ background: DOTS[i] }}
          aria-hidden
        />,
      ])}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden pt-[104px]">
      <div className="mx-auto max-w-[1440px] px-8">
        <h2
          data-reveal="words"
          className="vaw-display m-0 max-w-[22ch] text-[clamp(38px,5.6vw,92px)] leading-[0.92] tracking-[-0.025em]"
        >
          {['We', 'turn', 'your', 'idea', 'into'].map((w) => (
            <span key={w}>
              <span data-word className="inline-block">
                {w}
              </span>{' '}
            </span>
          ))}
          <span data-word className="inline-block text-[#d9a961]">
            something
          </span>{' '}
          <span data-word className="inline-block text-[#d9a961]">
            real
          </span>
        </h2>
        <p
          data-reveal="up"
          className="mt-7 max-w-[52ch] text-[19px] leading-normal text-[rgba(236,233,227,0.75)]"
        >
          You bring the idea. We handle the design, the build, the voice work, and the automation
          behind it, then hand back one finished product rather than a pile of parts. One clear path
          from the first conversation to the day it goes live.
        </p>
      </div>

      <div
        data-about-strip
        className="mt-14 overflow-hidden border-y border-[rgba(236,233,227,0.14)] py-[22px]"
      >
        <div
          data-about-row
          className="vaw-display flex w-max items-center gap-[54px] whitespace-nowrap text-[clamp(30px,4vw,62px)] leading-none will-change-transform"
        >
          <StripOnce />
          <span aria-hidden>
            <StripOnce />
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-8 pt-14">
        <div data-reveal="stagger" className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <div
              key={f.name}
              className="vaw-wavybox flex items-center gap-[22px] bg-[#131816] px-9 py-[34px]"
            >
              <div className="flex h-[88px] w-[88px] flex-none items-center justify-center rounded-full bg-[rgba(66,159,127,0.2)] text-xl font-bold text-[#429f7f]">
                {f.initials}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[13.5px] text-[#429f7f]">{f.role}</span>
                <h3 className="m-0 text-[22px] font-bold">{f.name}</h3>
                <div className="flex gap-4 text-sm">
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-[rgba(236,233,227,0.25)]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={f.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-[rgba(236,233,227,0.25)]"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* keep /about reachable for deep content */}
      <div className="mx-auto mt-8 max-w-[1440px] px-8">
        <Link href="/about" className="text-sm text-[rgba(236,233,227,0.55)] hover:text-[#429f7f]">
          Full about page →
        </Link>
      </div>
    </section>
  );
}
