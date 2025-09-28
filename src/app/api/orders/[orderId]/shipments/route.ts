import { NextRequest, NextResponse } from 'next/server'
import { getOrderShipments } from '@/lib/third-party-api'

/**
 * GET /api/orders/[orderId]/shipments - Get shipments for an order
 * Prevents CORS issues when deploying to Vercel
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        // Call third-party API
        const response = await getOrderShipments(orderId)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch order shipments' },
                { status: 500 }
            )
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=300'
            }
        })
    } catch (error) {
        console.error('Order shipments API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/orders/[orderId]/shipments - Update shipment status
 * Prevents CORS issues when deploying to Vercel
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params
        const body = await request.json()
        const { trackingNumber, status, provider } = body

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        // For now, return mock success response
        // In a real implementation, this would call the shipping provider API
        const mockResponse = {
            success: true,
            data: {
                id: `ship-${Date.now()}`,
                orderId,
                trackingNumber: trackingNumber || `TRK${Date.now()}`,
                provider: provider || 'Delhivery',
                status: status || 'shipped',
                updatedAt: new Date().toISOString()
            }
        }

        return NextResponse.json(mockResponse)
    } catch (error) {
        console.error('Update shipment API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}