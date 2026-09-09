import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import HashToService from './HashToService';
import ServiceChrome from './ServiceChrome';
import { SERVICES, SERVICE_FAQS } from '@/lib/services';

const FIT = [
  { id: 'web', line: 'You need a site or a web app people can use in a browser.' },
  { id: 'apps', line: 'It has to live on a phone, not a bookmark.' },
  { id: 'voice', line: 'Calls come in and nobody can pick up every time.' },
  { id: 'ai', line: 'The same questions and busywork keep eating the week.' },
  { id: 'commerce', line: 'You sell things and stock has to match the order.' },
  { id: 'care', line: 'Something is already live and it is drifting or breaking.' },
] as const;

const START = [
  'A short call or the form. You talk to the people who will build it.',
  'We lock a first slice with a date, not a vague phase.',
  'We build that slice, you use it, then we decide the next one.',
] as const;

export default function ServicesHub() {
  const hrefFor = (id: string) => `/services/${id}`;

  return (
    <ServiceChrome
      nav="services"
      active=""
      hrefFor={hrefFor}
      prefix={<HashToService />}
      hero={
        <>
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
            Services
          </p>
          <h1 className="vaw-display m-0 text-[clamp(2.2rem,5vw,4rem)] leading-[0.96] tracking-[-0.03em] text-[#161615]">
            What we build.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-[#5c5a56]">
            Use the list to open a service. If you are not sure which, start with the match below.
          </p>
        </>
      }
    >
      <h2 className="vaw-display m-0 text-[clamp(1.5rem,2.8vw,2rem)] tracking-[-0.03em] text-[#161615]">
        If you are not sure
      </h2>
      <ul className="mt-8 grid gap-x-12 border-b border-black/[0.08] sm:grid-cols-2">
        {FIT.map((row) => {
          const s = SERVICES.find((x) => x.id === row.id)!;
          return (
            <li key={row.id} className="border-t border-black/[0.08]">
              <Link href={hrefFor(row.id)} className="block py-5">
                <span className="text-[15px] font-medium text-[#0cb78b]">{s.nav}</span>
                <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[#5c5a56]">
                  {row.line}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="vaw-display mt-16 m-0 text-[clamp(1.5rem,2.8vw,2rem)] tracking-[-0.03em] text-[#161615]">
        How a project starts
      </h2>
      <ol className="mt-8 grid gap-8 sm:grid-cols-3">
        {START.map((step, i) => (
          <li key={step}>
            <p className="m-0 text-[13px] font-medium text-[#0cb78b]">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">{step}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16 border-t border-black/[0.06] pt-12">
        <h2 className="vaw-display m-0 text-[clamp(1.5rem,2.8vw,2rem)] tracking-[-0.03em] text-[#161615]">
          Questions we get first
        </h2>
        <div className="mt-8 border-t border-black/[0.08]">
          {SERVICE_FAQS.map((item) => (
            <details key={item.q} className="group border-b border-black/[0.08]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-[#161615] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="flex h-6 w-6 flex-none items-center justify-center text-[18px] font-normal leading-none text-[#0cb78b] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mb-4 mt-0 max-w-[52ch] pb-1 text-[14.5px] leading-relaxed text-[#5c5a56]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Link
        href="/gallery"
        className="mt-12 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
      >
        See gallery
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </ServiceChrome>
  );
}
