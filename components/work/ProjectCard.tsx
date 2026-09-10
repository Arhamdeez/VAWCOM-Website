import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project, WorkReview } from '@/lib/work';
import { youtubeEmbed } from '@/lib/work';

export function ReviewBlock({ review }: { review: WorkReview }) {
  if (review.type === 'video') {
    const yt = youtubeEmbed(review.src);
    return (
      <div className="vaw-review-video mt-4">
        {yt ? (
          <iframe
            src={yt}
            title={review.name}
            className="vaw-review-frame aspect-video w-full rounded-[1.1rem] border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="vaw-review-frame aspect-video w-full rounded-[1.1rem] bg-black/5"
            controls
            playsInline
            poster={review.poster}
            src={review.src}
          />
        )}
        <p className="vaw-review-by mt-2 mb-0 text-[13px] text-[#8a8882]">
          {review.name}
          {review.role ? `, ${review.role}` : ''}
        </p>
      </div>
    );
  }

  return (
    <blockquote className="vaw-review-quote mt-4 mb-0">
      <p className="m-0 text-[15px] leading-relaxed text-[#161615]">&ldquo;{review.quote}&rdquo;</p>
      <footer className="mt-2 text-[13px] text-[#8a8882]">
        {review.name}
        {review.role ? `, ${review.role}` : ''}
      </footer>
    </blockquote>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="vaw-glass rounded-[1.35rem]">
      <div className="vaw-glass-core rounded-[1.15rem] px-5 py-5">
        <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-[#161615]">
          {project.title}
        </h3>
        <p className="mt-2 mb-0 text-[14.5px] leading-relaxed text-[#5c5a56]">{project.summary}</p>
        {project.review ? <ReviewBlock review={project.review} /> : null}
        {project.url ? (
          <Link
            href={project.url}
            className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-medium text-[#0cb78b] hover:text-[#0a9d77]"
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
