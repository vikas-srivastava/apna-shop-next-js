'use client';

import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { registerUser, loginUser, getUserProfile, ApiResponse } from '../../lib/api';
import { User } from '../../lib/types';

// Enhanced Auth Context Types
interface AuthUser {
    id: string;
    name: string;
    email: string;
    customer_id: string;
    role?: string;
    tenant_id?: string;
}

interface AuthError {
    code: string;
    message: string;
    userMessage: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    error: AuthError | null;
    retryCount: number;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: {
        name: string;
        email: string;
        password: string;
        gender: 'male' | 'female';
        password_confirmation: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    clearError: () => void;
    retryLastOperation: () => Promise<void>;
}

// Auth configuration
const AUTH_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000,
    tokenRefreshInterval: 15 * 60 * 1000, // 15 minutes
    storageKeys: {
        user: 'auth_user',
        token: 'auth_token',
        customerId: 'customer_id',
        lastLogin: 'last_login'
    }
};

// Logger for auth operations
class AuthLogger {
    static info(message: string, data?: unknown) {
        console.log(`[AuthProvider] ${message}`, data || '');
    }

    static warn(message: string, data?: unknown) {
        console.warn(`[AuthProvider] ${message}`, data || '');
    }

    static error(message: string, data?: unknown) {
        console.error(`[AuthProvider] ${message}`, data || '');
    }
}

// Error mapper for user-friendly messages
const getUserFriendlyError = (error: string): AuthError => {
    const errorMappings: Record<string, AuthError> = {
        'Invalid credentials': {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid credentials',
            userMessage: 'The email or password you entered is incorrect. Please try again.'
        },
        'User not found': {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            userMessage: 'No account found with this email address. Please check your email or register a new account.'
        },
        'Email already exists': {
            code: 'EMAIL_EXISTS',
            message: 'Email already exists',
            userMessage: 'An account with this email already exists. Please try logging in instead.'
        },
        'Network error': {
            code: 'NETWORK_ERROR',
            message: 'Network error',
            userMessage: 'Unable to connect to the server. Please check your internet connection and try again.'
        },
        'Token expired': {
            code: 'TOKEN_EXPIRED',
            message: 'Token expired',
            userMessage: 'Your session has expired. Please log in again.'
        }
    };

    return errorMappings[error] || {
        code: 'UNKNOWN_ERROR',
        message: error,
        userMessage: 'An unexpected error occurred. Please try again later.'
    };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null,
        retryCount: 0,
    });

    // Persist auth state to localStorage
    const persistAuthState = useCallback((state: Partial<AuthState>) => {
        try {
            if (state.user) {
                localStorage.setItem(AUTH_CONFIG.storageKeys.user, JSON.stringify(state.user));
                localStorage.setItem(AUTH_CONFIG.storageKeys.customerId, state.user.customer_id);
                localStorage.setItem(AUTH_CONFIG.storageKeys.lastLogin, new Date().toISOString());
            }
            if (state.isAuthenticated === false) {
                localStorage.removeItem(AUTH_CONFIG.storageKeys.user);
                localStorage.removeItem(AUTH_CONFIG.storageKeys.customerId);
                localStorage.removeItem(AUTH_CONFIG.storageKeys.token);
            }
        } catch (error) {
            AuthLogger.error('Failed to persist auth state', error);
        }
    }, []);

    // Load auth state from localStorage
    const loadPersistedState = useCallback(() => {
        try {
            const userData = localStorage.getItem(AUTH_CONFIG.storageKeys.user);
            const lastLogin = localStorage.getItem(AUTH_CONFIG.storageKeys.lastLogin);

            if (userData && lastLogin) {
                const user = JSON.parse(userData) as AuthUser;
                const loginTime = new Date(lastLogin);
                const now = new Date();
                const timeDiff = now.getTime() - loginTime.getTime();

                // Check if session is still valid (24 hours)
                if (timeDiff < 24 * 60 * 60 * 1000) {
                    setAuthState(prev => ({
                        ...prev,
                        isAuthenticated: true,
                        user,
                        loading: false,
                    }));
                    AuthLogger.info('Restored auth state from localStorage');
                    return;
                } else {
                    // Session expired, clear storage
                    localStorage.removeItem(AUTH_CONFIG.storageKeys.user);
                    localStorage.removeItem(AUTH_CONFIG.storageKeys.customerId);
                    localStorage.removeItem(AUTH_CONFIG.storageKeys.token);
                    AuthLogger.info('Cleared expired auth session');
                }
            }
        } catch (error) {
            AuthLogger.error('Failed to load persisted auth state', error);
        }

        setAuthState(prev => ({ ...prev, loading: false }));
    }, []);

    // Retry mechanism with exponential backoff
    const retryOperation = useCallback(<T,>(
        operation: () => Promise<T>,
        maxRetries = AUTH_CONFIG.maxRetries
    ): Promise<T> => {
        return (async () => {
            let lastError: Error;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await operation();
                } catch (error) {
                    lastError = error as Error;
                    AuthLogger.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1})`, error);

                    if (attempt < maxRetries) {
                        const delay = AUTH_CONFIG.retryDelay * Math.pow(2, attempt);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }

            throw lastError!;
        })();
    }, []);

    // Login function with retry logic
    const login = useCallback(async (email: string, password: string) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await retryOperation(() =>
                loginUser({ email, password })
            );

            if (response.success && response.data) {
                const user: AuthUser = {
                    id: response.data.user,
                    name: email.split('@')[0], // Temporary name from email
                    email,
                    customer_id: response.data.customer_id,
                };

                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                    error: null,
                    retryCount: 0,
                });

                persistAuthState({ user, isAuthenticated: true });
                AuthLogger.info('User logged in successfully', { email });
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            const authError = getUserFriendlyError((error as Error).message);
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: authError,
                retryCount: prev.retryCount + 1,
            }));
            AuthLogger.error('Login failed', error);
            throw error;
        }
    }, [retryOperation, persistAuthState]);

    // Register function with retry logic
    const register = useCallback(async (userData: {
        name: string;
        email: string;
        password: string;
        gender: 'male' | 'female';
        password_confirmation: string;
    }) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await retryOperation(() =>
                registerUser(userData)
            );

            if (response.success && response.data) {
                const user: AuthUser = {
                    id: response.data.user,
                    name: userData.name,
                    email: userData.email,
                    customer_id: response.data.customer_id,
                };

                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                    error: null,
                    retryCount: 0,
                });

                persistAuthState({ user, isAuthenticated: true });
                AuthLogger.info('User registered successfully', { email: userData.email });
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            const authError = getUserFriendlyError((error as Error).message);
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: authError,
                retryCount: prev.retryCount + 1,
            }));
            AuthLogger.error('Registration failed', error);
            throw error;
        }
    }, [retryOperation, persistAuthState]);

    // Logout function
    const logout = useCallback(async () => {
        setAuthState(prev => ({ ...prev, loading: true }));

        try {
            // Note: Foundry API might not have a logout endpoint, so we'll just clear local state
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
                retryCount: 0,
            });

            persistAuthState({ isAuthenticated: false });
            AuthLogger.info('User logged out successfully');
        } catch (error) {
            AuthLogger.error('Logout error', error);
            // Even if logout fails, clear local state
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
                retryCount: 0,
            });
            persistAuthState({ isAuthenticated: false });
        }
    }, [persistAuthState]);

    // Refresh user profile
    const refreshProfile = useCallback(async () => {
        if (!authState.isAuthenticated || !authState.user) return;

        try {
            const response = await retryOperation(() => getUserProfile());

            if (response.success && response.data) {
                const updatedUser: AuthUser = {
                    ...authState.user,
                    role: response.data.role,
                    tenant_id: response.data.tenant_id,
                };

                setAuthState(prev => ({
                    ...prev,
                    user: updatedUser,
                }));

                persistAuthState({ user: updatedUser });
                AuthLogger.info('User profile refreshed');
            }
        } catch (error) {
            AuthLogger.error('Failed to refresh profile', error);
            // Don't set error state for profile refresh failures
        }
    }, [authState.isAuthenticated, authState.user, retryOperation, persistAuthState]);

    // Clear error
    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    // Retry last operation
    const retryLastOperation = useCallback(async () => {
        // This would need to be implemented based on the last operation type
        // For now, just clear the error
        clearError();
    }, [clearError]);

    // Initialize auth state on mount
    useEffect(() => {
        loadPersistedState();
    }, [loadPersistedState]);

    // Set up token refresh interval
    useEffect(() => {
        if (authState.isAuthenticated) {
            const interval = setInterval(() => {
                refreshProfile();
            }, AUTH_CONFIG.tokenRefreshInterval);

            return () => clearInterval(interval);
        }
    }, [authState.isAuthenticated, refreshProfile]);

    const contextValue: AuthContextType = {
        ...authState,
        login,
        register,
        logout,
        refreshProfile,
        clearError,
        retryLastOperation,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            <div
                role="status"
                aria-live="polite"
                aria-label={authState.loading ? "Loading authentication status" : "Authentication status loaded"}
                className="sr-only"
            >
                {authState.loading && "Loading..."}
                {authState.error && `Error: ${authState.error.userMessage}`}
            </div>
            {children}
        </AuthContext.Provider>
    );
}