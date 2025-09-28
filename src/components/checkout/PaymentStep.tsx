'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Typography } from '@/components/atoms/Typography'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import dynamic from 'next/dynamic'

// Lazy load payment components for better code splitting
const StripePayment = dynamic(() => import('./StripePayment').then(mod => ({ default: mod.StripePayment })), {
    loading: () => <div className="animate-pulse bg-secondary-100 rounded-lg p-4">Loading Stripe payment...</div>
})

const PayPalPayment = dynamic(() => import('./PayPalPayment').then(mod => ({ default: mod.PayPalPayment })), {
    loading: () => <div className="animate-pulse bg-secondary-100 rounded-lg p-4">Loading PayPal payment...</div>
})

const RazorpayPayment = dynamic(() => import('./RazorpayPayment').then(mod => ({ default: mod.RazorpayPayment })), {
    loading: () => <div className="animate-pulse bg-secondary-100 rounded-lg p-4">Loading Razorpay payment...</div>
})

interface PaymentFormData {
    method: string
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    cardholderName: string
    upiId: string
}

export function PaymentStep() {
    const { data, updateData, nextStep, prevStep, setProcessing, setError } = useCheckout()
    const { total } = useCart()
    const [selectedMethod, setSelectedMethod] = useState(data.paymentMethod || '')
    const [formData, setFormData] = useState<PaymentFormData>({
        method: data.paymentMethod || '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        upiId: ''
    })
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [paymentError, setPaymentError] = useState<string | null>(null)

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Credit/Debit Card (Stripe)',
            icon: '💳',
            description: 'Visa, Mastercard, American Express'
        },
        {
            id: 'paypal',
            name: 'PayPal',
            icon: '🅿️',
            description: 'Pay with PayPal account'
        },
        {
            id: 'razorpay',
            name: 'Razorpay',
            icon: '₹',
            description: 'UPI, Cards, Net Banking'
        },
        {
            id: 'card',
            name: 'Credit/Debit Card (Manual)',
            icon: '💳',
            description: 'Manual card entry'
        },
        {
            id: 'upi',
            name: 'UPI',
            icon: '📱',
            description: 'Google Pay, PhonePe, Paytm'
        },
        {
            id: 'netbanking',
            name: 'Net Banking',
            icon: '🏦',
            description: 'Direct bank transfer'
        },
        {
            id: 'wallet',
            name: 'Digital Wallet',
            icon: '👛',
            description: 'Apple Pay, Google Pay'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            icon: '💵',
            description: 'Pay when you receive'
        }
    ]

    const handleMethodSelect = (methodId: string) => {
        setSelectedMethod(methodId)
        setFormData(prev => ({ ...prev, method: methodId }))
    }

    const handleInputChange = (field: keyof PaymentFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePaymentSuccess = (paymentId: string, orderId?: string) => {
        if (selectedMethod === 'stripe' || selectedMethod === 'paypal' || selectedMethod === 'razorpay') {
            // Redirect to confirmation page for Stripe, PayPal, and Razorpay
            window.location.href = `/order-confirmation?payment=${paymentId}`
        } else {
            setPaymentSuccess(true)
            setPaymentError(null)
            setProcessing(false)
            updateData({
                paymentMethod: selectedMethod,
                paymentId,
                orderId
            })
            // Auto proceed to next step after successful payment
            setTimeout(() => nextStep(), 1000)
        }
    }

    const handlePaymentError = (error: string) => {
        setPaymentError(error)
        setPaymentSuccess(false)
        setProcessing(false)
        setError(error)
    }

    const handlePaymentCancel = () => {
        setProcessing(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!selectedMethod) return

        // For gateway payments, the payment component handles the flow
        if (['stripe', 'paypal', 'razorpay'].includes(selectedMethod)) {
            setProcessing(true)
            return
        }

        if (selectedMethod === 'card') {
            if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv || !formData.cardholderName) {
                return
            }
        } else if (selectedMethod === 'upi') {
            if (!formData.upiId) return
        }

        updateData({
            paymentMethod: selectedMethod
        })

        nextStep()
    }

    const isFormValid = () => {
        if (!selectedMethod) return false

        // Gateway payments handle their own validation
        if (['stripe', 'paypal', 'razorpay'].includes(selectedMethod)) {
            return true
        }

        if (selectedMethod === 'card') {
            return formData.cardNumber && formData.expiryMonth && formData.expiryYear && formData.cvv && formData.cardholderName
        } else if (selectedMethod === 'upi') {
            return formData.upiId
        }

        return true // For other methods that don't require additional info
    }

    const getSubmitButtonText = () => {
        if (['stripe', 'paypal', 'razorpay'].includes(selectedMethod)) {
            return 'Proceed to Payment'
        }
        return 'Review Order'
    }

    return (
        <Card className="p-6">
            <Typography variant="h3" weight="bold" className="mb-6">
                Payment Method
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Select Payment Method
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => handleMethodSelect(method.id)}
                                className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${selectedMethod === method.id
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                            >
                                <span className="text-2xl">{method.icon}</span>
                                <div className="text-center">
                                    <Typography variant="subtitle" weight="semibold" className="text-sm">
                                        {method.name}
                                    </Typography>
                                    <Typography variant="caption" color="secondary" className="text-xs">
                                        {method.description}
                                    </Typography>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Gateway Components */}
                {selectedMethod === 'stripe' && (
                    <div className="space-y-4">
                        <StripePayment
                            amount={Math.round((total + (total > 99 ? 0 : 5.99) + (total * 0.08)) * 100)}
                            currency="usd"
                            onSuccess={(paymentIntentId) => handlePaymentSuccess(paymentIntentId)}
                            onError={handlePaymentError}
                            onCancel={handlePaymentCancel}
                        />
                    </div>
                )}

                {selectedMethod === 'paypal' && (
                    <div className="space-y-4">
                        <PayPalPayment
                            amount={Math.round((total + (total > 99 ? 0 : 5.99) + (total * 0.08)) * 100)}
                            currency="USD"
                            onSuccess={(orderId) => handlePaymentSuccess(orderId, orderId)}
                            onError={handlePaymentError}
                            onCancel={handlePaymentCancel}
                        />
                    </div>
                )}

                {selectedMethod === 'razorpay' && (
                    <div className="space-y-4">
                        <RazorpayPayment
                            amount={Math.round((total + (total > 99 ? 0 : 5.99) + (total * 0.08)) * 100)} // Amount in paise
                            currency="INR"
                            onSuccess={(paymentId, orderId) => handlePaymentSuccess(paymentId, orderId)}
                            onError={handlePaymentError}
                            onCancel={handlePaymentCancel}
                        />
                    </div>
                )}

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

                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                        <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                            Card Information
                        </Typography>
                        <Input
                            label="Cardholder Name"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Card Number"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Expiry Month"
                                value={formData.expiryMonth}
                                onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                                placeholder="MM"
                                maxLength={2}
                                required
                            />
                            <Input
                                label="Expiry Year"
                                value={formData.expiryYear}
                                onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                                placeholder="YY"
                                maxLength={2}
                                required
                            />
                            <Input
                                label="CVV"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                placeholder="123"
                                maxLength={3}
                                required
                            />
                        </div>
                    </div>
                )}

                {/* UPI Payment Form */}
                {selectedMethod === 'upi' && (
                    <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                        <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                            UPI Information
                        </Typography>
                        <Input
                            label="UPI ID"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            placeholder="user@paytm"
                            required
                        />
                        <Typography variant="caption" color="secondary">
                            Enter your UPI ID (e.g., user@paytm, user@ybl, user@okhdfcbank)
                        </Typography>
                    </div>
                )}

                {/* Other Payment Methods Info */}
                {selectedMethod && !['card', 'upi'].includes(selectedMethod) && (
                    <div className="p-4 bg-secondary-50 rounded-lg">
                        <Typography variant="body">
                            {selectedMethod === 'cod'
                                ? 'You will pay for your order when it is delivered to your address.'
                                : selectedMethod === 'netbanking'
                                    ? 'You will be redirected to your bank\'s website to complete the payment.'
                                    : 'You will be redirected to complete the payment securely.'
                            }
                        </Typography>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={prevStep}
                    >
                        Back to Shipping
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={!isFormValid()}
                    >
                        {getSubmitButtonText()}
                    </Button>
                </div>
            </form>
        </Card>
    )
}