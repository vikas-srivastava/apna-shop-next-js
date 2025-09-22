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

    const paypalOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'mock_paypal_client_id',
        currency: currency.toUpperCase(),
        'enable-funding': 'venmo',
        'disable-funding': 'paylater,card',
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
                throw new Error('Failed to create PayPal order')
            }
        } catch (error) {
            onError('Failed to create PayPal order')
            throw error
        }
    }

    const onApprove = async (data: any) => {
        setIsProcessing(true)
        try {
            // Mock order capture
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate success/failure
            const isSuccess = Math.random() > 0.2 // 80% success rate

            if (isSuccess) {
                onSuccess(data.orderID)
            } else {
                throw new Error('Payment capture failed')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment failed'
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const onErrorPayPal = (error: any) => {
        onError('PayPal payment error occurred')
    }

    const onCancelPayPal = () => {
        if (onCancel) onCancel()
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

                {isProcessing && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
                        <Typography variant="body">Processing payment...</Typography>
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
                    Cancel
                </Button>
            )}
        </div>
    )
}

export function PayPalPayment(props: PayPalPaymentProps) {
    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'mock_paypal_client_id',
            currency: props.currency || 'USD'
        }}>
            <PayPalPaymentForm {...props} />
        </PayPalScriptProvider>
    )
}