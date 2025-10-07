import { NextRequest, NextResponse } from 'next/server'
import { getBestSellers } from '@/lib/third-party-api'

/**
 * GET /api/products/best-sellers - Get best selling products
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '12')

        const response = await getBestSellers(limit)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch best sellers' },
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