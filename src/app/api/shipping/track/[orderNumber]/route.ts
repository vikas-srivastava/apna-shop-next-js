import { NextRequest, NextResponse } from 'next/server'
import { trackOrder } from '@/lib/third-party-api'

/**
 * GET /api/shipping/track/[orderNumber] - Track order by order number
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const { orderNumber } = params

        if (!orderNumber) {
            return NextResponse.json(
                { error: 'Order number is required' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await trackOrder(orderNumber)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to track order' },
                { status: 500 }
            )
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=300'
            }
        })
    } catch (error) {
        console.error('Order tracking API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}