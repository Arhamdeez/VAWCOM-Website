'use client';

import { useEffect, useRef } from 'react';
import { ASCII_COLS, ASCII_ROWS, renderAsciiGlobePlain } from './globeAscii';

const TILT = 0.42;
const SPIN = 0.32; // rad/sec after type-in
const TWINKLES = [
  { t: '8%', l: '18%', d: '0s', s: 3 },
  { t: '14%', l: '78%', d: '0.4s', s: 2 },
  { t: '28%', l: '88%', d: '1.1s', s: 4 },
  { t: '62%', l: '12%', d: '0.7s', s: 2 },
  { t: '72%', l: '82%', d: '1.6s', s: 3 },
  { t: '84%', l: '28%', d: '0.2s', s: 2 },
  { t: '22%', l: '48%', d: '1.9s', s: 2 },
  { t: '48%', l: '8%', d: '1.3s', s: 3 },
] as const;

/**
 * ASCII globe (adamsky/globe-style): fades in when the scroll line arrives,
 * types each row left to right, then slowly rotates.
 */
export default function AsciiGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const yawRef = useRef(0.55);

  useEffect(() => {
    const root = rootRef.current;
    const pre = preRef.current;
    if (!root || !pre) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let typing = false;
    let spinning = false;
    let typed = false;
    let visible = true;
    let lineIdx = 0;
    let colIdx = 0;
    let lines: string[] = [];
    let lastSpin = 0;
    let lastType = 0;

    const sizePre = () => {
      const box = Math.min(root.clientWidth, root.clientHeight) * 0.72;
      pre.style.width = `${box}px`;
      pre.style.height = `${box}px`;
      pre.style.fontSize = `${box / ASCII_ROWS}px`;
      pre.style.letterSpacing = `${box / ASCII_COLS - (box / ASCII_ROWS) * 0.55}px`;
    };

    const painted = () => {
      if (!lines.length) return '';
      const done = lines.slice(0, lineIdx).join('\n');
      const current = lines[lineIdx]?.slice(0, colIdx) ?? '';
      if (lineIdx === 0) return current;
      if (lineIdx >= lines.length) return lines.join('\n');
      return `${done}\n${current}`;
    };

    const onReady = () => {
      const slot = root.closest('[data-globe-slot]');
      if (slot?.hasAttribute('data-line-ready')) start();
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible && !typing) return;

      if (typing) {
        if (now - lastType > 6) {
          let step = 22;
          while (step > 0 && lineIdx < lines.length) {
            const line = lines[lineIdx];
            const take = Math.min(step, line.length - colIdx);
            colIdx += take;
            step -= take;
            if (colIdx >= line.length) {
              lineIdx += 1;
              colIdx = 0;
            }
          }
          pre.textContent = painted();
          lastType = now;
          if (lineIdx >= lines.length) {
            typing = false;
            typed = true;
            pre.textContent = renderAsciiGlobePlain(yawRef.current, TILT);
            spinning = true;
            lastSpin = now;
          }
        }
        kick();
      } else if (spinning && !reduce && visible) {
        if (now - lastSpin > 140) {
          const dt = (now - lastSpin) / 1000;
          yawRef.current += dt * SPIN;
          pre.textContent = renderAsciiGlobePlain(yawRef.current, TILT);
          lastSpin = now;
        }
        kick();
      }
    };

    const start = () => {
      if (typed || typing) return;
      root.dataset.lit = '1';
      sizePre();
      const fullPlain = renderAsciiGlobePlain(yawRef.current, TILT);
      if (reduce) {
        pre.textContent = fullPlain;
        typed = true;
        spinning = true;
        return;
      }
      lines = fullPlain.split('\n');
      lineIdx = 0;
      colIdx = 0;
      typing = true;
      pre.textContent = '';
      lastType = performance.now();
      kick();
    };

    const mo = new MutationObserver(onReady);
    const slot = root.closest('[data-globe-slot]') ?? root.parentElement;
    if (slot) mo.observe(slot, { attributes: true, attributeFilter: ['data-line-ready'] });
    onReady();

    const ro = new ResizeObserver(sizePre);
    ro.observe(root);
    sizePre();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && (typing || spinning)) kick();
      },
      { rootMargin: '80px' },
    );
    io.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="group/globe relative z-[3] flex h-full w-full items-center justify-center"
    >
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-700 group-data-[lit]/globe:opacity-100"
        style={{
          background:
            'radial-gradient(circle, rgba(12,183,139,0.42) 0%, rgba(12,183,139,0.16) 42%, rgba(12,183,139,0.04) 62%, transparent 74%)',
          filter: 'blur(2px)',
        }}
      />
      {/* Soft ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-700 group-data-[lit]/globe:opacity-100"
        style={{
          boxShadow:
            '0 0 40px rgba(12,183,139,0.22), inset 0 0 28px rgba(12,183,139,0.12)',
        }}
      />
      {/* Twinkles */}
      {TWINKLES.map((tw, i) => (
        <span
          key={i}
          aria-hidden
          className="vaw-globe-twinkle pointer-events-none absolute z-[1] rounded-full bg-[#0cb78b] opacity-0 group-data-[lit]/globe:opacity-100"
          style={{
            top: tw.t,
            left: tw.l,
            width: tw.s,
            height: tw.s,
            animationDelay: tw.d,
            boxShadow: '0 0 6px rgba(12,183,139,0.85)',
          }}
        />
      ))}
      <pre
        ref={preRef}
        data-ascii-globe
        className="relative z-[2] m-0 select-none overflow-hidden whitespace-pre text-left font-mono leading-none text-[#0cb78b] opacity-0 transition-opacity duration-500 group-data-[lit]/globe:opacity-90"
      />
    </div>
  );
}
