import { type ServiceId } from './services';

export type WorkReview =
  | { type: 'text'; quote: string; name: string; role?: string }
  | { type: 'video'; src: string; poster?: string; name: string; role?: string };

export type Project = {
  id: string;
  service: ServiceId;
  title: string;
  summary: string;
  details?: string;
  highlights?: string[];
  demo?: string;
  url?: string;
  review?: WorkReview;
};

/** Public write-ups only. Add a review when the client says we can. */
export const PROJECTS: Project[] = [
  {
    id: 'hisaab',
    service: 'apps',
    title: 'Hisaab',
    summary: 'A spending tracker we built in-house. Transaction data stays on the phone.',
    details:
      'Hisaab keeps a running picture of what you spend without sending that history to a server. Payment alerts can be read on the device. No account, no cloud copy of your transactions.',
  },
  {
    id: 'vawbot',
    service: 'ai',
    title: 'Vawbot',
    summary: 'The assistant on this site. It answers from our pages, not a generic script.',
    details:
      'Vawbot sits on vawcom.com and answers questions about services, process, and contact. It stays on our own copy, so replies match what we actually offer.',
  },
  {
    id: 'voice-line',
    service: 'voice',
    title: 'Voice line',
    summary: 'A phone agent that answers, checks a calendar, and confirms the booking.',
    details:
      'The line on the homepage is a live voice agent. It picks up, checks availability, and confirms bookings without a human on the desk. Same pattern we use when a business needs the phone answered after hours, across time zones, or through a rush.\n\nCallers hear a natural greeting, answer a few questions, and get a confirmed slot — or a clean handoff if the request is out of scope. The stack hooks into the calendar you already use, so nothing gets double-booked.',
    highlights: [
      'Answers in under two rings with a branded greeting',
      'Checks live calendar availability before confirming',
      'Sends SMS confirmation and logs the call summary',
      'Escalates edge cases to a human inbox',
    ],
    demo: 'Sample walkthrough — placeholder video and mock call flow for design review.',
    url: '/#voice',
  },
];

export function projectsFor(service: ServiceId): Project[] {
  return PROJECTS.filter((p) => p.service === service);
}

export function youtubeEmbed(src: string): string | null {
  const id = src.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

type SlideKind = 'browser' | 'phone' | 'voice' | 'chat' | 'store' | 'care';

export type WorkSlide = Project & { kind: SlideKind };

const KIND: Record<ServiceId, SlideKind> = {
  web: 'browser',
  apps: 'phone',
  voice: 'voice',
  ai: 'chat',
  commerce: 'store',
  care: 'care',
};

export function workSlides(): WorkSlide[] {
  return PROJECTS.map((p) => ({ ...p, kind: KIND[p.service] }));
}
