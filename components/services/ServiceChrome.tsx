import type { ReactNode } from 'react';
import CreamPage from './CreamPage';
import ServiceNav from './ServiceNav';

type Props = {
  nav: 'services' | 'gallery';
  active: string;
  hrefFor: (id: string) => string;
  hero: ReactNode;
  children: ReactNode;
  prefix?: ReactNode;
};

export default function ServiceChrome({ nav, active, hrefFor, hero, children, prefix }: Props) {
  return (
    <CreamPage nav={nav}>
      {prefix}
      <section className="vaw-hero border-b border-black/[0.06]">
        <div className="mx-auto max-w-[40rem] px-6 pb-10 pt-28 text-center sm:px-8 sm:pb-12 sm:pt-32 [&_p]:mx-auto">
          {hero}
        </div>
      </section>
      <ServiceNav active={active} hrefFor={hrefFor} variant="mobile" />
      <div className="vaw-hero">
        <div className="mx-auto grid w-full max-w-[1080px] gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16 lg:py-16">
          <div className="min-w-0">{children}</div>
          <ServiceNav active={active} hrefFor={hrefFor} variant="side" />
        </div>
      </div>
    </CreamPage>
  );
}
