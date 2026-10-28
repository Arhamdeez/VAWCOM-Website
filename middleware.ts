import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SPLASH_COOKIE } from '@/lib/splashBoot';

/** Visiting /splash clears the seen cookie so SSR paints splash-pending. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/splash') return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set(SPLASH_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}

export const config = {
  matcher: '/splash',
};
