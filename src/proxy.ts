import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/chat');

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/login', '/'],
};