'use client'

import { useState, useEffect } from 'react'
import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import Link from 'next/link'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
    const { updatePassword, loading, error } = useSupabaseAuth()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [sessionValid, setSessionValid] = useState(false)

    const router = useRouter()

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setSessionValid(true)
            } else {
                // Try to set session from URL hash (from reset link)
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })
                    if (!error) {
                        setSessionValid(true)
                        // Clear the hash from URL
                        window.history.replaceState({}, document.title, window.location.pathname)
                    }
                }
            }
        }

        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password || password !== confirmPassword) return

        setIsSubmitting(true)
        try {
            await updatePassword(password)
            setIsSubmitted(true)
        } catch (error) {
            console.error('Reset password error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!sessionValid) {
        return (
            <div className="container-theme py-8">
                <div className="max-w-md mx-auto">
                    <Card className="p-8 text-center">
                        <div className="mb-6">
                            <Typography variant="h2" weight="bold" className="mb-2">
                                Invalid Reset Link
                            </Typography>
                            <Typography variant="body" color="secondary">
                                This password reset link is invalid or has expired. Please request a new one.
                            </Typography>
                        </div>

                        <Link href="/forgot-password">
                            <Button className="w-full">
                                Request New Reset Link
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="container-theme py-8">
                <div className="max-w-md mx-auto">
                    <Card className="p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <Typography variant="h2" weight="bold" className="mb-2">
                                Password Reset Successful
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </Typography>
                        </div>

                        <Link href="/login">
                            <Button className="w-full">
                                Continue to Sign In
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container-theme py-8">
            <div className="max-w-md mx-auto">
                <Card className="p-8">
                    <div className="text-center mb-8">
                        <Typography variant="h2" weight="bold" className="mb-4">
                            Reset Your Password
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Enter your new password below.
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading || isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading || isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {password && confirmPassword && password !== confirmPassword && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <Typography variant="caption" color="error">
                                    Passwords do not match
                                </Typography>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <Typography variant="caption" color="error">
                                    {error.message}
                                </Typography>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading || isSubmitting}
                            disabled={!password || !confirmPassword || password !== confirmPassword || isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-secondary-200 text-center">
                        <Typography variant="caption" color="secondary">
                            Remember your password?{' '}
                            <Link href="/login" className="text-primary-600 hover:underline">
                                Sign in here
                            </Link>
                        </Typography>
                    </div>
                </Card>
            </div>
        </div>
    )
}