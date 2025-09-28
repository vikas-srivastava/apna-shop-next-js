import { NextRequest, NextResponse } from 'next/server'
import { getShippingProviders } from '@/lib/third-party-api'
import { cache, CACHE_TTL } from '@/lib/cache'

/**
 * GET /api/shipping/providers - Get available shipping providers
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(request: NextRequest) {
    try {
        const cacheKey = 'shipping-providers'

        // Check cache first
        const cachedResponse = cache.get(cacheKey)
        if (cachedResponse) {
            return NextResponse.json(cachedResponse, {
                headers: {
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                    'X-Cache-Status': 'HIT'
                }
            })
        }

        // Call third-party API
        const response = await getShippingProviders()

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch shipping providers' },
                { status: 500 }
            )
        }

        // Cache the successful response
        cache.set(cacheKey, response, CACHE_TTL.PRODUCTS)

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'X-Cache-Status': 'MISS'
            }
        })
    } catch (error) {
        console.error('Shipping providers API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}