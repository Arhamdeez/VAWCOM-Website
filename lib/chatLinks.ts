/** Shared href allowlist for chat markdown (client + server). */

export function isAllowedChatHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  // Protocol-relative and non-path schemes are blocked.
  if (/^(javascript|data|vbscript):/i.test(h)) return false;
  if (h.startsWith('//')) return false;
  if (h.startsWith('#') || (h.startsWith('/') && !h.startsWith('//'))) return true;
  try {
    const u = new URL(h);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    return host === 'vawcom.com' || host.endsWith('.vawcom.com') || host === 'localhost';
  } catch {
    return false;
  }
}
