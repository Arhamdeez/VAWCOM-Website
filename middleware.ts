import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SPLASH_COOKIE, SPLASH_COOKIE_LEGACY } from '@/lib/splashBoot';

/**
 * - /splash clears the session cookie and forces the splash plate.
 * - Any request drops the old year-long `vaw_splash` cookie so returning
 *   visitors see the splash again under the session cookie.
 */
export function middleware(request: NextRequest) {
  const isSplashRoute = request.nextUrl.pathname === '/splash';

  let res: NextResponse;
  if (isSplashRoute) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-force-splash', '1');
    res = NextResponse.next({ request: { headers: requestHeaders } });
    res.cookies.set(SPLASH_COOKIE, '', { path: '/', maxAge: 0 });
  } else {
    res = NextResponse.next();
  }

  if (request.cookies.has(SPLASH_COOKIE_LEGACY)) {
    res.cookies.set(SPLASH_COOKIE_LEGACY, '', { path: '/', maxAge: 0 });
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Run on app routes (skip static assets). Needed so the legacy splash
     * cookie is cleared on the first hit after deploy.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
