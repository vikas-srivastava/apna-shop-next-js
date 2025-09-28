import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithOtp } from '@/lib/third-party-api'

/**
 * POST /api/auth/reset-password - Reset password with OTP
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        const { email, otp, password, password_confirmation } = body

        if (!email || !otp || !password || !password_confirmation) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            )
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            )
        }

        if (password !== password_confirmation) {
            return NextResponse.json(
                { success: false, message: 'Passwords do not match' },
                { status: 400 }
            )
        }

        // Basic password strength validation
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters long' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await resetPasswordWithOtp({
            email,
            otp,
            password,
            password_confirmation
        })

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Failed to reset password' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
            data: response.data
        })
    } catch (error) {
        console.error('Reset Password API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}