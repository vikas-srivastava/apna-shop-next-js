'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Order {
    id: string
    orderNumber: string
    userId: string
    items: Array<{
        id: string
        productId: string
        product: any
        quantity: number
        price: number
    }>
    shippingAddress: {
        id: string
        firstName: string
        lastName: string
        address1: string
        city: string
        state: string
        zipCode: string
        country: string
        phone: string
        isDefault: boolean
    }
    billingAddress: {
        id: string
        firstName: string
        lastName: string
        address1: string
        city: string
        state: string
        zipCode: string
        country: string
        phone: string
        isDefault: boolean
    }
    subtotal: number
    shipping: number
    tax: number
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: string
    updatedAt: string
}

/**
 * Order details page
 */
export default function OrderDetailsPage() {
    const { isAuthenticated } = useSupabaseAuth()
    const params = useParams()
    const orderId = params?.orderId as string

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!isAuthenticated || !orderId) return

            try {
                setLoading(true)
                const response = await fetch(`/api/orders/${orderId}`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Failed to fetch order details')
                }

                setOrder(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch order details')
                console.error('Error fetching order details:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [isAuthenticated, orderId])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'text-success-600 bg-success-100'
            case 'shipped':
                return 'text-warning-600 bg-warning-100'
            case 'processing':
                return 'text-primary-600 bg-primary-100'
            case 'pending':
                return 'text-secondary-600 bg-secondary-100'
            case 'cancelled':
                return 'text-error-600 bg-error-100'
            default:
                return 'text-secondary-600 bg-secondary-100'
        }
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        Order Details
                    </Typography>
                    <Card className="p-6">
                        <div className="text-center py-12">
                            <Typography variant="body">Loading order details...</Typography>
                        </div>
                    </Card>
                </div>
            </ProtectedRoute>
        )
    }

    if (error || !order) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        Order Details
                    </Typography>
                    <Card className="p-6">
                        <div className="text-center py-12">
                            <Typography variant="h3" weight="bold" className="mb-4 text-error-600">
                                Error Loading Order
                            </Typography>
                            <Typography variant="body" color="secondary" className="mb-6">
                                {error || 'Order not found'}
                            </Typography>
                            <Button variant="primary" asChild>
                                <Link href="/account/orders">
                                    Back to Orders
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/account/orders">
                            ← Back to Orders
                        </Link>
                    </Button>
                    <Typography variant="h1" weight="bold">
                        Order #{order.orderNumber}
                    </Typography>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Typography variant="h3" weight="semibold">
                                    Order Status
                                </Typography>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <Typography variant="body" color="secondary">
                                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Card>

                        {/* Order Items */}
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-6">
                                Order Items ({order.items.length})
                            </Typography>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-secondary-50 rounded-lg">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary-100">
                                            <Image
                                                src={item.product?.images?.[0] || '/globe.svg'}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Typography variant="subtitle" weight="semibold">
                                                {item.product?.name || 'Product'}
                                            </Typography>
                                            <Typography variant="body" color="secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                            <Typography variant="body" color="secondary">
                                                Price: ${item.price.toFixed(2)}
                                            </Typography>
                                        </div>
                                        <Typography variant="subtitle" weight="semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Order Actions */}
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-4">
                                Order Actions
                            </Typography>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary" asChild>
                                    <Link href={`/order-tracking/${order.id}`}>
                                        Track Order
                                    </Link>
                                </Button>
                                {order.status === 'pending' && (
                                    <Button variant="outline" className="text-error-600 border-error-300 hover:bg-error-50">
                                        Cancel Order
                                    </Button>
                                )}
                                {order.status === 'delivered' && (
                                    <Button variant="outline" className="text-error-600 border-error-300 hover:bg-error-50">
                                        Return & Refund
                                    </Button>
                                )}
                                <Button variant="secondary">
                                    Reorder
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-6">
                                Order Summary
                            </Typography>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Typography variant="body">Subtotal</Typography>
                                    <Typography variant="body">${order.subtotal.toFixed(2)}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body">Shipping</Typography>
                                    <Typography variant="body">{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body">Tax</Typography>
                                    <Typography variant="body">${order.tax.toFixed(2)}</Typography>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-secondary-200">
                                    <Typography variant="subtitle" weight="bold">Total</Typography>
                                    <Typography variant="subtitle" weight="bold" color="primary">
                                        ${order.total.toFixed(2)}
                                    </Typography>
                                </div>
                            </div>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-4">
                                Shipping Address
                            </Typography>
                            <div className="text-sm">
                                <Typography variant="body" weight="semibold">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </Typography>
                                <Typography variant="body">
                                    {order.shippingAddress.address1}
                                </Typography>
                                <Typography variant="body">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </Typography>
                                <Typography variant="body">
                                    {order.shippingAddress.country}
                                </Typography>
                                {order.shippingAddress.phone && (
                                    <Typography variant="body">
                                        Phone: {order.shippingAddress.phone}
                                    </Typography>
                                )}
                            </div>
                        </Card>

                        {/* Billing Address */}
                        {order.billingAddress.id !== order.shippingAddress.id && (
                            <Card className="p-6">
                                <Typography variant="h3" weight="semibold" className="mb-4">
                                    Billing Address
                                </Typography>
                                <div className="text-sm">
                                    <Typography variant="body" weight="semibold">
                                        {order.billingAddress.firstName} {order.billingAddress.lastName}
                                    </Typography>
                                    <Typography variant="body">
                                        {order.billingAddress.address1}
                                    </Typography>
                                    <Typography variant="body">
                                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                                    </Typography>
                                    <Typography variant="body">
                                        {order.billingAddress.country}
                                    </Typography>
                                    {order.billingAddress.phone && (
                                        <Typography variant="body">
                                            Phone: {order.billingAddress.phone}
                                        </Typography>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}