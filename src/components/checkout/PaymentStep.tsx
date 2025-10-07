'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/atoms/Typography'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import dynamic from 'next/dynamic'

// Lazy load Razorpay component
const RazorpayPayment = dynamic(() => import('./RazorpayPayment').then(mod => ({ default: mod.RazorpayPayment })), {
    loading: () => <div className="animate-pulse bg-secondary-100 rounded-lg p-4">Loading payment...</div>
})

export function PaymentStep() {
    const { updateData, nextStep, prevStep, setProcessing, setError } = useCheckout()
    const { total } = useCart()
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const [showRazorpay, setShowRazorpay] = useState(false)

    const isRazorpayEnabled = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    const handleCODSelect = () => {
        updateData({ paymentMethod: 'cod' })
        nextStep()
    }

    const handlePayNow = () => {
        if (isRazorpayEnabled && !showRazorpay) {
            setShowRazorpay(true)
            setProcessing(true)
        }
    }

    const handlePaymentSuccess = (paymentId: string, orderId?: string) => {
        // Redirect to confirmation page for Razorpay payments
        window.location.href = `/order-confirmation?payment=${paymentId}`
    }

    const handlePaymentError = (error: string) => {
        setPaymentError(error)
        setPaymentSuccess(false)
        setProcessing(false)
        setError(error)
    }

    const handlePaymentCancel = () => {
        setProcessing(false)
        setShowRazorpay(false)
    }

    return (
        <Card className="p-6">
            <Typography variant="h3" weight="bold" className="mb-6">
                Payment Method
            </Typography>

            <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Select Payment Method
                    </Typography>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleCODSelect}
                            className="flex-1 px-6 py-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex flex-col items-center gap-2"
                            aria-label="Select Cash on Delivery payment method"
                        >
                            <span className="text-2xl">💵</span>
                            <div className="text-center">
                                <Typography variant="subtitle" weight="semibold" className="text-sm">
                                    Cash on Delivery
                                </Typography>
                                <Typography variant="caption" color="secondary" className="text-xs">
                                    Pay when you receive
                                </Typography>
                            </div>
                        </button>
                        {isRazorpayEnabled && (
                            <button
                                type="button"
                                onClick={handlePayNow}
                                className="flex-1 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex flex-col items-center gap-2"
                                aria-label="Pay now with Razorpay"
                            >
                                <span className="text-2xl">💳</span>
                                <div className="text-center">
                                    <Typography variant="subtitle" weight="semibold" className="text-sm">
                                        Pay Now
                                    </Typography>
                                    <Typography variant="caption" color="secondary" className="text-xs">
                                        Secure online payment
                                    </Typography>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Success/Error Messages */}
                {paymentSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <Typography variant="body" className="text-green-700">
                            ✅ Payment successful! Proceeding to review...
                        </Typography>
                    </div>
                )}

                {paymentError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <Typography variant="body" className="text-red-700">
                            ❌ {paymentError}
                        </Typography>
                    </div>
                )}

                <div className="flex justify-start pt-4">
                    <button
                        type="button"
                        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        onClick={prevStep}
                    >
                        Back to Shipping
                    </button>
                </div>
            </div>

            {/* Razorpay Payment Component */}
            {showRazorpay && isRazorpayEnabled && (
                <div className="mt-6">
                    <RazorpayPayment
                        amount={Math.round((total + (total > 99 ? 0 : 5.99) + (total * 0.08)) * 100)} // Amount in paise
                        currency="INR"
                        autoTrigger={true}
                        onSuccess={(paymentId, orderId) => handlePaymentSuccess(paymentId, orderId)}
                        onError={handlePaymentError}
                        onCancel={handlePaymentCancel}
                    />
                </div>
            )}
        </Card>
    )
}