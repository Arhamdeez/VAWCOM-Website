'use client';

import { useEffect, useRef, type RefObject } from 'react';

type Opts = {
  pinScreens?: number;
};

/** Scroll-driven motion from the Claude Design home prototype — kept in one place. */
export function useHomeMotion(rootRef: RefObject<HTMLElement | null>, opts: Opts = {}) {
  const pinScreens = opts.pinScreens ?? 2;
  const activeCard = useRef(-1);
  const navCollapsed = useRef<boolean | null>(null);
  const waveAnims = useRef<Animation[]>([]);
  const waveRate = useRef(0);
  const paintAnim = useRef<Animation | null>(null);
  const dripAnims = useRef<Animation[]>([]);
  const introDone = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const q = <T extends Element>(sel: string) => root.querySelector(sel) as T | null;
    const qa = <T extends Element>(sel: string) => [...root.querySelectorAll(sel)] as T[];

    const pinWrap = () => q<HTMLElement>('[data-pin-wrap]');
    const applyPin = () => {
      const w = pinWrap();
      if (w) w.style.height = `${pinScreens * 100}vh`;
    };
    applyPin();

    const splashCard = (i: number) => {
      qa<HTMLElement>('[data-paint]').forEach((el) => {
        if (Number(el.dataset.paint) === i) return;
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      qa<HTMLElement>('[data-drip]').forEach((el) => {
        if (Number(el.dataset.drip) === i) return;
        el.style.opacity = '0';
        el.style.transform = 'scale(0)';
      });
      const paint = q<HTMLElement>(`[data-paint="${i}"]`);
      const rot = (i % 2 ? -1 : 1) * (5 + i * 4);
      const peak = i === 1 || i === 5 ? 0.26 : 0.4;
      if (paint) {
        if (reduce) {
          paint.style.opacity = String(peak);
          paint.style.transform = `translate(-50%,-50%) scale(1) rotate(${rot}deg)`;
        } else {
          paintAnim.current?.cancel();
          paintAnim.current = paint.animate(
            [
              { opacity: 0, transform: `translate(-50%,-50%) scale(0.15) rotate(${rot - 24}deg)` },
              {
                opacity: peak * 1.25,
                transform: `translate(-50%,-50%) scale(1.16) rotate(${rot + 6}deg)`,
                offset: 0.55,
              },
              { opacity: peak, transform: `translate(-50%,-50%) scale(1) rotate(${rot}deg)` },
            ],
            { duration: 720, easing: 'cubic-bezier(.16,1.1,.3,1)', fill: 'forwards' }
          );
        }
      }
      dripAnims.current.forEach((a) => a.cancel());
      dripAnims.current = [];
      qa<HTMLElement>(`[data-drip="${i}"]`).forEach((el, k) => {
        if (reduce) {
          el.style.opacity = '0.32';
          el.style.transform = 'scale(1)';
          return;
        }
        dripAnims.current.push(
          el.animate(
            [
              { opacity: 0, transform: 'scale(0) translate(0,0)' },
              {
                opacity: 0.4,
                transform: `scale(1.25) translate(${(k % 2 ? -1 : 1) * 8}px,${-6 - k * 2}px)`,
                offset: 0.5,
              },
              { opacity: 0.3, transform: 'scale(1) translate(0,0)' },
            ],
            {
              duration: 640,
              delay: 90 + k * 70,
              easing: 'cubic-bezier(.2,1.3,.35,1)',
              fill: 'forwards',
            }
          )
        );
      });
    };

    const updateZoom = () => {
      const wrap = q<HTMLElement>('[data-zoom-wrap]');
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
      const ease = (x: number) => x * x;
      const dev = q<HTMLElement>('[data-device]');
      const copy = q<HTMLElement>('[data-hero-copy]');
      const screen = q<HTMLElement>('[data-hero-screen]');
      if (dev) {
        const scale = 1 + ease(p) * 13;
        dev.style.transform = `translate(-50%,-30%) scale(${scale.toFixed(3)})`;
        const fadeIn = 0.42 + 0.58 * Math.min(1, p / 0.45);
        const fadeOut = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.25);
        dev.style.opacity = (fadeIn * fadeOut).toFixed(3);
      }
      if (copy) {
        const out = Math.max(0, Math.min(1, p / 0.34));
        copy.style.opacity = (1 - out).toFixed(3);
        copy.style.transform = `translateY(${(-out * 70).toFixed(1)}px) scale(${(1 - out * 0.04).toFixed(4)})`;
        copy.style.pointerEvents = out > 0.6 ? 'none' : 'auto';
      }
      if (screen) {
        // Reveal while still sticky; hold at full opacity through the end of the pin
        const inn = Math.max(0, Math.min(1, (p - 0.45) / 0.25));
        screen.style.opacity = inn.toFixed(3);
        screen.style.transform = `scale(${(1.06 - inn * 0.06).toFixed(4)})`;
        screen.style.pointerEvents = inn > 0.7 ? 'auto' : 'none';
      }
    };

    const updateNav = () => {
      const nav = q<HTMLElement>('[data-nav]');
      const links = q<HTMLElement>('[data-nav-links]');
      if (!nav || !links) return;
      const collapsed = window.scrollY > window.innerHeight * 0.55 || window.innerWidth < 820;
      if (collapsed === navCollapsed.current) return;
      navCollapsed.current = collapsed;
      links.style.maxWidth = collapsed ? '0px' : '660px';
      links.style.opacity = collapsed ? '0' : '1';
      nav.style.gap = collapsed ? '14px' : '22px';
      nav.style.padding = collapsed ? '10px 10px 10px 14px' : '10px 14px 10px 16px';
    };

    const updateSplash = () => {
      const layer = q<HTMLElement>('[data-splash]');
      const content = q<HTMLElement>('[data-splash-content]');
      if (!layer) return;
      const sec = layer.parentElement;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
      const eased = 1 - Math.pow(1 - p, 2.6);
      layer.style.transform = `scale(${(0.06 + eased * 0.98).toFixed(3)}) rotate(${(-4 + eased * 4).toFixed(2)}deg)`;
      layer.style.transformOrigin = '46% 40%';
      qa<HTMLElement>('[data-drop]').forEach((d, i) => {
        const start = 0.05 + i * 0.055;
        const dp = Math.max(0, Math.min(1, (p - start) / 0.16));
        const over = 1 - Math.pow(1 - dp, 3);
        d.style.filter = 'blur(0.6px)';
        d.style.transform = `scale(${(over * (1 + (i % 3) * 0.25)).toFixed(3)})`;
      });
      if (content) content.style.opacity = Math.max(0, Math.min(1, (p - 0.5) / 0.28)).toFixed(3);
    };

    const updateTrack = () => {
      const wrap = pinWrap();
      const track = q<HTMLElement>('[data-track]');
      if (!wrap || !track) return;
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      let p = span > 0 ? -r.top / span : 0;
      p = Math.max(0, Math.min(1, p));
      const dist = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      const beats = 6;
      const t = p * beats;
      const cards = qa<HTMLElement>('[data-step]');
      const active = Math.max(0, Math.min(cards.length - 1, Math.floor(t)));
      if (active !== activeCard.current) {
        activeCard.current = active;
        splashCard(active);
        const label = q<HTMLElement>('[data-track-label]');
        if (label) label.textContent = `${active + 1} / ${cards.length}`;
      }
      const bar = q<HTMLElement>('[data-progress]');
      if (bar) bar.style.width = `${(p * 100).toFixed(1)}%`;
      cards.forEach((el) => {
        const i = Number(el.dataset.step);
        const near = Math.max(0, 1 - Math.abs(t - (i + 0.5)) / 1.15);
        el.style.opacity = (0.18 + 0.82 * near).toFixed(3);
        el.style.transform = `translateY(${((1 - near) * 12).toFixed(1)}px)`;
      });
    };

    const updateAboutStrip = () => {
      const strip = q<HTMLElement>('[data-about-strip]');
      const row = q<HTMLElement>('[data-about-row]');
      if (!strip || !row) return;
      const r = strip.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (vh - r.top) / (vh + r.height);
      const half = row.scrollWidth / 2;
      row.style.transform = `translate3d(${(-((p * half * 1.15) % half)).toFixed(1)}px,0,0)`;
    };

    const updateWave = () => {
      const wrap = q<HTMLElement>('[data-wave]');
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const near = Math.max(
        0,
        1 - Math.abs(r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight * 0.9)
      );
      wrap.style.opacity = (0.28 + 0.72 * near).toFixed(3);
      const live = wrap.dataset.live === '1';
      const rate = (0.3 + near * 0.7) * (live ? 2.1 : 0.85);
      if (Math.abs(rate - waveRate.current) > 0.05) {
        waveRate.current = rate;
        waveAnims.current.forEach((a) => {
          try {
            a.updatePlaybackRate(rate);
          } catch {
            /* ignore */
          }
        });
      }
    };

    const startWave = () => {
      if (reduce || waveAnims.current.length) return;
      const wrap = q<HTMLElement>('[data-wave]');
      if (!wrap) return;
      const bars = qa<HTMLElement>('[data-bar]');
      bars.forEach((b, i) => {
        const peak = 1.6 + 5.4 * Math.abs(Math.sin(i * 0.7)) + (i % 5) * 0.5;
        waveAnims.current.push(
          b.animate(
            [
              { transform: 'scaleY(1)' },
              { transform: `scaleY(${peak.toFixed(2)})`, offset: 0.5 },
              { transform: 'scaleY(1)' },
            ],
            {
              duration: 1100 + (i % 7) * 130,
              delay: i * 24,
              iterations: Infinity,
              easing: 'ease-in-out',
            }
          )
        );
      });
    };

    const revealIn = (el: HTMLElement) => {
      el.dataset.revealed = 'done';
      if (reduce) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.querySelectorAll<HTMLElement>('[data-word]').forEach((w) => {
          w.style.opacity = '1';
          w.style.transform = 'none';
        });
        if (el.dataset.reveal === 'stagger') {
          [...el.children].forEach((c) => {
            (c as HTMLElement).style.opacity = '1';
            (c as HTMLElement).style.transform = 'none';
          });
        }
        return;
      }
      const kind = el.dataset.reveal;
      if (kind === 'words') {
        el.querySelectorAll<HTMLElement>('[data-word]').forEach((w, i) => {
          w.animate(
            [
              { opacity: 0, transform: 'translateY(38px) rotate(-4deg)' },
              { opacity: 1, transform: 'translateY(-9px) rotate(1deg)', offset: 0.62 },
              { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
            ],
            { duration: 760, delay: i * 70, fill: 'both', easing: 'cubic-bezier(.25,.9,.3,1)' }
          );
        });
        return;
      }
      if (kind === 'stagger') {
        [...el.children].forEach((c, i) => {
          (c as HTMLElement).animate(
            [
              { opacity: 0, transform: 'translateY(26px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 600, delay: i * 70, fill: 'both', easing: 'cubic-bezier(.2,1.5,.35,1)' }
          );
        });
        return;
      }
      el.animate(
        [
          { opacity: 0, transform: 'translateY(30px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 640, fill: 'both', easing: 'cubic-bezier(.2,1.5,.35,1)' }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          revealIn(e.target as HTMLElement);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    qa<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.dataset.revealed) return;
      if (reduce) {
        revealIn(el);
        return;
      }
      const kind = el.dataset.reveal;
      if (kind === 'words') {
        el.querySelectorAll<HTMLElement>('[data-word]').forEach((w) => {
          w.style.opacity = '0';
          w.style.transform = 'translateY(38px) rotate(-4deg)';
        });
      } else if (kind === 'stagger') {
        [...el.children].forEach((c) => {
          (c as HTMLElement).style.opacity = '0';
          (c as HTMLElement).style.transform = 'translateY(26px)';
        });
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
      }
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) revealIn(el);
      else io.observe(el);
    });

    const playIntro = () => {
      if (introDone.current) return;
      let seen = false;
      try {
        seen = sessionStorage.getItem('vawcom_hero_intro') === '1';
      } catch {
        /* ignore */
      }
      const quip = q<HTMLElement>('[data-quip]');
      const strike = q<HTMLElement>('[data-strike]');
      const headline = q<HTMLElement>('[data-headline]');
      const subhead = q<HTMLElement>('[data-subhead]');
      const cta = q<HTMLElement>('[data-cta]');
      const finish = () => {
        introDone.current = true;
        if (quip) quip.style.opacity = '0';
        [headline, subhead, cta].forEach((el) => {
          if (!el) return;
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        try {
          sessionStorage.setItem('vawcom_hero_intro', '1');
        } catch {
          /* ignore */
        }
      };
      if (reduce || seen) {
        finish();
        return;
      }
      if (headline) {
        headline.style.opacity = '0';
        headline.style.transform = 'translateY(18px) scale(.97)';
      }
      if (subhead) {
        subhead.style.opacity = '0';
        subhead.style.transform = 'translateY(14px)';
      }
      if (cta) {
        cta.style.opacity = '0';
        cta.style.transform = 'translateY(14px)';
      }
      quip?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, delay: 200, fill: 'both' });
      strike?.animate([{ width: '0%' }, { width: '100%' }], {
        duration: 280,
        delay: 820,
        fill: 'both',
      });
      quip?.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(120px,-70px) rotate(9deg)', opacity: 0 },
        ],
        { duration: 520, delay: 1240, fill: 'both' }
      );
      headline?.animate(
        [
          { opacity: 0, transform: 'translateY(18px) scale(.97)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 460, delay: 1560, fill: 'both', easing: 'cubic-bezier(.16,1.1,.3,1)' }
      );
      subhead?.animate(
        [
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 420, delay: 1820, fill: 'both' }
      );
      cta?.animate(
        [
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 420, delay: 1940, fill: 'both' }
      );
      window.setTimeout(finish, 2500);
    };

    const onScroll = () => {
      updateZoom();
      updateNav();
      updateTrack();
      updateWave();
      updateSplash();
      updateAboutStrip();
    };
    const onResize = () => {
      applyPin();
      updateZoom();
      updateTrack();
      updateNav();
    };

    startWave();
    playIntro();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Expose jump helpers for track arrows
    (root as HTMLElement & { __jumpTrack?: (dir: number) => void }).__jumpTrack = (dir: number) => {
      const wrap = pinWrap();
      if (!wrap) return;
      const cards = wrap.querySelectorAll('[data-step]').length || 1;
      const span = wrap.offsetHeight - window.innerHeight;
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const cur = activeCard.current < 0 ? 0 : activeCard.current;
      const to = Math.max(0, Math.min(cards - 1, cur + dir));
      window.scrollTo({ top: top + span * ((to + 0.5) / cards), behavior: 'smooth' });
    };

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      waveAnims.current.forEach((a) => a.cancel());
      waveAnims.current = [];
      paintAnim.current?.cancel();
      dripAnims.current.forEach((a) => a.cancel());
    };
  }, [rootRef, pinScreens]);
}

export function jumpHomeTrack(root: HTMLElement | null, dir: number) {
  const host = root as (HTMLElement & { __jumpTrack?: (d: number) => void }) | null;
  host?.__jumpTrack?.(dir);
}
