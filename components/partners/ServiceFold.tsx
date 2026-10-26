'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronDown, Layers, X, type LucideIcon } from 'lucide-react';
import './service-fold.css';

type Item = { Icon: LucideIcon; title: string; body: string };

function Face({ item }: { item: Item }) {
  const { Icon } = item;
  return (
    <>
      <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm">
        <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
      </span>
      <h3 className="m-0 text-[1rem] font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
      <p className="mb-0 mt-1.5 text-[0.8438rem] leading-relaxed text-white/75">{item.body}</p>
    </>
  );
}

function FoldCards({
  items,
  open,
  listId,
}: {
  items: readonly Item[];
  open: boolean;
  listId: string;
}) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="vaw-fold__wrap">
      <div className="vaw-fold__inner">
        <ul id={listId} className="vaw-fold__list" aria-hidden={!open} inert={!open}>
          {items.map((item, i) => {
            const second = i >= half;
            const c = second ? i - half : i;
            return (
              <li
                key={item.title}
                className={`vaw-fold__item ${second ? 'vaw-fold__item--b' : 'vaw-fold__item--a'}`}
                style={
                  {
                    '--c': c,
                    '--n': i,
                    '--ga': `var(--g${c % 4})`,
                    '--gb': `var(--g${(c + 2) % 4})`,
                  } as CSSProperties
                }
              >
                <div className="vaw-fold__flip">
                  <div
                    className={`vaw-fold__face vaw-fold__face--front ${second ? 'vaw-fold__face--b' : ''}`}
                  >
                    <Face item={item} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Fold reverse, then shell fade, then unmount. */
const FOLD_CLOSE_MS = 900;
const SHELL_FADE_MS = 480;
const FOLD_OPEN_DELAY_MS = 280;

/**
 * Page keeps the single intro card. Click opens a translucent popup where the existing
 * fold animation plays and the eight service cards land fully open.
 */
export default function ServiceFold({
  eyebrow,
  chip,
  title,
  textStrong,
  textRest,
  items,
}: {
  eyebrow: string;
  chip: string;
  title: string;
  textStrong: string;
  textRest: string;
  items: readonly Item[];
}) {
  const [portalReady, setPortalReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shellOpen, setShellOpen] = useState(false);
  const [foldOpen, setFoldOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const listId = useId();
  const titleId = useId();

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  useEffect(() => {
    setPortalReady(true);
    return clearTimers;
  }, [clearTimers]);

  const requestClose = useCallback(() => {
    clearTimers();
    setFoldOpen(false);
    // Below lg the cards don't animate (service-fold.css), so the shell fades straight away.
    const foldMs = window.matchMedia('(min-width: 1024px)').matches ? FOLD_CLOSE_MS : 0;
    timers.current.push(
      window.setTimeout(() => setShellOpen(false), foldMs),
      window.setTimeout(() => {
        setMounted(false);
        timers.current = [];
      }, foldMs + SHELL_FADE_MS),
    );
  }, [clearTimers]);

  const openPopup = () => {
    clearTimers();
    setShellOpen(false);
    setFoldOpen(false);
    setMounted(true);
  };

  useEffect(() => {
    if (!mounted) return;
    const shellId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShellOpen(true));
    });
    const foldDelay = window.matchMedia('(min-width: 1024px)').matches ? FOLD_OPEN_DELAY_MS : 0;
    const foldTimer = window.setTimeout(() => setFoldOpen(true), foldDelay);
    timers.current.push(foldTimer);
    return () => {
      cancelAnimationFrame(shellId);
      window.clearTimeout(foldTimer);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, requestClose]);

  const popup =
    portalReady && mounted
      ? createPortal(
          <div
            className="vaw-fold-pop"
            data-open={shellOpen}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="vaw-fold-pop__backdrop"
              aria-label="Close"
              onClick={requestClose}
            />
            <div className="vaw-fold-pop__panel">
              <div className="vaw-fold-pop__bar">
                <div>
                  <p className="vaw-fold-pop__eyebrow">{eyebrow}</p>
                  <h2 id={titleId} className="vaw-fold-pop__title vaw-display">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="vaw-fold-pop__close"
                  aria-label="Close"
                  onClick={requestClose}
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <div className="vaw-fold vaw-fold--popup" data-open={foldOpen}>
                <FoldCards items={items} open={foldOpen} listId={listId} />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="vaw-fold">
        <div className="vaw-fold__head">
          <button type="button" className="vaw-fold__card" onClick={openPopup}>
            <span className="vaw-fold__bg" aria-hidden />

            <div className="vaw-fold__chips" aria-hidden>
              <span className="vaw-fold__glass vaw-fold__glass--icon">
                <Layers className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />
              </span>
              <span className="vaw-fold__glass vaw-fold__glass--pill">{chip}</span>
              <span className="vaw-fold__glass vaw-fold__glass--icon ml-auto">
                <ArrowUpRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />
              </span>
            </div>

            <div className="vaw-fold__mid">
              <h2 className="vaw-fold__title vaw-display">{title}</h2>
              <p className="vaw-fold__text">
                <strong>{textStrong}</strong> {textRest}
              </p>
            </div>

            <div className="vaw-fold__foot">
              <div className="vaw-fold__dashes" aria-hidden>
                {items.map((item) => (
                  <span key={item.title} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="vaw-fold__glass vaw-fold__glass--pill vaw-fold__hint">
                  <span className="vaw-fold__hint-hover">Click to explore</span>
                  <span className="vaw-fold__hint-tap">Tap to explore</span>
                  <ChevronDown className="vaw-fold__hint-arrow h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="vaw-fold__glass vaw-fold__glass--pill" aria-hidden>
                  {items.length} services
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
      {popup}
    </>
  );
}
