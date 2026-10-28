'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CONTACT_EMAIL, HERO_CENTERED_TRYOUT as CENTERED, SOCIAL, getGmailComposeUrl } from '@/lib/site';
import { IconGitHub, IconInstagram, IconLinkedIn, IconMail } from './SocialIcons';
import { CHAT_PROMPTS, HeroChatSlot, useSiteChat } from '@/components/chat/SiteChat';
import { EASE, DUR, NAV_MORPH } from '@/lib/motion';

const VawcomBot = dynamic(() => import('./VawcomBot'), { ssr: false });

const ACCENT = '#0cb78b';

/** What we build, as a compact row: Web | Apps | Voice … Two groups so phones wrap into two clean rows. */
const SERVICE_ROWS = [
  ['Web', 'Apps', 'Voice', 'AI'],
  ['E-commerce', 'ERP', 'CRM', 'Maintenance'],
] as const;

export function HeroBanner({ hidden }: { hidden: boolean }) {
  const reduce = useReducedMotion();
  const item =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.65)] transition-colors hover:text-[#2dd4a8]';

  return (
    <motion.div
      initial={false}
      animate={
        hidden
          ? { opacity: 0, pointerEvents: 'none' as const }
          : { opacity: 1, pointerEvents: 'auto' as const }
      }
      transition={
        reduce
          ? { duration: 0 }
          : hidden
            ? { duration: 0.2, ease: NAV_MORPH.ease }
            : { duration: 0.3, ease: NAV_MORPH.ease, delay: 0.15 }
      }
      className="pointer-events-none fixed z-[61] mx-auto flex max-w-[90rem] items-center justify-between top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] sm:left-[max(1rem,env(safe-area-inset-left))] sm:right-[max(1rem,env(safe-area-inset-right))]"
    >
      <div className="pointer-events-auto flex items-center gap-2">
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={item} aria-label="Instagram">
          <IconInstagram size={18} />
        </a>
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className={item} aria-label="LinkedIn">
          <IconLinkedIn size={18} />
        </a>
        <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className={item} aria-label="GitHub">
          <IconGitHub size={18} />
        </a>
      </div>
      <a
        href={getGmailComposeUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black px-3.5 text-[0.8125rem] text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.65)] hover:text-[#2dd4a8]"
      >
        <IconMail size={18} />
        <span className="hidden sm:inline">{CONTACT_EMAIL}</span>
        <span className="sm:hidden">Email</span>
      </a>
    </motion.div>
  );
}

export default function HeroSection() {
  const { ask, typing } = useSiteChat();
  const reduce = useReducedMotion();
  // Mount one bot only — the hidden one still cost a WebGL context and a GLB parse.
  const [desktop, setDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Safari's toolbar resizes the viewport while scrolling and re-centred the hero text.
  // Phones lock the height. A mouse or trackpad follows the window so a drag stays in step.
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) return;
    let width = window.innerWidth;
    const lock = () => {
      if (heroRef.current) heroRef.current.style.minHeight = `${window.innerHeight}px`;
    };
    lock();
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      lock();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section id="top" className="vaw-hero relative z-[2] overflow-visible">
      <div
        ref={heroRef}
        className={`relative z-[2] mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col justify-center pb-16 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-[max(9rem,calc(env(safe-area-inset-top)+8.25rem))] sm:pb-24 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] ${
        CENTERED ? 'sm:pt-44 lg:pt-48' : 'sm:pt-52 lg:pt-56 lg:pl-20 xl:pl-24'
      }`}>
        <div
          className={`relative grid grid-cols-1 items-center gap-6 ${
            CENTERED ? '' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8 xl:gap-10'
          }`}
        >
          <div
            className={`relative z-[2] flex w-full flex-col ${
              CENTERED
                ? 'items-center text-center'
                : 'items-start text-left pr-[6.5rem] sm:pr-[8rem] lg:pr-0'
            }`}
          >
            <h1
              style={{ '--vaw-enter-delay': '0s' } as React.CSSProperties}
              className={`vaw-enter vaw-display m-0 leading-[0.94] tracking-[-0.03em] text-[#161615] ${
                CENTERED
                  ? 'max-w-[20ch] text-[clamp(2.2rem,5.6vw,4.5rem)]'
                  : 'max-w-[15ch] text-[clamp(2.2rem,5.8vw,4.75rem)]'
              }`}
            >
              <span className="block">{CENTERED ? 'Let us handle the' : 'Let us'}</span>
              {!CENTERED && <span className="block">handle the</span>}
              <span className="block" style={{ color: ACCENT }}>
                technical part
              </span>
            </h1>

            <ul
              style={{ '--vaw-enter-delay': '0.1s' } as React.CSSProperties}
              aria-label="What we build"
              className={`vaw-enter m-0 flex list-none flex-col gap-y-1 p-0 font-semibold leading-[1.45] tracking-[-0.01em] text-[#161615] sm:flex-row sm:flex-wrap sm:gap-x-3 ${
                CENTERED
                  ? 'mt-6 items-center text-[clamp(0.95rem,1.7vw,1.3rem)] sm:justify-center'
                  : 'mt-5 items-start text-[clamp(0.95rem,1.9vw,1.3rem)]'
              }`}
            >
              {SERVICE_ROWS.map((row, r) => (
                <li
                  key={row[0]}
                  className={`flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 max-[374px]:gap-x-3 sm:gap-3 ${
                    CENTERED ? 'justify-center' : 'justify-start'
                  }`}
                >
                  {r > 0 && (
                    <span aria-hidden className="hidden font-normal sm:inline" style={{ color: ACCENT }}>
                      |
                    </span>
                  )}
                  {row.map((name, i) => (
                    <span key={name} className="flex items-center gap-x-2 sm:gap-3">
                      {/* Under 375px the row wraps; a bar would start the next line */}
                      {i > 0 && (
                        <span aria-hidden className="font-normal max-[374px]:hidden" style={{ color: ACCENT }}>
                          |
                        </span>
                      )}
                      {name}
                    </span>
                  ))}
                </li>
              ))}
            </ul>

            <p
              style={{ '--vaw-enter-delay': '0.16s' } as React.CSSProperties}
              className={`vaw-enter leading-relaxed text-[#5c5a56] ${
                CENTERED
                  ? 'mt-5 max-w-[46ch] text-[clamp(0.95rem,1.6vw,1.1rem)]'
                  : 'mt-5 max-w-[34ch] text-[clamp(0.95rem,1.6vw,1.05rem)]'
              }`}
            >
              You think it. We build it,{' '}
              <span className="font-medium" style={{ color: ACCENT }}>
                start to finish
              </span>
              , whether you&apos;re a company or one person with an idea.
            </p>

            <div
              style={{ '--vaw-enter-delay': '0.2s' } as React.CSSProperties}
              className={`vaw-enter ${CENTERED ? 'mt-6' : 'mt-6'}`}
            >
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-full bg-[#0cb78b] font-semibold uppercase tracking-[0.06em] text-[#f5f3ee] transition-colors hover:bg-[#0a9d77] ${
                  CENTERED ? 'px-6 py-3.5 text-[0.875rem]' : 'px-5 py-3 text-[0.8438rem]'
                }`}
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              style={{ '--vaw-enter-delay': '0.26s' } as React.CSSProperties}
              className={`vaw-enter mt-7 flex w-full flex-col items-stretch gap-2.5 ${
                CENTERED ? 'max-w-[38rem] [&>div]:w-full [&>div]:max-w-full' : 'max-w-[28rem] lg:items-start'
              }`}
            >
              <HeroChatSlot />
              <div className={`flex flex-wrap gap-2 ${CENTERED ? 'justify-center' : ''}`}>
                {CHAT_PROMPTS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled={typing}
                    onClick={() => void ask(label)}
                    className="rounded-full border border-black/[0.08] bg-white/40 px-3.5 py-1.5 text-[0.8125rem] text-[#5c5a56] transition-colors hover:border-[#0cb78b]/50 hover:text-[#161615] disabled:opacity-40"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: bot slides in beside the headline instead of stacking below */}
            {!CENTERED && (
            <motion.div
              className="pointer-events-none absolute -right-1 top-0 z-[1] h-[10.5rem] w-[10.5rem] sm:-right-2 sm:h-[12.5rem] sm:w-[12.5rem] lg:hidden"
              initial={reduce ? false : { x: 64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: DUR.enter, delay: 0.12, ease: EASE }}
            >
              {desktop === false ? <VawcomBot compact /> : null}
            </motion.div>
            )}
          </div>

          {!CENTERED && (
          <div className="hidden h-[min(64vh,36rem)] w-full max-w-[36rem] items-center justify-end lg:flex">
            {desktop ? <VawcomBot /> : null}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
