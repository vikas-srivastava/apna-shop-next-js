'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getSignInUrl, getSignUpUrl, signOut } from '@workos-inc/authkit-nextjs';

interface AuthContextType {
    isAuthenticated: boolean;
    customerId: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    customerId: null,
    loading: true,
});

export function useAuthContext() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthContextType>({
        isAuthenticated: false,
        customerId: null,
        loading: true,
    });

    useEffect(() => {
        // Check if customer_id exists in localStorage
        const customerId = localStorage.getItem('customer_id');

        setAuthState({
            isAuthenticated: !!customerId,
            customerId,
            loading: false,
        });
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}

export { getSignInUrl, getSignUpUrl, signOut };