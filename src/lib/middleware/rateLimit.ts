import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 5, // 5 requests
  windowMs: 60 * 1000, // per minute
};

// In-memory store for rate limiting
// Note: In production, use Redis or similar for distributed systems
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig = defaultConfig) {
  return async function rateLimitMiddleware(req: Request | NextRequest): Promise<NextResponse | RateLimitInfo | null> {
    // Get client IP - fallback to header or anonymous
    let clientIp = 'anonymous';
    
    if ('ip' in req && typeof req.ip === 'string') {
      clientIp = req.ip;
    } else {
      const forwardedFor = req.headers.get('x-forwarded-for');
      if (forwardedFor) {
        const ips = forwardedFor.split(',');
        if (ips[0]) {
          clientIp = ips[0].trim();
        }
      }
    }

    const now = Date.now();

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    // Get or create rate limit info for this IP
    const rateLimit = rateLimitStore.get(clientIp) || {
      count: 0,
      resetTime: now + config.windowMs,
    };

    // Reset if outside window
    if (rateLimit.resetTime < now) {
      rateLimit.count = 0;
      rateLimit.resetTime = now + config.windowMs;
    }

    rateLimit.count++;
    rateLimitStore.set(clientIp, rateLimit);

    // Check if over limit
    if (rateLimit.count > config.maxRequests) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please try again later',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Return rate limit info instead of modifying the response
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests - rateLimit.count,
      reset: rateLimit.resetTime
    };
  };
} 