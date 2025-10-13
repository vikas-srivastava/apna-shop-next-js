'use client'

import { useCallback, useMemo, useRef, useEffect } from 'react'
import { useCart as useCartContext } from '../contexts/CartContext'
import { Product } from '../lib/types'
import { CartItem } from '../contexts/CartContext'

// Enhanced TypeScript types for the hook
export interface UseCartReturn extends ReturnType<typeof useCartContext> {
  // Additional computed properties
  isEmpty: boolean
  hasOutOfStockItems: boolean
  totalItemsValue: number
  formattedTotal: string

  // Enhanced methods with validation and logging
  addItemWithValidation: (product: Product, quantity?: number, size?: string, color?: string) => Promise<{ success: boolean; error?: string }>
  updateQuantityWithValidation: (id: string, quantity: number) => Promise<{ success: boolean; error?: string }>
  removeItemSafely: (id: string) => Promise<{ success: boolean; error?: string }>

  // Performance optimized methods
  debouncedAddItem: (product: Product, quantity?: number, size?: string, color?: string) => void
  memoizedCartItems: CartItem[]

  // Accessibility helpers
  getAriaLabel: (action: string, itemId?: string) => string
  getAriaDescription: (action: string) => string

  // Utility methods
  findItemByProductId: (productId: string) => CartItem | undefined
  getItemsByCategory: (category: string) => CartItem[]
  getRecentlyAddedItems: (minutesAgo?: number) => CartItem[]
}

// Logger utility for cart hook operations
class CartHookLogger {
  private static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[useCart ${timestamp}] ${message}`

    switch (level) {
      case 'info':

        break
      case 'warn':
        console.warn(logMessage, data || '')
        break
      case 'error':
        console.error(logMessage, data || '')
        break
    }
  }

  static info(message: string, data?: any) {
    this.log('info', message, data)
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  static error(message: string, data?: any) {
    this.log('error', message, data)
  }
}

// Debounce utility for performance optimization
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
}

/**
 * Enhanced useCart hook with Context7 best practices
 * Provides optimistic updates, error handling, validation, and performance optimizations
 */
export function useCart(): UseCartReturn {
  const cartContext = useCartContext()

  // Memoized computed properties for performance
  const isEmpty = useMemo(() => cartContext.itemCount === 0, [cartContext.itemCount])

  const hasOutOfStockItems = useMemo(() =>
    cartContext.items.some(item => !item.product.inStock),
    [cartContext.items]
  )

  const totalItemsValue = useMemo(() =>
    cartContext.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    [cartContext.items]
  )

  const formattedTotal = useMemo(() =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cartContext.total),
    [cartContext.total]
  )

  const memoizedCartItems = useMemo(() => cartContext.items, [cartContext.items])

  // Enhanced add item with validation
  const addItemWithValidation = useCallback(async (
    product: Product,
    quantity = 1,
    size?: string,
    color?: string
  ): Promise<{ success: boolean; error?: string }> => {
    CartHookLogger.info('Attempting to add item with validation', { productId: product.id, quantity })

    // Client-side validation
    const validation = cartContext.validateCartItem(product, quantity)
    if (!validation.valid) {
      CartHookLogger.warn('Cart item validation failed', validation.error)
      return { success: false, error: validation.error }
    }

    try {
      const result = await cartContext.addItem(product, quantity, size, color)
      if (result.success) {
        CartHookLogger.info('Item added successfully', { itemId: result.itemId })
      } else {
        CartHookLogger.error('Failed to add item', result.error)
      }
      return result
    } catch (error) {
      CartHookLogger.error('Exception during add item', error)
      return { success: false, error: 'UNEXPECTED_ERROR' }
    }
  }, [cartContext])

  // Enhanced update quantity with validation
  const updateQuantityWithValidation = useCallback(async (
    id: string,
    quantity: number
  ): Promise<{ success: boolean; error?: string }> => {
    CartHookLogger.info('Attempting to update quantity with validation', { itemId: id, quantity })

    const existingItem = cartContext.getItemById(id)
    if (!existingItem) {
      CartHookLogger.warn('Item not found for quantity update', { itemId: id })
      return { success: false, error: 'ITEM_NOT_FOUND' }
    }

    // Validate quantity
    const validation = cartContext.validateCartItem(existingItem.product, quantity)
    if (!validation.valid) {
      CartHookLogger.warn('Quantity validation failed', validation.error)
      return { success: false, error: validation.error }
    }

    try {
      const result = await cartContext.updateQuantity(id, quantity)
      if (result.success) {
        CartHookLogger.info('Quantity updated successfully', { itemId: id, newQuantity: quantity })
      } else {
        CartHookLogger.error('Failed to update quantity', result.error)
      }
      return result
    } catch (error) {
      CartHookLogger.error('Exception during quantity update', error)
      return { success: false, error: 'UNEXPECTED_ERROR' }
    }
  }, [cartContext])

  // Enhanced remove item with safety checks
  const removeItemSafely = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    CartHookLogger.info('Attempting to remove item safely', { itemId: id })

    const existingItem = cartContext.getItemById(id)
    if (!existingItem) {
      CartHookLogger.warn('Item not found for removal', { itemId: id })
      return { success: false, error: 'ITEM_NOT_FOUND' }
    }

    try {
      const result = await cartContext.removeItem(id)
      if (result.success) {
        CartHookLogger.info('Item removed successfully', { itemId: id })
      } else {
        CartHookLogger.error('Failed to remove item', result.error)
      }
      return result
    } catch (error) {
      CartHookLogger.error('Exception during item removal', error)
      return { success: false, error: 'UNEXPECTED_ERROR' }
    }
  }, [cartContext])

  // Debounced add item for performance (prevents rapid successive calls)
  const debouncedAddItem = useDebounce(
    (product: Product, quantity = 1, size?: string, color?: string) => {
      void addItemWithValidation(product, quantity, size, color)
    },
    300
  )

  // Utility methods
  const findItemByProductId = useCallback((productId: string) => {
    return cartContext.items.find(item => item.product.id === productId)
  }, [cartContext.items])

  const getItemsByCategory = useCallback((category: string) => {
    return cartContext.items.filter(item =>
      item.product.category?.name?.toLowerCase() === category.toLowerCase()
    )
  }, [cartContext.items])

  const getRecentlyAddedItems = useCallback((minutesAgo = 30) => {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000)
    return cartContext.items.filter(item => item.addedAt >= cutoffTime)
  }, [cartContext.items])

  // Accessibility helpers
  const getAriaLabel = useCallback((action: string, itemId?: string) => {
    const baseLabel = cartContext.getAccessibilityLabel(action as keyof typeof cartContext.loading)
    if (itemId) {
      const item = cartContext.getItemById(itemId)
      if (item) {
        return `${baseLabel} for ${item.product.name}`
      }
    }
    return baseLabel
  }, [cartContext])

  const getAriaDescription = useCallback((action: string) => {
    const descriptions = {
      addItem: 'Add this item to your shopping cart',
      removeItem: 'Remove this item from your shopping cart',
      updateQuantity: 'Change the quantity of this item in your cart',
      syncCart: 'Synchronize your cart with the server',
      calculateTotal: 'Calculate the total price of items in your cart'
    }
    return descriptions[action as keyof typeof descriptions] || action
  }, [])

  return {
    // Spread all context properties
    ...cartContext,

    // Additional computed properties
    isEmpty,
    hasOutOfStockItems,
    totalItemsValue,
    formattedTotal,

    // Enhanced methods
    addItemWithValidation,
    updateQuantityWithValidation,
    removeItemSafely,

    // Performance optimized methods
    debouncedAddItem,
    memoizedCartItems,

    // Accessibility helpers
    getAriaLabel,
    getAriaDescription,

    // Utility methods
    findItemByProductId,
    getItemsByCategory,
    getRecentlyAddedItems
  }
}

// Export types for external use
export type { CartItem }