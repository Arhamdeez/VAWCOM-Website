'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import CreamPage from './CreamPage';
import ServiceDeck from './ServiceDeck';
import ServiceJump from './ServiceJump';
import { SERVICES, SERVICE_FAQS } from '@/lib/services';

const START = [
  {
    title: 'Talk',
    body: 'A short call or the form. You talk to the people who will build it.',
  },
  {
    title: 'Lock a slice',
    body: 'We lock a first slice with a date, not a vague phase.',
  },
  {
    title: 'Ship & decide',
    body: 'We build that slice, you use it, then we decide the next one.',
  },
] as const;

function fade(reduce: boolean | null) {
  return reduce
    ? { initial: false, whileInView: undefined, viewport: undefined, transition: undefined }
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-8% 0px' },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };
}

export default function ServicesHub() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(SERVICES[0]?.id ?? '');
  const [jumpOpen, setJumpOpen] = useState(false);
  const [pastDeck, setPastDeck] = useState(false);
  const pastDeckRef = useRef(false);
  const deckEndRef = useRef<HTMLDivElement>(null);
  const anim = fade(reduce);

  const go = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  useEffect(() => {
    const el = deckEndRef.current;
    if (!el) return;
    const sync = () => {
      const past = el.getBoundingClientRect().top < window.innerHeight * 0.42;
      if (past === pastDeckRef.current) return;
      pastDeckRef.current = past;
      setPastDeck(past);
      if (!past) setJumpOpen(false);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  useEffect(() => {
    const scrollHash = () => {
      const id = window.location.hash.slice(1);
      if (!id || !SERVICES.some((s) => s.id === id)) return;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    scrollHash();
    window.addEventListener('hashchange', scrollHash);

    const nodes = SERVICES.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) {
      return () => window.removeEventListener('hashchange', scrollHash);
    }
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      window.removeEventListener('hashchange', scrollHash);
    };
  }, []);

  return (
    <CreamPage nav="services">
      <div className="vaw-hero">
        <ServiceJump
          active={active}
          open={jumpOpen}
          setOpen={setJumpOpen}
          visible={pastDeck}
          onPick={go}
        />

        <motion.header
          className="relative z-10 mx-auto max-w-[1100px] px-6 pt-28 text-center sm:px-8 lg:px-10 lg:pt-32"
          {...anim}
        >
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            Services
          </p>
          <h1 className="vaw-display m-0 text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] tracking-[-0.04em] text-[#161615]">
            What we
            <span className="text-[#0cb78b]"> build.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[42ch] text-[17px] leading-relaxed text-[#5c5a56]">
            Open a card, or pick from Services in the nav, for the full write-up: process, stack,
            and what to bring.
          </p>
        </motion.header>

        <div className="relative z-0 mt-4 w-full bg-transparent">
          <ServiceDeck />
        </div>
        <div ref={deckEndRef} className="h-0 w-full" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 pt-28 sm:px-8 lg:px-10 lg:pl-24">
          <motion.section {...anim}>
            <h2 className="vaw-display m-0 text-[clamp(1.7rem,3.2vw,2.4rem)] tracking-[-0.03em] text-[#161615]">
              How a project starts
            </h2>
            <ol className="mt-10 grid gap-5 sm:grid-cols-3">
              {START.map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_12px_32px_rgba(22,22,21,0.06)]"
                >
                  <span
                    aria-hidden
                    className="vaw-display select-none text-[3.25rem] leading-none tracking-[-0.06em] text-[#0cb78b]/30"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-[15px] font-semibold text-[#161615]">{step.title}</p>
                    <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          <motion.section className="mt-20" {...anim}>
            <h2 className="vaw-display m-0 text-[clamp(1.7rem,3.2vw,2.4rem)] tracking-[-0.03em] text-[#161615]">
              Questions we get first
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICE_FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-[1.5rem] bg-white p-5 shadow-[0_10px_28px_rgba(22,22,21,0.06)] open:bg-[#e6faf3] open:shadow-[0_14px_36px_rgba(12,183,139,0.12)]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15px] font-semibold text-[#161615] marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#0cb78b]/12 text-[18px] font-normal leading-none text-[#0cb78b] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mb-0 mt-3 text-[14.5px] leading-relaxed text-[#5c5a56]">{item.a}</p>
                </details>
              ))}
            </div>
          </motion.section>

          <motion.section className="mt-20" {...anim}>
            <div className="rounded-[1.5rem] bg-white p-7 shadow-[0_12px_32px_rgba(22,22,21,0.06)] sm:p-9">
              <h2 className="vaw-display m-0 text-[clamp(1.7rem,3.2vw,2.4rem)] tracking-[-0.03em] text-[#161615]">
                Still stuck?
              </h2>
              <p className="mt-4 mb-0 max-w-[46ch] text-[15px] leading-relaxed text-[#5c5a56]">
                Tell us what you are trying to get done. We will point you to the right service, or say
                if it is not a fit.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-6 py-3 text-[14px] font-medium text-[#0b0d0c] hover:bg-[#0a9d77]"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.section>

          <Link
            href="/gallery"
            className="mt-14 inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b]/12 px-5 py-2.5 text-[14px] font-medium text-[#0cb78b] hover:bg-[#0cb78b]/20"
          >
            See gallery
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </CreamPage>
  );
}
