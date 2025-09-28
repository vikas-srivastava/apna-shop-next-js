/**
 * Secure error handling utilities
 * Prevents information leakage through error messages
 */

import { NextResponse } from 'next/server';
import { AuditUtils } from './security';

export interface SecureError {
    message: string;
    statusCode: number;
    code?: string;
    details?: Record<string, any>;
}

/**
 * Error codes for secure error responses
 */
export const ERROR_CODES = {
    // Authentication errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    UNAUTHORIZED: 'UNAUTHORIZED',

    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Business logic errors
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',

    // System errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    REQUEST_TOO_LARGE: 'REQUEST_TOO_LARGE',

    // Payment errors
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_DECLINED: 'PAYMENT_DECLINED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
} as const;

type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Maps error codes to HTTP status codes and user-friendly messages
 */
const ERROR_MAPPING: Record<ErrorCode, { statusCode: number; message: string }> = {
    [ERROR_CODES.INVALID_CREDENTIALS]: { statusCode: 401, message: 'Invalid credentials' },
    [ERROR_CODES.ACCOUNT_LOCKED]: { statusCode: 423, message: 'Account is temporarily locked' },
    [ERROR_CODES.TOKEN_EXPIRED]: { statusCode: 401, message: 'Session expired' },
    [ERROR_CODES.TOKEN_INVALID]: { statusCode: 401, message: 'Invalid session' },
    [ERROR_CODES.UNAUTHORIZED]: { statusCode: 401, message: 'Authentication required' },

    [ERROR_CODES.VALIDATION_ERROR]: { statusCode: 400, message: 'Invalid input data' },
    [ERROR_CODES.INVALID_INPUT]: { statusCode: 400, message: 'Invalid input provided' },
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: { statusCode: 400, message: 'Required field is missing' },

    [ERROR_CODES.RESOURCE_NOT_FOUND]: { statusCode: 404, message: 'Resource not found' },
    [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: { statusCode: 409, message: 'Resource already exists' },
    [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: { statusCode: 403, message: 'Insufficient permissions' },
    [ERROR_CODES.OPERATION_NOT_ALLOWED]: { statusCode: 403, message: 'Operation not allowed' },

    [ERROR_CODES.INTERNAL_ERROR]: { statusCode: 500, message: 'Internal server error' },
    [ERROR_CODES.SERVICE_UNAVAILABLE]: { statusCode: 503, message: 'Service temporarily unavailable' },
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]: { statusCode: 429, message: 'Too many requests' },
    [ERROR_CODES.REQUEST_TOO_LARGE]: { statusCode: 413, message: 'Request too large' },

    [ERROR_CODES.PAYMENT_FAILED]: { statusCode: 402, message: 'Payment failed' },
    [ERROR_CODES.PAYMENT_DECLINED]: { statusCode: 402, message: 'Payment declined' },
    [ERROR_CODES.INSUFFICIENT_FUNDS]: { statusCode: 402, message: 'Insufficient funds' },
};

/**
 * Secure error handler class
 */
export class SecureErrorHandler {
    /**
     * Create a secure error response
     */
    static createError(
        code: ErrorCode,
        details?: Record<string, any>,
        logDetails?: Record<string, any>
    ): SecureError {
        const mapping = ERROR_MAPPING[code];

        // Log detailed error information for debugging (server-side only)
        if (logDetails) {
            console.error(`Secure Error [${code}]:`, {
                ...logDetails,
                timestamp: new Date().toISOString(),
                userAgent: details?.userAgent,
                ip: details?.ip,
            });

            // Log security events for certain error types
            if (this.isSecurityRelatedError(code)) {
                AuditUtils.logSecurityEvent('security_error', {
                    code,
                    ...logDetails,
                    ip: details?.ip,
                    userAgent: details?.userAgent,
                }, 'warn');
            }
        }

        return {
            message: mapping.message,
            statusCode: mapping.statusCode,
            code,
            details: process.env.NODE_ENV === 'development' ? details : undefined,
        };
    }

    /**
     * Check if error code is security-related
     */
    private static isSecurityRelatedError(code: ErrorCode): boolean {
        const securityCodes = [
            ERROR_CODES.INVALID_CREDENTIALS,
            ERROR_CODES.ACCOUNT_LOCKED,
            ERROR_CODES.TOKEN_EXPIRED,
            ERROR_CODES.TOKEN_INVALID,
            ERROR_CODES.UNAUTHORIZED,
            ERROR_CODES.RATE_LIMIT_EXCEEDED,
            ERROR_CODES.INSUFFICIENT_PERMISSIONS,
        ];

        return securityCodes.includes(code);
    }

    /**
     * Handle unknown errors securely
     */
    static handleUnknownError(
        error: unknown,
        context?: Record<string, any>
    ): SecureError {
        // Log the actual error details for debugging
        console.error('Unhandled error:', {
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            } : error,
            context,
            timestamp: new Date().toISOString(),
        });

        // Return generic error to prevent information leakage
        return this.createError(
            ERROR_CODES.INTERNAL_ERROR,
            undefined,
            {
                originalError: error instanceof Error ? error.message : 'Unknown error',
                ...context,
            }
        );
    }

    /**
     * Create NextResponse from SecureError
     */
    static toNextResponse(error: SecureError): NextResponse {
        const responseBody = {
            success: false,
            message: error.message,
            ...(error.code && { code: error.code }),
            ...(process.env.NODE_ENV === 'development' && error.details && { details: error.details }),
        };

        return NextResponse.json(responseBody, {
            status: error.statusCode,
        });
    }

    /**
     * Wrap API route handler with secure error handling
     */
    static async withErrorHandler<T>(
        handler: () => Promise<T>,
        context?: Record<string, any>
    ): Promise<T | NextResponse> {
        try {
            return await handler();
        } catch (error) {
            if (error instanceof SecureError) {
                return this.toNextResponse(error);
            }

            const secureError = this.handleUnknownError(error, context);
            return this.toNextResponse(secureError);
        }
    }
}

/**
 * Custom error classes for different error types
 */
export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends Error {
    constructor(message: string = 'Insufficient permissions') {
        super(message);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends Error {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`);
        this.name = 'NotFoundError';
    }
}

/**
 * Convert common error types to secure errors
 */
export function convertToSecureError(error: unknown): SecureError {
    if (error instanceof ValidationError) {
        return SecureErrorHandler.createError(
            ERROR_CODES.VALIDATION_ERROR,
            { field: error.field },
            { originalMessage: error.message, field: error.field }
        );
    }

    if (error instanceof AuthenticationError) {
        return SecureErrorHandler.createError(
            ERROR_CODES.UNAUTHORIZED,
            undefined,
            { originalMessage: error.message }
        );
    }

    if (error instanceof AuthorizationError) {
        return SecureErrorHandler.createError(
            ERROR_CODES.INSUFFICIENT_PERMISSIONS,
            undefined,
            { originalMessage: error.message }
        );
    }

    if (error instanceof NotFoundError) {
        return SecureErrorHandler.createError(
            ERROR_CODES.RESOURCE_NOT_FOUND,
            undefined,
            { originalMessage: error.message }
        );
    }

    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes('Too many requests')) {
        return SecureErrorHandler.createError(
            ERROR_CODES.RATE_LIMIT_EXCEEDED,
            undefined,
            { originalMessage: error.message }
        );
    }

    // Default to internal error
    return SecureErrorHandler.handleUnknownError(error);
}