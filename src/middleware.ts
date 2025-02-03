import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale } from './utils/constants';

export async function middleware(req: NextRequest) {
  let { pathname } = req.nextUrl;

  let locale = pathname.split('/')[1];

  if (!['fr', 'gb', 'ar'].includes(locale)) {
    pathname = `/${defaultLocale}${pathname}`;
    locale = defaultLocale;
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.ico$).*)'],
};
