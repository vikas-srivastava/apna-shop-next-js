/**
 * Node.js runtime only security utilities
 * These utilities require Node.js crypto module and are not compatible with Edge Runtime
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

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