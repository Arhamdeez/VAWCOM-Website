'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  /** Collapsing link strip only on home (scroll-driven via data-nav). */
  collapsible?: boolean;
  active?: 'home' | 'contact';
};

export default function PillNav({ collapsible = false, active = 'home' }: Props) {
  const link = 'text-[rgba(236,233,227,0.72)] hover:text-[#429f7f]';
  const cta =
    'flex-none rounded-full bg-[#429f7f] px-[18px] py-2.5 text-[14.5px] font-medium text-[#0b0d0c] hover:bg-[#429f7f]/85 hover:text-[#0b0d0c]';

  return (
    <div
      data-nav={collapsible ? '' : undefined}
      className="fixed left-0 right-0 top-5 z-[60] mx-auto flex w-max max-w-[calc(100vw-32px)] items-center gap-[22px] rounded-full border border-[rgba(236,233,227,0.16)] bg-black px-4 py-2.5 pl-4 backdrop-blur-[10px] backdrop-saturate-[1.2]"
      style={
        collapsible
          ? {
              transition: 'gap 380ms cubic-bezier(.3,.9,.25,1), padding 380ms cubic-bezier(.3,.9,.25,1)',
            }
          : undefined
      }
    >
      <Link href="/" className="flex flex-none items-center gap-2.5 text-inherit">
        <Image
          src="/vawcom-logo-3d.png"
          alt="VAWCOM"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          priority
        />
      </Link>
      <div
        data-nav-links={collapsible ? '' : undefined}
        className="flex items-center gap-[22px] overflow-hidden whitespace-nowrap text-[14.5px]"
        style={
          collapsible
            ? {
                maxWidth: 660,
                opacity: 1,
                transition:
                  'max-width 380ms cubic-bezier(.3,.9,.25,1), opacity 260ms linear',
              }
            : undefined
        }
      >
        <Link href="/#demos" className={link}>
          Demos
        </Link>
        {active === 'contact' ? (
          <Link href="/#process" className={link}>
            Services
          </Link>
        ) : null}
        <Link href="/#about" className={link}>
          About
        </Link>
        {active === 'home' ? (
          <Link href="/contact" className={link}>
            Contact
          </Link>
        ) : null}
      </div>
      {active === 'contact' ? (
        <span className={cta}>Contact</span>
      ) : (
        <Link href="/contact" className={cta}>
          Get Started
        </Link>
      )}
    </div>
  );
}
