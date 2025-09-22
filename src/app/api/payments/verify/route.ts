import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'

// Helper function to simulate API delay
function mockDelay(minMs = 500, maxMs = 1500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// POST /api/payments/verify - Verify Razorpay payment
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_id
        } = body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({
                success: false,
                message: 'Payment verification data is incomplete',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Check if payment exists
        const payment = mockStorage.payments.get(razorpay_order_id)
        if (!payment) {
            return NextResponse.json({
                success: false,
                message: 'Payment order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Verify order exists and update status
        const order = mockStorage.orders.get(payment.orderId)
        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Associated order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Simulate payment verification (in real implementation, verify signature)
        const isValid = Math.random() > 0.05 // 95% success rate for mock

        if (!isValid) {
            // Update payment status to failed
            mockStorage.payments.set(razorpay_order_id, {
                ...payment,
                status: 'failed',
                razorpay_payment_id,
                razorpay_signature,
                verifiedAt: new Date().toISOString()
            })

            return NextResponse.json({
                success: false,
                message: 'Payment verification failed',
                error: 'Payment verification error'
            }, { status: 400 })
        }

        // Update payment status to completed
        mockStorage.payments.set(razorpay_order_id, {
            ...payment,
            status: 'completed',
            razorpay_payment_id,
            razorpay_signature,
            verifiedAt: new Date().toISOString()
        })

        // Update order status to confirmed
        const updatedOrder = {
            ...order,
            status: 'confirmed' as const,
            updatedAt: new Date().toISOString()
        }
        mockStorage.orders.set(order.id, updatedOrder)

        return NextResponse.json({
            success: true,
            data: {
                payment_id: razorpay_payment_id,
                order_id: order.id,
                status: 'success',
                amount: payment.amount
            },
            message: 'Payment verified successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Payment verification failed',
            error: 'Internal server error'
        }, { status: 500 })
    }
}