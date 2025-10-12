import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
    try {
        console.log('Razorpay order creation request received');
        const body = await request.json()
        const { order_id, amount, currency = 'INR' } = body

        if (!amount || amount <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Valid amount is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        const razorpaySecret = process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY

        if (!razorpayKeyId || !razorpaySecret) {
            return NextResponse.json({
                success: false,
                message: 'Razorpay credentials not configured',
                error: 'Configuration error'
            }, { status: 500 })
        }

        // Create Razorpay order using their API
        const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64')

        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: amount, // Amount in paisa (smallest currency unit)
                currency: currency.toUpperCase(),
                receipt: order_id,
                payment_capture: 1 // Auto capture payment
            })
        })

        if (!razorpayResponse.ok) {
            const errorData = await razorpayResponse.text()
            console.error('Razorpay API error:', errorData)
            return NextResponse.json({
                success: false,
                message: 'Failed to create Razorpay order',
                error: 'Razorpay API error'
            }, { status: razorpayResponse.status })
        }

        const razorpayOrder = await razorpayResponse.json()

        return Response.json({
            success: true,
            data: razorpayOrder,
            message: 'Razorpay order created successfully'
        })
    } catch (error) {
        console.error('Razorpay order creation error:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to create Razorpay order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}