'use client'

import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams?.get('order') || null
    const paymentId = searchParams?.get('payment') || null
    const isPayment = !!paymentId

    return (
        <div className="container-theme py-8">
            <div className="max-w-2xl mx-auto">
                <Card className="p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <Typography variant="h2" weight="bold" className="text-green-600 mb-2">
                            {isPayment ? 'Payment Successful!' : 'Order Confirmed!'}
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-6">
                            {isPayment
                                ? 'Your payment has been processed successfully. Your order is being prepared.'
                                : 'Thank you for your order. We\'ll send you shipping updates at the email address provided.'
                            }
                        </Typography>
                    </div>

                    {orderNumber && (
                        <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                Order Details
                            </Typography>
                            <Typography variant="body">
                                Order Number: <span className="font-semibold">{orderNumber}</span>
                            </Typography>
                        </div>
                    )}

                    {paymentId && (
                        <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                Payment Details
                            </Typography>
                            <Typography variant="body">
                                Payment ID: <span className="font-semibold">{paymentId}</span>
                            </Typography>
                            <Typography variant="caption" color="secondary">
                                Your order will be processed shortly.
                            </Typography>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/account/orders">
                                View Orders
                            </Link>
                        </Button>
                        <Button variant="secondary" size="lg" asChild>
                            <Link href="/products">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}