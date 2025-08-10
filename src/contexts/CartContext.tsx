'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Product } from '@/lib/types'

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
    addItem: (product: Product, quantity?: number, size?: string, color?: string) => void
    removeItem: (id: string) => void
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

    const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { product, quantity, size, color }
        })
    }

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id })
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