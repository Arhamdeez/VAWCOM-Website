/** Scroll to the home demos section (works after client navigation to /). */
export function scrollToServicesSection(behavior: ScrollBehavior = 'smooth') {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('demos') ?? document.getElementById('services');
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior, block: 'start' });
  });
}

export function isServicesHashLink(href: string) {
  return (
    href === '/#demos' ||
    href === '#demos' ||
    href === '/#services' ||
    href === '#services'
  );
}
