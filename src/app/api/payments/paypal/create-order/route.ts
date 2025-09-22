import { NextRequest, NextResponse } from 'next/server'

// Helper function to simulate API delay
function mockDelay(minMs = 500, maxMs = 1500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const { amount, currency = 'USD' } = body

        if (!amount || parseFloat(amount) <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Valid amount is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Generate mock PayPal order ID
        const orderId = `PAYPAL_ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        return NextResponse.json({
            success: true,
            orderId,
            message: 'PayPal order created successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create PayPal order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}