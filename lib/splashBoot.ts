/** Cookie so SSR can paint splash state without an inline <script>. */
export const SPLASH_COOKIE = 'vaw_splash';

export function splashCookieHeader() {
  return `${SPLASH_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
}

/** Clear so the next paint can show the splash again (e.g. /splash). */
export function clearSplashCookieHeader() {
  return `${SPLASH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
