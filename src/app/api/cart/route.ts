import { NextRequest, NextResponse } from 'next/server'
import { mockStorage, mockApiProducts } from '@/lib/mock-data'
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

// GET /api/cart - Get cart items
export async function GET() {
    try {
        await mockDelay()

        const userId = getUserId()
        const cartItems = mockStorage.cart.get(userId) || []

        // Calculate total
        const total = cartItems.reduce((sum: number, item: CartItem) => {
            return sum + (parseFloat(item.product_price) * item.product_quantity)
        }, 0)

        const response = {
            success: true,
            data: {
                items: JSON.stringify(cartItems),
                total: total.toFixed(2)
            },
            message: 'Cart retrieved successfully'
        }

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve cart',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const { product_id, product_quantity = 1 } = body

        if (!product_id) {
            return NextResponse.json({
                success: false,
                message: 'Product ID is required',
                error: 'Validation error'
            }, { status: 422 })
        }

        const userId = getUserId()
        const cartItems = mockStorage.cart.get(userId) || []

        // Find product details
        const product = mockApiProducts.find(p => p.id === product_id)
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Check if product already exists in cart
        const existingItemIndex = cartItems.findIndex((item: CartItem) => item.product_id === product_id)

        if (existingItemIndex >= 0) {
            // Update quantity
            cartItems[existingItemIndex].product_quantity += product_quantity
        } else {
            // Add new item
            const newItem: CartItem = {
                id: Date.now().toString(),
                product_id,
                product_quantity,
                product_name: product.name,
                product_price: product.price,
                product_image: product.images?.[0] || ''
            }
            cartItems.push(newItem)
        }

        // Save updated cart
        mockStorage.cart.set(userId, cartItems)

        return NextResponse.json({
            success: true,
            message: 'Product added to cart successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to add item to cart',
            error: 'Internal server error'
        }, { status: 500 })
    }
}