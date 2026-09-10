'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const input =
  'w-full rounded-xl border-0 bg-[#f5f3ee] px-4 py-3 text-[15px] text-[#161615] outline-none ring-0 placeholder:text-[#8a8882] focus:bg-white focus:shadow-[0_0_0_2px_rgba(12,183,139,0.35)]';
const label = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a8882]';

export default function MiniContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    setError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          service: 'Consultation',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('Sent. We will get back within a business day.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(true);
      setStatus(err instanceof Error ? err.message : 'Could not send. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-[#e6faf3] p-6 shadow-[0_16px_40px_rgba(22,22,21,0.08)] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/70"
      >
        <MessageCircle className="h-10 w-10 text-[#0cb78b]/55" strokeWidth={1.5} />
      </div>
      <form onSubmit={onSubmit} className="relative z-[1] max-w-[32rem] space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="svc-help-name" className={label}>
              Name
            </label>
            <input
              id="svc-help-name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="svc-help-email" className={label}>
              Email
            </label>
            <input
              id="svc-help-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </div>
        </div>
        <div>
          <label htmlFor="svc-help-msg" className={label}>
            What are you trying to do?
          </label>
          <textarea
            id="svc-help-msg"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${input} resize-y`}
            placeholder="A sentence or two is enough."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-[#0cb78b] px-6 py-3 text-[14px] font-medium text-[#f5f3ee] hover:bg-[#0a9d77] disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Ask for help'}
        </button>
        {status ? (
          <p
            className={`m-0 rounded-xl px-4 py-3 text-[13.5px] ${
              error ? 'bg-red-50 text-red-700' : 'bg-white/70 text-[#5c5a56]'
            }`}
          >
            {status}
          </p>
        ) : null}
      </form>
    </div>
  );
}
