import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('session')?.value ??
    request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  const isProtected = ['/tai-khoan', '/gio-hang', '/thanh-toan', '/lich-su-mua-hang'].some(path =>
    pathname.startsWith(path)
  );
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if ((isProtected || isAdminRoute) && !token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  return NextResponse.next();
}