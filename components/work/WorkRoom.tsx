'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { getService } from '@/lib/services';
import { workSlides, type WorkSlide } from '@/lib/work';
import { ReviewBlock } from './ProjectCard';
import './work-room.css';

const SLIDES = workSlides();
const N = SLIDES.length;
const ORBIT_MS = 1100;
const SETTLE_MS = 280;

function wrap(i: number) {
  if (N < 1) return 0;
  return ((i % N) + N) % N;
}

function offset(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

function domainLabel(id: WorkSlide['service']) {
  return getService(id)?.nav ?? id;
}

function walkTransform(d: number) {
  // Keep Z positive so preserve-3d hit proxies can still map rects; depth is relative.
  return `translateX(calc(-50% + ${d * 22}vw)) rotateY(${-d * 38}deg) translateZ(${140 - Math.abs(d) * 110}px) scale(${1 - Math.abs(d) * 0.06})`;
}

function orbitTransform(index: number, spin: number) {
  const a = (360 / Math.max(N, 1)) * index + spin;
  return `rotateY(${a}deg) translateZ(var(--orbit-r))`;
}

function MockChrome({ kind }: { kind: WorkSlide['kind'] }) {
  return (
    <div className={`vaw-pop-mock is-${kind}`} aria-hidden>
      <div className="vaw-pop-mock-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="vaw-pop-mock-screen">
        <div className="vaw-pop-mock-line" />
        <div className="vaw-pop-mock-line is-short" />
        <div className="vaw-pop-mock-blob" />
      </div>
    </div>
  );
}

function Panel({
  slide,
  onClose,
}: {
  slide: WorkSlide;
  onClose: () => void;
}) {
  const service = getService(slide.service);
  const hasVideo = slide.review?.type === 'video';
  const body = (slide.details ?? slide.summary).split(/\n\n+/);

  return (
    <div
      className={`vaw-pop${hasVideo ? ' is-video' : ' is-wide'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="vaw-pop-core">
        <button type="button" className="vaw-pop-x" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="vaw-pop-main">
          <div className="vaw-pop-copy">
            <p className="vaw-pop-kicker">
              <Link href={`/services/${slide.service}`}>{service?.nav ?? slide.service}</Link>
            </p>
            <h2 id="vaw-monitor-title" className="vaw-display">
              {slide.title}
            </h2>
            {body.map((para) => (
              <p key={para.slice(0, 24)} className="vaw-pop-body">
                {para}
              </p>
            ))}
            <dl className="vaw-pop-meta">
              <div>
                <dt>Domain</dt>
                <dd>{service?.nav ?? slide.service}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{slide.kind}</dd>
              </div>
            </dl>
            {slide.highlights?.length ? (
              <div className="vaw-pop-highlights">
                <p className="vaw-pop-review-label">What it does</p>
                <ul>
                  {slide.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {slide.review && !hasVideo ? (
              <div className="vaw-pop-review">
                <p className="vaw-pop-review-label">Client</p>
                <ReviewBlock review={slide.review} />
              </div>
            ) : null}
            {slide.url ? (
              <Link href={slide.url} className="vaw-pop-open">
                Open
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
          <div className="vaw-pop-stage">
            <section className="vaw-pop-demo">
              <p className="vaw-pop-review-label">Demo</p>
              {slide.demo ? <p className="vaw-pop-demo-note">{slide.demo}</p> : null}
              <MockChrome kind={slide.kind} />
            </section>
            {hasVideo && slide.review ? (
              <section className="vaw-pop-demo">
                <p className="vaw-pop-review-label">Client review</p>
                <ReviewBlock review={slide.review} />
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkRoom() {
  const [i, setI] = useState(0);
  const [panel, setPanel] = useState<number | null>(null);
  const [mode, setMode] = useState<'orbit' | 'walk'>('orbit');
  const [fading, setFading] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const dlg = useRef<HTMLDialogElement>(null);
  const reduce = useRef(false);
  const lock = useRef(0);
  const acc = useRef(0);
  const touchX = useRef<number | null>(null);
  const openRef = useRef(false);
  const modeRef = useRef<'orbit' | 'settle' | 'walk'>('orbit');
  openRef.current = panel != null;

  const go = useCallback((dir: number) => {
    if (N < 2 || openRef.current) return false;
    const now = performance.now();
    if (now < lock.current) return false;
    lock.current = now + 280;
    setI((n) => wrap(n + dir));
    return true;
  }, []);

  const settle = useCallback((to?: number) => {
    if (modeRef.current !== 'orbit') return;
    if (reduce.current) {
      modeRef.current = 'walk';
      if (to != null) setI(to);
      setMode('walk');
      return;
    }
    modeRef.current = 'settle';
    setFading(true);
    window.setTimeout(() => {
      if (to != null) setI(to);
      modeRef.current = 'walk';
      setMode('walk');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFading(false));
      });
    }, SETTLE_MS);
  }, []);

  const closePanel = useCallback(() => {
    dlg.current?.close();
    setPanel(null);
  }, []);

  const openPanel = useCallback((n: number) => {
    if (modeRef.current === 'orbit') settle(n);
    setPanel(n);
  }, [settle]);

  const pickCardAt = useCallback((clientX: number, clientY: number) => {
    let best: number | null = null;
    let bestDist = Infinity;
    cards.current.forEach((el, n) => {
      if (!el || el.getAttribute('aria-hidden') === 'true') return;
      const r = el.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return;
      const dist = Math.hypot(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2));
      if (dist < bestDist) {
        bestDist = dist;
        best = n;
      }
    });
    return best;
  }, []);

  useLayoutEffect(() => {
    if (panel == null) return;
    if (dlg.current && !dlg.current.open) dlg.current.showModal();
  }, [panel]);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hash = window.location.hash.slice(1);
    const hit = SLIDES.findIndex((s) => s.id === hash || s.service === hash);
    if (hit >= 0) {
      setI(hit);
      settle();
      return;
    }
    if (reduce.current) settle();
  }, [settle]);

  useEffect(() => {
    if (mode !== 'orbit' || reduce.current) return;
    let raf = 0;
    let live = true;
    const start = performance.now();
    const tick = (now: number) => {
      if (!live || modeRef.current !== 'orbit') return;
      const t = Math.min(1, (now - start) / ORBIT_MS);
      const spin = t * 360;
      cards.current.forEach((el, n) => {
        if (!el) return;
        const a = ((360 / Math.max(N, 1)) * n + spin) * (Math.PI / 180);
        el.style.transform = orbitTransform(n, spin);
        el.style.zIndex = String(Math.round(40 + Math.cos(a) * 40));
      });
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      settle();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
    };
  }, [mode, settle]);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (openRef.current || modeRef.current === 'settle') return;
      e.preventDefault();
      if (modeRef.current === 'orbit') {
        settle();
        return;
      }
      const dominant = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      acc.current += dominant;
      if (acc.current > 36) {
        if (go(1)) acc.current = 0;
        else acc.current = 36;
      } else if (acc.current < -36) {
        if (go(-1)) acc.current = 0;
        else acc.current = -36;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (openRef.current || modeRef.current === 'settle') return;
      if (modeRef.current === 'orbit') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' ') {
          e.preventDefault();
          settle();
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        go(-1);
      }
    };

    const onMove = (e: MouseEvent) => {
      if (openRef.current || reduce.current || !ring.current) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      ring.current.style.transform = `rotateY(${x}deg)`;
    };

    const onTouchStart = (e: TouchEvent) => {
      touchX.current = e.changedTouches[0]?.clientX ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (openRef.current || modeRef.current === 'settle') return;
      const start = touchX.current;
      touchX.current = null;
      if (start == null) return;
      const end = e.changedTouches[0]?.clientX;
      if (end == null) return;
      const d = end - start;
      if (Math.abs(d) < 28) return;
      if (modeRef.current === 'orbit') {
        settle();
        return;
      }
      go(d < 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [go, settle]);

  const shown = panel != null ? SLIDES[panel] : null;

  return (
    <div
      ref={scene}
      className={`vaw-cover${mode === 'orbit' ? ' is-orbit' : ' is-walk'}${fading ? ' is-fading' : ''}${panel != null ? ' is-open' : ''}`}
    >
      <p className="vaw-cover-ghost vaw-display" aria-hidden>
        Gallery
      </p>
      <div className="vaw-cover-host">
        <div ref={ring} className="vaw-cover-ring">
          {SLIDES.map((slide, n) => {
            const d = offset(n, i);
            const far = mode === 'walk' && Math.abs(d) > 2;
            return (
              <button
                key={slide.id}
                ref={(node) => {
                  cards.current[n] = node;
                }}
                type="button"
                className={`vaw-cover-card${d === 0 && mode === 'walk' ? ' is-on' : ''}`}
                data-d={d}
                tabIndex={far ? -1 : 0}
                aria-hidden={far}
                aria-current={d === 0 && mode === 'walk' ? 'true' : undefined}
                aria-label={`Open ${slide.title}`}
                style={
                  mode === 'walk'
                    ? {
                        transform: walkTransform(d),
                        zIndex: 8 - Math.abs(d),
                        opacity: far ? 0 : 1,
                      }
                    : { transform: orbitTransform(n, 0) }
                }
                onClick={() => openPanel(n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPanel(n);
                  }
                }}
              >
                <span className="vaw-cover-face">
                  <span className="vaw-cover-kicker">{domainLabel(slide.service)}</span>
                  <span className="vaw-cover-title vaw-display">{slide.title}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="vaw-cover-hits"
          aria-hidden
          onPointerDown={(e) => {
            if (e.button !== 0 || openRef.current) return;
            const n = pickCardAt(e.clientX, e.clientY);
            if (n != null) openPanel(n);
          }}
        />
      </div>

      {mode === 'walk' && N > 1 ? (
        <>
          <button
            type="button"
            className="vaw-cover-arrow vaw-cover-arrow-l"
            onClick={() => go(-1)}
            aria-label="Previous"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="vaw-cover-arrow vaw-cover-arrow-r"
            onClick={() => go(1)}
            aria-label="Next"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </>
      ) : null}

      <dialog
        ref={dlg}
        className="vaw-pop-dlg"
        onClose={() => setPanel(null)}
        onClick={closePanel}
        aria-labelledby="vaw-monitor-title"
      >
        {shown ? <Panel slide={shown} onClose={closePanel} /> : null}
      </dialog>
    </div>
  );
}
