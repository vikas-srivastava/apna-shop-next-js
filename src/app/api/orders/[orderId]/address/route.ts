import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'
import { Address } from '@/lib/types'

// Helper function to simulate API delay
function mockDelay(minMs = 300, maxMs = 800): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// GET /api/orders/[orderId]/address - Get order addresses
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
            data: {
                shippingAddress: order.shippingAddress,
                billingAddress: order.billingAddress
            },
            message: 'Order addresses retrieved successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve order addresses',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// PUT /api/orders/[orderId]/address - Update order addresses
export async function PUT(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        await mockDelay()

        const orderId = params.orderId
        const userId = getUserId()
        const body = await request.json()
        const { shippingAddress, billingAddress } = body

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

        // Only allow updating addresses for orders that haven't been shipped
        if (['shipped', 'delivered'].includes(order.status)) {
            return NextResponse.json({
                success: false,
                message: 'Cannot update addresses for orders that have been shipped',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Validate addresses if provided
        const validateAddress = (address: any): boolean => {
            return address &&
                address.firstName &&
                address.lastName &&
                address.address1 &&
                address.city &&
                address.state &&
                address.zipCode &&
                address.country
        }

        if (shippingAddress && !validateAddress(shippingAddress)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid shipping address',
                error: 'Validation error'
            }, { status: 422 })
        }

        if (billingAddress && !validateAddress(billingAddress)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid billing address',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Update the order addresses
        const updatedOrder: any = {
            ...order,
            shippingAddress: shippingAddress || order.shippingAddress,
            billingAddress: billingAddress || order.billingAddress,
            updatedAt: new Date().toISOString()
        }

        mockStorage.orders.set(orderId, updatedOrder)

        return NextResponse.json({
            success: true,
            data: {
                shippingAddress: updatedOrder.shippingAddress,
                billingAddress: updatedOrder.billingAddress
            },
            message: 'Order addresses updated successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update order addresses',
            error: 'Internal server error'
        }, { status: 500 })
    }
}