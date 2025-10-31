/**
 * Edge Runtime compatible security utilities
 * These utilities work in both Edge and Node.js runtimes
 */

// Rate limiting configuration
export interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

// Default rate limit configurations
export const RATE_LIMITS = {
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
    api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
    payment: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
    global: { windowMs: 60 * 1000, maxRequests: 1000 }, // 1000 requests per minute
} as const;

/**
 * Security headers utilities
 */
export class SecurityHeaders {
    /**
     * Get comprehensive security headers
     */
    static getSecurityHeaders(): Record<string, string> {
        return {
            // Prevent clickjacking
            'X-Frame-Options': 'DENY',
            // Prevent MIME type sniffing
            'X-Content-Type-Options': 'nosniff',
            // Enable XSS protection
            'X-XSS-Protection': '1; mode=block',
            // Referrer policy
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            // Permissions policy
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            // HSTS (HTTP Strict Transport Security)
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            // Content Security Policy
            'Content-Security-Policy': this.getCSPHeader(),
        };
    }

    /**
     * Get Content Security Policy header
     */
    private static getCSPHeader(): string {
        const csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "media-src 'self'",
            "object-src 'none'",
            "frame-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ];

        return csp.join('; ');
    }

    /**
     * Get CORS headers
     */
    static getCORSHeaders(origin?: string): Record<string, string> {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        const defaultOrigin = allowedOrigins.length > 0 ? allowedOrigins[0] : '*';

        const corsHeaders: Record<string, string> = {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400', // 24 hours
        };

        if (allowedOrigins.includes(origin || '')) {
            corsHeaders['Access-Control-Allow-Origin'] = origin!;
        } else {
            corsHeaders['Access-Control-Allow-Origin'] = defaultOrigin;
        }

        return corsHeaders;
    }
}

/**
 * Request validation utilities
 */
export class RequestUtils {
    /**
     * Validate request size
     */
    static validateRequestSize(contentLength: number, maxSize: number = 10 * 1024 * 1024): boolean {
        return contentLength <= maxSize;
    }

    /**
     * Sanitize request headers
     */
    static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
        const sanitized: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers)) {
            // Remove potentially dangerous headers
            if (!['host', 'connection', 'keep-alive', 'proxy-authenticate'].includes(key.toLowerCase())) {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Check if IP is blocked
     */
    static isIPBlocked(ip: string, blockedIPs: string[] = []): boolean {
        return blockedIPs.includes(ip);
    }

    /**
     * Rate limiting store (in-memory, use Redis in production)
     */
    private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

    /**
     * Check rate limit
     */
    static checkRateLimit(
        identifier: string,
        config: RateLimitConfig
    ): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now();
        const key = `${identifier}:${Math.floor(now / config.windowMs)}`;

        const record = this.rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs };

        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + config.windowMs;
        }

        record.count++;
        this.rateLimitStore.set(key, record);

        const allowed = record.count <= config.maxRequests;
        const remaining = Math.max(0, config.maxRequests - record.count);

        return {
            allowed,
            remaining,
            resetTime: record.resetTime
        };
    }

    /**
     * Clean up expired rate limit records
     */
    static cleanupRateLimitStore(): void {
        const now = Date.now();
        for (const [key, record] of this.rateLimitStore.entries()) {
            if (now > record.resetTime) {
                this.rateLimitStore.delete(key);
            }
        }
    }
}

/**
 * Audit logging utilities
 */
export class AuditUtils {
    /**
     * Log security event
     */
    static logSecurityEvent(
        event: string,
        details: Record<string, any>,
        level: 'info' | 'warn' | 'error' = 'info'
    ): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            level,
            details,
            ip: details.ip || 'unknown',
            userId: details.userId || 'anonymous'
        };

        // In production, send to logging service
        
    }

    /**
     * Log authentication attempt
     */
    static logAuthAttempt(email: string, success: boolean, ip: string, userAgent?: string): void {
        this.logSecurityEvent(
            success ? 'auth_success' : 'auth_failure',
            { email, ip, userAgent },
            success ? 'info' : 'warn'
        );
    }

    /**
     * Log suspicious activity
     */
    static logSuspiciousActivity(activity: string, details: Record<string, any>): void {
        this.logSecurityEvent('suspicious_activity', details, 'warn');
    }
}

// Rate limit store cleanup is manual - call RequestUtils.cleanupRateLimitStore() when needed