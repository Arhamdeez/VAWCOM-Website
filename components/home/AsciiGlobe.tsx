'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { globeGrid, projectGlobePoint, renderAsciiGlobePlain } from './globeAscii';
import { GLOBE_PLACES, projectsForPlace, type GlobePlace } from './globePlaces';
import { SHOW_GALLERY } from '@/lib/site';

const SPIN = 0.32;
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
 * ASCII globe (adamsky/globe): real land outlines, drag to look around, click a pin for work.
 */
export default function AsciiGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const diskRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const yawRef = useRef(0.4);
  const tiltRef = useRef(0.38);
  const openRef = useRef<GlobePlace | null>(null);
  const setOpenRef = useRef<(p: GlobePlace | null) => void>(() => {});
  const kickRef = useRef<() => void>(() => {});
  const placePinsRef = useRef<() => void>(() => {});
  const [open, setOpen] = useState<GlobePlace | null>(null);
  openRef.current = open;
  setOpenRef.current = setOpen;

  useEffect(() => {
    const root = rootRef.current;
    const disk = diskRef.current;
    const pre = preRef.current;
    if (!root || !disk || !pre) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let typing = false;
    let spinning = false;
    let typed = false;
    let visible = true;
    let dragging = false;
    let dragDist = 0;
    let lastPtrX = 0;
    let lastPtrY = 0;
    let cols = 80;
    let rows = 40;
    let lineIdx = 0;
    let colIdx = 0;
    let lines: string[] = [];
    let lastSpin = 0;
    let lastType = 0;
    let diskPx = 0;

    const frame = () => renderAsciiGlobePlain(yawRef.current, tiltRef.current, cols, rows);

    const pinXY: Record<string, { x: number; y: number }> = {};

    // Pin math is relative to the disk, so placePins needs no rect read (a forced layout per frame).
    const layoutPins = (box: { left: number; top: number; width: number; height: number }) => {
      if (box.width < 4) return [];
      const items = GLOBE_PLACES.map((place) => {
        const pt = projectGlobePoint(place.lat, place.lon, yawRef.current, tiltRef.current);
        if (!pt) return { place, x: 0, y: 0, visible: false };
        return {
          place,
          x: box.left + ((pt.nx + 1) / 2) * box.width,
          y: box.top + ((pt.ny + 1) / 2) * box.height,
          visible: true,
        };
      });
      const minSep = 52;
      for (let n = 0; n < 5; n++) {
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i];
            const b = items[j];
            if (!a.visible || !b.visible) continue;
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let d = Math.hypot(dx, dy);
            if (d < 0.5) {
              dx = 1;
              dy = 0;
              d = 0.5;
            }
            if (d >= minSep) continue;
            const push = (minSep - d) / 2;
            dx /= d;
            dy /= d;
            a.x -= dx * push;
            a.y -= dy * push;
            b.x += dx * push;
            b.y += dy * push;
          }
        }
      }
      for (const key of Object.keys(pinXY)) delete pinXY[key];
      for (const item of items) {
        if (item.visible) pinXY[item.place.id] = { x: item.x, y: item.y };
      }
      return items;
    };

    const placePins = () => {
      if (!typed || typing) return;
      const box = { left: 0, top: 0, width: diskPx, height: diskPx };
      const openId = openRef.current?.id;
      for (const item of layoutPins(box)) {
        const el = pinRefs.current[item.place.id];
        if (!el) continue;
        if (!item.visible) {
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          continue;
        }
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
        el.style.left = `${((item.x - box.left) / box.width) * 100}%`;
        el.style.top = `${((item.y - box.top) / box.height) * 100}%`;
        el.style.zIndex = openId && openId !== item.place.id ? '5' : '3';
      }
    };
    placePinsRef.current = placePins;

    const hitPlace = (clientX: number, clientY: number) => {
      layoutPins(disk.getBoundingClientRect());
      const hits: { place: GlobePlace; d: number }[] = [];
      for (const place of GLOBE_PLACES) {
        const xy = pinXY[place.id];
        if (!xy) continue;
        hits.push({ place, d: Math.hypot(clientX - xy.x, clientY - xy.y) });
      }
      hits.sort((a, b) => a.d - b.d);
      const reach = 48;
      const inRange = hits.filter((h) => h.d < reach);
      if (!inRange.length) return null;
      const openId = openRef.current?.id;
      if (openId && inRange.length > 1 && inRange[0].place.id === openId) return inRange[1].place;
      return inRange[0].place;
    };

    const sizePre = () => {
      const box = Math.min(root.clientWidth, root.clientHeight) * 0.72;
      const grid = globeGrid(box);
      cols = grid.cols;
      rows = grid.rows;
      diskPx = box;
      if (coverRef.current) {
        coverRef.current.style.width = `${box}px`;
        coverRef.current.style.height = `${box}px`;
      }
      disk.style.width = `${box}px`;
      disk.style.height = `${box}px`;
      pre.style.fontSize = `${box / rows}px`;
      pre.style.letterSpacing = `calc((${box}px - ${cols}ch) / ${Math.max(1, cols - 1)})`;
      if (typed && !typing) {
        pre.textContent = frame();
        placePins();
      }
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
    kickRef.current = kick;

    const paint = (now?: number) => {
      pre.textContent = frame();
      placePins();
      if (now != null) lastSpin = now;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible && !typing) return;

      if (typing) {
        if (now - lastType > 6) {
          const total = cols * rows;
          let step = Math.max(24, (total / 90) | 0);
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
            paint(now);
            spinning = true;
          }
        }
        kick();
      } else if (spinning && !reduce && visible && !dragging && !openRef.current) {
        if (now - lastSpin > 32) {
          const dt = (now - lastSpin) / 1000;
          yawRef.current += dt * SPIN;
          paint(now);
        }
        kick();
      }
    };

    const start = () => {
      if (typed || typing) return;
      root.dataset.lit = '1';
      sizePre();
      if (reduce) {
        typed = true;
        spinning = true;
        paint();
        return;
      }
      lines = frame().split('\n');
      lineIdx = 0;
      colIdx = 0;
      typing = true;
      pre.textContent = '';
      lastType = performance.now();
      kick();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!typed && !typing) return;
      if ((e.target as HTMLElement).closest('[data-globe-pin],[data-globe-pop]')) return;
      typing = false;
      typed = true;
      const hit = hitPlace(e.clientX, e.clientY);
      if (hit) {
        setOpenRef.current(openRef.current?.id === hit.id ? null : hit);
        paint();
        return;
      }
      dragging = true;
      dragDist = 0;
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;
      root.style.cursor = 'grabbing';
      root.setPointerCapture(e.pointerId);
      paint();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastPtrX;
      const dy = e.clientY - lastPtrY;
      dragDist += Math.hypot(dx, dy);
      yawRef.current += dx * 0.01;
      tiltRef.current = Math.max(-0.95, Math.min(0.95, tiltRef.current + dy * 0.008));
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;
      if (dragDist > 16 && openRef.current) setOpenRef.current(null);
      paint();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      root.style.cursor = '';
      try {
        root.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      if (dragDist < 16) {
        const hit = hitPlace(e.clientX, e.clientY);
        if (hit) setOpenRef.current(openRef.current?.id === hit.id ? null : hit);
        else if (openRef.current) setOpenRef.current(null);
      }
      if (typed && !reduce && visible && !openRef.current) {
        spinning = true;
        lastSpin = performance.now();
        kick();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenRef.current(null);
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
        root.classList.toggle('is-offscreen', !visible);
        if (visible && (typing || spinning)) kick();
      },
      { rootMargin: '80px' },
    );
    io.observe(root);

    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (visible && (typing || spinning)) kick();
    };
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('keydown', onKey);
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('keydown', onKey);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  useEffect(() => {
    placePinsRef.current();
    if (!open) kickRef.current();
  }, [open]);

  return (
    <div
      ref={rootRef}
      data-globe-root
      className="group/globe relative z-[3] flex h-full w-full cursor-grab items-center justify-center touch-none"
    >
      {/* Hides the scroll line behind the globe (replaces the SVG hole mask). Same colour as the page. */}
      <div
        ref={coverRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f3ee]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-morph group-data-[lit]/globe:opacity-100"
        style={{
          background:
            'radial-gradient(circle, rgba(12,183,139,0.42) 0%, rgba(12,183,139,0.16) 42%, rgba(12,183,139,0.04) 62%, transparent 74%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-morph group-data-[lit]/globe:opacity-100"
        style={{
          boxShadow:
            '0 0 40px rgba(12,183,139,0.22), inset 0 0 28px rgba(12,183,139,0.12)',
        }}
      />
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
      <div ref={diskRef} className="relative z-[2]">
        <pre
          ref={preRef}
          data-ascii-globe
          className="m-0 h-full w-full select-none overflow-hidden whitespace-pre [contain:layout_paint] text-left font-mono leading-none text-[#0cb78b] opacity-0 transition-opacity duration-enter group-data-[lit]/globe:opacity-90"
        />
        {GLOBE_PLACES.map((place) => (
          <button
            key={place.id}
            ref={(el) => {
              pinRefs.current[place.id] = el;
            }}
            type="button"
            data-globe-pin
            aria-label={`${place.name}: work we’ve done`}
            className="vaw-globe-pin absolute z-[3] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 opacity-0 group-data-[lit]/globe:opacity-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setOpen((cur) => (cur?.id === place.id ? null : place))}
          >
            <span className="vaw-globe-pin-dot" />
          </button>
        ))}
      </div>
      {open && (
        <aside
          data-globe-pop
          role="dialog"
          aria-label={open.name}
          className="pointer-events-auto absolute top-[78%] left-1/2 z-10 w-[min(16rem,calc(100%-1.5rem))] -translate-x-1/2 lg:top-[20%] lg:left-[88%] lg:translate-x-0"
        >
          <div className="vaw-glass">
          <div className="vaw-glass-core rounded-[1.15rem] px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <p className="m-0 text-[13px] font-medium uppercase tracking-[0.12em] text-[#8a8882]">
                {open.name}
              </p>
              <button
                type="button"
                className="mt-0.5 text-[#8a8882] hover:text-[#161615]"
                aria-label="Close"
                onClick={() => setOpen(null)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 mb-0 text-[13.5px] leading-snug text-[#161615]">{open.blurb}</p>
            <ul className="mt-3 mb-0 list-none space-y-1.5 p-0">
              {projectsForPlace(open).map((p) => (
                <li key={p.id}>
                  {SHOW_GALLERY ? (
                    <Link
                      href={`/gallery#${p.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
                    >
                      {p.title}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0cb78b]">
                      {p.title}
                    </span>
                  )}
                  <p className="m-0 text-[12.5px] leading-snug text-[#5c5a56]">{p.summary}</p>
                </li>
              ))}
              {SHOW_GALLERY ? (
                <li>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
                  >
                    {projectsForPlace(open).length ? 'All public work' : 'See the gallery'}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
          </div>
        </aside>
      )}
    </div>
  );
}
