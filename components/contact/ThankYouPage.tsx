'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import CreamPage from '@/components/services/CreamPage';

export default function ThankYouPage() {
  return (
    <CreamPage nav="contact" footer={false}>
      <div className="vaw-hero flex min-h-[100svh] items-center">
        <div className="vaw-shell-narrow w-full pb-20 pt-[max(7.5rem,calc(env(safe-area-inset-top)+5.75rem))] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0cb78b] text-[#0b0d0c]">
            <Check className="h-6 w-6" strokeWidth={2.4} />
          </div>
          <p className="m-0 mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#0cb78b]">
            Thank you
          </p>
          <h1 className="vaw-display m-0 mt-3 text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#161615]">
            We have your message.
          </h1>
          <p className="mx-auto mt-4 max-w-[32ch] text-[1.0625rem] leading-relaxed text-[#5c5a56]">
            We will reply within a business day.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-[#161615] px-5 py-3 text-base font-medium text-[#f5f3ee] hover:bg-[#0b0d0c] sm:text-[0.875rem]"
            >
              Back home
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-base font-medium text-[#161615] hover:border-[#0cb78b]/40 sm:text-[0.875rem]"
            >
              Send another
            </Link>
          </div>
        </div>
      </div>
    </CreamPage>
  );
}
