'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import CreamPage from '@/components/services/CreamPage';
import CtaFooter from '@/components/home/CtaFooter';
import { CONTACT_EMAIL, getGmailComposeUrl } from '@/lib/site';
import { SERVICES } from '@/lib/services';

const SERVICE_OPTIONS = [
  'Select a service',
  ...SERVICES.map((s) => s.title),
  'Consultation',
  'White-label partnership',
  'Other',
] as const;

const label = 'mb-1.5 block text-left text-[0.8125rem] font-medium text-[#3d4a45]';
const field =
  'w-full min-h-12 rounded-2xl border border-black/[0.06] bg-[#f7f6f2] px-4 py-3.5 text-left text-base text-[#161615] outline-none transition-[background,box-shadow,border-color] duration-200 placeholder:text-[#a3a199] focus:border-[#0cb78b]/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(12,183,139,0.12)]';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: 'Select a service',
  message: '',
};

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setError('');
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
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
      router.push('/contact/thanks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <CreamPage nav="contact" footer={false}>
      <div className="vaw-hero">
        <div className="vaw-shell-narrow grid items-start gap-10 pb-16 pt-[max(7.5rem,calc(env(safe-area-inset-top)+5.75rem))] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-24 lg:pt-36">
          <header className="lg:sticky lg:top-28">
            <p className="m-0 mb-5 inline-flex rounded-full border border-[#0cb78b]/30 bg-white/70 px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
              Contact
            </p>
            <h1 className="vaw-display m-0 max-w-[12ch] text-[clamp(2.15rem,8vw,4.25rem)] leading-[0.92] tracking-[-0.04em] text-[#161615] sm:text-[clamp(2.5rem,5.4vw,4.25rem)]">
              Tell us what you are
              <span className="text-[#0cb78b]"> building.</span>
            </h1>
            <p className="mt-5 max-w-[28ch] text-[1.0625rem] leading-relaxed text-[#5c5a56]">
              We reply within a business day.
            </p>
            <a
              href={getGmailComposeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block max-w-full break-all text-[0.9375rem] font-medium text-[#161615] underline decoration-[#0cb78b]/40 underline-offset-4 hover:text-[#0a9d77]"
            >
              {CONTACT_EMAIL}
            </a>
          </header>

          <form
            onSubmit={onSubmit}
            className="rounded-[1.75rem] border border-black/[0.05] bg-white p-5 shadow-[0_1.25rem_3.5rem_rgba(22,22,21,0.07)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name *</span>
                <input
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange('name')}
                  className={field}
                />
              </label>
              <label className="block">
                <span className={label}>Email *</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={onChange('email')}
                  className={field}
                />
              </label>
              <label className="block">
                <span className={label}>Company</span>
                <input
                  autoComplete="organization"
                  placeholder="Optional"
                  value={form.company}
                  onChange={onChange('company')}
                  className={field}
                />
              </label>
              <label className="block">
                <span className={label}>Phone</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Optional"
                  value={form.phone}
                  onChange={onChange('phone')}
                  className={field}
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className={label}>Service</span>
              <span className="relative block">
                <select
                  value={form.service}
                  onChange={onChange('service')}
                  className={`${field} appearance-none pr-11`}
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8882]" />
              </span>
            </label>

            <label className="mt-4 block">
              <span className={label}>Message *</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={onChange('message')}
                placeholder="What you are building, and any date you are working toward."
                className={`${field} min-h-[9rem] resize-y`}
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0cb78b] px-7 py-3.5 text-base font-semibold text-[#0b0d0c] transition-colors hover:bg-[#0a9d77] disabled:opacity-50 sm:w-auto"
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
              <p className="m-0 text-[0.8125rem] text-[#8a8882]">* Required</p>
            </div>

            {error ? (
              <p role="alert" className="m-0 mt-4 text-[0.9063rem] text-[#c45c3a]">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      <CtaFooter />
    </CreamPage>
  );
}
