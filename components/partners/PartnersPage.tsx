'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Bot,
  CalendarRange,
  Check,
  Clock,
  EyeOff,
  FileCheck2,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Mail,
  Plug,
  Rocket,
  Smartphone,
  Video,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import CreamPage from '@/components/services/CreamPage';
import FaqGrid from '@/components/services/FaqGrid';
import Reveal from '@/components/Reveal';
import PartnerVisual from './PartnerVisual';
import ServiceFold from './ServiceFold';
import StepFlow from './StepFlow';
import {
  BUILD,
  COUNTRIES,
  MODELS,
  PARTNER_CONTACT_SERVICE,
  PARTNER_FAQS,
  WHITE_LABEL,
  WHY,
} from '@/lib/partners';
import { getGmailComposeUrl, CONTACT_EMAIL } from '@/lib/site';

const ICONS: Record<string, LucideIcon> = {
  lock: Lock,
  eyeOff: EyeOff,
  workflow: Workflow,
  video: Video,
  badgePercent: BadgePercent,
  layers: Layers,
  smartphone: Smartphone,
  dashboard: LayoutDashboard,
  bot: Bot,
  rocket: Rocket,
  plug: Plug,
  lifeBuoy: LifeBuoy,
  wrench: Wrench,
  fileCheck: FileCheck2,
  clock: Clock,
  calendar: CalendarRange,
};

const shell = 'vaw-shell-narrow';
const eyebrow = 'mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]';
const h2 =
  'vaw-display m-0 text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1] tracking-[-0.03em] text-[#161615]';
const lede = 'mt-4 mb-0 max-w-[46ch] text-[1rem] leading-relaxed text-[#5c5a56]';

const contactHref = `/contact?service=${encodeURIComponent(PARTNER_CONTACT_SERVICE)}`;

/** Where 5 cards sit on a 6-column grid: 3 on top, the last 2 centred beneath. */
function centredLast(i: number, total: number) {
  const left = total % 3;
  if (left === 2 && i === total - 2) return 'lg:col-start-2';
  if (left === 2 && i === total - 1) return 'lg:col-start-4';
  return '';
}

export default function PartnersPage() {
  return (
    <CreamPage nav="partners">
      <div className="vaw-hero overflow-x-clip pb-8">
        {/* ───────── Hero ───────── */}
        <header className={`${shell} grid items-center gap-10 pb-10 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pt-36`}>
          <div className="relative z-[1]">
            <div
              className="vaw-enter mb-5 flex flex-wrap items-center gap-2"
              style={{ '--vaw-enter-delay': '0s' } as React.CSSProperties}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0a9d77] shadow-[0_0.375rem_1.125rem_rgba(22,22,21,0.06)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0cb78b]" />
                White-label partnerships
              </span>
              <span className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[0.75rem] font-medium text-[#5c5a56]">
                Also offered by VAWCOM
              </span>
            </div>
            <h1
              className="vaw-enter vaw-display m-0 text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[0.94] tracking-[-0.04em] text-[#161615]"
              style={{ '--vaw-enter-delay': '0.06s' } as React.CSSProperties}
            >
              You sell it.
              <span className="block text-[#0cb78b]">We build it.</span>
            </h1>
            <p
              className="vaw-enter mb-0 mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-[#5c5a56]"
              style={{ '--vaw-enter-delay': '0.14s' } as React.CSSProperties}
            >
              Your brand gets the credit. We design, build and maintain web apps, mobile apps, SaaS
              platforms and AI solutions as a confidential development partner for agencies and
              studios.
            </p>
            <div
              className="vaw-enter mt-7 flex flex-wrap items-center gap-3"
              style={{ '--vaw-enter-delay': '0.22s' } as React.CSSProperties}
            >
              <Link
                href={contactHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#0cb78b] px-6 py-3.5 text-[0.9063rem] font-semibold text-[#0b0d0c] hover:bg-[#0a9d77] hover:text-[#0b0d0c]"
              >
                Become a partner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-[0.9063rem] font-medium text-[#161615] hover:border-[#0cb78b]/50 hover:text-[#0a9d77]"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="vaw-enter" style={{ '--vaw-enter-delay': '0.2s' } as React.CSSProperties}>
            <PartnerVisual />
          </div>
        </header>

        {/* ───────── "Also offered" note ───────── */}
        <div className={`${shell} pb-6`}>
          <Reveal className="flex flex-col gap-4 rounded-[1.5rem] border border-[#0cb78b]/25 bg-[#e6faf3]/70 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-[#0cb78b] shadow-[0_0.375rem_1.125rem_rgba(12,183,139,0.18)]">
              <Layers className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <p className="m-0 flex-1 text-[0.9375rem] leading-relaxed text-[#2b3a35]">
              <strong className="font-semibold text-[#161615]">A side of what we do.</strong>{' '}
              Building websites, apps, voice agents and AI for our own clients is our main work.
              White-label partnership is something we also offer, for agencies and studios who want
              a dependable build partner.
            </p>
            <Link
              href="/services"
              className="inline-flex flex-none items-center gap-1 text-[0.875rem] font-medium text-[#0a9d77] hover:text-[#067055]"
            >
              Our core services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* ───────── White label ───────── */}
        <section className={`${shell} pt-16`} aria-labelledby="wl-heading">
          <Reveal>
            <p className={eyebrow}>For agencies &amp; studios</p>
            <h2 id="wl-heading" className={h2}>
              Built to stay behind the scenes.
            </h2>
            <p className={lede}>
              Take on more client projects with a development partner behind you. VAWCOM works to your
              agreed processes and keeps the partnership confidential.
            </p>
          </Reveal>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {WHITE_LABEL.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal
                  key={item.title}
                  delay={(i % 3) * 0.07}
                  className={`group rounded-[1.5rem] border border-black/[0.05] bg-white p-6 shadow-[0_0.625rem_1.75rem_rgba(22,22,21,0.05)] transition-[transform,box-shadow,border-color] duration-std hover:-translate-y-1 hover:border-[#0cb78b]/40 hover:shadow-[0_1.125rem_2.5rem_rgba(12,183,139,0.14)] lg:col-span-2 ${centredLast(
                    i,
                    WHITE_LABEL.length,
                  )}`}
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0cb78b]/15 text-[#0a9d77] transition-[transform,background-color] duration-std group-hover:scale-110 group-hover:bg-[#0cb78b]/20">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="m-0 text-[1.0313rem] font-semibold tracking-[-0.01em] text-[#161615]">
                    {item.title}
                  </h3>
                  <p className="mb-0 mt-2 text-[0.9063rem] leading-relaxed text-[#5c5a56]">{item.body}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ───────── What we build (one card that opens into the full set) ───────── */}
        <section className={`${shell} pt-20`} aria-label="What we can build under your name">
          <Reveal>
            <ServiceFold
              eyebrow="What we can build under your name"
              chip="What we build"
              title="From first idea to launch, and beyond."
              textStrong="We support the full product lifecycle,"
              textRest="so your client sees one team from start to finish."
              items={BUILD.map((b) => ({ Icon: ICONS[b.icon], title: b.title, body: b.body }))}
            />
          </Reveal>
        </section>

        {/* ───────── How it works ───────── */}
        <section id="how-it-works" className={`${shell} scroll-mt-28 pt-20`} aria-labelledby="how-heading">
          <Reveal className="text-center">
            <p className={eyebrow}>How it works</p>
            <h2 id="how-heading" className={h2}>
              From idea to launch in five simple steps.
            </h2>
          </Reveal>
          <div className="mt-10">
            <StepFlow />
          </div>
        </section>

        {/* ───────── Engagement models ───────── */}
        <section className={`${shell} pt-20`} aria-labelledby="models-heading">
          <Reveal>
            <p className={eyebrow}>Engagement models</p>
            <h2 id="models-heading" className={h2}>
              Work with us the way that suits you.
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-4 md:grid-cols-3 lg:gap-5">
            {MODELS.map((m, i) => {
              const Icon = ICONS[m.icon];
              return (
                <Reveal
                  key={m.name}
                  delay={i * 0.08}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white p-6 shadow-[0_0.625rem_1.75rem_rgba(22,22,21,0.05)] transition-[transform,box-shadow,border-color] duration-std hover:-translate-y-1 hover:border-[#0cb78b]/40 hover:shadow-[0_1.125rem_2.5rem_rgba(12,183,139,0.14)]"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0cb78b]/15 text-[#0a9d77]">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="m-0 text-[1.125rem] font-semibold tracking-[-0.015em] text-[#161615]">
                    {m.name}
                  </h3>
                  <p className="mb-0 mt-3 text-[0.7188rem] font-semibold uppercase tracking-[0.12em] text-[#8a8882]">
                    Best for
                  </p>
                  <p className="mb-0 mt-1 text-[0.9063rem] font-medium leading-snug text-[#161615]">
                    {m.best}
                  </p>
                  <p className="mb-0 mt-3 text-[0.875rem] leading-relaxed text-[#5c5a56]">{m.how}</p>
                </Reveal>
              );
            })}
          </div>
          <Reveal as="p" className="mb-0 mt-5 text-center text-[0.9063rem] text-[#5c5a56]">
            Not sure which fits? We&apos;ll recommend an engagement model during the first call.
          </Reveal>
        </section>

        {/* ───────── Why VAWCOM ───────── */}
        <section className={`${shell} pt-20`} aria-labelledby="why-heading">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <Reveal>
              <p className={eyebrow}>Why VAWCOM</p>
              <h2 id="why-heading" className={h2}>
                A partner you can actually rely on.
              </h2>
              <p className={lede}>
                We work with clients across the world, including the USA, France, Germany, Nigeria and
                Australia, and coordinate communication across time zones.
              </p>
              <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                {COUNTRIES.map((c, i) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-[#161615]"
                  >
                    <span
                      className="vaw-dot h-1.5 w-1.5 rounded-full bg-[#0cb78b]"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <ul className="m-0 list-none divide-y divide-black/[0.07] p-0">
              {WHY.map((w, i) => (
                <Reveal as="li" key={w.title} delay={i * 0.05} className="group flex gap-4 py-5 first:pt-0">
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#0cb78b]/15 text-[#0a9d77] transition-[transform,background-color,color] duration-std group-hover:scale-110 group-hover:bg-[#0cb78b] group-hover:text-white">
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                  <div>
                    <h3 className="m-0 text-[1.0313rem] font-semibold tracking-[-0.01em] text-[#161615]">
                      {w.title}
                    </h3>
                    <p className="mb-0 mt-1 text-[0.9063rem] leading-relaxed text-[#5c5a56]">{w.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className={`${shell} pt-20`} aria-labelledby="faq-heading">
          <Reveal>
            <p className={eyebrow}>FAQ</p>
            <h2 id="faq-heading" className={h2}>
              Questions partners ask.
            </h2>
          </Reveal>
          <Reveal className="mt-9">
            <FaqGrid items={PARTNER_FAQS} />
          </Reveal>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section className={`${shell} pb-16 pt-20`}>
          <Reveal
            data-nav-contrast="dark"
            className="relative overflow-hidden rounded-[1.9rem] px-7 py-14 text-center sm:px-10 sm:py-16"
            style={{
              background:
                'radial-gradient(120% 90% at 28% 18%, #2a4f47 0%, #152e2a 42%, #0a1916 78%, #061210 100%)',
            }}
          >
            <h2 className={`${h2} !text-[#f5f3ee]`}>Ready to partner with us?</h2>
            <p className="mx-auto mb-0 mt-4 max-w-[46ch] text-[0.9688rem] leading-relaxed text-white/85">
              Tell us what you&apos;re building. We&apos;ll get back to you within one business day
              with initial feedback, likely next steps and a path to scope the work, free and with no
              obligation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact?service=Consultation"
                className="inline-flex items-center gap-2 rounded-full bg-[#0cb78b] px-6 py-3.5 text-[0.9063rem] font-semibold text-[#0b0d0c] hover:bg-[#2dd4a8] hover:text-[#0b0d0c]"
              >
                Book a free consultation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={getGmailComposeUrl('White-label partnership inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[0.9063rem] font-medium text-white hover:border-white/60 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
            </div>
            <p className="mx-auto mb-0 mt-6 max-w-[48ch] text-[0.8125rem] leading-relaxed text-white/60">
              Your details are treated confidentially. We can discuss an NDA before reviewing sensitive
              project information.
            </p>
          </Reveal>
        </section>
      </div>
    </CreamPage>
  );
}
