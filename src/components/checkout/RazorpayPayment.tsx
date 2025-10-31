'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import Script from 'next/script'

// Declare Razorpay types for TypeScript
declare global {
    interface Window {
        Razorpay: any
        razorpayOpenInProgress?: boolean
    }
}

interface RazorpayPaymentProps {
    amount: number
    currency?: string
    orderId?: string
    method?: string
    autoTrigger?: boolean
    onSuccess: (paymentId: string, orderId: string) => void
    onError: (error: string) => void
    onCancel?: () => void
}

export function RazorpayPayment({
    amount,
    currency = 'INR',
    orderId,
    method,
    autoTrigger = false,
    onSuccess,
    onError,
    onCancel
}: RazorpayPaymentProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [isSdkLoaded, setIsSdkLoaded] = useState(false)
    const [lastError, setLastError] = useState<string | null>(null)
    const [razorpayInstance, setRazorpayInstance] = useState<any>(null)
    const maxRetries = 3
    const hasTriggeredRef = useRef(false)
    const sdkLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Check if SDK is loaded
    const checkSdkLoaded = () => {
        if (window.Razorpay) {

            setIsSdkLoaded(true)
            return true
        }
                return false
    }

    // Check periodically until loaded
    useEffect(() => {
        if (checkSdkLoaded()) return

        const interval = setInterval(() => {
            if (!isSdkLoaded && checkSdkLoaded()) {
                clearInterval(interval)
                if (sdkLoadTimeoutRef.current) {
                    clearTimeout(sdkLoadTimeoutRef.current)
                    sdkLoadTimeoutRef.current = null
                }
            }
        }, 500)

        // Set timeout for SDK loading
        sdkLoadTimeoutRef.current = setTimeout(() => {
            if (!isSdkLoaded) {
                console.error('[Razorpay Debug] SDK load timeout')
                setLastError('Failed to load Razorpay SDK. Please check your internet connection and try again.')
                onError('Failed to load Razorpay SDK. Please check your internet connection and try again.')
                clearInterval(interval)
            }
        }, 10000) // 10 seconds timeout

        return () => {
            clearInterval(interval)
            if (sdkLoadTimeoutRef.current) {
                clearTimeout(sdkLoadTimeoutRef.current)
                sdkLoadTimeoutRef.current = null
            }
        }
    }, [isSdkLoaded])

    // Auto-trigger payment when SDK is loaded and autoTrigger is true
    useEffect(() => {
        if (autoTrigger && isSdkLoaded && !isProcessing && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true
            handlePayment()
        }
    }, [autoTrigger, isSdkLoaded, isProcessing])

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

            const text = await response.text()
            const data = text ? JSON.parse(text) : {}
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

            const text = await response.text()
            const data = text ? JSON.parse(text) : {}
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

        if (!isSdkLoaded) {
            onError('Razorpay SDK not loaded. Please refresh the page and try again.')
            return
        }

        if (window.razorpayOpenInProgress) {

            return
        }

        window.razorpayOpenInProgress = true
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
                method: method || 'card',
                handler: function (response: any) {

                    // Reset flag on success
                    window.razorpayOpenInProgress = false
                    // Call onSuccess immediately for synchronous response to Razorpay

                    onSuccess(response.razorpay_payment_id, response.razorpay_order_id)
                    setRetryCount(0) // Reset retry count on success

                    // Verify payment asynchronously in background

                    verifyPayment(
                        response.razorpay_payment_id,
                        response.razorpay_order_id,
                        response.razorpay_signature
                    ).then(() => {

                    }).catch((verifyError) => {
                        console.error('[Razorpay Debug] Background verification error:', verifyError)
                        const errorMsg = verifyError instanceof Error ? verifyError.message : 'Payment verification failed'
                        setLastError(errorMsg)
                        onError(errorMsg)
                    })
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
    
                        window.razorpayOpenInProgress = false
                        if (onCancel) onCancel()
                        // Cleanup instance on dismiss

                        setRazorpayInstance(null)
                    },
                    confirm_close: true,
                    escape: true
                }
            }

            const rzp = new window.Razorpay(options)
            try {
                rzp.open()

            } catch (openError) {
                console.error('[Razorpay Debug] Error opening Razorpay modal:', openError)
                throw new Error('Failed to open payment modal')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed'
            setLastError(errorMessage)
            onError(errorMessage)
        } finally {
            setIsProcessing(false)
            window.razorpayOpenInProgress = false
        }
    }

    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1)
            handlePayment()
        }
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"

                onError={(e) => {
                    console.error('[Razorpay Debug] Script load error:', e)
                    setLastError('Failed to load Razorpay SDK')
                    onError('Failed to load Razorpay SDK')
                }}
            />
            <div className="space-y-4">
                <div className="p-4 bg-secondary-50 rounded-lg">
                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                        Razorpay Payment
                    </Typography>
                    <Typography variant="body" className="text-secondary-600 mb-4">
                        Amount: {currency.toUpperCase()} ₹{(amount / 100).toFixed(2)}
                    </Typography>



                    {!autoTrigger && (
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                onClick={handlePayment}
                                disabled={isProcessing || !isSdkLoaded}
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
                    )}

                    {!isSdkLoaded && (
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
        </>
    )
}
