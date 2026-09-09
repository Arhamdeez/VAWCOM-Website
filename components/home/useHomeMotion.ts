'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** Lightweight home motion: nav link collapse + one-shot hero intro. */
export function useHomeMotion(rootRef: RefObject<HTMLElement | null>) {
  const navCollapsed = useRef<boolean | null>(null);
  const introDone = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = <T extends Element>(sel: string) => root.querySelector(sel) as T | null;

    const updateNav = () => {
      const nav = q<HTMLElement>('[data-nav]');
      const links = q<HTMLElement>('[data-nav-links]');
      if (!nav || !links) return;
      const collapsed =
        window.scrollY > window.innerHeight * 0.55 || window.innerWidth < 820;
      if (collapsed === navCollapsed.current) return;
      navCollapsed.current = collapsed;
      links.style.maxWidth = collapsed ? '0px' : '660px';
      links.style.opacity = collapsed ? '0' : '1';
      if (collapsed) {
        nav.style.gap = '14px';
        nav.style.padding = '10px 10px 10px 14px';
      } else {
        nav.style.gap = '';
        nav.style.padding = '';
      }
    };

    const playIntro = () => {
      if (introDone.current) return;
      introDone.current = true;
      const headline = q<HTMLElement>('[data-headline]');
      if (!headline || reduce) return;
      headline.animate(
        [
          { opacity: 0, transform: 'translateY(18px) scale(.97)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        {
          duration: 460,
          delay: 200,
          fill: 'both',
          easing: 'cubic-bezier(.16,1.1,.3,1)',
        },
      );
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateNav();
      });
    };

    playIntro();
    updateNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateNav);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateNav);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [rootRef]);
}
