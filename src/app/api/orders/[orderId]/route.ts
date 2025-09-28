import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'
import { Order, Address } from '@/lib/types'

// Helper function to simulate API delay
function mockDelay(minMs = 300, maxMs = 800): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// GET /api/orders/[orderId] - Get individual order details
export async function GET(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await mockDelay()

        const orderId = params.orderId
        const userId = getUserId()

        // Find the order
        const order = mockStorage.orders.get(orderId)

        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Check if order belongs to the user
        if (order.userId !== userId) {
            return NextResponse.json({
                success: false,
                message: 'Access denied',
                error: 'Forbidden'
            }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order retrieved successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// PUT /api/orders/[orderId] - Update order details (limited fields)
export async function PUT(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await mockDelay()

        const orderId = params.orderId
        const userId = getUserId()
        const body = await request.json()

        // Find the order
        const order = mockStorage.orders.get(orderId)

        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Check if order belongs to the user
        if (order.userId !== userId) {
            return NextResponse.json({
                success: false,
                message: 'Access denied',
                error: 'Forbidden'
            }, { status: 403 })
        }

        // Only allow updating certain fields for regular users
        // Admin functionality would allow more updates
        const allowedUpdates = ['notes', 'shippingAddress', 'billingAddress']

        const updates: any = {}
        for (const [key, value] of Object.entries(body)) {
            if (allowedUpdates.includes(key)) {
                updates[key] = value
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No valid fields to update',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Update the order
        const updatedOrder: Order = {
            ...order,
            ...updates,
            updatedAt: new Date().toISOString()
        }

        mockStorage.orders.set(orderId, updatedOrder)

        return NextResponse.json({
            success: true,
            data: updatedOrder,
            message: 'Order updated successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}