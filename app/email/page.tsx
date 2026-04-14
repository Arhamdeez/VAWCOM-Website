'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getGmailComposeUrl } from '@/lib/site';
import { Mail } from 'lucide-react';

/** Visiting `/email` sends you to Gmail compose (same URL as footer + contact email link). */
export default function EmailPage() {
  const gmailUrl = getGmailComposeUrl();

  useEffect(() => {
    window.location.replace(gmailUrl);
  }, [gmailUrl]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-900">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-6">Opening Gmail…</p>
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white"
          >
            <Mail className="h-5 w-5" aria-hidden />
            Open Gmail
          </a>
          <p className="mt-6 max-w-md text-center text-sm text-slate-400">
            If you weren&apos;t redirected, tap the button — you must be signed into Google in this browser.
          </p>
        </div>
        <Link href="/contact" className="text-sm text-emerald-400/90 hover:text-emerald-300 transition-colors">
          ← Back to Contact
        </Link>
      </div>
    </div>
  );
}
