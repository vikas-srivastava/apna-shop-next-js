import { NextRequest, NextResponse } from 'next/server'
import { logoutUser } from '@/lib/third-party-api'

/**
 * POST /api/auth/logout - User logout
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        // Call third-party API
        const response = await logoutUser()

        if (!response.success) {
            // Even if API call fails, we still consider logout successful on client side
            console.warn('Logout API call failed:', response.error)
        }

        return NextResponse.json({
            success: true,
            message: 'Logout successful'
        })
    } catch (error) {
        console.error('Logout API Error:', error)
        // Still return success for logout to ensure client-side cleanup
        return NextResponse.json({
            success: true,
            message: 'Logout successful'
        })
    }
}