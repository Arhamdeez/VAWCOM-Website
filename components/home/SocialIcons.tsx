import { getMailtoHref, SOCIAL } from '@/lib/site';

export function IconLinkedIn({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6.6" y="10" width="2.1" height="7.6" fill="currentColor" />
      <circle cx="7.65" cy="7.1" r="1.25" fill="currentColor" />
      <path
        d="M11.4 17.6V10h2.1v1.1c.5-.8 1.4-1.3 2.5-1.3 1.8 0 2.9 1.2 2.9 3.2v4.6h-2.1v-4.2c0-1.1-.5-1.7-1.5-1.7s-1.7.7-1.7 1.8v4.1h-2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconInstagram({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function IconGitHub({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.4 20.4v-2.6c0-.8.3-1.4.8-1.8-2.3-.3-3.8-1.5-3.8-4.3 0-1.1.4-2 .9-2.6-.2-.6-.2-1.5.1-2.3 0 0 .9.1 2.1 1a6.6 6.6 0 0 1 3 0c1.2-.9 2.1-1 2.1-1 .3.8.3 1.7.1 2.3.6.6.9 1.5.9 2.6 0 2.8-1.5 4-3.8 4.3.5.4.8 1 .8 1.9v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMail({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 7.2 12 13l8-5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const linkClass = 'flex items-center gap-2.5';

/** Footer connect column — matches Claude Design home/contact. */
export function SocialConnectLinks() {
  return (
    <>
      <a
        href={SOCIAL.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <IconLinkedIn /> LinkedIn
      </a>
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <IconInstagram /> Instagram
      </a>
      <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <IconGitHub /> GitHub
      </a>
      <a href={getMailtoHref()} className={linkClass}>
        <IconMail /> Email
      </a>
    </>
  );
}
