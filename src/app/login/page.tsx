'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { AuthButton } from '@/components/auth/AuthButton'
import Link from 'next/link'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Login page
 */
export default function LoginPage() {
    const { isAuthenticated, loading } = useAuthContext()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Persist returnUrl (if any) so callback can redirect correctly
    useEffect(() => {
        if (!searchParams) return
        const ru = (searchParams as any)?.get?.('returnUrl') || null
        if (ru) {
            try {
                localStorage.setItem('post_login_redirect', ru)
            } catch {
                // no-op
            }
        }
    }, [searchParams])

    useEffect(() => {
        // Redirect to account page if already authenticated
        if (!loading && isAuthenticated) {
            router.push('/account')
        }
    }, [isAuthenticated, loading, router])

    if (loading) {
        return (
            <div className="container-theme py-8">
                <div className="text-center">
                    <Typography variant="body">Loading...</Typography>
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
                            Welcome Back
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Sign in to your account to continue shopping
                        </Typography>
                    </div>

                    <AuthButton />

                    <div className="mt-8 pt-8 border-t border-secondary-200 text-center">
                        <Typography variant="caption" color="secondary">
                            By signing in, you agree to our{' '}
                            <Link href="/terms" className="text-primary-600 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </Typography>
                    </div>
                </Card>
            </div>
        </div>
    )
}