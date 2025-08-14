import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/third-party-api'
import { ProductFilter } from '@/lib/types'

/**
 * GET /api/products - Get products with filtering and pagination
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const category = searchParams.get('category') || undefined
        const search = searchParams.get('search') || undefined
        const sortBy = searchParams.get('sortBy') as ProductFilter['sortBy'] || undefined
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const rating = searchParams.get('rating')
        const inStock = searchParams.get('inStock')
        const colors = searchParams.get('colors')
        const sizes = searchParams.get('sizes')
        const tags = searchParams.get('tags')

        // Build filters object
        const filters: ProductFilter = {}

        if (category) filters.category = category
        if (search) filters.search = search
        if (sortBy) filters.sortBy = sortBy
        if (rating) filters.rating = parseFloat(rating)
        if (inStock !== null) filters.inStock = inStock === 'true'

        if (minPrice || maxPrice) {
            filters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : 10000
            }
        }

        if (colors) {
            filters.colors = colors.split(',').map(c => c.trim())
        }

        if (sizes) {
            filters.sizes = sizes.split(',').map(s => s.trim())
        }

        if (tags) {
            filters.tags = tags.split(',').map(t => t.trim())
        }

        // Fetch products from third-party API
        const response = await getProducts(filters, page, limit)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch products' },
                { status: 500 }
            )
        }

        return NextResponse.json(response.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
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