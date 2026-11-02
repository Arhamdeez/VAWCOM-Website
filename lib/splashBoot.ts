/** Cookie so SSR can paint splash state without an inline <script>. */
export const SPLASH_COOKIE = 'vaw_splash_s';
/** Old year-long cookie — cleared so it cannot suppress splash forever. */
export const SPLASH_COOKIE_LEGACY = 'vaw_splash';

/** Session cookie: splash once per browser session, not again on refresh. */
export function splashCookieHeader() {
  return `${SPLASH_COOKIE}=1; Path=/; SameSite=Lax`;
}

/** Clear so the next paint can show the splash again (e.g. /splash). */
export function clearSplashCookieHeader() {
  return `${SPLASH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearLegacySplashCookieHeader() {
  return `${SPLASH_COOKIE_LEGACY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasSeenSplash() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').includes(`${SPLASH_COOKIE}=1`);
}

/** Remember this session so a refresh does not replay the splash. */
export function markSplashSeen() {
  if (typeof document === 'undefined') return;
  document.cookie = splashCookieHeader();
  document.cookie = clearLegacySplashCookieHeader();
}
