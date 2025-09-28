import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, updateUserProfile } from '@/lib/third-party-api'

/**
 * GET /api/auth/profile - Get user profile
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(request: NextRequest) {
    try {
        // Call third-party API
        const response = await getUserProfile()

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Failed to get profile' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Profile retrieved successfully',
            data: response.data
        })
    } catch (error) {
        console.error('Get Profile API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/auth/profile - Update user profile
 * Prevents CORS issues when deploying to Vercel
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        const { name, email, password, password_confirmation } = body

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: 'Name and email are required' },
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

        // Password validation if provided
        if (password && password !== password_confirmation) {
            return NextResponse.json(
                { success: false, message: 'Passwords do not match' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await updateUserProfile({
            name,
            email,
            ...(password && { password, password_confirmation })
        })

        if (!response.success) {
            return NextResponse.json(
                { success: false, message: response.error || 'Failed to update profile' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: response.data
        })
    } catch (error) {
        console.error('Update Profile API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}