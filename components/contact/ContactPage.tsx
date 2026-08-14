'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Space_Grotesk, Bricolage_Grotesque } from 'next/font/google';
import '@/components/home/home.css';
import PillNav from '@/components/home/PillNav';
import { CONTACT_EMAIL, SOCIAL, getMailtoHref } from '@/lib/site';
import { IconInstagram, SocialConnectLinks } from '@/components/home/SocialIcons';

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const SERVICES = [
  'Select a service',
  'Web Development',
  'Mobile Apps',
  'Voice Solutions',
  'Chatbots',
  'n8n & integrations',
  'AI Integrations',
  'Consultation',
  'Other',
] as const;

const fieldLabel = 'text-[13.5px] text-[rgba(236,233,227,0.5)]';
const underlineInput =
  'border-none border-b border-[rgba(236,233,227,0.25)] bg-transparent px-0 py-2.5 text-lg text-[#ece9e3] outline-none focus:border-[#429f7f]';

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Select a service',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const splash = splashRef.current;
    if (splash) {
      if (reduce) {
        splash.style.opacity = '0.3';
        splash.style.transform = 'scale(1)';
      } else {
        splash.animate(
          [
            { opacity: 0, transform: 'scale(0.2) rotate(-18deg)' },
            { opacity: 0.38, transform: 'scale(1.08) rotate(4deg)', offset: 0.6 },
            { opacity: 0.3, transform: 'scale(1) rotate(0deg)' },
          ],
          { duration: 900, delay: 160, easing: 'cubic-bezier(.16,1.1,.3,1)', fill: 'both' }
        );
      }
    }
    const h = headingRef.current;
    if (h && !reduce) {
      h.animate(
        [
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 620, easing: 'cubic-bezier(.16,1.05,.3,1)', fill: 'both' }
      );
    }
  }, []);

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setStatus('');
      setStatusError(false);
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus('');
    setStatusError(false);
    try {
      const payload = {
        ...form,
        service: form.service === 'Select a service' ? '' : form.service,
      };
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setStatus('Got it. We will reply within a business day.');
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: 'Select a service',
        message: '',
      });
      const formEl = formRef.current;
      if (formEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        formEl.animate(
          [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-6px)', offset: 0.4 },
            { transform: 'translateY(0)' },
          ],
          { duration: 420, easing: 'cubic-bezier(.2,1.3,.35,1)' }
        );
      }
    } catch (err) {
      setStatusError(true);
      setStatus(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`vaw-home min-h-screen ${space.variable} ${bricolage.variable} ${space.className}`}
    >
      <PillNav active="contact" />

      <section className="relative overflow-hidden pt-[150px]">
        <div
          ref={splashRef}
          className="vaw-paint-mask pointer-events-none absolute right-[-8%] top-[4%] w-[46vw] origin-center scale-0 bg-[#cf6a2c] pb-[34vw] opacity-0"
        />

        <div className="relative mx-auto max-w-[1440px] px-8">
          <h1
            ref={headingRef}
            className="vaw-display m-0 max-w-[18ch] text-[clamp(46px,7.6vw,120px)] leading-[0.88] tracking-[-0.03em]"
          >
            Tell us what you&apos;re <span className="text-[#cf6a2c]">building</span>
          </h1>
          <p className="mt-[26px] max-w-[44ch] text-[19px] leading-normal text-[rgba(236,233,227,0.72)]">
            Send the form, or email us directly. We usually reply within a business day.
          </p>

          <div className="mt-16 grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-16">
            <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-7">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[rgba(236,233,227,0.18)] pb-3.5">
                <h2 className="vaw-display m-0 text-[clamp(24px,2.4vw,34px)] leading-none">
                  Project details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2">
                <label className="flex flex-col gap-2.5">
                  <span className={fieldLabel}>Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={onChange('name')}
                    className={underlineInput}
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className={fieldLabel}>Email *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={onChange('email')}
                    className={underlineInput}
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className={fieldLabel}>Company</span>
                  <input value={form.company} onChange={onChange('company')} className={underlineInput} />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className={fieldLabel}>Phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={onChange('phone')}
                    className={underlineInput}
                  />
                </label>
              </div>

              <label className="relative flex max-w-[420px] flex-col gap-2.5">
                <span className={fieldLabel}>Service interest</span>
                <span className="pointer-events-none absolute bottom-5 right-4 block h-2.5 w-2.5 rotate-45 border-b-[1.6px] border-r-[1.6px] border-[rgba(236,233,227,0.6)]" />
                <select
                  value={form.service}
                  onChange={onChange('service')}
                  className="appearance-none rounded-sm border border-[rgba(236,233,227,0.25)] bg-[#131816] py-[15px] pl-4 pr-11 text-[17px] text-[#ece9e3] outline-none"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2.5">
                <span className={fieldLabel}>Message *</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={onChange('message')}
                  placeholder="What you're building, who it's for, and any date you're working towards."
                  className="resize-y border border-[rgba(236,233,227,0.25)] bg-transparent p-4 text-[17px] leading-normal text-[#ece9e3] outline-none placeholder:text-[rgba(236,233,227,0.35)] focus:border-[#429f7f]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-x-[26px] gap-y-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="vaw-wavy border-0 bg-[#429f7f] px-[38px] py-7 text-[15px] font-medium text-[#0b0d0c] hover:bg-[#429f7f]/85 disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : status && !statusError ? 'Sent' : 'Send'}
                </button>
                {status ? (
                  <span
                    className={`text-[14.5px] ${statusError ? 'text-[#cf6a2c]' : 'text-[#429f7f]'}`}
                  >
                    {status}
                  </span>
                ) : null}
              </div>
            </form>

            <div className="flex flex-col gap-[34px]">
              <div className="flex flex-col gap-3">
                <span className="text-[13.5px] text-[rgba(236,233,227,0.5)]">
                  Prefer email? Same reply window as the form.
                </span>
                <a
                  href={getMailtoHref()}
                  className="break-words text-[clamp(18px,1.7vw,24px)] font-medium leading-tight"
                >
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 self-start border-b border-[rgba(236,233,227,0.25)] text-[15px]"
                >
                  <IconInstagram /> Instagram
                </a>
              </div>
              <div className="flex flex-col gap-2.5 border-t border-[rgba(236,233,227,0.14)] pt-[22px]">
                <span className="text-[13.5px] text-[#429f7f]">Rather see it working first?</span>
                <Link
                  href="/#demos"
                  className="self-start border-b border-[rgba(236,233,227,0.25)] text-[17.5px] leading-snug"
                >
                  Try the demos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-[104px] max-w-[1440px] px-8 pb-10">
        <div className="grid grid-cols-1 gap-10 border-t border-[rgba(236,233,227,0.14)] pt-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <Image
              src="/vawcom-logo-3d.png"
              alt="VAWCOM"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <p className="m-0 max-w-[34ch] text-[15px] leading-normal text-[rgba(236,233,227,0.6)]">
              Web, mobile, voice, and AI, delivered end to end from product thinking to launch.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <span className="text-[13.5px] text-[rgba(236,233,227,0.45)]">Quick links</span>
            <Link href="/#demos">Demos</Link>
            <Link href="/#process">Services</Link>
            <Link href="/#about">About Us</Link>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <span className="text-[13.5px] text-[rgba(236,233,227,0.45)]">Connect</span>
            <SocialConnectLinks />
          </div>
        </div>
        <div className="mt-[34px] text-[13.5px] text-[rgba(236,233,227,0.45)]">
          © {new Date().getFullYear()} VAWCOM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
