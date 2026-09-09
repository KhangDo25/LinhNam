import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  intervalMs: number;
  maxRequests: number;
}

export function rateLimit(options: RateLimitOptions) {
  const { intervalMs, maxRequests } = options;

  return {
    check(req: NextRequest | Request, identifier?: string): { success: boolean; remaining: number; resetMs: number } {
      const ip =
        identifier ||
        (req as NextRequest).headers?.get?.('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        'anonymous';

      const now = Date.now();
      const entry = store.get(ip);

      if (!entry || now > entry.resetTime) {
        store.set(ip, { count: 1, resetTime: now + intervalMs });
        return { success: true, remaining: maxRequests - 1, resetMs: intervalMs };
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, resetMs: entry.resetTime - now };
      }

      entry.count += 1;
      store.set(ip, entry);
      return { success: true, remaining: maxRequests - entry.count, resetMs: entry.resetTime - now };
    },
  };
}

export function rateLimitResponse(resetMs: number) {
  return NextResponse.json(
    { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(resetMs / 1000)),
      },
    }
  );
}

// Pre-configured limiters
export const authLimiter = rateLimit({ intervalMs: 15 * 60 * 1000, maxRequests: 20 });
export const apiLimiter = rateLimit({ intervalMs: 60 * 1000, maxRequests: 60 });
