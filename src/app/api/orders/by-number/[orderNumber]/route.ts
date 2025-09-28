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

// GET /api/orders/by-number/[orderNumber] - Get order by order number
export async function GET(
    request: NextRequest,
    { params }: { params: { orderNumber: string } }
) {
    try {
        await mockDelay()

        const orderNumber = params.orderNumber
        const userId = getUserId()

        // Find the order by order number
        let foundOrder = null
        for (const [orderId, order] of mockStorage.orders.entries()) {
            if (order.orderNumber === orderNumber) {
                foundOrder = order
                break
            }
        }

        if (!foundOrder) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Check if order belongs to the user
        if (foundOrder.userId !== userId) {
            return NextResponse.json({
                success: false,
                message: 'Access denied',
                error: 'Forbidden'
            }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            data: foundOrder,
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