import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from '@/lib/third-party-api'

interface RouteParams {
    params: {
        slug: string
    }
}

/**
 * GET /api/products/[slug] - Get single product by slug
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { slug } = params

        if (!slug) {
            return NextResponse.json(
                { error: 'Product slug is required' },
                { status: 400 }
            )
        }

        // Fetch product from third-party API
        const response = await getProduct(slug)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Product not found' },
                { status: response.error === 'Product not found' ? 404 : 500 }
            )
        }

        return NextResponse.json(response.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
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