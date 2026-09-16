import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function getJwtSecret(): string {
  // Hỗ trợ cả JWT_SECRET (chuẩn) và AUTH_SECRET (đang dùng trong .env hiện tại).
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Thiếu JWT_SECRET (hoặc AUTH_SECRET). Cấu hình biến môi trường trước khi deploy.');
    }
    console.warn('⚠️ Chưa cấu hình JWT_SECRET/AUTH_SECRET — dùng secret tạm, CHỈ cho dev.');
    return 'dev-only-fallback-secret-do-not-use-in-production';
  }
  if (secret.length < 32) {
    console.warn('⚠️ JWT secret ngắn hơn 32 ký tự — nên dùng chuỗi ngẫu nhiên dài hơn.');
  }
  return secret;
}
const SESSION_EXPIRY = '7d';

export interface SessionPayload {
  userId: string;
  email?: string;
}

export function createSession(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: SESSION_EXPIRY });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  return verifySession(token);
}

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, 
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}