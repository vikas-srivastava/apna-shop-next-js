/**
 * Unified Authentication Service
 * Provides a clean interface for authentication using Apna Shop API
 */

import { ApiService } from './api'

// AuthUser interface for unified auth service
export interface AuthUser {
    id: string
    name: string
    email: string
    customer_id: string
    role?: string
    tenant_id?: string
}

export class AuthService {
    private static readonly STORAGE_KEYS = {
        user: 'auth_user',
        token: 'auth_token',
        customerId: 'customer_id',
        lastLogin: 'last_login'
    }

    private static readonly AUTH_CONFIG = {
        maxRetries: 3,
        retryDelay: 1000,
        tokenRefreshInterval: 15 * 60 * 1000, // 15 minutes
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    }

    // Get current user from localStorage
    static getCurrentUser(): AuthUser | null {
        try {
            const userData = localStorage.getItem(this.STORAGE_KEYS.user)
            const lastLogin = localStorage.getItem(this.STORAGE_KEYS.lastLogin)

            if (userData && lastLogin) {
                const user = JSON.parse(userData)
                const loginTime = new Date(lastLogin)
                const now = new Date()
                const timeDiff = now.getTime() - loginTime.getTime()

                // Check if session is still valid (24 hours)
                if (timeDiff < this.AUTH_CONFIG.sessionTimeout) {
                    return user
                } else {
                    // Session expired, clear storage
                    this.clearAuthData()
                }
            }
        } catch (error) {
            console.error('Failed to get current user:', error)
            this.clearAuthData()
        }
        return null
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return !!this.getCurrentUser()
    }

    // Get customer ID
    static getCustomerId(): string | null {
        return localStorage.getItem(this.STORAGE_KEYS.customerId)
    }

    // Store authentication data
    static storeAuthData(user: AuthUser, customerId: string): void {
        try {
            localStorage.setItem(this.STORAGE_KEYS.user, JSON.stringify(user))
            localStorage.setItem(this.STORAGE_KEYS.customerId, customerId)
            localStorage.setItem(this.STORAGE_KEYS.lastLogin, new Date().toISOString())
        } catch (error) {
            console.error('Failed to store auth data:', error)
        }
    }

    // Clear authentication data
    static clearAuthData(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.user)
            localStorage.removeItem(this.STORAGE_KEYS.customerId)
            localStorage.removeItem(this.STORAGE_KEYS.token)
            localStorage.removeItem(this.STORAGE_KEYS.lastLogin)
        } catch (error) {
            console.error('Failed to clear auth data:', error)
        }
    }

    // Login user
    static async login(email: string, password: string): Promise<{ user: AuthUser; customerId: string }> {
        const response = await ApiService.loginUser({ email, password })

        if (!response.success || !response.data) {
            throw new Error(response.error || 'Login failed')
        }

        const user: AuthUser = {
            id: response.data.user,
            name: email.split('@')[0], // Temporary name from email
            email,
            customer_id: response.data.customer_id,
        }

        this.storeAuthData(user, response.data.customer_id)

        return { user, customerId: response.data.customer_id }
    }

    // Register user
    static async register(userData: {
        name: string
        email: string
        password: string
        gender: 'male' | 'female'
        password_confirmation: string
    }): Promise<{ user: AuthUser; customerId: string }> {
        const response = await ApiService.registerUser(userData)

        if (!response.success || !response.data) {
            throw new Error(response.error || 'Registration failed')
        }

        const user: AuthUser = {
            id: response.data.user,
            name: userData.name,
            email: userData.email,
            customer_id: response.data.customer_id,
        }

        this.storeAuthData(user, response.data.customer_id)

        return { user, customerId: response.data.customer_id }
    }

    // Logout user
    static async logout(): Promise<void> {
        try {
            await ApiService.logoutUser()
        } catch (error) {
            console.warn('Logout API call failed:', error)
        } finally {
            this.clearAuthData()
        }
    }

    // Get user profile
    static async getProfile(): Promise<AuthUser | null> {
        const currentUser = this.getCurrentUser()
        if (!currentUser) return null

        try {
            const response = await ApiService.getUserProfile()

            if (response.success && response.data) {
                const updatedUser: AuthUser = {
                    ...currentUser,
                    role: response.data.role,
                    tenant_id: response.data.tenant_id,
                }

                this.storeAuthData(updatedUser, currentUser.customer_id)
                return updatedUser
            }
        } catch (error) {
            console.error('Failed to get user profile:', error)
        }

        return currentUser
    }

    // Forgot password
    static async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await ApiService.forgotPassword(email)

        if (!response.success) {
            throw new Error(response.error || 'Failed to send password reset email')
        }

        return { message: response.data?.message || 'Password reset email sent' }
    }

    // Send password reset OTP
    static async sendPasswordResetOtp(email: string): Promise<{ message: string }> {
        const response = await ApiService.sendPasswordResetOtp(email)

        if (!response.success) {
            throw new Error(response.error || 'Failed to send OTP')
        }

        return { message: response.data?.message || 'OTP sent successfully' }
    }

    // Reset password with OTP
    static async resetPasswordWithOtp(data: {
        email: string
        otp: string
        password: string
        password_confirmation: string
    }): Promise<{ message: string }> {
        const response = await ApiService.resetPasswordWithOtp(data)

        if (!response.success) {
            throw new Error(response.error || 'Failed to reset password')
        }

        return { message: response.data?.message || 'Password reset successfully' }
    }
}