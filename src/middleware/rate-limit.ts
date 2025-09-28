/**
 * Rate limiting middleware for Next.js
 * Implements different rate limits for different endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { RequestUtils, RATE_LIMITS, AuditUtils } from '@/lib/security';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}

/**
 * Rate limiting middleware class
 */
export class RateLimitMiddleware {
    /**
     * Check rate limit for a request
     */
    static checkRateLimit(
        request: NextRequest,
        configKey: keyof typeof RATE_LIMITS
    ): RateLimitResult {
        const config = RATE_LIMITS[configKey];
        const ip = this.getClientIP(request);
        const identifier = `${configKey}:${ip}`;

        const result = RequestUtils.checkRateLimit(identifier, config);

        if (!result.allowed) {
            // Log rate limit violation
            AuditUtils.logSecurityEvent('rate_limit_exceeded', {
                ip,
                endpoint: request.nextUrl.pathname,
                userAgent: request.headers.get('user-agent'),
                configKey
            }, 'warn');
        }

        return result;
    }

    /**
     * Get client IP address
     */
    private static getClientIP(request: NextRequest): string {
        // Try different headers for IP detection
        const forwarded = request.headers.get('x-forwarded-for');
        const realIP = request.headers.get('x-real-ip');
        const clientIP = request.headers.get('x-client-ip');

        if (forwarded) {
            // Take the first IP if there are multiple
            return forwarded.split(',')[0].trim();
        }

        if (realIP) {
            return realIP;
        }

        if (clientIP) {
            return clientIP;
        }

        // Fallback to a default identifier
        return 'unknown';
    }

    /**
     * Create rate limit response
     */
    static createRateLimitResponse(result: RateLimitResult): NextResponse {
        const response = NextResponse.json(
            {
                success: false,
                message: 'Too many requests',
                error: 'RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
            },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
                    'X-RateLimit-Remaining': result.remaining.toString(),
                    'X-RateLimit-Reset': result.resetTime.toString(),
                }
            }
        );

        return response;
    }

    /**
     * Apply rate limiting to a request
     */
    static async applyRateLimit(
        request: NextRequest,
        configKey: keyof typeof RATE_LIMITS = 'api'
    ): Promise<NextResponse | null> {
        const result = this.checkRateLimit(request, configKey);

        if (!result.allowed) {
            return this.createRateLimitResponse(result);
        }

        return null; // Continue with the request
    }

    /**
     * Get rate limit config based on pathname
     */
    static getConfigForPath(pathname: string): keyof typeof RATE_LIMITS {
        if (pathname.startsWith('/api/auth/')) {
            return 'auth';
        }

        if (pathname.startsWith('/api/payments/') || pathname.includes('/create-razorpay-order')) {
            return 'payment';
        }

        return 'api';
    }
}

/**
 * Rate limiting middleware function for Next.js
 */
export async function withRateLimit(
    request: NextRequest,
    configKey?: keyof typeof RATE_LIMITS
): Promise<NextResponse | null> {
    const key = configKey || RateLimitMiddleware.getConfigForPath(request.nextUrl.pathname);
    return RateLimitMiddleware.applyRateLimit(request, key);
}