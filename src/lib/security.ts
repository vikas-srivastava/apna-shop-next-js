/**
 * Security utilities for authentication, token management, and data protection
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

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
 * JWT token utilities
 */
export class JWTUtils {
    /**
     * Generate access token
     */
    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'apna-shop',
            audience: 'apna-shop-users'
        });
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
            issuer: 'apna-shop',
            audience: 'apna-shop-refresh'
        });
    }

    /**
     * Verify and decode token
     */
    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET, {
                issuer: 'apna-shop',
                audience: ['apna-shop-users', 'apna-shop-refresh']
            });
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Decode token without verification (for expired tokens)
     */
    static decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Invalid token format');
        }
    }

    /**
     * Check if token is expired
     */
    static isTokenExpired(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded.exp) return false;
            return Date.now() >= decoded.exp * 1000;
        } catch {
            return true;
        }
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader: string | null): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}

/**
 * Password security utilities
 */
export class PasswordUtils {
    /**
     * Hash password using bcrypt-like approach with crypto
     * Note: In production, use bcrypt or argon2
     */
    static async hashPassword(password: string): Promise<string> {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }

    /**
     * Verify password against hash
     */
    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const [salt, hash] = hashedPassword.split(':');
        if (!salt || !hash) return false;

        const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
    }

    /**
     * Generate secure random password
     */
    static generateSecurePassword(length: number = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            password += chars[randomIndex];
        }

        return password;
    }
}

/**
 * CSRF protection utilities
 */
export class CSRFUtils {
    /**
     * Generate CSRF token
     */
    static generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Verify CSRF token
     */
    static verifyToken(sessionToken: string, providedToken: string): boolean {
        if (!sessionToken || !providedToken) return false;

        try {
            return crypto.timingSafeEqual(
                Buffer.from(sessionToken, 'hex'),
                Buffer.from(providedToken, 'hex')
            );
        } catch {
            return false;
        }
    }
}

/**
 * Encryption utilities for sensitive data
 */
export class EncryptionUtils {
    private static algorithm = 'aes-256-cbc';
    private static keyLength = 32;
    private static ivLength = 16;

    /**
     * Encrypt data using AES-256-CBC
     */
    static encrypt(text: string, key?: string): string {
        const encryptionKey = key || process.env.ENCRYPTION_KEY;
        if (!encryptionKey) throw new Error('Encryption key not configured');

        const keyBuffer = crypto.scryptSync(encryptionKey, 'salt', this.keyLength);
        const iv = crypto.randomBytes(this.ivLength);

        const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Return format: iv:encryptedData
        return `${iv.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypt data
     */
    static decrypt(encryptedText: string, key?: string): string {
        const encryptionKey = key || process.env.ENCRYPTION_KEY;
        if (!encryptionKey) throw new Error('Encryption key not configured');

        const parts = encryptedText.split(':');
        if (parts.length !== 2) throw new Error('Invalid encrypted data format');

        const [ivHex, encrypted] = parts;

        const keyBuffer = crypto.scryptSync(encryptionKey, 'salt', this.keyLength);
        const iv = Buffer.from(ivHex, 'hex');

        const decipher = crypto.createDecipheriv(this.algorithm, keyBuffer, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

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
        console.log(`[SECURITY-${level.toUpperCase()}]`, JSON.stringify(logEntry));
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

// Clean up rate limit store periodically
setInterval(() => {
    RequestUtils.cleanupRateLimitStore();
}, 60000); // Clean up every minute