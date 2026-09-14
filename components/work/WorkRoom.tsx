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
const ORBIT_MS = 480;
const SETTLE_MS = 720;
/** One short intro turn — not a full lap. */
const ORBIT_DEG = 120;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

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

function walkTransform(d: number, compact = false) {
  if (compact) {
    // Flatter cover-flow so phones aren’t crammed into deep perspective.
    return `translateX(calc(-50% + ${d * 12}vw)) rotateY(${-d * 18}deg) translateZ(${60 - Math.abs(d) * 40}px) scale(${1 - Math.abs(d) * 0.05})`;
  }
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
  full = false,
}: {
  slide: WorkSlide;
  onClose: () => void;
  full?: boolean;
}) {
  const service = getService(slide.service);
  const hasVideo = slide.review?.type === 'video';
  const body = (slide.details ?? slide.summary).split(/\n\n+/);

  return (
    <div
      className={`vaw-pop${hasVideo ? ' is-video' : ' is-wide'}${full ? ' is-full' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="vaw-pop-core">
        {full ? (
          <button type="button" className="vaw-pop-x" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : null}
        <div className="vaw-pop-main">
          <div className="vaw-pop-copy">
            <p className="vaw-pop-kicker">
              <Link href={`/services/${slide.service}`}>{service?.nav ?? slide.service}</Link>
            </p>
            <h2 id={full ? 'vaw-monitor-title' : undefined} className="vaw-display">
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
            {slide.url ? (
              <Link href={slide.url} className="vaw-pop-open">
                Open
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
          <div className="vaw-pop-stage">
            {slide.review ? (
              <section className={`vaw-pop-demo${hasVideo ? ' is-side' : ' is-quote'}`}>
                <p className="vaw-pop-review-label">Client review</p>
                <ReviewBlock review={slide.review} />
              </section>
            ) : null}
            <section className="vaw-pop-demo is-hero">
              <p className="vaw-pop-review-label">Demo</p>
              {slide.demo ? <p className="vaw-pop-demo-note">{slide.demo}</p> : null}
              <MockChrome kind={slide.kind} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkRoom() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [panel, setPanel] = useState<number | null>(null);
  const [mode, setMode] = useState<'orbit' | 'walk'>('orbit');
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const dlg = useRef<HTMLDialogElement>(null);
  const reduce = useRef(false);
  const compact = useRef(false);
  const lock = useRef(0);
  const acc = useRef(0);
  const touchX = useRef<number | null>(null);
  const openRef = useRef(false);
  const iRef = useRef(0);
  const settlingRef = useRef(false);
  const flipFrom = useRef<
    ({ x: number; y: number; w: number; h: number } | null)[] | null
  >(null);
  const modeRef = useRef<'orbit' | 'settle' | 'walk'>('orbit');
  openRef.current = panel != null;
  iRef.current = i;

  const go = useCallback((dir: number) => {
    if (N < 2 || openRef.current) return false;
    const now = performance.now();
    if (now < lock.current) return false;
    lock.current = now + 280;
    setHover(null);
    setI((n) => wrap(n + dir));
    return true;
  }, []);

  const settle = useCallback((to?: number) => {
    if (modeRef.current !== 'orbit') return;
    if (to != null) {
      iRef.current = to;
      setI(to);
    }

    if (reduce.current) {
      modeRef.current = 'walk';
      settlingRef.current = false;
      setMode('walk');
      return;
    }

    modeRef.current = 'settle';
    settlingRef.current = true;
    flipFrom.current = cards.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    });
    cards.current.forEach((el) => {
      if (!el) return;
      el.style.transition = 'none';
    });
    setMode('walk');
  }, []);

  useLayoutEffect(() => {
    const first = flipFrom.current;
    if (!first || mode !== 'walk' || !settlingRef.current) return;
    flipFrom.current = null;
    const active = iRef.current;

    cards.current.forEach((el, n) => {
      if (!el || !first[n]) return;
      const d = offset(n, active);
      const r = el.getBoundingClientRect();
      const dx = first[n].x - (r.left + r.width / 2);
      const dy = first[n].y - (r.top + r.height / 2);
      const sx = first[n].w / (r.width || 1);
      const sy = first[n].h / (r.height || 1);
      el.style.transition = 'none';
      el.style.transform = `${walkTransform(d, compact.current)} translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      el.style.opacity = '1';
      el.style.zIndex = String(8 - Math.abs(d));
    });

    let doneTimer = 0;
    const play = requestAnimationFrame(() => {
      cards.current.forEach((el, n) => {
        if (!el) return;
        const d = offset(n, active);
        el.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease`;
        el.style.transform = walkTransform(d, compact.current);
        el.style.opacity = Math.abs(d) > 2 ? '0' : '1';
        el.style.zIndex = String(8 - Math.abs(d));
      });
      doneTimer = window.setTimeout(() => {
        // Keep final walk poses — clearing transform drops to CSS translateX(-50%)
        // and stacks every card on the center before React can re-apply styles.
        cards.current.forEach((el, n) => {
          if (!el) return;
          const d = offset(n, active);
          el.style.transition = '';
          el.style.transform = walkTransform(d, compact.current);
          el.style.opacity = Math.abs(d) > 2 ? '0' : '1';
          el.style.zIndex = String(8 - Math.abs(d));
        });
        settlingRef.current = false;
        modeRef.current = 'walk';
        setI((n) => n);
      }, SETTLE_MS + 40);
    });

    return () => {
      cancelAnimationFrame(play);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [mode]);

  const closePanel = useCallback(() => {
    dlg.current?.close();
    setPanel(null);
  }, []);

  const openPanel = useCallback((n: number) => {
    if (!compact.current && modeRef.current === 'orbit') settle(n);
    setHover(null);
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

  const peekCard = useCallback(
    (clientX: number, clientY: number) => {
      if (openRef.current || modeRef.current !== 'walk' || reduce.current) {
        setHover(null);
        return;
      }
      setHover(pickCardAt(clientX, clientY));
    },
    [pickCardAt],
  );

  useLayoutEffect(() => {
    if (panel == null) return;
    if (dlg.current && !dlg.current.open) dlg.current.showModal();
  }, [panel]);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mq = window.matchMedia('(max-width: 800px)');
    const syncCompact = () => {
      const on = mq.matches;
      compact.current = on;
      setIsMobile(on);
    };
    syncCompact();
    mq.addEventListener('change', syncCompact);
    const hash = window.location.hash.slice(1);
    const hit = SLIDES.findIndex((s) => s.id === hash || s.service === hash);
    if (hit >= 0) {
      setI(hit);
      if (mq.matches) setPanel(hit);
      else settle();
      return () => mq.removeEventListener('change', syncCompact);
    }
    if (!mq.matches && reduce.current) settle();
    return () => mq.removeEventListener('change', syncCompact);
  }, [settle]);

  useEffect(() => {
    if (isMobile || mode !== 'orbit' || reduce.current) return;
    let raf = 0;
    let live = true;
    const start = performance.now();
    const tick = (now: number) => {
      if (!live || modeRef.current !== 'orbit') return;
      const t = Math.min(1, (now - start) / ORBIT_MS);
      const spin = easeOutCubic(t) * ORBIT_DEG;
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
  }, [mode, settle, isMobile]);

  useEffect(() => {
    if (isMobile) return;
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
  }, [go, settle, isMobile]);

  const shown = panel != null ? SLIDES[panel] : null;
  const peek = hover != null && panel == null && mode === 'walk' ? SLIDES[hover] : null;

  const detailDialog = (
    <dialog
      ref={dlg}
      className="vaw-pop-dlg"
      onClose={() => setPanel(null)}
      onClick={closePanel}
      aria-labelledby="vaw-monitor-title"
    >
      {shown ? <Panel slide={shown} onClose={closePanel} full /> : null}
    </dialog>
  );

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="min-h-svh bg-[#f5f3ee] text-[#161615]">
        <div className="mx-auto max-w-lg px-5 pb-16 pt-28">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            Gallery
          </p>
          <h1 className="vaw-display m-0 text-[clamp(2rem,8vw,2.75rem)] tracking-[-0.03em] text-[#161615]">
            Selected work
          </h1>
          <p className="mt-3 mb-0 max-w-[36ch] text-[15px] leading-relaxed text-[#5c5a56]">
            Tap a project for the full write-up.
          </p>
          <ul className="mt-8 m-0 list-none space-y-3 p-0">
            {SLIDES.map((slide, n) => (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => openPanel(n)}
                  className="flex w-full flex-col rounded-[1.25rem] border border-black/[0.06] bg-white px-5 py-4 text-left shadow-[0_10px_28px_rgba(22,22,21,0.05)] transition-colors hover:border-[#0cb78b]/35"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0cb78b]">
                    {domainLabel(slide.service)}
                  </span>
                  <span className="vaw-display mt-1.5 text-[1.35rem] tracking-[-0.02em] text-[#161615]">
                    {slide.title}
                  </span>
                  <span className="mt-2 text-[14px] leading-snug text-[#5c5a56]">
                    {slide.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {detailDialog}
      </div>
    );
  }

  return (
    <div
      ref={scene}
      className={`vaw-cover${mode === 'orbit' ? ' is-orbit' : ' is-walk'}${panel != null ? ' is-open' : ''}${peek ? ' is-peek' : ''}`}
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
                  mode === 'orbit'
                    ? { transform: orbitTransform(n, 0) }
                    : {
                        transform: walkTransform(d, compact.current),
                        zIndex: 8 - Math.abs(d),
                        opacity: far ? 0 : 1,
                      }
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
          onPointerMove={(e) => {
            if (e.pointerType === 'touch') return;
            peekCard(e.clientX, e.clientY);
          }}
          onPointerLeave={() => setHover(null)}
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

      {peek ? (
        <div className="vaw-pop-peek" aria-hidden>
          <Panel slide={peek} onClose={() => setHover(null)} />
        </div>
      ) : null}

      {detailDialog}
    </div>
  );
}
