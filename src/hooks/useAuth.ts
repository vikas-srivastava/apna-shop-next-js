import { useEffect, useState } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    customerId: string | null;
    loading: boolean;
}

/**
 * Custom hook to check authentication status
 * @returns AuthState - Authentication status, customer ID, and loading state
 */
export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        customerId: null,
        loading: true
    });

    useEffect(() => {
        // Check if customer_id exists in localStorage
        const customerId = localStorage.getItem('customer_id');

        setAuthState({
            isAuthenticated: !!customerId,
            customerId,
            loading: false
        });
    }, []);

    return authState;
}

/**
 * Helper function to check if user is authenticated
 * @returns boolean - True if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('customer_id');
}