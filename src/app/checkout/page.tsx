'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

/**
 * Checkout page
 */
export default function CheckoutPage() {
    const { items, total, itemCount } = useCart()

    // Mock address data
    const addresses = [
        {
            id: "1",
            name: "John Doe",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
            isDefault: true
        }
    ]

    // Mock payment methods
    const paymentMethods = [
        {
            id: "1",
            type: "Visa",
            number: "**** **** **** 1234",
            expiry: "12/2025",
            isDefault: true
        }
    ]

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

    return (
        <div className="container-theme py-8">
            <Typography variant="h1" weight="bold" className="mb-8">
                Checkout
            </Typography>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <Card className="p-6">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Shipping Address
                        </Typography>
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div key={address.id} className="flex items-start gap-3 p-4 border border-secondary-200 rounded-lg">
                                    <input
                                        type="radio"
                                        id={`address-${address.id}`}
                                        name="shipping-address"
                                        defaultChecked={address.isDefault}
                                        className="mt-1"
                                    />
                                    <label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                                        <Typography variant="subtitle" weight="semibold">
                                            {address.name}
                                        </Typography>
                                        <Typography variant="body">
                                            {address.street}
                                        </Typography>
                                        <Typography variant="body">
                                            {address.city}, {address.state} {address.zip}
                                        </Typography>
                                        <Typography variant="body">
                                            {address.country}
                                        </Typography>
                                    </label>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            ))}
                            <Button variant="secondary" className="w-full">
                                Add New Address
                            </Button>
                        </div>
                    </Card>

                    {/* Payment Method */}
                    <Card className="p-6">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Payment Method
                        </Typography>
                        <div className="space-y-4">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg">
                                    <input
                                        type="radio"
                                        id={`payment-${method.id}`}
                                        name="payment-method"
                                        defaultChecked={method.isDefault}
                                        className="mt-1"
                                    />
                                    <label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-6 bg-secondary-200 rounded flex items-center justify-center">
                                                <Typography variant="caption" weight="bold">
                                                    {method.type.charAt(0)}
                                                </Typography>
                                            </div>
                                            <Typography variant="subtitle" weight="semibold">
                                                {method.type}
                                            </Typography>
                                        </div>
                                        <Typography variant="body">
                                            {method.number}
                                        </Typography>
                                    </label>
                                </div>
                            ))}
                            <Button variant="secondary" className="w-full">
                                Add New Payment Method
                            </Button>
                        </div>
                    </Card>

                    {/* Order Summary for Mobile */}
                    <Card className="p-6 lg:hidden">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Order Summary
                        </Typography>
                        <div className="space-y-4">
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
                            <div className="border-t border-secondary-200 pt-4 space-y-2">
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
                                        {total > 99 ? 'Free' : '$5.99'}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body">
                                        Tax
                                    </Typography>
                                    <Typography variant="body">
                                        ${(total * 0.08).toFixed(2)}
                                    </Typography>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-secondary-200">
                                    <Typography variant="subtitle" weight="bold">
                                        Total
                                    </Typography>
                                    <Typography variant="subtitle" weight="bold" color="primary">
                                        ${(total + (total > 99 ? 0 : 5.99) + (total * 0.08)).toFixed(2)}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="hidden lg:block">
                    <Card className="p-6 sticky top-8">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Order Summary
                        </Typography>
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
                        <div className="space-y-4 mb-6">
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
                                    {total > 99 ? 'Free' : '$5.99'}
                                </Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography variant="body">
                                    Tax
                                </Typography>
                                <Typography variant="body">
                                    ${(total * 0.08).toFixed(2)}
                                </Typography>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-secondary-200">
                                <Typography variant="subtitle" weight="bold">
                                    Total
                                </Typography>
                                <Typography variant="subtitle" weight="bold" color="primary">
                                    ${(total + (total > 99 ? 0 : 5.99) + (total * 0.08)).toFixed(2)}
                                </Typography>
                            </div>
                        </div>
                        <Button variant="primary" size="lg" className="w-full">
                            Place Order
                        </Button>
                        <Typography variant="caption" color="secondary" className="text-center mt-4">
                            By placing your order, you agree to our <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                        </Typography>
                    </Card>
                </div>
            </div>

            {/* Place Order Button for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 p-4 pb-6">
                <Button variant="primary" size="lg" className="w-full">
                    Place Order - ${(total + (total > 99 ? 0 : 5.99) + (total * 0.08)).toFixed(2)}
                </Button>
            </div>
        </div>
    )
}