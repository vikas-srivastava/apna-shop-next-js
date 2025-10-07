import { NextRequest, NextResponse } from 'next/server'
import { getRecentViews } from '@/lib/third-party-api'

/**
 * GET /api/products/recent-views - Get recent product views
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')

        const response = await getRecentViews(limit)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch recent views' },
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