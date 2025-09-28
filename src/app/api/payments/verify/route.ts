import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'

// Helper function to simulate API delay
function mockDelay(minMs = 500, maxMs = 1500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Mock signature verification (in production, use proper crypto verification)
function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
    // Mock implementation - in production, use crypto.createHmac
    const expectedSignature = `mock_signature_${orderId}_${paymentId}`
    return signature === expectedSignature || Math.random() > 0.1 // 90% success rate for mock
}

// POST /api/payments/verify - Verify payment from any gateway
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const {
            gateway,
            order_id,
            payment_id,
            signature,
            amount,
            currency,
            metadata
        } = body

        // Security validations
        if (!gateway || !order_id || !payment_id) {
            return NextResponse.json({
                success: false,
                message: 'Payment verification data is incomplete',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Validate gateway
        const allowedGateways = ['razorpay', 'stripe', 'paypal']
        if (!allowedGateways.includes(gateway.toLowerCase())) {
            return NextResponse.json({
                success: false,
                message: 'Invalid payment gateway',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Validate amount (prevent negative or zero amounts)
        if (amount !== undefined && (amount <= 0 || amount > 10000000)) { // Max 1M for safety
            return NextResponse.json({
                success: false,
                message: 'Invalid payment amount',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Validate currency
        const allowedCurrencies = ['INR', 'USD', 'EUR', 'GBP']
        if (currency && !allowedCurrencies.includes(currency.toUpperCase())) {
            return NextResponse.json({
                success: false,
                message: 'Invalid currency',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Rate limiting check (basic implementation)
        const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        // In production, implement proper rate limiting with Redis/external service

        // Find payment by order ID or payment ID
        let payment = Array.from(mockStorage.payments.values())
            .find(p => p.orderId === order_id || p.id === payment_id)

        if (!payment) {
            return NextResponse.json({
                success: false,
                message: 'Payment not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Verify order exists
        const order = mockStorage.orders.get(payment.orderId)
        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Associated order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Gateway-specific verification
        let isValid = false
        let verificationError = null

        switch (gateway) {
            case 'razorpay':
                if (!signature) {
                    return NextResponse.json({
                        success: false,
                        message: 'Razorpay signature is required',
                        error: 'Validation error'
                    }, { status: 422 })
                }
                isValid = verifySignature(order_id, payment_id, signature, process.env.RAZORPAY_SECRET || 'mock_secret')
                break

            case 'stripe':
                // Stripe uses webhooks for verification, but we can do basic checks
                isValid = payment_id.startsWith('pi_') && Math.random() > 0.05
                break

            case 'paypal':
                // PayPal verification through webhooks
                isValid = payment_id.startsWith('PAYPAL_') && Math.random() > 0.05
                break

            default:
                isValid = Math.random() > 0.1 // 90% success rate for unknown gateways
        }

        if (!isValid) {
            // Update payment status to failed
            mockStorage.payments.set(payment.id, {
                ...payment,
                status: 'failed',
                gatewayPaymentId: payment_id,
                signature,
                verificationError,
                verifiedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })

            // Update order status
            mockStorage.orders.set(order.id, {
                ...order,
                status: 'payment_failed',
                paymentStatus: 'failed',
                updatedAt: new Date().toISOString()
            })

            return NextResponse.json({
                success: false,
                message: 'Payment verification failed',
                error: 'Payment verification error'
            }, { status: 400 })
        }

        // Update payment status to completed
        mockStorage.payments.set(payment.id, {
            ...payment,
            status: 'completed',
            gateway,
            gatewayPaymentId: payment_id,
            signature,
            verifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        // Update order status to confirmed
        mockStorage.orders.set(order.id, {
            ...order,
            status: 'confirmed',
            paymentStatus: 'paid',
            updatedAt: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            data: {
                payment_id: payment_id,
                order_id: order.id,
                gateway,
                status: 'success',
                amount: payment.amount,
                verified_at: new Date().toISOString()
            },
            message: 'Payment verified successfully'
        })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json({
            success: false,
            message: 'Payment verification failed',
            error: 'Internal server error'
        }, { status: 500 })
    }
}