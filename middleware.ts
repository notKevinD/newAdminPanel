// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Konfigurasi paths yang bisa diakses tanpa login
const PUBLIC_PATHS = ['/login'];
const PROTECTED_PATHS = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get('admin-token')?.value;
  const { pathname } = request.nextUrl;

  // Cek apakah path termasuk public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  
  // Cek apakah path termasuk protected
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  // Redirect jika sudah login mencoba akses login page
  if (isPublicPath && token) {
    const isValid = verifyToken(token);
    if (isValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Proteksi path yang memerlukan autentikasi
  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = verifyToken(token);
    if (!isValid) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/login'
  ],
};