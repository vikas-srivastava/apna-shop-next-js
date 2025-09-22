'use client'

import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext'
import { ShippingStep } from '@/components/checkout/ShippingStep'
import { PaymentStep } from '@/components/checkout/PaymentStep'
import { ReviewStep } from '@/components/checkout/ReviewStep'
import { CheckoutSidebar } from '@/components/checkout/CheckoutSidebar'
import { useCart } from '@/contexts/CartContext'

function CheckoutContent() {
    const { currentStep, error } = useCheckout()
    const { items } = useCart()

    if (items.length === 0) {
        return (
            <div className="container-theme py-8">
                <div className="text-center py-12">
                    <Typography variant="h2" weight="bold" className="mb-4">
                        Your Cart is Empty
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-8">
                        Add items to your cart before checking out.
                    </Typography>
                    <Button variant="primary" size="lg" asChild>
                        <Link href="/products">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <ShippingStep />
            case 2:
                return <PaymentStep />
            case 3:
                return <ReviewStep />
            default:
                return <ShippingStep />
        }
    }

    return (
        <div className="container-theme py-8">
            <Typography variant="h1" weight="bold" className="mb-8">
                Checkout
            </Typography>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Typography variant="body" color="error">
                        {error}
                    </Typography>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <Typography variant="h2" weight="bold">
                                Step {currentStep} of 3
                            </Typography>
                        </div>
                        <div className="flex items-center space-x-4">
                            {[
                                { id: 1, name: 'Shipping' },
                                { id: 2, name: 'Payment' },
                                { id: 3, name: 'Review' }
                            ].map((step) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step.id < currentStep
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : step.id === currentStep
                                                ? 'border-primary-500 text-primary-500'
                                                : 'border-secondary-300 text-secondary-400'
                                        }`}>
                                        {step.id < currentStep ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm font-semibold">{step.id}</span>
                                        )}
                                    </div>
                                    <Typography
                                        variant="subtitle"
                                        weight={step.id === currentStep ? 'semibold' : 'normal'}
                                        className={`ml-2 ${step.id === currentStep ? 'text-primary-600' : step.id < currentStep ? 'text-secondary-600' : 'text-secondary-400'}`}
                                    >
                                        {step.name}
                                    </Typography>
                                    {step.id < 3 && (
                                        <div className={`w-12 h-px mx-4 ${step.id < currentStep ? 'bg-primary-500' : 'bg-secondary-300'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {renderCurrentStep()}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <CheckoutSidebar />
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <ProtectedRoute>
            <CheckoutProvider>
                <CheckoutContent />
            </CheckoutProvider>
        </ProtectedRoute>
    )
}