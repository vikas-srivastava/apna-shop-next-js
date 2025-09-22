import { NextRequest, NextResponse } from 'next/server'
import { mockStorage, mockApiProducts } from '@/lib/mock-data'
import { Order, OrderItem, Address } from '@/lib/types'

// Helper function to simulate API delay
function mockDelay(minMs = 500, maxMs = 1500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// Helper function to generate order number
function generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const {
            shipping_address,
            billing_address,
            payment_method = 'razorpay'
        } = body

        if (!shipping_address || !billing_address) {
            return NextResponse.json({
                success: false,
                message: 'Shipping and billing addresses are required',
                error: 'Validation error'
            }, { status: 422 })
        }

        const userId = getUserId()
        const cartItems = mockStorage.cart.get(userId) || []

        if (cartItems.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Cart is empty',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Convert cart items to order items
        const orderItems: OrderItem[] = cartItems.map((cartItem: any) => {
            const product = mockApiProducts.find(p => p.id === cartItem.product_id)
            return {
                id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                productId: cartItem.product_id.toString(),
                product: product as any,
                quantity: cartItem.product_quantity,
                price: parseFloat(cartItem.product_price)
            }
        })

        // Calculate totals
        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = subtotal > 500 ? 0 : 10.99 // Free shipping over $500
        const tax = subtotal * 0.08 // 8% tax
        const total = subtotal + shipping + tax

        // Create order
        const order: Order = {
            id: generateOrderNumber(),
            orderNumber: generateOrderNumber(),
            userId,
            items: orderItems,
            shippingAddress: shipping_address as Address,
            billingAddress: billing_address as Address,
            subtotal: parseFloat(subtotal.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        // Save order
        mockStorage.orders.set(order.id, order)

        // Clear cart after successful order
        mockStorage.cart.set(userId, [])

        return NextResponse.json({
            success: true,
            data: {
                order_id: order.id,
                order_number: order.orderNumber,
                total: order.total,
                status: order.status
            },
            message: 'Order created successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create order',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// GET /api/orders - Get user orders
export async function GET() {
    try {
        await mockDelay()

        const userId = getUserId()
        const userOrders: Order[] = []

        // Get all orders for the user
        for (const [orderId, order] of mockStorage.orders.entries()) {
            if (order.userId === userId) {
                userOrders.push(order)
            }
        }

        // Sort by creation date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return NextResponse.json({
            success: true,
            data: userOrders,
            message: 'Orders retrieved successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve orders',
            error: 'Internal server error'
        }, { status: 500 })
    }
}