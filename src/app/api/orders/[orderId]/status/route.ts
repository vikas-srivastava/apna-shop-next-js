import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'

// Helper function to simulate API delay
function mockDelay(minMs = 300, maxMs = 800): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// PUT /api/orders/[orderId]/status - Update order status
export async function PUT(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await mockDelay()

        const orderId = params.orderId
        const userId = getUserId()
        const body = await request.json()
        const { status, notes } = body

        if (!status) {
            return NextResponse.json({
                success: false,
                message: 'Status is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed', 'refunded']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid status',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Find the order
        const order = mockStorage.orders.get(orderId)

        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Check if order belongs to the user (for regular users)
        // Admin users would have different permissions
        if (order.userId !== userId) {
            return NextResponse.json({
                success: false,
                message: 'Access denied',
                error: 'Forbidden'
            }, { status: 403 })
        }

        // For regular users, only allow cancelling orders that are still pending
        if (status === 'cancelled' && order.status !== 'pending') {
            return NextResponse.json({
                success: false,
                message: 'Order cannot be cancelled at this stage',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Update the order status
        const updatedOrder: any = {
            ...order,
            status,
            updatedAt: new Date().toISOString()
        }

        // Add status change tracking (in a real app, this would be in a separate table)
        if (!updatedOrder.statusHistory) {
            updatedOrder.statusHistory = []
        }
        updatedOrder.statusHistory.push({
            status,
            changedAt: new Date().toISOString(),
            changedBy: userId,
            notes: notes || `Status changed to ${status}`
        })

        mockStorage.orders.set(orderId, updatedOrder)

        return NextResponse.json({
            success: true,
            data: updatedOrder,
            message: 'Order status updated successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update order status',
            error: 'Internal server error'
        }, { status: 500 })
    }
}