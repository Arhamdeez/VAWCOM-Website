'use client';

import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CONTACT_EMAIL, SOCIAL, getGmailComposeUrl } from '@/lib/site';
import { IconGitHub, IconInstagram, IconLinkedIn, IconMail } from './SocialIcons';
import { CHAT_PROMPTS, HeroChatSlot, useSiteChat } from '@/components/chat/SiteChat';

const VawcomBot = dynamic(() => import('./VawcomBot'), { ssr: false });

const ACCENT = '#0cb78b';

const HOOKS = ['idea', 'business', 'problem', 'next big thing'] as const;

export function HeroBanner({ hidden }: { hidden: boolean }) {
  const reduce = useReducedMotion();
  const item =
    'inline-flex items-center justify-center rounded-full p-1.5 text-[#161615]/70 transition-colors hover:text-[#0cb78b]';

  return (
    <motion.div
      initial={false}
      animate={
        hidden
          ? { opacity: 0, y: -12, pointerEvents: 'none' as const }
          : { opacity: 1, y: 0, pointerEvents: 'auto' as const }
      }
      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-3 top-3 z-[61] flex h-10 items-center justify-between gap-3 rounded-[1.25rem] border border-black/[0.06] bg-[#f5f3ee]/55 px-4 backdrop-blur-[8px] sm:inset-x-4 sm:px-5"
    >
      <div className="flex items-center gap-1">
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={item} aria-label="Instagram">
          <IconInstagram size={15} />
        </a>
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className={item} aria-label="LinkedIn">
          <IconLinkedIn size={15} />
        </a>
        <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className={item} aria-label="GitHub">
          <IconGitHub size={15} />
        </a>
      </div>
      <a
        href={getGmailComposeUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 text-[12.5px] text-[#161615]/70 hover:text-[#0cb78b]"
      >
        <IconMail size={15} />
        <span className="hidden sm:inline">{CONTACT_EMAIL}</span>
        <span className="sm:hidden">Email</span>
      </a>
    </motion.div>
  );
}

export default function HeroSection() {
  const { ask, typing } = useSiteChat();
  const reduce = useReducedMotion();

  return (
    <section id="top" className="vaw-hero relative z-[2] overflow-visible">
      <div className="relative z-[2] mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col justify-center px-6 pl-10 pb-20 pt-40 sm:px-8 sm:pl-14 sm:pb-24 sm:pt-52 lg:pl-20 lg:pt-56 xl:pl-24">
        {/* Copy stacks vertically with chat; bot sits beside on large screens */}
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8 xl:gap-10">
          <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1.1, 0.3, 1] }}
              className="vaw-display m-0 max-w-[11ch] text-[clamp(2.4rem,5.8vw,4.75rem)] leading-[0.94] tracking-[-0.03em] text-[#161615]"
            >
              <span className="block">What if we</span>
              <span className="block">
                just <span style={{ color: ACCENT }}>built it?</span>
              </span>
            </motion.h1>

            <motion.ul
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1.1, 0.3, 1] }}
              className="mt-5 m-0 list-none space-y-0.5 p-0 text-[clamp(1.05rem,1.9vw,1.3rem)] leading-[1.45] tracking-[-0.01em] text-[#161615]"
            >
              {HOOKS.map((word) => (
                <li key={word}>
                  Your{' '}
                  <span className="font-semibold" style={{ color: ACCENT }}>
                    {word}
                  </span>
                  .
                </li>
              ))}
            </motion.ul>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1.1, 0.3, 1] }}
              className="mt-5 max-w-[34ch] text-[clamp(0.95rem,1.6vw,1.05rem)] leading-relaxed text-[#5c5a56]"
            >
              You think it. We build it —{' '}
              <span className="font-medium" style={{ color: ACCENT }}>
                start to finish
              </span>
              , whether you&apos;re a company or one person with an idea.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1.1, 0.3, 1] }}
              className="mt-6"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#0cb78b] px-5 py-3 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-[#f5f3ee] transition-colors hover:bg-[#0a9d77]"
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1.1, 0.3, 1] }}
              className="mt-7 flex w-full max-w-[28rem] flex-col items-center gap-2.5 lg:items-start"
            >
              <HeroChatSlot />
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {CHAT_PROMPTS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled={typing}
                    onClick={() => void ask(label)}
                    className="rounded-full border border-black/[0.08] bg-white/40 px-3.5 py-1.5 text-[13px] text-[#5c5a56] transition-colors hover:border-[#0cb78b]/50 hover:text-[#161615] disabled:opacity-40"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1.1, 0.3, 1] }}
            className="flex h-[20rem] w-full max-w-[24rem] items-center justify-center sm:h-[24rem] sm:max-w-[28rem] lg:h-[min(64vh,36rem)] lg:max-w-[36rem] lg:justify-end"
          >
            <VawcomBot />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
