import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/third-party-api'
import { ProductFilter } from '@/lib/types'
import { cache, CACHE_TTL, generateCacheKey } from '@/lib/cache'

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
        const brand = searchParams.get('brand') || undefined
        const search = searchParams.get('search') || undefined
        const sortBy = searchParams.get('sortBy') as ProductFilter['sortBy'] || undefined
        const minPrice = searchParams.get('min_price') || searchParams.get('minPrice')
        const maxPrice = searchParams.get('max_price') || searchParams.get('maxPrice')
        const rating = searchParams.get('rating')
        const inStock = searchParams.get('inStock')
        const colors = searchParams.get('colors')
        const sizes = searchParams.get('sizes')
        const tags = searchParams.get('tags')

        // Build filters object
        const filters: ProductFilter = {}

        if (category) filters.category = category
        if (brand) filters.brand = brand
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
        // Generate cache key from request parameters
        const cacheKey = generateCacheKey('products', {
            page,
            limit,
            ...filters
        })

        // Check cache first
        const cachedResponse = cache.get(cacheKey)
        if (cachedResponse) {
            return NextResponse.json(cachedResponse, {
                headers: {
                    'Cache-Control': 'public, max-age=300',
                    'X-Cache-Status': 'HIT'
                }
            })
        }


        // Fetch products from third-party API
        const response = await getProducts(filters, page, limit)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch products' },
                { status: 500 }
            )
        }

        // Cache the successful response
        cache.set(cacheKey, response, CACHE_TTL.PRODUCTS)

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=300',
                'X-Cache-Status': 'MISS'
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