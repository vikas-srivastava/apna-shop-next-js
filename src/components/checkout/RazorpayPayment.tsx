'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'

// Declare Razorpay types for TypeScript
declare global {
    interface Window {
        Razorpay: any
    }
}

interface RazorpayPaymentProps {
    amount: number
    currency?: string
    orderId?: string
    onSuccess: (paymentId: string, orderId: string) => void
    onError: (error: string) => void
    onCancel?: () => void
}

export function RazorpayPayment({
    amount,
    currency = 'INR',
    orderId,
    onSuccess,
    onError,
    onCancel
}: RazorpayPaymentProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null)

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const createRazorpayOrder = async () => {
        try {
            const response = await fetch('/api/payments/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId || `order_${Date.now()}`,
                    amount: Math.round(amount), // Amount in paisa for INR
                    currency
                })
            })

            const data = await response.json()
            if (data.success) {
                setRazorpayOrderId(data.data.id)
                return data.data
            } else {
                throw new Error(data.message || 'Failed to create Razorpay order')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order'
            onError(errorMessage)
            throw error
        }
    }

    const handlePayment = async () => {
        if (!window.Razorpay) {
            onError('Razorpay SDK not loaded')
            return
        }

        setIsProcessing(true)

        try {
            const orderData = await createRazorpayOrder()

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.id,
                name: 'Mock E-commerce Store',
                description: 'Test Payment',
                handler: function (response: any) {
                    // Mock payment verification
                    setTimeout(() => {
                        const isSuccess = Math.random() > 0.25 // 75% success rate
                        if (isSuccess) {
                            onSuccess(response.razorpay_payment_id, response.razorpay_order_id)
                        } else {
                            onError('Payment verification failed')
                        }
                    }, 2000)
                },
                prefill: {
                    name: 'Test User',
                    email: 'test@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3B82F6'
                },
                modal: {
                    ondismiss: function () {
                        if (onCancel) onCancel()
                    }
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed'
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
                <Typography variant="subtitle" weight="semibold" className="mb-2">
                    Razorpay Payment
                </Typography>
                <Typography variant="body" className="text-secondary-600 mb-4">
                    Amount: {currency.toUpperCase()} ₹{(amount / 100).toFixed(2)}
                </Typography>

                <Typography variant="caption" color="secondary" className="mb-4 block">
                    This is a mock Razorpay integration for testing purposes. Click the button to open the payment modal.
                </Typography>

                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing || !window.Razorpay}
                    className="w-full"
                >
                    {isProcessing ? 'Processing...' : `Pay ₹${(amount / 100).toFixed(2)} with Razorpay`}
                </Button>

                {!window.Razorpay && (
                    <Typography variant="caption" color="secondary" className="mt-2 block">
                        Loading payment gateway...
                    </Typography>
                )}
            </div>

            {onCancel && (
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
            )}
        </div>
    )
}