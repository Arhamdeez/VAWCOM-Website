'use client';

import { useEffect, useRef } from 'react';
import { useVoiceCall } from './demos/useVoiceCall';

const BARS = Array.from({ length: 56 }, (_, i) => i);
const DROPS = [
  { left: '8%', top: '6%', size: 26 },
  { left: '31%', top: '78%', size: 18 },
  { left: '58%', top: '4%', size: 22 },
  { left: '84%', top: '66%', size: 30 },
  { left: '46%', top: '88%', size: 14 },
  { left: '94%', top: '18%', size: 16 },
];

export default function VoiceSection() {
  const voice = useVoiceCall();
  const waveRef = useRef<HTMLDivElement>(null);
  const live = voice.calling || voice.status.type === 'success';

  useEffect(() => {
    if (waveRef.current) waveRef.current.dataset.live = live ? '1' : '0';
  }, [live]);

  const callLabel = voice.calling
    ? 'Calling…'
    : voice.status.type === 'success'
      ? 'Call again'
      : 'Start the call';

  const callHint = voice.calling
    ? 'On the line…'
    : voice.status.type === 'success'
      ? 'Press start to start demo'
      : voice.status.type === 'error'
        ? voice.status.message
        : 'Press start to start demo';

  return (
    <section id="demos" className="relative overflow-hidden bg-[#0b0d0c] text-[#0b0d0c]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-splash
          className="vaw-splash-mask absolute inset-[-10%] scale-0 bg-[#cf6a2c]"
        />
        {DROPS.map((d, i) => (
          <span
            key={i}
            data-drop
            className="vaw-drop absolute block scale-0 bg-[#cf6a2c]"
            style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          />
        ))}
      </div>

      <div
        data-splash-content
        id="voice"
        className="relative mx-auto max-w-[1440px] px-8 pb-[148px] pt-[200px] text-[#fbf6ec] opacity-0"
      >
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2
            data-reveal="words"
            className="vaw-display m-0 text-[clamp(44px,7.4vw,120px)] leading-[0.88] tracking-[-0.03em]"
          >
            <span data-word className="inline-block">
              Our
            </span>{' '}
            <span data-word className="inline-block">
              voice
            </span>{' '}
            <span data-word className="inline-block">
              agent
            </span>{' '}
            <span data-word className="inline-block text-[#1f6b52]">
              picks
            </span>{' '}
            <span data-word className="inline-block text-[#1f6b52]">
              up
            </span>{' '}
            <span data-word className="inline-block text-[#1f6b52]">
              the
            </span>{' '}
            <span data-word className="inline-block text-[#1f6b52]">
              phone
            </span>
          </h2>
          <p
            data-reveal="up"
            className="mb-3 max-w-[32ch] text-lg leading-normal text-[rgba(255,250,242,0.9)]"
          >
            A voice agent that answers, checks the calendar, and confirms.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-5">
          <input
            type="tel"
            value={voice.phone}
            onChange={(e) => {
              voice.setPhone(e.target.value);
              voice.setStatus({ type: null, message: '' });
            }}
            placeholder="+1 (217) 555-1234"
            disabled={voice.calling}
            aria-label="Phone number"
            className="min-w-[220px] max-w-sm flex-1 border border-[rgba(255,250,242,0.35)] bg-transparent px-4 py-3 text-[15px] text-[#fbf6ec] outline-none placeholder:text-[rgba(255,250,242,0.4)] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void voice.startCall()}
            disabled={voice.calling}
            className="vaw-wavy border-0 bg-[#fbf6ec] px-[34px] py-[26px] text-[15px] font-medium text-[#14100c] hover:bg-white disabled:opacity-60"
          >
            {callLabel}
          </button>
          <span
            className={`text-[15px] ${
              voice.status.type === 'error'
                ? 'text-[#fff8ef]'
                : 'text-[rgba(255,250,242,0.8)]'
            }`}
          >
            {callHint}
          </span>
        </div>

        <div
          ref={waveRef}
          data-wave
          className="mt-9 flex h-[180px] items-center gap-1 border-y border-[rgba(255,250,242,0.35)] py-5"
        >
          {BARS.map((i) => (
            <span
              key={i}
              data-bar
              className="block h-[14%] flex-1 origin-center bg-[#fbf6ec]"
            />
          ))}
        </div>

        <p className="vaw-display mt-4 text-[clamp(22px,2.4vw,34px)] leading-tight text-[#1f6b52]">
          It answers when you can&apos;t.
        </p>
      </div>
    </section>
  );
}
