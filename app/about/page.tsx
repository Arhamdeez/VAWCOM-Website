'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import Link from 'next/link';
import ProcessLightTrail from '@/components/about/ProcessLightTrail';
import CreamPage from '@/components/services/CreamPage';
import { FOUNDERS } from '@/components/home/data';
import { IconGitHub, IconLinkedIn } from '@/components/home/SocialIcons';
import { SOCIAL } from '@/lib/site';

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

export default function About() {
  const reduce = useReducedMotion();
  const anim = fade(reduce);

  return (
    <CreamPage nav="about">
      <div className="vaw-hero">
        <motion.header
          className="relative z-10 mx-auto max-w-[1100px] px-6 pt-28 text-center sm:px-8 lg:px-10 lg:pt-32"
          {...anim}
        >
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            About
          </p>
          <h1 className="vaw-display m-0 text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] tracking-[-0.04em] text-[#161615]">
            A studio that ships the
            <span className="text-[#0cb78b]"> whole thing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[42ch] text-[17px] leading-relaxed text-[#5c5a56]">
            Web, apps, voice, and AI from one team. Design and build stay together so what you launch
            feels like one product, not a pile of parts.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-5 py-2.5 text-[14px] font-medium text-[#0b0d0c] hover:bg-[#0cb78b]/85"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-[#161615] shadow-[0_1px_0_rgba(22,22,21,0.06)] hover:bg-[#f5f3ee]"
            >
              How we work
            </a>
          </div>
        </motion.header>

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 pt-16 sm:px-8 lg:px-10">
          <motion.section {...anim} aria-label="Company film">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#161615] shadow-[0_12px_32px_rgba(22,22,21,0.08)]">
              <div className="relative flex aspect-video items-center justify-center">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(12,183,139,0.18), transparent 62%)',
                  }}
                />
                <div className="relative flex flex-col items-center gap-3 px-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0cb78b]/20 text-[#0cb78b]">
                    <Play className="h-6 w-6 fill-current" />
                  </span>
                  <p className="m-0 text-[15px] font-medium text-[#ece9e3]">Company film</p>
                  <p className="m-0 max-w-[28ch] text-[13.5px] leading-relaxed text-[rgba(236,233,227,0.55)]">
                    A short look at how we work. Video coming soon.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="process"
            className="mt-20 scroll-mt-28"
            aria-labelledby="about-process-heading"
            {...anim}
          >
            <h2
              id="about-process-heading"
              className="vaw-display m-0 mb-10 text-center text-[clamp(1.7rem,3.2vw,2.4rem)] tracking-[-0.03em] text-[#161615]"
            >
              Our process
            </h2>
            <ProcessLightTrail />
            <div className="mt-8 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
              >
                See this on services
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.section>

          <motion.section className="mt-20" {...anim}>
            <h2 className="vaw-display m-0 text-center text-[clamp(1.7rem,3.2vw,2.4rem)] tracking-[-0.03em] text-[#161615]">
              Founders
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {FOUNDERS.map((person) => (
                <div
                  key={person.name}
                  className="flex flex-col items-center rounded-[1.5rem] bg-white px-6 py-8 text-center shadow-[0_12px_32px_rgba(22,22,21,0.06)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0cb78b] text-[15px] font-semibold text-[#0b0d0c]">
                    {person.initials}
                  </div>
                  <h3 className="mt-4 m-0 text-[17px] font-semibold text-[#161615]">{person.name}</h3>
                  <p className="mt-1 mb-0 text-[14px] text-[#5c5a56]">{person.role}</p>
                  <div className="mt-5 flex gap-2">
                    <Link
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f3ee] text-[#5c5a56] hover:bg-[#0cb78b]/15 hover:text-[#0cb78b]"
                      aria-label={`${person.name} on LinkedIn`}
                    >
                      <IconLinkedIn size={16} />
                    </Link>
                    <Link
                      href={person.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f3ee] text-[#5c5a56] hover:bg-[#0cb78b]/15 hover:text-[#0cb78b]"
                      aria-label={`${person.name} on GitHub`}
                    >
                      <IconGitHub size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center">
              <Link
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-medium text-[#5c5a56] hover:text-[#0cb78b]"
              >
                VAWCOM on LinkedIn
              </Link>
            </p>
          </motion.section>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[10.5rem] flex-col justify-between rounded-[1.35rem] bg-white p-6 shadow-[0_1px_0_rgba(22,22,21,0.06)] sm:p-7">
              <div>
                <h2 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#161615]">
                  See the work
                </h2>
                <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
                  Browse projects in the gallery.
                </p>
              </div>
              <Link
                href="/gallery"
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#161615] px-4 py-2.5 text-[13.5px] font-medium text-[#ece9e3] hover:bg-[#0b0d0c]"
              >
                Open gallery
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex min-h-[10.5rem] flex-col justify-between rounded-[1.35rem] bg-[#0cb78b] p-6 sm:p-7">
              <div>
                <h2 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#0b0d0c]">
                  Compare services
                </h2>
                <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#0b0d0c]/75]">
                  See everything we build on one page.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0b0d0c] px-4 py-2.5 text-[13.5px] font-medium text-[#ece9e3] hover:bg-[#161615]"
              >
                All services
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CreamPage>
  );
}
