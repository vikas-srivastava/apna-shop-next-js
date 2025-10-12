'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useEffect, useState } from 'react'
import { getOrders } from '@/lib/api'

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
 * Orders page
 */
export default function OrdersPage() {
    const { isAuthenticated, user } = useSupabaseAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return

            try {
                setLoading(true)
                const response = await getOrders()
                if (response.success && response.data) {
                    setOrders(response.data)
                } else {
                    setError('Failed to fetch orders. Please try again.')
                }
            } catch (err) {
                setError('Failed to fetch orders. Please try again.')
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isAuthenticated])

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
                        My Orders
                    </Typography>
                    <Card className="p-6">
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border border-secondary-200 rounded-lg p-6 animate-pulse">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-secondary-100">
                                        <div>
                                            <div className="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="text-right">
                                            <div className="h-6 bg-secondary-200 rounded w-1/4 mb-2"></div>
                                            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        <div className="h-8 bg-secondary-200 rounded w-24"></div>
                                        <div className="h-8 bg-secondary-200 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </ProtectedRoute>
        )
    }

    if (error) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        My Orders
                    </Typography>
                    <Card className="p-6">
                        <div className="text-center py-12">
                            <Typography variant="h3" weight="bold" className="mb-4 text-error-600">
                                Error Loading Orders
                            </Typography>
                            <Typography variant="body" color="secondary" className="mb-6">
                                {error}
                            </Typography>
                            <Button variant="primary" onClick={() => window.location.reload()}>
                                Try Again
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
                <Typography variant="h1" weight="bold" className="mb-8">
                    My Orders
                </Typography>

                <Card className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Typography variant="h3" weight="bold" className="mb-4">
                                No Orders Yet
                            </Typography>
                            <Typography variant="body" color="secondary" className="mb-6">
                                You haven't placed any orders yet.
                            </Typography>
                            <Button variant="primary" asChild>
                                <a href="/products">
                                    Start Shopping
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-secondary-200 rounded-lg p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-secondary-100">
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <Typography variant="subtitle" weight="semibold">
                                                    Order #{order.orderNumber}
                                                </Typography>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <Typography variant="caption" color="secondary" className="mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                        </div>
                                        <div className="text-right">
                                            <Typography variant="subtitle" weight="semibold">
                                                ${order.total.toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" color="secondary">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            Track Order
                                        </Button>
                                        {order.status === 'delivered' && (
                                            <Button variant="outline" size="sm" className="text-error-600 border-error-300 hover:bg-error-50">
                                                Return & Refund
                                            </Button>
                                        )}
                                        <Button variant="secondary" size="sm">
                                            Reorder
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </ProtectedRoute>
    )
}