'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'

export function ReviewStep() {
    const { data, prevStep, setProcessing, setError } = useCheckout()
    const { items, total, clearCart } = useCart()
    const [orderNotes, setOrderNotes] = useState(data.orderNotes || '')
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const handlePlaceOrder = async () => {
        if (!data.shippingAddress || !data.billingAddress || !data.paymentMethod) {
            setError('Missing required information. Please go back and complete all steps.')
            return
        }

        setIsPlacingOrder(true)
        setProcessing(true)
        setError(null)

        try {
            // Create order via API
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shipping_address: data.shippingAddress,
                    billing_address: data.billingAddress,
                    payment_method: data.paymentMethod,
                    order_notes: orderNotes
                }),
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok || !orderData.success) {
                throw new Error(orderData.message || 'Failed to create order')
            }

            const { order_id, order_number } = orderData.data

            // If payment method requires payment processing
            if (data.paymentMethod !== 'cod') {
                // Create Razorpay order
                const paymentResponse = await fetch('/api/payments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        order_id,
                        amount: (total + (total > 99 ? 0 : 5.99) + (total * 0.08)).toFixed(2),
                        currency: 'INR'
                    }),
                })

                const paymentData = await paymentResponse.json()

                if (!paymentResponse.ok || !paymentData.success) {
                    throw new Error(paymentData.message || 'Failed to create payment order')
                }

                // For demo purposes, simulate payment success
                // In real implementation, this would integrate with Razorpay SDK
                const verifyResponse = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        razorpay_order_id: paymentData.data.id,
                        razorpay_payment_id: `pay_${Date.now()}`,
                        razorpay_signature: 'demo_signature',
                        order_id
                    }),
                })

                const verifyData = await verifyResponse.json()

                if (!verifyResponse.ok || !verifyData.success) {
                    throw new Error(verifyData.message || 'Payment verification failed')
                }
            }

            // Clear cart on successful order
            clearCart()

            // Redirect to order confirmation page
            window.location.href = `/order-confirmation?order=${order_number}`

        } catch (error) {
            console.error('Order placement failed:', error)
            setError(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
        } finally {
            setIsPlacingOrder(false)
            setProcessing(false)
        }
    }

    const shipping = total > 99 ? 0 : 5.99
    const tax = total * 0.08
    const finalTotal = total + shipping + tax

    return (
        <Card className="p-6">
            <Typography variant="h3" weight="bold" className="mb-6">
                Review & Place Order
            </Typography>

            <div className="space-y-6">
                {/* Shipping Address */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Shipping Address
                    </Typography>
                    {data.shippingAddress && (
                        <div className="p-4 bg-secondary-50 rounded-lg">
                            <Typography variant="body" weight="semibold">
                                {data.shippingAddress.firstName} {data.shippingAddress.lastName}
                            </Typography>
                            <Typography variant="body">
                                {data.shippingAddress.address1}
                                {data.shippingAddress.address2 && `, ${data.shippingAddress.address2}`}
                            </Typography>
                            <Typography variant="body">
                                {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.zipCode}
                            </Typography>
                            <Typography variant="body">
                                {data.shippingAddress.country}
                            </Typography>
                            {data.shippingAddress.phone && (
                                <Typography variant="body">
                                    Phone: {data.shippingAddress.phone}
                                </Typography>
                            )}
                        </div>
                    )}
                </div>

                {/* Billing Address */}
                {data.billingAddress && data.billingAddress.id !== data.shippingAddress?.id && (
                    <div className="space-y-4">
                        <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                            Billing Address
                        </Typography>
                        <div className="p-4 bg-secondary-50 rounded-lg">
                            <Typography variant="body" weight="semibold">
                                {data.billingAddress.firstName} {data.billingAddress.lastName}
                            </Typography>
                            <Typography variant="body">
                                {data.billingAddress.address1}
                                {data.billingAddress.address2 && `, ${data.billingAddress.address2}`}
                            </Typography>
                            <Typography variant="body">
                                {data.billingAddress.city}, {data.billingAddress.state} {data.billingAddress.zipCode}
                            </Typography>
                            <Typography variant="body">
                                {data.billingAddress.country}
                            </Typography>
                            {data.billingAddress.phone && (
                                <Typography variant="body">
                                    Phone: {data.billingAddress.phone}
                                </Typography>
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Method */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Payment Method
                    </Typography>
                    <div className="p-4 bg-secondary-50 rounded-lg">
                        <Typography variant="body" weight="semibold">
                            {data.paymentMethod === 'card' && 'Credit/Debit Card'}
                            {data.paymentMethod === 'upi' && 'UPI'}
                            {data.paymentMethod === 'netbanking' && 'Net Banking'}
                            {data.paymentMethod === 'wallet' && 'Digital Wallet'}
                            {data.paymentMethod === 'cod' && 'Cash on Delivery'}
                        </Typography>
                    </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Order Items
                    </Typography>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-secondary-50 rounded-lg">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary-100">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Typography variant="subtitle" weight="semibold">
                                        {item.product.name}
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Quantity: {item.quantity}
                                    </Typography>
                                </div>
                                <Typography variant="body" weight="semibold">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Notes */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Order Notes (Optional)
                    </Typography>
                    <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Order Summary */}
                <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Order Summary
                    </Typography>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Typography variant="body">Subtotal</Typography>
                            <Typography variant="body">${total.toFixed(2)}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="body">Shipping</Typography>
                            <Typography variant="body">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="body">Tax</Typography>
                            <Typography variant="body">${tax.toFixed(2)}</Typography>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-secondary-200">
                            <Typography variant="subtitle" weight="bold">Total</Typography>
                            <Typography variant="subtitle" weight="bold" color="primary">
                                ${finalTotal.toFixed(2)}
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={prevStep}
                        disabled={isPlacingOrder}
                    >
                        Back to Payment
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                    >
                        {isPlacingOrder ? 'Placing Order...' : `Place Order - $${finalTotal.toFixed(2)}`}
                    </Button>
                </div>

                <Typography variant="caption" color="secondary" className="text-center">
                    By placing your order, you agree to our{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
                </Typography>
            </div>
        </Card>
    )
}