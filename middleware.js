import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host');
  const url = request.nextUrl.clone();
  
  // Determine which domain we're on
  const isLocalhost = hostname?.includes('localhost');
  const isMainDomain = hostname?.includes('thecookiejar.app') && !hostname?.includes('creator.');
  const isCreatorDomain = hostname?.includes('creator.thecookiejar.app');
  
  // Check if accessing dashboard or auth routes
  const isDashboardRoute = url.pathname.startsWith('/dashboard');
  const isAuthRoute = url.pathname.startsWith('/auth');
  const isApiRoute = url.pathname.startsWith('/api');
  const isRootPath = url.pathname === '/';
  
  // Allow API routes to pass through
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  // Main domain (thecookiejar.app) logic
  if (isMainDomain) {
    // If trying to access dashboard or auth from main domain, redirect to creator subdomain
    if (isDashboardRoute || isAuthRoute) {
      url.hostname = 'creator.thecookiejar.app';
      return NextResponse.redirect(url);
    }
    // Allow landing page on main domain
    return NextResponse.next();
  }
  
  // Creator subdomain (creator.thecookiejar.app) logic
  if (isCreatorDomain || isLocalhost) {
    // If on root path of creator domain, redirect to dashboard/overview
    if (isRootPath) {
      url.pathname = '/dashboard/overview';
      return NextResponse.redirect(url);
    }
    // Allow dashboard and auth routes on creator subdomain
    if (isDashboardRoute || isAuthRoute) {
      return NextResponse.next();
    }
    // If trying to access landing page components from creator subdomain, redirect to main domain
    if (!isLocalhost) {
      url.hostname = 'thecookiejar.app';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)',
  ],
};

