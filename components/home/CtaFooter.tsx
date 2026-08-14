'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SocialConnectLinks } from './SocialIcons';

export default function CtaFooter() {
  return (
    <>
      <section id="contact" className="mx-auto mt-[104px] max-w-[1440px] px-8">
        <div
          data-reveal="up"
          className="vaw-wavybox grid grid-cols-1 items-end gap-12 bg-[#131816] px-8 py-14 sm:px-16 sm:py-[72px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          <div>
            <h2 className="vaw-display m-0 max-w-[20ch] text-[clamp(34px,4.2vw,62px)] leading-[0.96] tracking-[-0.02em]">
              Have a project in mind?
            </h2>
            <p className="mt-[22px] max-w-[46ch] text-lg leading-normal text-[rgba(236,233,227,0.7)]">
              Tell us what you&apos;re building and we&apos;ll help you scope it and get to launch.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 justify-self-start md:justify-self-end">
            <Link
              href="/contact"
              className="vaw-wavy bg-[#429f7f] px-9 py-7 text-[15px] font-medium text-[#0b0d0c] hover:bg-[#429f7f]/85 hover:text-[#0b0d0c]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1440px] px-8 pb-10 pt-14">
        <div className="grid grid-cols-1 gap-10 border-t border-[rgba(236,233,227,0.14)] pt-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <Image
              src="/vawcom-logo-3d.png"
              alt="VAWCOM"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <p className="m-0 max-w-[32ch] text-[15px] leading-normal text-[rgba(236,233,227,0.6)]">
              Automation-first digital solutions. Karachi, Pakistan.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <span className="text-[13.5px] text-[rgba(236,233,227,0.45)]">Quick links</span>
            <a href="#demos">Demos</a>
            <a href="#process">Services</a>
            <a href="#about">About</a>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <span className="text-[13.5px] text-[rgba(236,233,227,0.45)]">Connect</span>
            <SocialConnectLinks />
          </div>
        </div>
        <div className="mt-[34px] text-[13.5px] text-[rgba(236,233,227,0.45)]">
          © {new Date().getFullYear()} VAWCOM
        </div>
      </footer>
    </>
  );
}
