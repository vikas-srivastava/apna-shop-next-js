/**
 * Security headers middleware for Next.js
 * Adds comprehensive security headers to all responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityHeaders, RequestUtils, AuditUtils } from '@/lib/security-edge';

export interface SecurityMiddlewareOptions {
    enableCSP?: boolean;
    enableHSTS?: boolean;
    enableCORS?: boolean;
    allowedOrigins?: string[];
    enableRateLimit?: boolean;
    blockedIPs?: string[];
}

/**
 * Security middleware class
 */
export class SecurityMiddleware {
    private options: Required<SecurityMiddlewareOptions>;

    constructor(options: SecurityMiddlewareOptions = {}) {
        this.options = {
            enableCSP: options.enableCSP ?? true,
            enableHSTS: options.enableHSTS ?? true,
            enableCORS: options.enableCORS ?? true,
            allowedOrigins: options.allowedOrigins || [],
            enableRateLimit: options.enableRateLimit ?? true,
            blockedIPs: options.blockedIPs || [],
        };
    }

    /**
     * Apply security middleware to a request
     */
    async applySecurity(request: NextRequest): Promise<NextResponse | null> {
        // Check if IP is blocked
        const clientIP = this.getClientIP(request);
        if (RequestUtils.isIPBlocked(clientIP, this.options.blockedIPs)) {
            AuditUtils.logSecurityEvent('blocked_ip_access', {
                ip: clientIP,
                path: request.nextUrl.pathname,
                userAgent: request.headers.get('user-agent')
            }, 'warn');

            return new NextResponse('Access denied', {
                status: 403,
                headers: { 'Content-Type': 'text/plain' }
            });
        }

        // Validate request size
        const contentLength = parseInt(request.headers.get('content-length') || '0');
        if (!RequestUtils.validateRequestSize(contentLength)) {
            AuditUtils.logSecurityEvent('request_too_large', {
                ip: clientIP,
                contentLength,
                path: request.nextUrl.pathname
            }, 'warn');

            return new NextResponse('Request too large', {
                status: 413,
                headers: { 'Content-Type': 'text/plain' }
            });
        }

        // Check for suspicious headers
        const suspiciousHeaders = this.detectSuspiciousHeaders(request.headers);
        if (suspiciousHeaders.length > 0) {
            AuditUtils.logSecurityEvent('suspicious_headers', {
                ip: clientIP,
                headers: suspiciousHeaders,
                path: request.nextUrl.pathname
            }, 'warn');
        }

        return null; // Continue with the request
    }

    /**
     * Add security headers to response
     */
    addSecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
        const headers = SecurityHeaders.getSecurityHeaders();

        // Add headers to response
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        // Add CORS headers if enabled
        if (this.options.enableCORS) {
            const origin = request.headers.get('origin');
            const corsHeaders = SecurityHeaders.getCORSHeaders(origin || undefined);

            Object.entries(corsHeaders).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }

        // Remove CSP if disabled
        if (!this.options.enableCSP) {
            response.headers.delete('Content-Security-Policy');
        }

        // Remove HSTS if disabled
        if (!this.options.enableHSTS) {
            response.headers.delete('Strict-Transport-Security');
        }

        // Add custom headers
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Add server information (remove in production for security)
        if (process.env.NODE_ENV !== 'production') {
            response.headers.set('X-Powered-By', 'Next.js');
        } else {
            response.headers.delete('X-Powered-By');
        }

        return response;
    }

    /**
     * Get client IP address
     */
    private getClientIP(request: NextRequest): string {
        const forwarded = request.headers.get('x-forwarded-for');
        const realIP = request.headers.get('x-real-ip');
        const clientIP = request.headers.get('x-client-ip');

        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }

        if (realIP) {
            return realIP;
        }

        if (clientIP) {
            return clientIP;
        }

        return 'unknown';
    }

    /**
     * Detect suspicious headers
     */
    private detectSuspiciousHeaders(headers: Headers): string[] {
        const suspicious: string[] = [];
        const suspiciousPatterns = [
            /^x-forwarded-for$/i,
            /^x-real-ip$/i,
            /^x-client-ip$/i,
            /^x-forwarded-host$/i,
            /^x-forwarded-proto$/i,
        ];

        for (const [key] of headers.entries()) {
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(key)) {
                    suspicious.push(key);
                    break;
                }
            }
        }

        return suspicious;
    }
}

/**
 * Default security middleware instance
 */
const defaultSecurityMiddleware = new SecurityMiddleware({
    enableCSP: true,
    enableHSTS: process.env.NODE_ENV === 'production',
    enableCORS: true,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
    enableRateLimit: true,
    blockedIPs: process.env.BLOCKED_IPS?.split(',') || [],
});

/**
 * Security middleware function for Next.js
 */
export async function withSecurity(
    request: NextRequest,
    options?: SecurityMiddlewareOptions
): Promise<NextResponse | null> {
    const middleware = options ? new SecurityMiddleware(options) : defaultSecurityMiddleware;
    return middleware.applySecurity(request);
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(
    response: NextResponse,
    request: NextRequest,
    options?: SecurityMiddlewareOptions
): NextResponse {
    const middleware = options ? new SecurityMiddleware(options) : defaultSecurityMiddleware;
    return middleware.addSecurityHeaders(response, request);
}