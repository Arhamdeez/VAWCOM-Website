'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  ListChecks,
  LayoutTemplate,
  Layers2,
  Code2,
  Rocket,
  Linkedin,
  Github,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import PremiumPageBackdrop from '@/components/PremiumPageBackdrop';
import { tEnter, tReveal, tStagger } from '@/lib/motion';
import { SiteCenter, SiteContainer } from '@/components/SiteContainer';
import { SOCIAL } from '@/lib/site';

const processSteps = [
  {
    title: 'Idea',
    line: 'What problem, for whom, and what “done” looks like.',
    Icon: Lightbulb,
  },
  {
    title: 'Planning',
    line: 'Scope, milestones, and tradeoffs—on paper before code.',
    Icon: ListChecks,
  },
  {
    title: 'Wireframes',
    line: 'Flows and rough layouts so UX is cheap to change.',
    Icon: LayoutTemplate,
  },
  {
    title: 'Structure',
    line: 'Architecture, data model, and the build order.',
    Icon: Layers2,
  },
  {
    title: 'Development',
    line: 'UI, APIs, integrations—voice & AI when they earn their place.',
    Icon: Code2,
  },
  {
    title: 'Deploy',
    line: 'Release, monitor, harden—then iterate from real usage.',
    Icon: Rocket,
  },
] as const;

const team = [
  {
    initials: 'AB',
    name: 'Arham Babar',
    role: 'Co-founder',
    gradient: 'from-emerald-500 to-teal-600',
    linkedin: 'https://www.linkedin.com/in/arham-babar-a9510630a/',
    github: 'https://github.com/Arhamdeez',
  },
  {
    initials: 'SK',
    name: 'Shahbakht Khurram',
    role: 'Co-founder',
    gradient: 'from-teal-500 to-cyan-600',
    linkedin: 'https://www.linkedin.com/in/shahbakht-khurram-b322a8329',
    github: 'https://github.com/shahbakht11',
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumPageBackdrop />
      <div className="relative z-10">
        {/* Hero */}
        <section className="pb-10 pt-[max(7rem,env(safe-area-inset-top,0px)+5.5rem)] md:pb-14">
          <SiteContainer center>
            <SiteCenter max="3xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={tEnter()}
                className="glass-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-emerald-200/95 sm:text-sm"
              >
                <Sparkles className="h-4 w-4 shrink-0 opacity-90" />
                <span>About VAWCOM</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={tEnter(0.06)}
                className="mb-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.15]"
              >
                A studio that{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  ships the whole thing
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={tEnter(0.12)}
                className="mx-auto max-w-lg text-base leading-relaxed text-slate-400 md:text-[17px]"
              >
                End-to-end product work—UI, APIs, voice, and AI—so it ships as{' '}
                <span className="text-slate-300">one thing</span>, not a pile of parts.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={tEnter(0.18)}
                className="mx-auto mt-6 max-w-xl text-sm text-slate-500"
              >
                One straight path from first thought to production—no mystery phases.
              </motion.p>
            </SiteCenter>
          </SiteContainer>
        </section>

        {/* Process: idea → deploy */}
        <section className="pb-16 md:pb-20" aria-labelledby="about-process-heading">
          <SiteContainer center>
            <SiteCenter max="2xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={tReveal()}
                className="mb-10 text-center md:mb-12"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/85">How we work</p>
                <h2 id="about-process-heading" className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  From idea to deploy
                </h2>
                <p className="mx-auto mt-2 max-w-md px-1 text-sm leading-relaxed text-slate-500">
                  Six beats we move through with you—each step has a clear output before the next begins.
                </p>
              </motion.div>

              <div className="relative mx-auto w-full max-w-xl md:max-w-2xl">
                {/* timeline rail — desktop / tablet only; mobile uses stacked centered cards */}
                <div
                  className="pointer-events-none absolute left-[15px] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-emerald-500/45 via-teal-500/25 to-cyan-500/35 md:block"
                  aria-hidden
                />

                <ol className="relative space-y-0 text-left">
                  {processSteps.map((item, i) => (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-24px' }}
                      transition={tStagger(i, 0.04)}
                      className="relative flex flex-col items-center gap-3 pb-10 last:pb-0 md:flex-row md:items-start md:gap-6 md:pb-10"
                    >
                      <div className="relative z-[1] flex shrink-0 flex-col items-center md:w-[52px] md:min-w-[52px]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/35 bg-[#0a1628] shadow-[0_0_20px_-4px_rgba(52,211,153,0.35)] md:h-9 md:w-9">
                          <item.Icon className="h-[17px] w-[17px] text-emerald-300/95" strokeWidth={1.85} />
                        </div>
                        <span className="mt-2 font-mono text-[10px] font-medium tabular-nums text-emerald-500/75 md:text-[11px]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="w-full min-w-0 max-w-md rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent px-4 py-3.5 text-center md:max-w-none md:flex-1 md:px-5 md:py-4 md:text-left">
                        <h3 className="text-base font-semibold text-white md:text-[17px]">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.line}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </SiteCenter>
          </SiteContainer>
        </section>

        {/* Team */}
        <section className="pb-20 sm:pb-28">
          <SiteContainer center>
            <SiteCenter max="4xl">
              <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/85 sm:text-sm sm:tracking-[0.12em]">
                Founders
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6">
                {team.map((person, i) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={tStagger(i, 0.04)}
                    className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent px-5 py-6 text-center md:px-6 md:py-7"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${person.gradient} text-base font-semibold text-white shadow-lg shadow-emerald-950/20`}
                    >
                      {person.initials}
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{person.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                    <div className="mt-5 flex justify-center gap-1 sm:gap-2">
                      <Link
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-white active:bg-white/[0.06]"
                        aria-label={`${person.name} on LinkedIn`}
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link
                        href={person.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-white active:bg-white/[0.06]"
                        aria-label={`${person.name} on GitHub`}
                      >
                        <Github className="h-5 w-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex w-full flex-col items-center gap-4 px-1 sm:flex-row sm:justify-center sm:gap-6">
                <Link
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 transition-colors hover:text-emerald-400/90"
                >
                  VAWCOM on LinkedIn
                </Link>
                <span className="hidden text-slate-700 sm:inline" aria-hidden>
                  ·
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-200 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/15"
                >
                  Start a project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SiteCenter>
          </SiteContainer>
        </section>
      </div>
    </div>
  );
}
