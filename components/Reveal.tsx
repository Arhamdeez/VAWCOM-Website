'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef, type ComponentType } from 'react';
import { DUR } from '@/lib/motion';

/**
 * Shared scroll reveal. Content is visible in the server HTML and for anyone without JS. After
 * hydration, anything that is still below the fold is hidden and eased in (fade + small rise) as
 * it scrolls into view, once. Anything already on screen is left alone, so there is never a flash
 * or a delay on what the visitor is looking at.
 *
 * Don't wrap elements other code measures with getBoundingClientRect (e.g. the globe slot): the
 * rise would offset the measurement.
 */
type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'aside' | 'header' | 'footer' | 'p';

type Props<T extends Tag> = { as?: T; delay?: number } & ComponentPropsWithoutRef<T>;

// One scroll listener for every pending element (not IntersectionObserver): a fast jump, an anchor
// link or the End key can skip an element entirely, and an observer would never fire for it, leaving
// it hidden. Checking position on scroll also reveals anything already scrolled past.
const pending = new Map<HTMLElement, () => void>();
let ticking = false;
let listening = false;

function check() {
  ticking = false;
  const limit = window.innerHeight * 0.9;
  for (const [el, reveal] of pending) {
    if (el.getBoundingClientRect().top < limit) {
      pending.delete(el);
      reveal();
    }
  }
  if (!pending.size && listening) {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    listening = false;
  }
}

function schedule() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(check);
  }
}

function watch(el: HTMLElement, reveal: () => void) {
  pending.set(el, reveal);
  if (!listening) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    listening = true;
  }
  schedule();
}

export default function Reveal<T extends Tag = 'div'>({ as, delay = 0, ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    // Already on screen (or above it): nothing to reveal.
    if (r.top < window.innerHeight * 0.9) return;

    let cleanup = 0;
    el.setAttribute('data-reveal', 'pending');
    el.style.setProperty('--vaw-reveal-delay', `${delay}s`);
    watch(el, () => {
      el.setAttribute('data-reveal', 'in');
      // Drop the hooks once it has landed so it can't interfere with later hover/transform styles.
      cleanup = window.setTimeout(
        () => {
          el.removeAttribute('data-reveal');
          el.style.removeProperty('--vaw-reveal-delay');
        },
        (DUR.enter + delay) * 1000 + 150,
      );
    });

    return () => {
      pending.delete(el);
      window.clearTimeout(cleanup);
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--vaw-reveal-delay');
    };
  }, [delay]);

  // A string tag at runtime; typed loosely because JSX can't resolve a ref across every element type.
  const Tag = (as ?? 'div') as unknown as ComponentType<Record<string, unknown>>;
  return <Tag ref={ref} {...rest} />;
}
