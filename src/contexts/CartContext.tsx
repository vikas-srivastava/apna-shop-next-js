'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Product } from '@/lib/types'
import * as thirdPartyApi from '@/lib/third-party-api'
import { useRouter } from 'next/navigation'

export interface CartItem {
    id: string
    product: Product
    quantity: number
    selectedSize?: string
    selectedColor?: string
}

interface CartState {
    items: CartItem[]
    total: number
    itemCount: number
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; size?: string; color?: string } }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartState }

interface CartContextType extends CartState {
    addItem: (product: Product, quantity?: number, size?: string, color?: string) => Promise<{ success: boolean; error?: string }>
    removeItem: (id: string) => Promise<void>
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Cart reducer to manage cart state
 */
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, quantity = 1, size, color } = action.payload
            const itemId = `${product.id}-${size || 'default'}-${color || 'default'}`

            const existingItemIndex = state.items.findIndex(item =>
                item.id === itemId
            )

            let newItems: CartItem[]

            if (existingItemIndex > -1) {
                // Update existing item quantity
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Add new item
                const newItem: CartItem = {
                    id: itemId,
                    product,
                    quantity,
                    selectedSize: size,
                    selectedColor: color,
                }
                newItems = [...state.items, newItem]
            }

            const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

            return {
                items: newItems,
                total: newTotal,
                itemCount: newItemCount,
            }
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload)
            const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

            return {
                items: newItems,
                total: newTotal,
                itemCount: newItemCount,
            }
        }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload

            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
            }

            const newItems = state.items.map(item =>
                item.id === id ? { ...item, quantity } : item
            )

            const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

            return {
                items: newItems,
                total: newTotal,
                itemCount: newItemCount,
            }
        }

        case 'CLEAR_CART': {
            return {
                items: [],
                total: 0,
                itemCount: 0,
            }
        }

        case 'LOAD_CART': {
            return action.payload
        }

        default:
            return state
    }
}

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
}

/**
 * Cart Provider Component
 * Manages global cart state with localStorage persistence
 */
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState)
    const router = useRouter()

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                dispatch({ type: 'LOAD_CART', payload: parsedCart })
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error)
            }
        }
    }, [])

    // Save cart to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state))
    }, [state])

    // After successful login, resume any pending "add to cart" intent
    useEffect(() => {
        try {
            const customerId = localStorage.getItem('customer_id');
            const pending = localStorage.getItem('pending_add_to_cart');
            if (customerId && pending) {
                const { product, quantity, size, color } = JSON.parse(pending);
                // fire-and-forget; addItem will update local state and call API
                void addItem(product, quantity, size, color);
                localStorage.removeItem('pending_add_to_cart');
            }
        } catch {
            // no-op
        }
    }, [])

    const addItem = async (product: Product, quantity = 1, size?: string, color?: string) => {
        try {
            // Load customer_id from localStorage
            let customerId = localStorage.getItem('customer_id');

            // If not authenticated, persist intent and redirect to login (no alerts)
            if (!customerId) {
                try {
                    localStorage.setItem('pending_add_to_cart', JSON.stringify({ product, quantity, size, color }));
                } catch { /* best effort */ }

                const returnUrl = typeof window !== 'undefined'
                    ? `${window.location.pathname}${window.location.search}`
                    : '/';

                try {
                    localStorage.setItem('post_login_redirect', returnUrl);
                } catch { /* best effort */ }

                // Redirect to login with returnUrl
                router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);

                // Signal to caller that auth is required (avoid noisy logs)
                return { success: false, error: 'AUTH_REQUIRED' };
            }

            // Call the third-party API to add the item to the cart
            const response = await thirdPartyApi.addToCart({
                product_id: parseInt(product.id, 10),
                product_quantity: quantity,
                product_variant_id: null,
                product_variant_data: size || color ? [size || '', color || ''] : null,
                customer_id: customerId
            });

            if (response.success) {
                // If the API call was successful, update the local state
                dispatch({
                    type: 'ADD_ITEM',
                    payload: { product, quantity, size, color }
                });
                return { success: true };
            } else {
                console.error('Failed to add item to cart:', response.error);
                return { success: false, error: response.error || 'ADD_TO_CART_FAILED' };
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return { success: false, error: 'ADD_TO_CART_EXCEPTION' };
        }
    }

    const removeItem = async (id: string) => {
        try {
            // Extract the product ID from the cart item ID
            // The cart item ID is formatted as `${product.id}-${size || 'default'}-${color || 'default'}`
            const productId = id.split('-')[0];

            // Call the third-party API to remove the item from the cart
            // Note: This is a simplified implementation. In a real application, you would need
            // to pass the actual cart item ID to the API.
            const response = await thirdPartyApi.removeCartItem(productId);

            if (response.success) {
                // If the API call was successful, update the local state
                dispatch({ type: 'REMOVE_ITEM', payload: id });
            } else {
                console.error('Failed to remove item from cart:', response.error);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' })
    }

    const value: CartContextType = {
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

/**
 * Hook to use cart context
 */
export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}