import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale } from './utils/constants';

export async function middleware(req: NextRequest) {
  let { pathname } = req.nextUrl;
  console.log('🚀 ~ middleware ~ pathname:', pathname);

  let locale = pathname.split('/')[1];

  if (!['fr', 'gb', 'ar'].includes(locale)) {
    pathname = `/${defaultLocale}${pathname}`;
    locale = defaultLocale;
  }
  console.log('🚀 ~ middleware ~ locale:', locale);

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
