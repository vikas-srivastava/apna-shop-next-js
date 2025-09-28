/**
 * Input validation and sanitization utilities
 * Provides comprehensive validation for user inputs to prevent common security vulnerabilities
 */

import DOMPurify from 'isomorphic-dompurify';

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password strength requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// SQL injection patterns to detect
const SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(\\x3B)|(;))/i,
    /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)/gi
];

// XSS patterns
const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
];

export interface ValidationResult {
    valid: boolean;
    error?: string;
    sanitized?: string;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }

    const trimmed = email.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Email cannot be empty' };
    }

    if (trimmed.length > 254) {
        return { valid: false, error: 'Email is too long' };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, sanitized: trimmed.toLowerCase() };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` };
    }

    if (password.length > 128) {
        return { valid: false, error: 'Password is too long' };
    }

    if (!PASSWORD_REGEX.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        };
    }

    return { valid: true };
}

/**
 * Validates password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmation: string): ValidationResult {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return passwordValidation;
    }

    if (password !== confirmation) {
        return { valid: false, error: 'Passwords do not match' };
    }

    return { valid: true };
}

/**
 * Sanitizes text input to prevent XSS
 */
export function sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // First, check for obvious XSS patterns
    for (const pattern of XSS_PATTERNS) {
        if (pattern.test(input)) {
            throw new Error('Potentially malicious content detected');
        }
    }

    // Use DOMPurify for comprehensive sanitization
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: []
    }).trim();
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitizeInput(input: string, maxLength: number = 1000): ValidationResult {
    if (!input || typeof input !== 'string') {
        return { valid: false, error: 'Input is required' };
    }

    if (input.length > maxLength) {
        return { valid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
    }

    try {
        const sanitized = sanitizeText(input);
        return { valid: true, sanitized };
    } catch (error) {
        return { valid: false, error: 'Invalid input content' };
    }
}

/**
 * Validates name input
 */
export function validateName(name: string): ValidationResult {
    const result = validateAndSanitizeInput(name, 100);
    if (!result.valid) {
        return result;
    }

    // Additional name validation
    if (result.sanitized!.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters long' };
    }

    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(result.sanitized!)) {
        return { valid: false, error: 'Name contains invalid characters' };
    }

    return result;
}

/**
 * Validates phone number (basic validation)
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone || typeof phone !== 'string') {
        return { valid: true }; // Phone is optional
    }

    const trimmed = phone.trim();

    // Remove all non-digit characters for validation
    const digitsOnly = trimmed.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { valid: false, error: 'Phone number must be between 10 and 15 digits' };
    }

    return { valid: true, sanitized: digitsOnly };
}

/**
 * Validates quantity input
 */
export function validateQuantity(quantity: any, maxStock?: number): ValidationResult {
    if (quantity === null || quantity === undefined) {
        return { valid: false, error: 'Quantity is required' };
    }

    const num = Number(quantity);
    if (isNaN(num) || !Number.isInteger(num)) {
        return { valid: false, error: 'Quantity must be a valid integer' };
    }

    if (num < 1) {
        return { valid: false, error: 'Quantity must be at least 1' };
    }

    if (maxStock !== undefined && num > maxStock) {
        return { valid: false, error: `Quantity cannot exceed available stock (${maxStock})` };
    }

    return { valid: true, sanitized: num.toString() };
}

/**
 * Validates URL input
 */
export function validateUrl(url: string): ValidationResult {
    if (!url || typeof url !== 'string') {
        return { valid: false, error: 'URL is required' };
    }

    try {
        const urlObj = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
        }

        return { valid: true, sanitized: url };
    } catch {
        return { valid: false, error: 'Invalid URL format' };
    }
}

/**
 * Validates file upload
 */
export function validateFileUpload(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
} = {}): ValidationResult {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    if (!file) {
        return { valid: false, error: 'File is required' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File size exceeds maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)` };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    // Check for malicious file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileName = file.name.toLowerCase();
    for (const ext of dangerousExtensions) {
        if (fileName.endsWith(ext)) {
            return { valid: false, error: 'File type not allowed' };
        }
    }

    return { valid: true };
}

/**
 * Validates request size
 */
export function validateRequestSize(contentLength: number, maxSize: number = 10 * 1024 * 1024): ValidationResult {
    if (contentLength > maxSize) {
        return { valid: false, error: `Request size exceeds maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)` };
    }

    return { valid: true };
}

/**
 * General input sanitization for API requests
 */
export function sanitizeApiInput(input: any): any {
    if (typeof input === 'string') {
        return sanitizeText(input);
    }

    if (Array.isArray(input)) {
        return input.map(item => sanitizeApiInput(item));
    }

    if (input && typeof input === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = sanitizeApiInput(value);
        }
        return sanitized;
    }

    return input;
}