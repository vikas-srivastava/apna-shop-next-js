'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
    id: string
    orderNumber: string
    userId: string
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed' | 'refunded'
    statusHistory?: Array<{
        status: string
        changedAt: string
        changedBy: string
        notes?: string
    }>
    createdAt: string
    updatedAt: string
    shippingAddress: {
        firstName: string
        lastName: string
        address1: string
        city: string
        state: string
        zipCode: string
        country: string
    }
}

/**
 * Order tracking page
 */
export default function OrderTrackingPage() {
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

    const getStatusSteps = (currentStatus: string) => {
        const steps = [
            { id: 'pending', name: 'Order Placed', description: 'Your order has been received' },
            { id: 'confirmed', name: 'Order Confirmed', description: 'Your order has been confirmed' },
            { id: 'processing', name: 'Processing', description: 'Your order is being prepared' },
            { id: 'shipped', name: 'Shipped', description: 'Your order has been shipped' },
            { id: 'delivered', name: 'Delivered', description: 'Your order has been delivered' }
        ]

        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
        const currentIndex = statusOrder.indexOf(currentStatus)

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }))
    }

    const getStatusColor = (status: string, completed: boolean, current: boolean) => {
        if (completed) return 'bg-success-500 text-white'
        if (current) return 'bg-primary-500 text-white'
        return 'bg-secondary-200 text-secondary-400'
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        Track Order
                    </Typography>
                    <Card className="p-6">
                        <div className="text-center py-12">
                            <Typography variant="body">Loading order tracking...</Typography>
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
                        Track Order
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

    const statusSteps = getStatusSteps(order.status)

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
                        Track Order #{order.orderNumber}
                    </Typography>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tracking Timeline */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-6">
                                Order Status
                            </Typography>

                            <div className="space-y-6">
                                {statusSteps.map((step, index) => (
                                    <div key={step.id} className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.id, step.completed, step.current)}`}>
                                            {step.completed ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <span className="text-sm font-semibold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Typography variant="subtitle" weight="semibold" className={step.current ? 'text-primary-600' : ''}>
                                                {step.name}
                                            </Typography>
                                            <Typography variant="body" color="secondary" className="mb-2">
                                                {step.description}
                                            </Typography>
                                            {step.completed && (
                                                <Typography variant="caption" color="secondary">
                                                    Completed
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Status History */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                            <Card className="p-6 mt-6">
                                <Typography variant="h3" weight="semibold" className="mb-6">
                                    Status History
                                </Typography>
                                <div className="space-y-4">
                                    {order.statusHistory.map((history, index) => (
                                        <div key={index} className="flex items-start gap-4 p-3 bg-secondary-50 rounded-lg">
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                                            <div className="flex-1">
                                                <Typography variant="subtitle" weight="semibold">
                                                    {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                                </Typography>
                                                <Typography variant="caption" color="secondary">
                                                    {new Date(history.changedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                                {history.notes && (
                                                    <Typography variant="body" color="secondary" className="mt-1">
                                                        {history.notes}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-4">
                                Order Information
                            </Typography>
                            <div className="space-y-3">
                                <div>
                                    <Typography variant="body" weight="semibold">Order Number</Typography>
                                    <Typography variant="body" color="secondary">{order.orderNumber}</Typography>
                                </div>
                                <div>
                                    <Typography variant="body" weight="semibold">Order Date</Typography>
                                    <Typography variant="body" color="secondary">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body" weight="semibold">Current Status</Typography>
                                    <Typography variant="body" color="secondary" className="capitalize">
                                        {order.status.replace('_', ' ')}
                                    </Typography>
                                </div>
                            </div>
                        </Card>

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
                            </div>
                        </Card>

                        <Card className="p-6">
                            <Typography variant="h3" weight="semibold" className="mb-4">
                                Need Help?
                            </Typography>
                            <div className="space-y-3">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/account/orders/${order.id}`}>
                                        View Order Details
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href="/contact">
                                        Contact Support
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}