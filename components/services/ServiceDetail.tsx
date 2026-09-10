'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import CreamPage from './CreamPage';
import ServiceJump from './ServiceJump';
import ProjectCard from '@/components/work/ProjectCard';
import type { Service } from '@/lib/services';
import { PROCESS_STEPS } from '@/lib/process';
import { projectsFor } from '@/lib/work';

const shell = 'mx-auto w-full max-w-[1100px] px-6 sm:px-8 lg:px-10 lg:pl-24';

function Panel({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex h-full min-h-[10.5rem] flex-col rounded-[1.35rem] p-6 ${className}`}>
      {children}
    </div>
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

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <header className="min-w-0 max-w-[40rem]">
            <h1 className="vaw-display m-0 text-[clamp(2.2rem,4.8vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-[#161615]">
              {service.title}
            </h1>
            <p className="mt-4 mb-0 text-[16px] leading-relaxed text-[#5c5a56]">{service.lede}</p>
          </header>
          <Link
            href={contactHref}
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#0cb78b] px-5 py-3 text-[14px] font-medium text-[#0b0d0c] hover:bg-[#0a9d77] lg:mt-2"
          >
            Book a call
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="vaw-display mt-10 mb-0 max-w-[18ch] text-[clamp(1.65rem,3.2vw,2.35rem)] leading-[1.2] tracking-[-0.03em] text-[#161615] sm:max-w-[22ch]">
          {service.hook}
        </p>
        <p className="mt-4 mb-0 max-w-[46rem] text-[15px] leading-relaxed text-[#5c5a56]">
          {service.promise}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Panel className="bg-white shadow-[0_1px_0_rgba(22,22,21,0.06)]">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0cb78b]">
              Example first cut
            </p>
            <p className="mt-3 mb-0 flex-1 text-[14.5px] leading-relaxed text-[#161615]">
              {service.first}
            </p>
          </Panel>
          <Panel className="bg-[#0cb78b]">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0b0d0c]/70">
              Timing
            </p>
            <p className="mt-3 mb-0 flex-1 text-[14.5px] leading-relaxed text-[#0b0d0c]">
              {service.span}
            </p>
          </Panel>
          <Panel className="bg-[#161615]">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0cb78b]">
              Who it is for
            </p>
            <p className="mt-3 mb-0 flex-1 text-[14.5px] leading-relaxed text-[rgba(236,233,227,0.82)]">
              {service.for}
            </p>
          </Panel>
        </div>

        <section className="mt-12">
          <h2 className="vaw-display m-0 text-[clamp(1.4rem,2.5vw,1.85rem)] tracking-[-0.03em] text-[#161615]">
            What this <span className="text-[#0cb78b]">can</span> include
          </h2>
          <p className="mt-2 mb-0 max-w-[40rem] text-[14.5px] leading-relaxed text-[#5c5a56]">
            Exact scope depends on your project. These are common pieces we build when they fit.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {service.outcomes.map((item) => (
              <Panel
                key={item.title}
                className="min-h-[9.5rem] bg-white shadow-[0_1px_0_rgba(22,22,21,0.06)]"
              >
                <h3 className="m-0 text-[16px] font-semibold tracking-[-0.015em] text-[#161615]">
                  {item.title}
                </h3>
                <p className="mt-2 mb-0 text-[14px] leading-relaxed text-[#5c5a56]">{item.body}</p>
              </Panel>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link
            href={contactHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-5 py-2.5 text-[14px] font-medium text-[#0b0d0c] hover:bg-[#0a9d77]"
          >
            Book a call
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

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
                className="min-h-[8.5rem] rounded-[1.15rem] bg-white/[0.04] px-5 py-5"
              >
                <p className="m-0 text-[12px] font-semibold text-[#0cb78b]">{step.title}</p>
                <p className="mt-2 mb-0 text-[13.5px] leading-relaxed text-[rgba(236,233,227,0.72)]">
                  {step.line}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Panel className="mt-4 min-h-0 bg-[#0cb78b]">
          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0b0d0c]/70">
            Stack we often use
          </p>
          <p className="mt-3 mb-0 text-[14.5px] leading-relaxed text-[#0b0d0c]">
            {service.stack.join(' · ')}
          </p>
          <p className="mt-2 mb-0 text-[13px] leading-relaxed text-[#0b0d0c]/75">
            {service.extras.join(' · ')}
          </p>
        </Panel>

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

        {/* Next steps: non-contact paths; site footer owns the contact CTA */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="flex min-h-[10.5rem] flex-col justify-between rounded-[1.35rem] bg-white p-6 shadow-[0_1px_0_rgba(22,22,21,0.06)] sm:p-7">
            <div>
              <h2 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#161615]">
                See related work
              </h2>
              <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
                Browse projects in the gallery that sit near this kind of build.
              </p>
            </div>
            <Link
              href={`/gallery#${service.id}`}
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
              <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#0b0d0c]/75">
                Not sure this is the right lane? See everything we build on one page.
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
