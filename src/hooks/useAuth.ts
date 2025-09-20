'use client'

import { useCallback, useMemo } from 'react'
import { useSupabaseAuth } from '../components/auth/SupabaseAuthProvider'

// Enhanced useAuth hook with Supabase integration
export function useAuth() {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  } = useSupabaseAuth()

  // Enhanced login with better error handling
  const login = useCallback(async (email: string, password: string) => {
    try {
      await signIn(email, password)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [signIn])

  // Enhanced register with metadata support
  const register = useCallback(async (userData: {
    name: string
    email: string
    password: string
    password_confirmation?: string
  }) => {
    try {
      await signUp(userData.email, userData.password, {
        full_name: userData.name,
      })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }, [signUp])

  // Enhanced logout
  const logout = useCallback(async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }, [signOut])

  // Password reset functionality
  const forgotPassword = useCallback(async (email: string) => {
    try {
      await resetPassword(email)
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }, [resetPassword])

  // Profile update functionality
  const updateUserProfile = useCallback(async (updates: {
    name?: string
    avatar_url?: string
    website?: string
  }) => {
    try {
      await updateProfile({
        full_name: updates.name,
        avatar_url: updates.avatar_url,
        website: updates.website,
      })
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }, [updateProfile])

  // Computed values
  const isLoading = useMemo(() => loading, [loading])
  const hasError = useMemo(() => !!error, [error])
  const getErrorMessage = useMemo(() => error?.message || '', [error])

  // Session management
  const isSessionExpiring = useMemo(() => {
    // Supabase handles session refresh automatically
    return false
  }, [])

  const sessionTimeRemaining = useMemo(() => {
    // Supabase handles session management
    return 0
  }, [])

  // Validation utilities
  const validateAuthState = useCallback(() => {
    return {
      isValid: isAuthenticated && !!user,
      hasUser: !!user,
      hasValidSession: isAuthenticated,
    }
  }, [isAuthenticated, user])

  // Retry functionality
  const retryOperation = useCallback(async () => {
    clearError()
  }, [clearError])

  // Accessibility helpers
  const getAriaAttributes = useCallback(() => ({
    'aria-live': 'polite',
    'aria-busy': loading,
    'aria-label': loading ? 'Loading authentication status' : 'Authentication status',
    role: 'status',
  }), [loading])

  return {
    // Core auth state
    isAuthenticated,
    user,
    loading: isLoading,
    error,

    // Enhanced methods
    login,
    register,
    logout,
    forgotPassword,
    updateUserProfile,

    // State management
    hasError,
    getErrorMessage,
    clearError,
    retryOperation,

    // Validation
    validateAuthState,

    // Session management
    isSessionExpiring,
    sessionTimeRemaining,

    // Accessibility
    getAriaAttributes,

    // Legacy compatibility (for backward compatibility)
    isLoading,
  }
}

// Legacy export for backward compatibility
export default useAuth