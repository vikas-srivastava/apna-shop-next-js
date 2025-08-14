import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/third-party-api'

/**
 * GET /api/categories - Get all categories
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET() {
    try {
        // Fetch categories from third-party API
        const response = await getCategories()

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch categories' },
                { status: 500 }
            )
        }

        return NextResponse.json(response.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
            }
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}