import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetOtp } from '@/lib/third-party-api'

/**
 * POST /api/auth/forgot-password - Send password reset OTP
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
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

        // Call third-party API
        const response = await sendPasswordResetOtp(email)

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Failed to send OTP' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            data: response.data
        })
    } catch (error) {
        console.error('Forgot Password API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}