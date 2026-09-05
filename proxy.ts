import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isProtected = ['/tai-khoan', '/gio-hang', '/thanh-toan'].some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }
  
  return NextResponse.next();
}