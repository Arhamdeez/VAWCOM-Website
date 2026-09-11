'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import CreamPage from './CreamPage';
import ServiceJump from './ServiceJump';
import ProjectCard from '@/components/work/ProjectCard';
import type { Service } from '@/lib/services';
import { PROCESS_STEPS } from '@/lib/process';
import { projectsFor } from '@/lib/work';

const shell = 'mx-auto w-full max-w-[1100px] px-6 sm:px-8 lg:px-10 lg:pl-24';

const ICON_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons';

/** simple-icons slug + brand color for service.stack labels */
const STACK_ICON: Record<string, { slug: string; color: string }> = {
  'Next.js': { slug: 'nextdotjs', color: '#0b0d0c' },
  React: { slug: 'react', color: '#087ea4' },
  TypeScript: { slug: 'typescript', color: '#3178C6' },
  Tailwind: { slug: 'tailwindcss', color: '#0b6e75' },
  Postgres: { slug: 'postgresql', color: '#336791' },
  'React Native': { slug: 'react', color: '#087ea4' },
  Flutter: { slug: 'flutter', color: '#02569B' },
  Kotlin: { slug: 'kotlin', color: '#7F52FF' },
  Swift: { slug: 'swift', color: '#F05138' },
  Firebase: { slug: 'firebase', color: '#DD2C00' },
  Twilio: { slug: 'twilio', color: '#F22F46' },
  OpenAI: { slug: 'openai', color: '#0b0d0c' },
  n8n: { slug: 'n8n', color: '#EA4B71' },
  'Calendar APIs': { slug: 'googlecalendar', color: '#1A73E8' },
  Claude: { slug: 'anthropic', color: '#8B5E3C' },
  Python: { slug: 'python', color: '#3776AB' },
  'Node.js': { slug: 'nodedotjs', color: '#339933' },
  Stripe: { slug: 'stripe', color: '#635BFF' },
  AWS: { slug: 'amazonaws', color: '#C45500' },
  Docker: { slug: 'docker', color: '#2496ED' },
};

function StackItem({ name }: { name: string }) {
  const meta = STACK_ICON[name];
  const mask = meta ? `url(${ICON_BASE}/${meta.slug}.svg)` : undefined;

  return (
    <li className="flex items-center gap-2.5 rounded-full bg-[#0b0d0c]/10 px-3.5 py-2">
      {meta ? (
        <span
          aria-hidden
          className="h-5 w-5 flex-none"
          style={{
            backgroundColor: meta.color,
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      ) : null}
      <span className="text-[13.5px] font-medium text-[#0b0d0c]">{name}</span>
    </li>
  );
}

export default function ServiceDetail({ service }: { service: Service }) {
  const projects = projectsFor(service.id);
  const contactHref = `/contact?service=${encodeURIComponent(service.title)}`;
  const [jumpOpen, setJumpOpen] = useState(false);

  return (
    <CreamPage nav="services">
      <div className="vaw-hero">
        <ServiceJump active={service.id} open={jumpOpen} setOpen={setJumpOpen} link />
        <div className={`${shell} pb-16 pt-24 lg:pb-20 lg:pt-28`}>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5c5a56] hover:text-[#0cb78b]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <header className="min-w-0 max-w-[40rem]">
              <h1 className="vaw-display m-0 text-[clamp(2.2rem,4.8vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-[#161615]">
                {service.title}
              </h1>
              <p className="mt-4 mb-0 text-[16px] leading-relaxed text-[#5c5a56]">{service.lede}</p>
            </header>
            <div className="w-full max-w-[17.5rem] flex-none rounded-[1.25rem] bg-white px-5 py-5 shadow-[0_1px_0_rgba(22,22,21,0.06)] sm:self-end">
              <p className="m-0 text-[15px] font-semibold tracking-[-0.015em] text-[#161615]">
                Join us
              </p>
              <Link
                href={contactHref}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-5 py-2.5 text-[14px] font-medium text-[#0b0d0c] hover:bg-[#0a9d77] hover:text-[#0b0d0c]"
              >
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <section className="mt-12">
            <h2 className="vaw-display m-0 text-[clamp(1.4rem,2.5vw,1.85rem)] tracking-[-0.03em] text-[#161615]">
              What this service <span className="text-[#0cb78b]">can</span> include
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.outcomes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] bg-white px-5 py-5 shadow-[0_1px_0_rgba(22,22,21,0.06)]"
                >
                  <h3 className="m-0 text-[15px] font-semibold tracking-[-0.015em] text-[#161615]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 mb-0 text-[13.5px] leading-relaxed text-[#5c5a56]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[1.35rem] bg-[#161615] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="vaw-display m-0 text-[clamp(1.4rem,2.5vw,1.85rem)] tracking-[-0.03em] text-[#ece9e3]">
                  How we work
                </h2>
                <p className="mt-2 mb-0 max-w-[36rem] text-[14px] leading-relaxed text-[rgba(236,233,227,0.58)]">
                  From idea to deploy. Each step has a clear output before the next begins.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#0cb78b] hover:text-[#2dd4a8]"
              >
                More on About
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="grid min-h-[8.5rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-[1.15rem] bg-white/[0.04] px-5 py-5"
                >
                  <span
                    aria-hidden
                    className="vaw-display select-none text-[2.75rem] leading-none tracking-[-0.06em] text-[#0cb78b]/30"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-[12px] font-semibold text-[#0cb78b]">{step.title}</p>
                    <p className="mt-2 mb-0 text-[13.5px] leading-relaxed text-[rgba(236,233,227,0.72)]">
                      {step.line}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 flex w-full flex-col gap-5 rounded-[1.35rem] bg-[#0cb78b] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-8 sm:py-6">
            <div className="min-w-0">
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0b0d0c]/70">
                Stack we often use
              </p>
              <ul className="mt-4 mb-0 flex list-none flex-wrap gap-2.5 p-0">
                {service.stack.map((name) => (
                  <StackItem key={name} name={name} />
                ))}
              </ul>
            </div>
            <Link
              href="/#stack"
              className="inline-flex flex-none items-center gap-1.5 self-start text-[13.5px] font-semibold text-[#0b0d0c] hover:!text-[#0b0d0c]/70 sm:self-end"
            >
              See full stack
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <section className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="vaw-display m-0 text-[clamp(1.4rem,2.5vw,1.85rem)] tracking-[-0.03em] text-[#161615]">
                Related work
              </h2>
              <Link
                href={`/gallery#${service.id}`}
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
              >
                Open gallery
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {projects.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <p className="mt-4 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
                Nothing public yet. On a call we can walk through a similar build if you need examples.
              </p>
            )}
          </section>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href={contactHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-6 py-3 text-[14.5px] font-medium text-[#0b0d0c] hover:bg-[#0a9d77] hover:text-[#0b0d0c]"
            >
              Book a call
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-[14.5px] font-medium text-[#161615] hover:border-[#0cb78b]/40 hover:text-[#0cb78b]"
            >
              All services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </CreamPage>
  );
}
