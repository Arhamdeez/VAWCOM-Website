import Link from 'next/link';
import { SERVICES } from '@/lib/services';

type Props = {
  active: string;
  hrefFor: (id: string) => string;
  variant: 'mobile' | 'side';
};

export default function ServiceNav({ active, hrefFor, variant }: Props) {
  if (variant === 'mobile') {
    return (
      <div className="vaw-hero sticky top-0 z-40 border-b border-black/[0.06] lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-6 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={hrefFor(s.id)}
              className={`flex-none rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                active === s.id
                  ? 'bg-[#0cb78b] text-[#f5f3ee]'
                  : 'bg-black/[0.04] text-[#5c5a56]'
              }`}
            >
              {s.nav}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav aria-label="Services" className="hidden lg:block lg:self-start lg:sticky lg:top-28">
      <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
        Select a service
      </p>
      <ul className="space-y-1">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <Link
              href={hrefFor(s.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-[14.5px] ${
                active === s.id
                  ? 'bg-[#0cb78b] font-medium text-[#f5f3ee]'
                  : 'text-[#5c5a56] hover:bg-black/[0.04] hover:text-[#161615]'
              }`}
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
