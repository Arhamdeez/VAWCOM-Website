'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DUR } from '@/lib/motion';

const CHIPS = [
  { title: 'Automate', body: 'Replace manual busywork. Keep approval steps where a mistake would hurt.' },
  { title: 'Chat', body: 'A bot that answers from your site content, not canned replies.' },
  { title: 'Workflows', body: 'We ship one working automation first, with a clear activity log.' },
  { title: 'Doc Q&A', body: 'Search your documents in plain language and get answers from them.' },
] as const;

export default function AiPromoSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="ai-promo"
      className="vaw-hero relative z-[2] overflow-hidden border-t border-black/[0.06] py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 88% 40%, rgba(12,183,139,0.18), transparent 62%), radial-gradient(ellipse 50% 60% at 8% 80%, rgba(184,217,60,0.12), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[90rem] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DUR.enter, ease: EASE }}
        >
          <h2 className="vaw-display m-0 max-w-[12ch] text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.94] tracking-[-0.03em] text-[#161615]">
            Accelerate your business with{' '}
            <span className="text-[#0cb78b]">AI</span>.
          </h2>
          <p className="mt-5 max-w-[32ch] text-[1rem] leading-relaxed text-[#5c5a56]">
            Save time on repeat work. Start with one automation, then add more.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/services/ai"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-6 py-3 text-[0.9063rem] font-medium text-[#f5f3ee] hover:bg-[#0a9d77]"
            >
              AI services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#161615]/10 px-6 py-3 text-[0.9063rem] font-medium text-[#161615] hover:bg-[#161615]/15"
            >
              Talk to us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: DUR.enter, ease: EASE }}
          className="relative mx-auto w-full max-w-[32rem] lg:max-w-none"
        >
          <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-4">
            {CHIPS.map((chip, i) => (
              <motion.div
                key={chip.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: DUR.enter,
                  delay: reduce ? 0 : 0.06 * i,
                  ease: EASE,
                }}
                className={`vaw-glass rounded-[1.75rem] ${i === 0 ? 'sm:translate-y-4' : ''} ${
                  i === 3 ? 'sm:-translate-y-4' : ''
                }`}
              >
                <div className="vaw-glass-core rounded-[1.35rem] px-6 py-6 sm:py-7">
                  <span
                    className="mb-3 block h-1.5 w-10 rounded-full bg-[#0cb78b]"
                    aria-hidden
                  />
                  <p className="vaw-display m-0 text-[1.45rem] leading-none tracking-[-0.02em] text-[#161615] sm:text-[1.65rem]">
                    {chip.title}
                  </p>
                  <p className="mt-2.5 mb-0 text-[0.8438rem] leading-snug text-[#5c5a56]">
                    {chip.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
