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

// GET /api/payments - Get payments list
export async function GET(request: NextRequest) {
    try {
        await mockDelay()

        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = parseInt(searchParams.get('offset') || '0')

        let payments = Array.from(mockStorage.payments.values())

        // Filter by order ID if provided
        if (orderId) {
            payments = payments.filter(payment => payment.orderId === orderId)
        }

        // Filter by status if provided
        if (status) {
            payments = payments.filter(payment => payment.status === status)
        }

        // Sort by creation date (newest first)
        payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        // Apply pagination
        const total = payments.length
        const paginatedPayments = payments.slice(offset, offset + limit)

        return NextResponse.json({
            success: true,
            data: {
                payments: paginatedPayments,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total
                }
            },
            message: 'Payments retrieved successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve payments',
            error: 'Internal server error'
        }, { status: 500 })
    }
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
            id: razorpayOrderId,
            orderId: order_id,
            amount: parseFloat(amount),
            currency,
            status: 'created',
            gateway: 'razorpay',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
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