import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestConfig } from 'next-intl/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom middleware function
export default async function middleware(request: NextRequest) {
  // First, handle internationalization with next-intl middleware
  const response = await intlMiddleware(request);

  // Return the response from next-intl middleware
  return response;
}

export const config = {
  // Match only internationalized pathnames, exclude static files and API routes
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};