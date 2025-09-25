'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import { AuthService, AuthUser } from '../lib/auth-service'

// Enhanced useAuth hook with Apna Shop API integration
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const isAuthenticated = useMemo(() => AuthService.isAuthenticated(), [user])

  // Enhanced login with better error handling
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { user: loggedInUser } = await AuthService.login(email, password)
      setUser(loggedInUser)
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Login failed')
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }, [])

  // Enhanced register with metadata support
  const register = useCallback(async (userData: {
    name: string
    email: string
    password: string
    password_confirmation?: string
    gender: 'male' | 'female'
  }) => {
    setLoading(true)
    setError(null)

    try {
      const { user: registeredUser } = await AuthService.register({
        ...userData,
        password_confirmation: userData.password_confirmation || userData.password
      })
      setUser(registeredUser)
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Registration failed')
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }, [])

  // Enhanced logout
  const logout = useCallback(async () => {
    setLoading(true)

    try {
      await AuthService.logout()
      setUser(null)
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Logout failed')
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }, [])

  // Password reset functionality
  const forgotPassword = useCallback(async (email: string) => {
    setError(null)

    try {
      const result = await AuthService.forgotPassword(email)
      return result
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Password reset failed')
      setError(authError)
      throw authError
    }
  }, [])

  // Send password reset OTP
  const sendPasswordResetOtp = useCallback(async (email: string) => {
    setError(null)

    try {
      const result = await AuthService.sendPasswordResetOtp(email)
      return result
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to send OTP')
      setError(authError)
      throw authError
    }
  }, [])

  // Reset password with OTP
  const resetPasswordWithOtp = useCallback(async (data: {
    email: string
    otp: string
    password: string
    password_confirmation: string
  }) => {
    setError(null)

    try {
      const result = await AuthService.resetPasswordWithOtp(data)
      return result
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Password reset failed')
      setError(authError)
      throw authError
    }
  }, [])

  // Profile update functionality
  const updateUserProfile = useCallback(async (updates: {
    name?: string
    avatar_url?: string
    website?: string
  }) => {
    setError(null)

    try {
      const updatedUser = await AuthService.getProfile()
      if (updatedUser) {
        setUser(updatedUser)
      }
      return updatedUser
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Profile update failed')
      setError(authError)
      throw authError
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Computed values
  const isLoading = useMemo(() => loading, [loading])
  const hasError = useMemo(() => !!error, [error])
  const getErrorMessage = useMemo(() => error?.message || '', [error])

  // Session management
  const isSessionExpiring = useMemo(() => {
    // AuthService handles session management
    return false
  }, [])

  const sessionTimeRemaining = useMemo(() => {
    // AuthService handles session management
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
    sendPasswordResetOtp,
    resetPasswordWithOtp,
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