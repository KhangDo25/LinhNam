import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth-session';

const PROTECTED_PREFIXES = ['/tai-khoan', '/gio-hang', '/thanh-toan', '/lich-su-mua-hang'];

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('session')?.value ??
    request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin');

  if ((isProtected || isAdminRoute) && !token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  // Verify chữ ký JWT ngay tại boundary: cookie giả/khác secret → đá về login.
  if (token && (isProtected || isAdminRoute) && !verifySession(token)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Phiên đăng nhập hết hạn.' }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL('/dang-nhap', request.url));
    res.cookies.delete('session');
    res.cookies.delete('token');
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

export const config = {
  matcher: [
    '/tai-khoan/:path*',
    '/gio-hang/:path*',
    '/thanh-toan/:path*',
    '/lich-su-mua-hang/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/checkout/:path*',
    '/api/topup/:path*',
    '/api/orders/:path*',
  ],
};