import { NextRequest, NextResponse } from 'next/server'
import { getLatestArrivals } from '@/lib/third-party-api'

/**
 * GET /api/products/latest-arrivals - Get latest arrival products
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '12')

        const response = await getLatestArrivals(limit)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch latest arrivals' },
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