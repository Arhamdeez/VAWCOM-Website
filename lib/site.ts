/** Site-wide contact & social URLs — single source of truth */

export const CONTACT_EMAIL = 'vawcomtechnologies@gmail.com';

/** Pages the site assistant may link to. Keep hrefs exact — the model copies them. */
export const CHAT_SITE_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Why us', href: '/#why' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const DEFAULT_MAIL_SUBJECT = 'Project inquiry from vawcom.com';

/** Opens Gmail compose in the browser — use this for all “email us” links. */
export function getGmailComposeUrl(subject: string = DEFAULT_MAIL_SUBJECT) {
  const q = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: CONTACT_EMAIL,
    su: subject,
  });
  return `https://mail.google.com/mail/?${q.toString()}`;
}

/** Optional mailto for non-web contexts (e.g. server email HTML). */
export function getMailtoHref(subject: string = DEFAULT_MAIL_SUBJECT) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const SOCIAL = {
  instagram: 'https://www.instagram.com/vawcom.tech/',
  linkedin: 'https://www.linkedin.com/company/vawcom',
  github: 'https://github.com/vawcom-technologies',
} as const;
