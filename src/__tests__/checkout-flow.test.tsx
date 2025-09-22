import React from 'react'
import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react'
import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext'
import CheckoutPage from '@/app/checkout/page'
import OrderConfirmationPage from '@/app/order-confirmation/page'
import { Product } from '@/lib/types'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn()
    }),
    useSearchParams: () => ({
        get: jest.fn()
    })
}))

// Mock API calls
jest.mock('@/lib/api', () => ({
    addToCart: jest.fn(),
    getCart: jest.fn(),
    getCartTotal: jest.fn(),
    createOrder: jest.fn(),
    savePaymentDetail: jest.fn()
}))

// Mock payment components
jest.mock('@/components/checkout/StripePayment', () => ({
    StripePayment: ({ onSuccess, onError }: any) => (
        <div data-testid="stripe-payment">
            <button
                data-testid="stripe-pay-button"
                onClick={() => onSuccess('pi_test_123')}
            >
                Pay with Stripe
            </button>
            <button
                data-testid="stripe-error-button"
                onClick={() => onError('Stripe payment failed')}
            >
                Trigger Stripe Error
            </button>
        </div>
    )
}))

jest.mock('@/components/checkout/PayPalPayment', () => ({
    PayPalPayment: ({ onSuccess, onError }: any) => (
        <div data-testid="paypal-payment">
            <button
                data-testid="paypal-pay-button"
                onClick={() => onSuccess('order_paypal_123')}
            >
                Pay with PayPal
            </button>
            <button
                data-testid="paypal-error-button"
                onClick={() => onError('PayPal payment failed')}
            >
                Trigger PayPal Error
            </button>
        </div>
    )
}))

jest.mock('@/components/checkout/RazorpayPayment', () => ({
    RazorpayPayment: ({ onSuccess, onError }: any) => (
        <div data-testid="razorpay-payment">
            <button
                data-testid="razorpay-pay-button"
                onClick={() => onSuccess('pay_razorpay_123', 'order_razorpay_123')}
            >
                Pay with Razorpay
            </button>
            <button
                data-testid="razorpay-error-button"
                onClick={() => onError('Razorpay payment failed')}
            >
                Trigger Razorpay Error
            </button>
        </div>
    )
}))

// Mock ProtectedRoute
jest.mock('@/components/auth/ProtectedRoute', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock CheckoutSidebar
jest.mock('@/components/checkout/CheckoutSidebar', () => ({
    CheckoutSidebar: () => <div data-testid="checkout-sidebar">Order Summary</div>
}))

// Mock ShippingStep
jest.mock('@/components/checkout/ShippingStep', () => ({
    ShippingStep: ({ onNext }: any) => (
        <div data-testid="shipping-step">
            <h3>Shipping Information</h3>
            <button data-testid="shipping-next" onClick={onNext}>
                Continue to Payment
            </button>
        </div>
    )
}))

// Mock ReviewStep
jest.mock('@/components/checkout/ReviewStep', () => ({
    ReviewStep: ({ onPlaceOrder }: any) => (
        <div data-testid="review-step">
            <h3>Review Order</h3>
            <button data-testid="place-order" onClick={onPlaceOrder}>
                Place Order
            </button>
        </div>
    )
}))

// Mock window.location
delete (global as any).window.location
global.window.location = { href: '' } as any

// Test data
const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    images: ['/test-image.jpg'],
    category: 'Test Category',
    brand: 'Test Brand',
    inStock: true,
    stockCount: 10,
    rating: 4.5,
    reviewCount: 25,
    slug: 'test-product',
    variants: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
}

const mockAddress = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    addressLine1: '123 Main St',
    addressLine2: '',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
}

describe('Checkout Flow Integration Tests', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        jest.clearAllMocks()
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'mock-customer-123'),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        })
    })

    const renderCheckoutPage = () => {
        return render(
            <CartProvider>
                <CheckoutProvider>
                    <CheckoutPage />
                </CheckoutProvider>
            </CartProvider>
        )
    }

    describe('Cart Operations', () => {
        test('shows empty cart message when no items', () => {
            renderCheckoutPage()

            expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
            expect(screen.getByText('Add items to your cart before checking out.')).toBeInTheDocument()
            expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument()
        })

        test('redirects to login when adding to cart without authentication', async () => {
            // Mock no customer ID
            ; (window.localStorage.getItem as jest.Mock).mockReturnValue(null)

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            await act(async () => {
                await result.current.addItem(mockProduct)
            })

            expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=/products')
        })

        test('successfully adds item to cart', async () => {
            const mockApiResponse = { success: true, data: { id: 'cart-item-1' } }
            const { addToCart } = require('@/lib/api')
            addToCart.mockResolvedValue(mockApiResponse)

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            let addResult
            await act(async () => {
                addResult = await result.current.addItem(mockProduct)
            })

            expect(addResult.success).toBe(true)
            expect(result.current.items).toHaveLength(1)
            expect(result.current.items[0].product.id).toBe('1')
        })

        test('handles cart API failure gracefully', async () => {
            const mockApiResponse = { success: false, error: 'API Error' }
            const { addToCart } = require('@/lib/api')
            addToCart.mockResolvedValue(mockApiResponse)

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            let addResult
            await act(async () => {
                addResult = await result.current.addItem(mockProduct)
            })

            expect(addResult.success).toBe(false)
            expect(addResult.error).toBe('API Error')
            // Item should be removed due to rollback
            expect(result.current.items).toHaveLength(0)
        })
    })

    describe('Checkout Navigation', () => {
        beforeEach(() => {
            // Mock cart with items
            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            act(() => {
                result.current.items = [{
                    id: 'cart-item-1',
                    product: mockProduct,
                    quantity: 1,
                    addedAt: new Date(),
                    lastModified: new Date()
                }]
                result.current.total = 99.99
                result.current.itemCount = 1
            })
        })

        test('starts at shipping step', () => {
            renderCheckoutPage()

            expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
            expect(screen.getByTestId('shipping-step')).toBeInTheDocument()
        })

        test('navigates from shipping to payment step', async () => {
            renderCheckoutPage()

            const shippingNextButton = screen.getByTestId('shipping-next')
            await user.click(shippingNextButton)

            await waitFor(() => {
                expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
                expect(screen.getByText('Payment Method')).toBeInTheDocument()
            })
        })

        test('prevents navigation without required data', () => {
            renderCheckoutPage()

            // Should not be able to proceed to payment without shipping address
            expect(screen.queryByText('Step 2 of 3')).not.toBeInTheDocument()
        })
    })

    describe('Payment Processing', () => {
        beforeEach(() => {
            // Setup cart and shipping
            const cartHook = renderHook(() => useCart(), {
                wrapper: CartProvider
            })
            const checkoutHook = renderHook(() => useCheckout(), {
                wrapper: CheckoutProvider
            })

            act(() => {
                cartHook.result.current.items = [{
                    id: 'cart-item-1',
                    product: mockProduct,
                    quantity: 1,
                    addedAt: new Date(),
                    lastModified: new Date()
                }]
                cartHook.result.current.total = 99.99
                cartHook.result.current.itemCount = 1

                checkoutHook.result.current.updateData({
                    shippingAddress: mockAddress,
                    paymentMethod: 'stripe'
                })
                checkoutHook.result.current.goToStep(2)
            })
        })

        test('displays all payment method options', () => {
            renderCheckoutPage()

            expect(screen.getByText('Credit/Debit Card (Stripe)')).toBeInTheDocument()
            expect(screen.getByText('PayPal')).toBeInTheDocument()
            expect(screen.getByText('Razorpay')).toBeInTheDocument()
            expect(screen.getByText('Cash on Delivery')).toBeInTheDocument()
        })

        test('handles Stripe payment success', async () => {
            renderCheckoutPage()

            // Select Stripe
            const stripeButton = screen.getByText('💳').closest('button')
            await user.click(stripeButton)

            // Click pay button
            const payButton = screen.getByTestId('stripe-pay-button')
            await user.click(payButton)

            // Should redirect to confirmation
            await waitFor(() => {
                expect(window.location.href).toBe('/order-confirmation?payment=pi_test_123')
            })
        })

        test('handles PayPal payment success', async () => {
            renderCheckoutPage()

            // Select PayPal
            const paypalButton = screen.getAllByText('🅿️')[0].closest('button')
            await user.click(paypalButton)

            // Click pay button
            const payButton = screen.getByTestId('paypal-pay-button')
            await user.click(payButton)

            // Should redirect to confirmation
            await waitFor(() => {
                expect(window.location.href).toBe('/order-confirmation?order=order_paypal_123')
            })
        })

        test('handles Razorpay payment success', async () => {
            renderCheckoutPage()

            // Select Razorpay
            const razorpayButton = screen.getByText('₹').closest('button')
            await user.click(razorpayButton)

            // Click pay button
            const payButton = screen.getByTestId('razorpay-pay-button')
            await user.click(payButton)

            // Should redirect to confirmation
            await waitFor(() => {
                expect(window.location.href).toBe('/order-confirmation?payment=pay_razorpay_123')
            })
        })

        test('handles payment errors gracefully', async () => {
            renderCheckoutPage()

            // Select Stripe
            const stripeButton = screen.getByText('💳').closest('button')
            await user.click(stripeButton)

            // Trigger error
            const errorButton = screen.getByTestId('stripe-error-button')
            await user.click(errorButton)

            // Should show error message
            await waitFor(() => {
                expect(screen.getByText('❌ Stripe payment failed')).toBeInTheDocument()
            })
        })

        test('validates manual card payment form', async () => {
            renderCheckoutPage()

            // Select manual card
            const cardButton = screen.getAllByText('💳')[1].closest('button')
            await user.click(cardButton)

            // Form should be visible
            expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()

            // Submit button should be disabled without data
            const submitButton = screen.getByRole('button', { name: /review order/i })
            expect(submitButton).toBeDisabled()

            // Fill form
            await user.type(screen.getByLabelText(/cardholder name/i), 'John Doe')
            await user.type(screen.getByLabelText(/card number/i), '4111111111111111')
            await user.type(screen.getByLabelText(/expiry month/i), '12')
            await user.type(screen.getByLabelText(/expiry year/i), '25')
            await user.type(screen.getByLabelText(/cvv/i), '123')

            // Submit button should now be enabled
            expect(submitButton).toBeEnabled()
        })

        test('handles UPI payment form', async () => {
            renderCheckoutPage()

            // Select UPI
            const upiButton = screen.getByText('📱').closest('button')
            await user.click(upiButton)

            // UPI form should be visible
            expect(screen.getByLabelText(/upi id/i)).toBeInTheDocument()

            // Fill UPI ID
            await user.type(screen.getByLabelText(/upi id/i), 'user@paytm')

            const submitButton = screen.getByRole('button', { name: /review order/i })
            expect(submitButton).toBeEnabled()
        })
    })

    describe('Order Confirmation', () => {
        test('displays payment success message', () => {
            // Mock search params
            const mockGet = jest.fn((key) => {
                if (key === 'payment') return 'pi_test_123'
                return null
            })

            jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
                get: mockGet
            } as any)

            render(<OrderConfirmationPage />)

            expect(screen.getByText('Payment Successful!')).toBeInTheDocument()
            expect(screen.getByText('Payment ID: pi_test_123')).toBeInTheDocument()
        })

        test('displays order confirmation message', () => {
            const mockGet = jest.fn((key) => {
                if (key === 'order') return 'ORD-12345'
                return null
            })

            jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
                get: mockGet
            } as any)

            render(<OrderConfirmationPage />)

            expect(screen.getByText('Order Confirmed!')).toBeInTheDocument()
            expect(screen.getByText('Order Number: ORD-12345')).toBeInTheDocument()
        })
    })

    describe('Error Scenarios and Edge Cases', () => {
        test('handles network errors during payment', async () => {
            // Mock network error
            const { addToCart } = require('@/lib/api')
            addToCart.mockRejectedValue(new Error('Network Error'))

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            let addResult
            await act(async () => {
                addResult = await result.current.addItem(mockProduct)
            })

            expect(addResult.success).toBe(false)
            expect(addResult.error).toBe('ADD_TO_CART_EXCEPTION')
        })

        test('handles invalid cart items', async () => {
            const invalidProduct = { ...mockProduct, price: -10 }

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            let addResult
            await act(async () => {
                addResult = await result.current.addItem(invalidProduct)
            })

            expect(addResult.success).toBe(false)
            expect(addResult.error).toBe('Invalid product price')
        })

        test('handles out of stock items', async () => {
            const outOfStockProduct = { ...mockProduct, inStock: false }

            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            let addResult
            await act(async () => {
                addResult = await result.current.addItem(outOfStockProduct)
            })

            expect(addResult.success).toBe(false)
            expect(addResult.error).toBe('Product is out of stock')
        })

        test('handles checkout with empty cart', () => {
            renderCheckoutPage()

            expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
            expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument()
        })

        test('prevents navigation beyond valid steps', () => {
            const { result } = renderHook(() => useCheckout(), {
                wrapper: CheckoutProvider
            })

            act(() => {
                result.current.goToStep(5) // Invalid step
            })

            expect(result.current.currentStep).toBe(3) // Should be clamped to max
        })

        test('handles payment processing state', async () => {
            renderCheckoutPage()

            const { result } = renderHook(() => useCheckout(), {
                wrapper: CheckoutProvider
            })

            act(() => {
                result.current.setProcessing(true)
            })

            expect(result.current.isProcessing).toBe(true)

            act(() => {
                result.current.setProcessing(false)
            })

            expect(result.current.isProcessing).toBe(false)
        })
    })

    describe('Accessibility', () => {
        test('provides proper ARIA labels for cart operations', () => {
            const { result } = renderHook(() => useCart(), {
                wrapper: CartProvider
            })

            expect(result.current.getAccessibilityLabel('addItem')).toBe('Add item to cart')
        })

        test('handles keyboard navigation in payment selection', async () => {
            renderCheckoutPage()

            const paymentButtons = screen.getAllByRole('button').filter(button =>
                button.textContent?.includes('💳') ||
                button.textContent?.includes('🅿️') ||
                button.textContent?.includes('₹')
            )

            // Focus first payment method
            paymentButtons[0].focus()
            expect(document.activeElement).toBe(paymentButtons[0])

            // Tab to next
            await user.keyboard('{Tab}')
            expect(document.activeElement).toBe(paymentButtons[1])
        })
    })
})