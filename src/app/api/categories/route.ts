import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/third-party-api'
import { cache, CACHE_TTL, generateCacheKey } from '@/lib/cache'

/**
 * GET /api/categories - Get all categories
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET() {
    try {
        // Generate cache key for categories
        const cacheKey = generateCacheKey('categories')

        // Check cache first
        const cachedResponse = cache.get(cacheKey)
        if (cachedResponse) {
            return NextResponse.json(cachedResponse, {
                headers: {
                    'Cache-Control': 'public, max-age=600',
                    'X-Cache-Status': 'HIT'
                }
            })
        }

        // Fetch categories from third-party API
        const response = await getCategories()

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch categories' },
                { status: 500 }
            )
        }

        // Cache the successful response
        cache.set(cacheKey, response, CACHE_TTL.CATEGORIES)

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=600',
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