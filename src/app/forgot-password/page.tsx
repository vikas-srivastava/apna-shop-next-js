'use client'

import { useState } from 'react'
import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import Link from 'next/link'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'

export default function ForgotPasswordPage() {
    const { resetPassword, loading, error } = useSupabaseAuth()
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)
        try {
            await resetPassword(email)
            setIsSubmitted(true)
        } catch (error) {
            console.error('Forgot password error:', error)
        } finally {
            setIsSubmitting(false)
        }
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
                                Check Your Email
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We've sent a password reset link to <strong>{email}</strong>
                            </Typography>
                        </div>

                        <div className="space-y-4">
                            <Typography variant="caption" color="secondary">
                                Didn't receive the email? Check your spam folder or try again.
                            </Typography>

                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Try Again
                                </Button>

                                <Link href="/login">
                                    <Button variant="ghost" className="w-full">
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
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
                            Enter your email address and we'll send you a link to reset your password.
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

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
                            disabled={!email || isSubmitting}
                        >
                            Send Reset Link
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