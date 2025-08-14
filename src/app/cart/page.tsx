'use client'

import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/ui/Card'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { Plus, Minus, X } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

/**
 * Cart page
 */
export default function CartPage() {
    const { items, total, itemCount, updateQuantity, removeItem } = useCart()

    const handleQuantityChange = async (id: string, delta: number) => {
        const item = items.find(item => item.id === id)
        if (item) {
            const newQuantity = item.quantity + delta
            if (newQuantity <= 0) {
                await removeItem(id)
            } else {
                updateQuantity(id, newQuantity)
            }
        }
    }

    if (items.length === 0) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <div className="text-center py-12">
                        <Typography variant="h2" weight="bold" className="mb-4">
                            Your Cart is Empty
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </Typography>
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/products">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    Your Shopping Cart
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-secondary-200 last:border-0 last:pb-0">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary-100">
                                            <img
                                                src={item.product.images[0] || '/globe.svg'}
                                                alt={item.product.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <Typography variant="subtitle" weight="semibold">
                                                {item.product.name}
                                            </Typography>
                                            {item.selectedSize && (
                                                <Typography variant="caption" color="secondary">
                                                    Size: {item.selectedSize}
                                                </Typography>
                                            )}
                                            {item.selectedColor && (
                                                <Typography variant="caption" color="secondary">
                                                    Color: {item.selectedColor}
                                                </Typography>
                                            )}
                                            <Typography variant="body" weight="semibold" color="primary" className="mt-1">
                                                ${item.product.price.toFixed(2)}
                                            </Typography>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={async () => await handleQuantityChange(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-10 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={async () => await handleQuantityChange(item.id, 1)}
                                                disabled={item.quantity >= item.product.stockCount}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="w-24 text-right">
                                            <Typography variant="body" weight="semibold">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async () => await removeItem(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="p-6">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Order Summary
                            </Typography>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <Typography variant="body">
                                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                                    </Typography>
                                    <Typography variant="body" weight="semibold">
                                        ${total.toFixed(2)}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body">
                                        Shipping
                                    </Typography>
                                    <Typography variant="body" weight="semibold">
                                        {total > 99 ? 'Free' : '$5.99'}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body">
                                        Tax
                                    </Typography>
                                    <Typography variant="body" weight="semibold">
                                        ${(total * 0.08).toFixed(2)}
                                    </Typography>
                                </div>
                                <div className="border-t border-secondary-200 pt-4">
                                    <div className="flex justify-between">
                                        <Typography variant="subtitle" weight="bold">
                                            Total
                                        </Typography>
                                        <Typography variant="h4" weight="bold" color="primary">
                                            ${(total + (total > 99 ? 0 : 5.99) + (total * 0.08)).toFixed(2)}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <Button variant="primary" size="lg" className="w-full mb-4" asChild>
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>

                            <Button variant="secondary" className="w-full" asChild>
                                <Link href="/products">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}