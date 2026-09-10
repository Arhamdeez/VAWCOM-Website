/** Cookie + session flag so SSR can paint splash state without an inline <script>. */
export const SPLASH_COOKIE = 'vaw_splash';

export function splashCookieHeader(seen: boolean) {
  return seen
    ? `${SPLASH_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`
    : `${SPLASH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
