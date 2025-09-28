import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/third-party-api'

/**
 * POST /api/auth/login - User login
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
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
        const response = await loginUser({ email, password })

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Login failed' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: response.data
        })
    } catch (error) {
        console.error('Login API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}