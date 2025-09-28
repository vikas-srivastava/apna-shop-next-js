import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/third-party-api'

/**
 * POST /api/auth/register - User registration
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        const { name, email, password, gender, password_confirmation } = body

        if (!name || !email || !password || !gender || !password_confirmation) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            )
        }

        if (password !== password_confirmation) {
            return NextResponse.json(
                { success: false, message: 'Passwords do not match' },
                { status: 400 }
            )
        }

        if (!['male', 'female', 'other'].includes(gender)) {
            return NextResponse.json(
                { success: false, message: 'Invalid gender value' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await registerUser({
            name,
            email,
            password,
            gender,
            password_confirmation
        })

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Registration failed' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: response.data
        })
    } catch (error) {
        console.error('Registration API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}