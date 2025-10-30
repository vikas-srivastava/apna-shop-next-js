'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'

interface PayPalPaymentProps {
    amount: number
    currency?: string
    onSuccess: (orderId: string) => void
    onError: (error: string) => void
    onCancel?: () => void
}

function PayPalPaymentForm({ amount, currency = 'USD', onSuccess, onError, onCancel }: PayPalPaymentProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const [lastError, setLastError] = useState<string | null>(null)
    const maxRetries = 3

    const paypalOptions = {
        clientId: process.env.NEXT_PRIVATE__PAYPAL_CLIENT_ID || 'mock_paypal_client_id',
        currency: currency.toUpperCase(),
        'enable-funding': 'venmo',
        'disable-funding': 'paylater,card',
    }

    const verifyPayment = async (paypalOrderId: string) => {
        try {
            const response = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gateway: 'paypal',
                    order_id: `order_${Date.now()}`, // Mock order ID
                    payment_id: paypalOrderId,
                    amount: amount,
                    currency: currency
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

    const createOrder = async () => {
        try {
            const response = await fetch('/api/payments/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: (amount / 100).toFixed(2),
                    currency
                })
            })

            const data = await response.json()
            if (data.success) {
                return data.orderId
            } else {
                throw new Error(data.message || 'Failed to create PayPal order')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create PayPal order'
            setLastError(errorMessage)
            throw error
        }
    }

    const onApprove = async (data: any) => {
        setIsProcessing(true)
        setLastError(null)

        try {
            // Verify payment with backend
            await verifyPayment(data.orderID)

            // Simulate success/failure
            const isSuccess = Math.random() > 0.2 // 80% success rate

            if (isSuccess) {
                onSuccess(data.orderID)
                setRetryCount(0) // Reset retry count on success
            } else {
                throw new Error('Payment capture failed')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment failed'
            setLastError(errorMessage)
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const onErrorPayPal = (error: any) => {
        const errorMessage = 'PayPal payment error occurred'
        setLastError(errorMessage)
        onError(errorMessage)
    }

    const onCancelPayPal = () => {
        if (onCancel) onCancel()
    }

    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1)
            // PayPal buttons will handle retry through re-clicking
        }
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
                <Typography variant="subtitle" weight="semibold" className="mb-2">
                    PayPal Payment
                </Typography>
                <Typography variant="body" className="text-secondary-600 mb-4">
                    Amount: {currency.toUpperCase()} ${(amount / 100).toFixed(2)}
                </Typography>

                <Typography variant="caption" color="secondary" className="mb-4 block">
                    This is a mock PayPal integration for testing purposes. Click the PayPal button to simulate payment.
                </Typography>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onErrorPayPal}
                            onCancel={onCancelPayPal}
                            style={{
                                layout: 'vertical',
                                color: 'blue',
                                shape: 'rect',
                                label: 'paypal'
                            }}
                            disabled={isProcessing}
                        />
                    </div>

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

                {isProcessing && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
                        <Typography variant="body">Processing payment...</Typography>
                    </div>
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

export function PayPalPayment(props: PayPalPaymentProps) {
    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PRIVATE__PAYPAL_CLIENT_ID || 'mock_paypal_client_id',
            currency: props.currency || 'USD'
        }}>
            <PayPalPaymentForm {...props} />
        </PayPalScriptProvider>
    )
}