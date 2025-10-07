import { NextRequest, NextResponse } from 'next/server'
import { searchBrands } from '@/lib/third-party-api'

/**
 * GET /api/brands/search - Search brands
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q') || ''

        if (!query) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            )
        }

        const response = await searchBrands(query)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to search brands' },
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