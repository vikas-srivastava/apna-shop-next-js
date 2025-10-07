'use client'

import { useState, useEffect } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'

// Initialize Stripe with mock publishable key for testing
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key')

interface StripePaymentProps {
    amount: number
    currency?: string
    onSuccess: (paymentIntentId: string) => void
    onError: (error: string) => void
    onCancel?: () => void
    embedded?: boolean
}

function StripePaymentForm({ amount, currency = 'usd', onSuccess, onError, onCancel }: StripePaymentProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [lastError, setLastError] = useState<string | null>(null)
    const maxRetries = 3

    const verifyPayment = async (paymentIntentId: string) => {
        try {
            const response = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gateway: 'stripe',
                    order_id: `order_${Date.now()}`, // Mock order ID
                    payment_id: paymentIntentId,
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setMessage(null)
        setLastError(null)

        try {
            // Mock payment processing
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing delay

            // Simulate success/failure randomly for testing
            const isSuccess = Math.random() > 0.3 // 70% success rate

            if (isSuccess) {
                const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

                // Verify payment with backend
                await verifyPayment(mockPaymentIntentId)

                setMessage('Payment successful!')
                onSuccess(mockPaymentIntentId)
                setRetryCount(0) // Reset retry count on success
            } else {
                throw new Error('Payment failed. Please try again.')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
            setMessage(errorMessage)
            setLastError(errorMessage)
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1)
            handleSubmit({ preventDefault: () => { } } as React.FormEvent)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
                <Typography variant="subtitle" weight="semibold" className="mb-2">
                    Stripe Payment
                </Typography>
                <Typography variant="body" className="text-secondary-600 mb-4">
                    Amount: {currency.toUpperCase()} ${(amount / 100).toFixed(2)}
                </Typography>

                {/* Mock Payment Element */}
                <div className="space-y-3 p-3 border border-secondary-200 rounded">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Card Number:</span>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="flex-1 px-2 py-1 border border-secondary-300 rounded text-sm"
                            defaultValue="4242 4242 4242 4242"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Expiry:</span>
                        <input
                            type="text"
                            placeholder="12/34"
                            className="w-20 px-2 py-1 border border-secondary-300 rounded text-sm"
                            defaultValue="12/34"
                        />
                        <span className="text-sm font-medium">CVC:</span>
                        <input
                            type="text"
                            placeholder="123"
                            className="w-16 px-2 py-1 border border-secondary-300 rounded text-sm"
                            defaultValue="123"
                        />
                    </div>
                </div>

                <Typography variant="caption" color="secondary" className="mt-2">
                    This is a mock Stripe integration for testing purposes. Use test card numbers like 4242 4242 4242 4242.
                </Typography>
            </div>

            {message && (
                <div className={`p-3 rounded ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <Typography variant="body">{message}</Typography>
                </div>
            )}

            <div className="flex space-x-3">
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

                <div className="flex gap-3 flex-1">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={!stripe || isProcessing}
                        className="flex-1"
                    >
                        {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
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
            </div>
        </form>
    )
}

export function StripePayment(props: StripePaymentProps) {
    const [clientSecret, setClientSecret] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Create mock payment intent
        const createPaymentIntent = async () => {
            try {
                const response = await fetch('/api/payments/stripe/create-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: props.amount,
                        currency: props.currency || 'usd'
                    })
                })

                const data = await response.json()
                if (data.success) {
                    setClientSecret(data.clientSecret)
                    setError(null)
                } else {
                    const errorMsg = 'Failed to initialize payment'
                    setError(errorMsg)
                    props.onError(errorMsg)
                }
            } catch (error) {
                const errorMsg = 'Failed to initialize payment'
                setError(errorMsg)
                props.onError(errorMsg)
            }
        }

        createPaymentIntent()
    }, [props.amount, props.currency, props.onError])

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <Typography variant="body" className="text-red-600 mb-4">{error}</Typography>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center p-8">
                <Typography variant="body">Loading payment form...</Typography>
            </div>
        )
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm {...props} />
        </Elements>
    )
}