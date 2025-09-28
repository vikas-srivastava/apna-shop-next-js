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
    const [retryCount, setRetryCount] = useState(0)
    const [lastError, setLastError] = useState<string | null>(null)
    const maxRetries = 3

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

    const createRazorpayOrder = async (): Promise<any> => {
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
            setLastError(errorMessage)
            throw error
        }
    }

    const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
        try {
            const response = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gateway: 'razorpay',
                    order_id: orderId,
                    payment_id: paymentId,
                    signature,
                    amount: Math.round(amount),
                    currency
                })
            })

            const data = await response.json()
            if (data.success) {
                return data
            } else {
                throw new Error(data.message || 'Payment verification failed')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed'
            throw new Error(errorMessage)
        }
    }

    const handlePayment = async () => {
        if (!window.Razorpay) {
            onError('Razorpay SDK not loaded. Please refresh the page and try again.')
            return
        }

        setIsProcessing(true)
        setLastError(null)

        try {
            const orderData = await createRazorpayOrder()

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.id,
                name: 'Mock E-commerce Store',
                description: 'Test Payment',
                handler: async function (response: any) {
                    try {
                        // Verify payment with backend
                        await verifyPayment(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        )

                        onSuccess(response.razorpay_payment_id, response.razorpay_order_id)
                        setRetryCount(0) // Reset retry count on success
                    } catch (verifyError) {
                        const errorMsg = verifyError instanceof Error ? verifyError.message : 'Payment verification failed'
                        setLastError(errorMsg)
                        onError(errorMsg)
                    }
                },
                prefill: {
                    name: 'Test User',
                    email: 'test@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3B82F6'
                },
                retry: {
                    enabled: true,
                    max_count: 2
                },
                modal: {
                    ondismiss: function () {
                        if (onCancel) onCancel()
                    },
                    confirm_close: true,
                    escape: true
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed'
            setLastError(errorMessage)
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1)
            handlePayment()
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

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isProcessing || !window.Razorpay}
                        className="flex-1"
                    >
                        {isProcessing ? 'Processing...' : `Pay ₹${(amount / 100).toFixed(2)} with Razorpay`}
                    </Button>

                    {lastError && retryCount < maxRetries && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={handleRetry}
                            disabled={isProcessing}
                        >
                            Retry ({retryCount}/{maxRetries})
                        </Button>
                    )}
                </div>

                {!window.Razorpay && (
                    <Typography variant="caption" color="secondary" className="mt-2 block">
                        Loading payment gateway...
                    </Typography>
                )}

                {lastError && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded">
                        <Typography variant="caption">{lastError}</Typography>
                    </div>
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
                    Cancel Payment
                </Button>
            )}
        </div>
    )
}