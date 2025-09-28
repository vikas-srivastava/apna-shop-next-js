import { NextRequest, NextResponse } from 'next/server'
import { getShippingRates } from '@/lib/third-party-api'

/**
 * POST /api/shipping/rates - Calculate shipping rates
 * Prevents CORS issues when deploying to Vercel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { weight, destination, provider } = body

        // Validate required parameters
        if (!weight || weight <= 0) {
            return NextResponse.json(
                { error: 'Weight is required and must be greater than 0' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await getShippingRates({
            weight: parseFloat(weight),
            destination,
            provider
        })

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to calculate shipping rates' },
                { status: 500 }
            )
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=300'
            }
        })
    } catch (error) {
        console.error('Shipping rates API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/shipping/rates - Get available shipping rates (fallback)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const weight = searchParams.get('weight')
        const destination = searchParams.get('destination')
        const provider = searchParams.get('provider')

        // Call third-party API
        const response = await getShippingRates({
            weight: weight ? parseFloat(weight) : undefined,
            destination: destination || undefined,
            provider: provider || undefined
        })

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch shipping rates' },
                { status: 500 }
            )
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=300'
            }
        })
    } catch (error) {
        console.error('Shipping rates GET API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}