'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CreamPage from '@/components/services/CreamPage';
import CtaFooter from '@/components/home/CtaFooter';
import { CONTACT_EMAIL, getGmailComposeUrl, SHOW_GALLERY } from '@/lib/site';
import { SERVICES } from '@/lib/services';
import Reveal from '@/components/Reveal';

const SERVICE_OPTIONS = [
  'Select a service',
  ...SERVICES.map((s) => s.title),
  'Consultation',
  'White-label partnership',
  'Other',
] as const;

const label =
  'mb-2 block text-center text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#8a8882]';
const input =
  'w-full rounded-xl border-0 bg-[#f5f3ee] px-4 py-3.5 text-[0.9375rem] text-[#161615] outline-none ring-0 placeholder:text-[#8a8882] focus:bg-white focus:shadow-[0_0_0_2px_rgba(12,183,139,0.35)]';

export default function ContactPage() {
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
    const q = new URLSearchParams(window.location.search).get('service');
    if (q && (SERVICE_OPTIONS as readonly string[]).includes(q)) {
      setForm((f) => ({ ...f, service: q }));
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
      const data = (await res.json().catch(() => ({}))) as { error?: string };
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
    } catch (err) {
      setStatusError(true);
      setStatus(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CreamPage nav="contact" footer={false}>
      <div className="vaw-hero">
        <header className="vaw-shell-narrow flex flex-col items-center pt-[max(7rem,calc(env(safe-area-inset-top)+5.5rem))] text-center lg:pt-32">
          <p className="m-0 mb-5 rounded-full border border-[#0cb78b]/30 bg-white/60 px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            Contact
          </p>
          <h1 className="vaw-display m-0 max-w-[14ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-[#161615]">
            Tell us what you are
            <span className="text-[#0cb78b]"> building.</span>
          </h1>
          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[#5c5a56]">
            Send the form first, or use the email below. We usually reply within a business day.
          </p>
        </header>

        <div className="vaw-shell-narrow flex flex-col items-center gap-5 pb-4 pt-12 lg:pb-2 lg:pt-14">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="w-full max-w-[38rem] rounded-[1.5rem] bg-white p-6 shadow-[0_0.75rem_2rem_rgba(22,22,21,0.06)] sm:p-8"
          >
            <div className="mb-7 text-center">
              <p className="m-0 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
                Send a message
              </p>
              <h2 className="vaw-display m-0 mt-2 text-[clamp(1.35rem,2.4vw,1.6rem)] tracking-[-0.02em] text-[#161615]">
                Project details
              </h2>
              <p className="m-0 mt-1.5 text-[0.8125rem] text-[#8a8882]">Asterisk (*) marks required fields.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name *</span>
                <input
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={onChange('name')}
                  className={input}
                />
              </label>
              <label className="block">
                <span className={label}>Email *</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={onChange('email')}
                  className={input}
                />
              </label>
              <label className="block">
                <span className={label}>Company</span>
                <input
                  autoComplete="organization"
                  placeholder="Company Inc."
                  value={form.company}
                  onChange={onChange('company')}
                  className={input}
                />
              </label>
              <label className="block">
                <span className={label}>Phone</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+92 300 1234567"
                  value={form.phone}
                  onChange={onChange('phone')}
                  className={input}
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className={label}>Service</span>
              <select
                value={form.service}
                onChange={onChange('service')}
                className={`${input} appearance-none pr-10`}
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-5 block">
              <span className={label}>Message *</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={onChange('message')}
                placeholder="What you are building, who it is for, and any date you are working towards."
                className={`${input} min-h-[8.5rem] resize-y`}
              />
            </label>

            <div className="mt-7 flex flex-col items-center gap-3 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-[#0cb78b] px-7 py-3.5 text-[0.9375rem] font-semibold text-[#0b0d0c] hover:bg-[#0a9d77] disabled:opacity-50"
              >
                {submitting ? 'Sending…' : status && !statusError ? 'Sent' : 'Send message'}
              </button>
              {status ? (
                <p
                  role="status"
                  className={`vaw-msg m-0 text-[0.9063rem] ${
                    statusError ? 'text-[#c45c3a]' : 'text-[#0a9d77]'
                  }`}
                >
                  {status}
                </p>
              ) : null}
            </div>
          </form>

          <Reveal as="aside" className="flex w-full max-w-[38rem] flex-col items-center gap-4 text-center">
            <div data-nav-contrast="dark" className="w-full rounded-[1.5rem] bg-[#161615] p-6 sm:p-7">
              <p className="m-0 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0cb78b]">
                Email us
              </p>
              <a
                href={getGmailComposeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block break-all text-[clamp(0.9375rem,2.4vw,1.125rem)] font-semibold tracking-[-0.015em] text-[#ece9e3] hover:text-[#0cb78b]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            {SHOW_GALLERY ? (
            <div className="flex min-h-[9rem] w-full flex-col items-center justify-between rounded-[1.5rem] bg-[#0cb78b] p-6 sm:p-7">
              <div>
                <h2 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#0b0d0c]">
                  See shipped work
                </h2>
                <p className="mt-2 mb-0 text-[0.9063rem] leading-relaxed text-[#0b0d0c]/75]">
                  Browse projects before you write.
                </p>
              </div>
              <Link
                href="/gallery"
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0b0d0c] px-4 py-2.5 text-[0.8438rem] font-medium text-[#ece9e3] hover:bg-[#161615]"
              >
                Open gallery
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            ) : null}

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-[#5c5a56] hover:text-[#0cb78b]"
            >
              Compare services
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </div>

      <CtaFooter />
    </CreamPage>
  );
}
