import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            gateway,
            order_id,
            payment_id,
            signature,
            amount,
            currency
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

        let isValid = false
        let verificationError = null

        if (gateway === 'razorpay') {
            if (!signature) {
                return NextResponse.json({
                    success: false,
                    message: 'Razorpay signature is required',
                    error: 'Validation error'
                }, { status: 422 })
            }

            const razorpaySecret = process.env.RAZORPAY_SECRET_KEY
            if (!razorpaySecret) {
                return NextResponse.json({
                    success: false,
                    message: 'Razorpay secret not configured',
                    error: 'Configuration error'
                }, { status: 500 })
            }

            // Verify Razorpay signature
            const expectedSignature = crypto
                .createHmac('sha256', razorpaySecret)
                .update(`${order_id}|${payment_id}`)
                .digest('hex')

            isValid = expectedSignature === signature

            if (!isValid) {
                verificationError = 'Invalid signature'
            }
        } else if (gateway === 'stripe') {
            // For Stripe, we would typically verify via webhook
            // For now, basic validation
            isValid = payment_id.startsWith('pi_')
        } else if (gateway === 'paypal') {
            // For PayPal, we would typically verify via webhook
            // For now, basic validation
            isValid = payment_id.startsWith('PAYPAL_')
        }

        if (!isValid) {
            return NextResponse.json({
                success: false,
                message: 'Payment verification failed',
                error: verificationError || 'Payment verification error'
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            orderId: order_id,
            paymentId: payment_id
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