/** Site-wide contact & social URLs — single source of truth */

export const CONTACT_EMAIL = 'vawcomtechnologies@gmail.com';

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
