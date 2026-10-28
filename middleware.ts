import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SPLASH_COOKIE } from '@/lib/splashBoot';

/** Visiting /splash clears the seen cookie and forces this response to paint the splash. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/splash') return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-force-splash', '1');
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.cookies.set(SPLASH_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}

export const config = {
  matcher: '/splash',
};
