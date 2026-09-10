'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CreamPage from '@/components/services/CreamPage';
import CtaFooter from '@/components/home/CtaFooter';
import { CONTACT_EMAIL, getGmailComposeUrl } from '@/lib/site';
import { SERVICES } from '@/lib/services';

const SERVICE_OPTIONS = [
  'Select a service',
  ...SERVICES.map((s) => s.title),
  'Consultation',
  'Other',
] as const;

const label = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a8882]';
const input =
  'w-full rounded-xl border-0 bg-[#f5f3ee] px-4 py-3.5 text-[15px] text-[#161615] outline-none ring-0 placeholder:text-[#8a8882] focus:bg-white focus:shadow-[0_0_0_2px_rgba(12,183,139,0.35)]';

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
        <header className="mx-auto max-w-[1100px] px-6 pt-28 sm:px-8 lg:px-10 lg:pt-32">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            Contact
          </p>
          <h1 className="vaw-display m-0 max-w-[14ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-[#161615]">
            Tell us what you are
            <span className="text-[#0cb78b]"> building.</span>
          </h1>
          <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-[#5c5a56]">
            Use the form or email us. We usually reply within a business day.
          </p>
        </header>

        <div className="mx-auto grid max-w-[1100px] gap-8 px-6 pb-4 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:gap-10 lg:px-10 lg:pb-2 lg:pt-14">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_32px_rgba(22,22,21,0.06)] sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name *</span>
                <input
                  required
                  autoComplete="name"
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
                  value={form.email}
                  onChange={onChange('email')}
                  className={input}
                />
              </label>
              <label className="block">
                <span className={label}>Company</span>
                <input
                  autoComplete="organization"
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

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-[#0cb78b] px-7 py-3.5 text-[15px] font-semibold text-[#0b0d0c] hover:bg-[#0a9d77] disabled:opacity-50"
              >
                {submitting ? 'Sending…' : status && !statusError ? 'Sent' : 'Send message'}
              </button>
              {status ? (
                <p
                  role="status"
                  className={`m-0 text-[14.5px] ${
                    statusError ? 'text-[#c45c3a]' : 'text-[#0a9d77]'
                  }`}
                >
                  {status}
                </p>
              ) : null}
            </div>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[1.5rem] bg-[#161615] p-6 sm:p-7">
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0cb78b]">
                Email us
              </p>
              <a
                href={getGmailComposeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block whitespace-nowrap text-[clamp(13px,1.55vw,17px)] font-semibold tracking-[-0.015em] text-[#ece9e3] hover:text-[#0cb78b]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between rounded-[1.5rem] bg-[#0cb78b] p-6 sm:p-7">
              <div>
                <h2 className="vaw-display m-0 text-[1.35rem] tracking-[-0.02em] text-[#0b0d0c]">
                  See shipped work
                </h2>
                <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#0b0d0c]/75]">
                  Browse projects before you write.
                </p>
              </div>
              <Link
                href="/gallery"
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0b0d0c] px-4 py-2.5 text-[13.5px] font-medium text-[#ece9e3] hover:bg-[#161615]"
              >
                Open gallery
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-[#5c5a56] hover:text-[#0cb78b]"
            >
              Compare services
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </div>

      <CtaFooter />
    </CreamPage>
  );
}
