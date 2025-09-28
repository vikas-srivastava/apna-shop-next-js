/**
 * Next.js middleware for security and rate limiting
 * Combines security headers, rate limiting, and other security measures
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/middleware/rate-limit';
import { withSecurity, addSecurityHeaders } from '@/middleware/security';

// Use Edge runtime for better performance
export const runtime = 'edge';

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and Next.js internals
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/public/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Apply security checks
    const securityResponse = await withSecurity(request);
    if (securityResponse) {
        return addSecurityHeaders(securityResponse, request);
    }

    // Apply rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const rateLimitResponse = await withRateLimit(request);
        if (rateLimitResponse) {
            return addSecurityHeaders(rateLimitResponse, request);
        }
    }

    // Continue with the request and add security headers
    const response = NextResponse.next();
    return addSecurityHeaders(response, request);
}
