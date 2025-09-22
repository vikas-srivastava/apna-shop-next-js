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
        const { order_id, amount, currency = 'INR' } = body

        if (!amount || amount <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Valid amount is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Generate mock Razorpay order
        const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        return NextResponse.json({
            success: true,
            data: {
                id: mockOrderId,
                entity: 'order',
                amount: amount,
                amount_paid: 0,
                amount_due: amount,
                currency: currency.toUpperCase(),
                receipt: order_id,
                offer_id: null,
                status: 'created',
                attempts: 0,
                notes: [],
                created_at: Math.floor(Date.now() / 1000)
            },
            message: 'Razorpay order created successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create Razorpay order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}