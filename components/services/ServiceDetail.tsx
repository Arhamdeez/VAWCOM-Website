import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ServiceChrome from './ServiceChrome';
import ProjectCard from '@/components/work/ProjectCard';
import type { Service } from '@/lib/services';
import { projectsFor } from '@/lib/work';

export default function ServiceDetail({ service }: { service: Service }) {
  const projects = projectsFor(service.id);
  const hrefFor = (id: string) => `/services/${id}`;

  return (
    <ServiceChrome
      nav="services"
      active={service.id}
      hrefFor={hrefFor}
      hero={
        <>
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
            Services
          </p>
          <h1 className="vaw-display m-0 text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.96] tracking-[-0.03em] text-[#161615]">
            {service.title}
          </h1>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[#5c5a56]">{service.lede}</p>
        </>
      }
    >
      <p className="mt-0 text-[15px] leading-relaxed text-[#5c5a56]">{service.for}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="vaw-glass rounded-[1.35rem]">
          <div className="vaw-glass-core rounded-[1.15rem] px-5 py-5">
            <p className="m-0 text-[14px] font-semibold text-[#161615]">What you get</p>
            <ul className="mt-3 space-y-2 text-[14px] leading-snug text-[#5c5a56]">
              {service.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="vaw-glass rounded-[1.35rem]">
          <div className="vaw-glass-core rounded-[1.15rem] px-5 py-5">
            <p className="m-0 text-[14px] font-semibold text-[#161615]">How it runs</p>
            <ol className="mt-3 space-y-2 text-[14px] leading-snug text-[#5c5a56]">
              {service.steps.map((step, i) => (
                <li key={step}>
                  <span className="mr-2 font-medium text-[#0cb78b]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="m-0 text-[15px] font-semibold text-[#161615]">What to bring</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-snug text-[#5c5a56]">
            {service.need.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="m-0 text-[15px] font-semibold text-[#161615]">First slice</h2>
          <p className="mt-3 mb-0 text-[14px] leading-relaxed text-[#5c5a56]">{service.first}</p>
        </div>
      </div>

      <section className="mt-14 border-t border-black/[0.06] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="vaw-display m-0 text-[clamp(1.5rem,2.8vw,2rem)] tracking-[-0.03em] text-[#161615]">
            Related work
          </h2>
          <Link
            href={`/gallery#${service.id}`}
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
          >
            Full gallery
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {projects.length ? (
          <div className="mt-6 grid gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="mt-4 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">
            Nothing public for this one yet. If you want a walkthrough of a similar build, ask on the
            call.
          </p>
        )}
      </section>

      <Link
        href={`/contact?service=${encodeURIComponent(service.title)}`}
        className="mt-10 inline-flex items-center gap-1.5 rounded-full bg-[#0cb78b] px-5 py-3 text-[14px] font-medium text-[#f5f3ee] hover:bg-[#0a9d77]"
      >
        Start this
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </ServiceChrome>
  );
}
