import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'

// Helper function to simulate API delay
function mockDelay(minMs = 300, maxMs = 1000): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// POST /api/payments/create-razorpay-order - Create Razorpay order
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const { order_id, amount, currency = 'INR' } = body

        if (!order_id || !amount) {
            return NextResponse.json({
                success: false,
                message: 'Order ID and amount are required',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Verify order exists
        const order = mockStorage.orders.get(order_id)
        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Generate mock Razorpay order
        const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Store payment intent
        mockStorage.payments.set(razorpayOrderId, {
            orderId: order_id,
            amount: parseFloat(amount),
            currency,
            status: 'created',
            createdAt: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            data: {
                id: razorpayOrderId,
                amount: Math.round(parseFloat(amount) * 100), // Razorpay expects amount in paisa
                currency,
                order_id: order_id
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