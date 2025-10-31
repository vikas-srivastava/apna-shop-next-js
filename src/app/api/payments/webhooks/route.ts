import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'

// Helper function to simulate API delay
function mockDelay(minMs = 100, maxMs = 500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// POST /api/payments/webhooks - Handle payment webhooks
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const { event, data } = body

        // Log webhook event (in production, you'd validate signatures)


        switch (event) {
            case 'payment.succeeded':
                await handlePaymentSucceeded(data)
                break
            case 'payment.failed':
                await handlePaymentFailed(data)
                break
            case 'payment.cancelled':
                await handlePaymentCancelled(data)
                break
            case 'payment.refunded':
                await handlePaymentRefunded(data)
                break
            default:
        
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully'
        })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({
            success: false,
            message: 'Webhook processing failed',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// Handle successful payment
async function handlePaymentSucceeded(data: any) {
    const { payment_id, order_id, amount, currency, gateway } = data

    // Find and update payment
    const payment = Array.from(mockStorage.payments.values())
        .find(p => p.id === payment_id || p.orderId === order_id)

    if (payment) {
        mockStorage.payments.set(payment.id, {
            ...payment,
            status: 'completed',
            gatewayPaymentId: payment_id,
            verifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        // Update order status
        const order = mockStorage.orders.get(payment.orderId)
        if (order) {
            mockStorage.orders.set(order.id, {
                ...order,
                status: 'confirmed',
                paymentStatus: 'paid',
                updatedAt: new Date().toISOString()
            })
        }
    }
}

// Handle failed payment
async function handlePaymentFailed(data: any) {
    const { payment_id, order_id, reason } = data

    // Find and update payment
    const payment = Array.from(mockStorage.payments.values())
        .find(p => p.id === payment_id || p.orderId === order_id)

    if (payment) {
        mockStorage.payments.set(payment.id, {
            ...payment,
            status: 'failed',
            failureReason: reason,
            updatedAt: new Date().toISOString()
        })

        // Update order status
        const order = mockStorage.orders.get(payment.orderId)
        if (order) {
            mockStorage.orders.set(order.id, {
                ...order,
                status: 'payment_failed',
                paymentStatus: 'failed',
                updatedAt: new Date().toISOString()
            })
        }
    }
}

// Handle cancelled payment
async function handlePaymentCancelled(data: any) {
    const { payment_id, order_id } = data

    // Find and update payment
    const payment = Array.from(mockStorage.payments.values())
        .find(p => p.id === payment_id || p.orderId === order_id)

    if (payment) {
        mockStorage.payments.set(payment.id, {
            ...payment,
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        })

        // Update order status
        const order = mockStorage.orders.get(payment.orderId)
        if (order) {
            mockStorage.orders.set(order.id, {
                ...order,
                status: 'cancelled',
                paymentStatus: 'cancelled',
                updatedAt: new Date().toISOString()
            })
        }
    }
}

// Handle refunded payment
async function handlePaymentRefunded(data: any) {
    const { payment_id, order_id, refund_amount, refund_id } = data

    // Find and update payment
    const payment = Array.from(mockStorage.payments.values())
        .find(p => p.id === payment_id || p.orderId === order_id)

    if (payment) {
        mockStorage.payments.set(payment.id, {
            ...payment,
            status: 'refunded',
            refundId: refund_id,
            refundAmount: refund_amount,
            updatedAt: new Date().toISOString()
        })

        // Update order status
        const order = mockStorage.orders.get(payment.orderId)
        if (order) {
            mockStorage.orders.set(order.id, {
                ...order,
                status: 'refunded',
                paymentStatus: 'refunded',
                updatedAt: new Date().toISOString()
            })
        }
    }
}