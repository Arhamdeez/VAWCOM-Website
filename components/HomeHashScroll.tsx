'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToServicesSection } from '@/lib/navigation';

function getNavigationType(): string | undefined {
  if (typeof performance === 'undefined') return undefined;
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type;
}

/**
 * Ensures /#services scrolls into view after client navigations and hash changes.
 * On full reload with a hash, strip hash and stay at hero (no jump).
 */
export default function HomeHashScroll() {
  const pathname = usePathname();
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
      if (hash !== 'demos' && hash !== 'services') return;
      scrollToServicesSection();
    };

    let t: number | undefined;
    if (!skipInitialHashScrollRef.current) {
      scrollToHash();
      t = window.setTimeout(scrollToHash, 180);
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
