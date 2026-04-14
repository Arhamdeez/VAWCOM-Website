'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getNavigationType(): string | undefined {
  if (typeof performance === 'undefined') return undefined;
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type;
}

/**
 * Ensures /#services (and other in-page hashes) scroll into view after
 * client navigations and hash changes — but a full **reload** stays at the hero
 * (no jump to #services from a lingering hash).
 */
export default function HomeHashScroll() {
  const pathname = usePathname();
  /** True only for the initial paint after a full reload (skip auto hash scroll once). */
  const skipInitialHashScrollRef = useRef(false);

  useLayoutEffect(() => {
    if (pathname !== '/') return;
    if (getNavigationType() !== 'reload') {
      skipInitialHashScrollRef.current = false;
      return;
    }

    skipInitialHashScrollRef.current = true;

    if (typeof window.history.scrollRestoration === 'string') {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        });
      });
    };

    let t: number | undefined;
    if (!skipInitialHashScrollRef.current) {
      scrollToHash();
      t = window.setTimeout(scrollToHash, 120);
    } else {
      skipInitialHashScrollRef.current = false;
    }

    window.addEventListener('hashchange', scrollToHash);
    return () => {
      if (t !== undefined) window.clearTimeout(t);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [pathname]);

  return null;
}
