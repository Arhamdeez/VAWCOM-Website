import Link from 'next/link';
import { SiteCenter } from '@/components/SiteContainer';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-[max(1rem,env(safe-area-inset-left,0px))] pb-16 pt-[max(6rem,calc(env(safe-area-inset-top,0px)+4.5rem))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
      <SiteCenter max="md">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400/90">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          That link may be outdated or mistyped. Head back home or contact us if you need help.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="btn-glass-primary inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium text-white sm:w-auto"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="btn-glass-muted inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium text-slate-300 sm:w-auto"
          >
            Contact us
          </Link>
        </div>
      </SiteCenter>
    </div>
  );
}
