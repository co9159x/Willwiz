import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicPaths = ['/', '/policies'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/clients', '/wills', '/storage', '/pricing', '/admin', '/tasks'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected paths, let the page handle authentication
  if (isProtectedPath) {
    return NextResponse.next();
  }

  // Redirect login page if accessing protected routes without auth
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};