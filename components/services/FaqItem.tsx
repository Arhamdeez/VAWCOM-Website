'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * One FAQ. Open/closed is React state (not <details>) so the answer can drop down and fold back up
 * smoothly in every browser: the answer sits in a grid row that animates 0fr -> 1fr.
 */
export default function FaqItem({
  q,
  a,
  link,
}: {
  q: string;
  a: string;
  link?: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div
      className={`rounded-[1.5rem] p-5 transition-[background-color,box-shadow] duration-std ${
        open
          ? 'bg-[#e6faf3] shadow-[0_14px_36px_rgba(12,183,139,0.12)]'
          : 'bg-white shadow-[0_10px_28px_rgba(22,22,21,0.06)]'
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-start justify-between gap-3 border-0 bg-transparent p-0 text-left text-[15px] font-semibold text-[#161615]"
      >
        <span>{q}</span>
        <span
          aria-hidden
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#0cb78b]/12 text-[18px] font-normal leading-none text-[#0cb78b] transition-transform duration-std ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        id={id}
        role="region"
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-std ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="m-0 pt-3 text-[14.5px] leading-relaxed text-[#5c5a56]">{a}</p>
          {link ? (
            <Link
              href={link.href}
              tabIndex={open ? 0 : -1}
              className="mt-3 inline-flex items-center gap-1 text-[14px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
