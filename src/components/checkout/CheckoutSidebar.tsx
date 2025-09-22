'use client'

import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/atoms/Typography'
import { useCart } from '@/contexts/CartContext'

export function CheckoutSidebar() {
    const { items, total } = useCart()

    const shipping = total > 99 ? 0 : 5.99
    const tax = total * 0.08
    const finalTotal = total + shipping + tax

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 sticky top-8">
                <Typography variant="h3" weight="bold" className="mb-6">
                    Order Summary
                </Typography>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
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
                                    Qty: {item.quantity}
                                </Typography>
                            </div>
                            <Typography variant="body" weight="semibold">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </Typography>
                        </div>
                    ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Typography variant="body">
                            Subtotal
                        </Typography>
                        <Typography variant="body">
                            ${total.toFixed(2)}
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography variant="body">
                            Shipping
                        </Typography>
                        <Typography variant="body">
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography variant="body">
                            Tax
                        </Typography>
                        <Typography variant="body">
                            ${tax.toFixed(2)}
                        </Typography>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-secondary-200">
                        <Typography variant="subtitle" weight="bold">
                            Total
                        </Typography>
                        <Typography variant="subtitle" weight="bold" color="primary">
                            ${finalTotal.toFixed(2)}
                        </Typography>
                    </div>
                </div>

                {/* Free Shipping Notice */}
                {total < 99 && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                        <Typography variant="caption" className="text-primary-700">
                            Add ${(99 - total).toFixed(2)} more for free shipping!
                        </Typography>
                    </div>
                )}
            </Card>
        </div>
    )
}