import { NextRequest, NextResponse } from 'next/server'
import { getBrands } from '@/lib/third-party-api'

/**
 * GET /api/brands - Get all brands
 */
export async function GET(request: NextRequest) {
    try {
        const response = await getBrands()

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch brands' },
                { status: 500 }
            )
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}