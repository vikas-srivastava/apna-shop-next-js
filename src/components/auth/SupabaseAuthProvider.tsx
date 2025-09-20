'use client'

import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

// Enhanced Auth Context Types
interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  full_name?: string
  website?: string
  created_at?: string
  updated_at?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
  error: AuthError | null
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string; website?: string }) => Promise<void>
  clearError: () => void
}

// Auth configuration
const AUTH_CONFIG = {
  redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
}

// Logger for auth operations
class AuthLogger {
  static info(message: string, data?: unknown) {
    console.log(`[SupabaseAuth] ${message}`, data || '')
  }

  static warn(message: string, data?: unknown) {
    console.warn(`[SupabaseAuth] ${message}`, data || '')
  }

  static error(message: string, data?: unknown) {
    console.error(`[SupabaseAuth] ${message}`, data || '')
  }
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)

export function useSupabaseAuth(): AuthContextType {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

export default function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  })

  // Transform Supabase user to our AuthUser format
  const transformUser = useCallback((user: User | null): AuthUser | null => {
    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      full_name: user.user_metadata?.full_name,
      website: user.user_metadata?.website,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }, [])

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const transformedUser = transformUser(data.user)
        setAuthState({
          isAuthenticated: true,
          user: transformedUser,
          loading: false,
          error: null,
        })
        AuthLogger.info('User signed in successfully', { email })
      }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      AuthLogger.error('Sign in failed', error)
      throw error
    }
  }, [transformUser])

  // Sign up with email and password
  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error

      if (data.user) {
        const transformedUser = transformUser(data.user)
        setAuthState({
          isAuthenticated: true,
          user: transformedUser,
          loading: false,
          error: null,
        })
        AuthLogger.info('User signed up successfully', { email })
      }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      AuthLogger.error('Sign up failed', error)
      throw error
    }
  }, [transformUser])

  // Sign out
  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      })
      AuthLogger.info('User signed out successfully')
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      AuthLogger.error('Sign out failed', error)
      throw error
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: AUTH_CONFIG.redirectTo,
      })
      if (error) throw error
      AuthLogger.info('Password reset email sent', { email })
    } catch (error) {
      AuthLogger.error('Password reset failed', error)
      throw error
    }
  }, [])

  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      AuthLogger.info('Password updated successfully')
    } catch (error) {
      AuthLogger.error('Password update failed', error)
      throw error
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (updates: {
    full_name?: string
    avatar_url?: string
    website?: string
  }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      })
      if (error) throw error

      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }))

      AuthLogger.info('Profile updated successfully')
    } catch (error) {
      AuthLogger.error('Profile update failed', error)
      throw error
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          const transformedUser = transformUser(session.user)
          setAuthState({
            isAuthenticated: true,
            user: transformedUser,
            loading: false,
            error: null,
          })
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        AuthLogger.error('Failed to get initial session', error)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        AuthLogger.info('Auth state changed', { event, userId: session?.user?.id })

        if (session?.user) {
          const transformedUser = transformUser(session.user)
          setAuthState({
            isAuthenticated: true,
            user: transformedUser,
            loading: false,
            error: null,
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [transformUser])

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  }

  return (
    <SupabaseAuthContext.Provider value={contextValue}>
      <div
        role="status"
        aria-live="polite"
        aria-label={authState.loading ? "Loading authentication status" : "Authentication status loaded"}
        className="sr-only"
      >
        {authState.loading && "Loading..."}
        {authState.error && `Error: ${authState.error.message}`}
      </div>
      {children}
    </SupabaseAuthContext.Provider>
  )
}