'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects unauthenticated users to the login page
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuthContext();

    useEffect(() => {
        // Check if user is authenticated
        if (!loading && !isAuthenticated) {
            // Build return URL and redirect to login
            const returnUrl = typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : '/';
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
    }, [isAuthenticated, loading, router]);

    // If user is authenticated, render children
    // Otherwise, render nothing while redirecting
    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : null;
}