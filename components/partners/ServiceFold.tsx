'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ChevronDown, Layers, type LucideIcon } from 'lucide-react';
import './service-fold.css';

type Item = { Icon: LucideIcon; title: string; body: string };

function Face({ item }: { item: Item }) {
  const { Icon } = item;
  return (
    <>
      <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm">
        <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
      </span>
      <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
      <p className="mb-0 mt-1.5 text-[13.5px] leading-relaxed text-white/75">{item.body}</p>
    </>
  );
}

/**
 * Starts as one tall gradient card with the section's title and text. Hover (mouse) or tap/Enter opens
 * it: it fades into the first four cards, a stacked copy appears, and that copy folds down into the
 * second row. Scrolling back up past it plays everything in reverse, back to the single card. Below
 * `lg` it expands into a staggered list instead.
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const armed = useRef(true); // whether plain hovering may open it (off right after it auto-closes)
  const openedAt = useRef(0);
  const [shift, setShift] = useState(0);
  const listId = useId();
  const half = Math.ceil(items.length / 2);

  // While closed on desktop, the card sits halfway down the (hidden) cards so it reads as centred.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      setShift(desktop ? Math.round((list.offsetHeight + 40) / 2) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Scrolling back up past the section closes it (the reverse of the opening); a new visit re-arms it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const up = y < lastY;
      lastY = y;
      const r = el.getBoundingClientRect();
      if (open) {
        if (up && r.top > window.innerHeight * 0.6 && performance.now() - openedAt.current > 1000) {
          armed.current = false;
          setOpen(false);
        }
      } else if (!armed.current && (r.top > window.innerHeight || r.bottom < 0)) {
        armed.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  const show = () => {
    if (open) return;
    openedAt.current = performance.now();
    setOpen(true);
  };

  const style = { '--fold-shift': `${shift}px` } as CSSProperties;

  return (
    <div ref={rootRef} className="vaw-fold" data-open={open} style={style}>
      <div className="vaw-fold__head">
        <div
          className="vaw-fold__card"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse' && armed.current) show();
          }}
          onPointerLeave={() => {
            armed.current = true;
          }}
          onClick={show}
        >
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

          <div>
            <p className="vaw-fold__eyebrow">{eyebrow}</p>
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
              <button
                type="button"
                className="vaw-fold__glass vaw-fold__glass--pill vaw-fold__hint"
                aria-expanded={open}
                aria-controls={listId}
                tabIndex={open ? -1 : 0}
              >
                <span className="vaw-fold__hint-hover">Hover to explore</span>
                <span className="vaw-fold__hint-tap">Tap to explore</span>
                <ChevronDown className="vaw-fold__hint-arrow h-4 w-4" strokeWidth={2.2} />
              </button>
              <span className="vaw-fold__glass vaw-fold__glass--pill" aria-hidden>
                {items.length} services
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="vaw-fold__wrap">
        <div className="vaw-fold__inner">
          <ul
            ref={listRef}
            id={listId}
            className="vaw-fold__list"
            aria-hidden={!open}
            inert={!open}
          >
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
                    {second ? (
                      // The copy of the card above it: this is what is seen turning over.
                      <div className="vaw-fold__face vaw-fold__face--back" aria-hidden>
                        <Face item={items[c]} />
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
