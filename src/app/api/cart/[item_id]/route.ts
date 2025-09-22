import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'
import { CartItem } from '@/lib/types'

// Helper function to simulate API delay
function mockDelay(minMs = 200, maxMs = 800): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// PUT /api/cart/[item_id] - Update cart item quantity
export async function PUT(
    request: NextRequest,
    { params }: { params: { item_id: string } }
) {
    try {
        await mockDelay()

        const { item_id } = params
        const body = await request.json()
        const { product_quantity } = body

        if (!product_quantity || product_quantity < 1) {
            return NextResponse.json({
                success: false,
                message: 'Valid quantity is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        const userId = getUserId()
        const cartItems = mockStorage.cart.get(userId) || []

        const itemIndex = cartItems.findIndex((item: CartItem) => item.id === item_id)

        if (itemIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'Cart item not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Update quantity
        cartItems[itemIndex].product_quantity = product_quantity

        // Save updated cart
        mockStorage.cart.set(userId, cartItems)

        return NextResponse.json({
            success: true,
            message: 'Cart item updated successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update cart item',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// DELETE /api/cart/[item_id] - Remove item from cart
export async function DELETE(
    request: NextRequest,
    { params }: { params: { item_id: string } }
) {
    try {
        await mockDelay()

        const { item_id } = params

        const userId = getUserId()
        const cartItems = mockStorage.cart.get(userId) || []

        const itemIndex = cartItems.findIndex((item: CartItem) => item.id === item_id)

        if (itemIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'Cart item not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Remove item
        cartItems.splice(itemIndex, 1)

        // Save updated cart
        mockStorage.cart.set(userId, cartItems)

        return NextResponse.json({
            success: true,
            message: 'Cart item removed successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to remove cart item',
            error: 'Internal server error'
        }, { status: 500 })
    }
}