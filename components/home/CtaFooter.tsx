'use client';

import Link from 'next/link';
import { CONTACT_EMAIL, getGmailComposeUrl, SOCIAL } from '@/lib/site';
import { IconGitHub, IconInstagram, IconLinkedIn, IconMail } from './SocialIcons';

const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

const iconClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#161615] transition-colors hover:bg-[#0cb78b] hover:text-[#0b0d0c]';

/** Compact footer — big faded mark, content above the wash. */
export default function CtaFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden text-[#161615]"
      style={{
        background:
          'linear-gradient(180deg, #f5f3ee 0%, #eef8f3 32%, #c5ebd8 72%, #9fdfc4 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(12,183,139,0.42), transparent 70%)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none overflow-hidden text-center"
      >
        <span
          className="vaw-display inline-block translate-y-[22%] text-[clamp(5.5rem,24vw,16rem)] leading-none tracking-[-0.06em]"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          vawcom
        </span>
      </div>

      <div className="relative z-[1] mx-auto flex max-w-[1440px] items-start justify-between gap-6 px-6 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={iconClass}
            >
              <IconInstagram size={16} />
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={iconClass}
            >
              <IconLinkedIn size={16} />
            </a>
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={iconClass}
            >
              <IconGitHub size={16} />
            </a>
            <a
              href={getGmailComposeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className={iconClass}
            >
              <IconMail size={16} />
            </a>
          </div>
          <a
            href={getGmailComposeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 block whitespace-nowrap text-[clamp(12px,2.6vw,15px)] font-semibold tracking-[-0.015em] text-[#161615] hover:text-[#0a9d77]"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-1 mb-0 text-[13px] text-[#3d4a45]">Karachi, Pakistan</p>
        </div>

        <nav aria-label="Footer" className="flex shrink-0 flex-col gap-1.5 text-right">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-semibold tracking-[-0.015em] text-[#161615] hover:text-[#0a9d77] sm:text-[15px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative z-[1] h-[clamp(4rem,12vw,7rem)]" aria-hidden />

      <div className="relative z-[1] mx-auto max-w-[1440px] px-6 pb-3 sm:px-8 lg:px-10">
        <p className="m-0 text-[12px] text-[#3d4a45]/85">
          © {year} VAWCOM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
