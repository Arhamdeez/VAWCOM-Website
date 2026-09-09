'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Leftover /#services bookmarks → /services.
 * On full reload with a hash, strip hash and stay at hero.
 */
export default function HomeHashScroll() {
  const pathname = usePathname();
  const skipInitialHashScrollRef = useRef(false);

  useLayoutEffect(() => {
    if (pathname !== '/') return;
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type !== 'reload') {
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
      if (window.location.hash.slice(1) === 'services') {
        window.location.replace('/services');
      }
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
