'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react'
import { Product } from '@/lib/types'
import {
  addToCart as apiAddToCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
  getCart as apiGetCart,
  getCartTotal as apiGetCartTotal
} from '@/lib/api'
import { useRouter } from 'next/navigation'

// Enhanced TypeScript types
export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  addedAt: Date
  lastModified: Date
}

export interface CartOperationResult {
  success: boolean
  error?: string
  itemId?: string
}

export interface CartLoadingStates {
  addItem: boolean
  removeItem: boolean
  updateQuantity: boolean
  syncCart: boolean
  calculateTotal: boolean
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: CartLoadingStates
  lastSync: Date | null
  isOnline: boolean
  pendingOperations: CartOperation[]
  errors: CartError[]
}

interface CartOperation {
  id: string
  type: 'add' | 'remove' | 'update'
  itemId: string
  data: any
  timestamp: Date
  retryCount: number
}

interface CartError {
  id: string
  operation: string
  message: string
  timestamp: Date
  recoverable: boolean
}

type CartAction =
  | { type: 'ADD_ITEM_START'; payload: { itemId: string } }
  | { type: 'ADD_ITEM_SUCCESS'; payload: CartItem }
  | { type: 'ADD_ITEM_FAILURE'; payload: { itemId: string; error: string } }
  | { type: 'REMOVE_ITEM_START'; payload: { itemId: string } }
  | { type: 'REMOVE_ITEM_SUCCESS'; payload: string }
  | { type: 'REMOVE_ITEM_FAILURE'; payload: { itemId: string; error: string } }
  | { type: 'UPDATE_QUANTITY_START'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY_SUCCESS'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_QUANTITY_FAILURE'; payload: { itemId: string; error: string; previousQuantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; payload: { items: CartItem[]; total: number } }
  | { type: 'SYNC_FAILURE'; payload: string }
  | { type: 'SET_LOADING'; payload: Partial<CartLoadingStates> }
  | { type: 'ADD_ERROR'; payload: CartError }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'ADD_PENDING_OPERATION'; payload: CartOperation }
  | { type: 'REMOVE_PENDING_OPERATION'; payload: string }

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => Promise<CartOperationResult>
  removeItem: (id: string) => Promise<CartOperationResult>
  updateQuantity: (id: string, quantity: number) => Promise<CartOperationResult>
  clearCart: () => void
  syncCart: () => Promise<void>
  retryFailedOperation: (operationId: string) => Promise<void>
  validateCartItem: (product: Product, quantity: number) => { valid: boolean; error?: string }
  calculateTotal: () => number
  getItemById: (id: string) => CartItem | undefined
  hasPendingOperations: boolean
  getAccessibilityLabel: (operation: keyof CartLoadingStates) => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Logger utility for cart operations
class CartLogger {
  private static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[Cart ${timestamp}] ${message}`

    switch (level) {
      case 'info':
        console.log(logMessage, data || '')
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

// Cart validation utility
class CartValidator {
  static validateProduct(product: Product): { valid: boolean; error?: string } {
    if (!product || !product.id) {
      return { valid: false, error: 'Invalid product' }
    }
    if (typeof product.price !== 'number' || product.price < 0) {
      return { valid: false, error: 'Invalid product price' }
    }
    if (!product.inStock) {
      return { valid: false, error: 'Product is out of stock' }
    }
    return { valid: true }
  }

  static validateQuantity(quantity: number, maxStock?: number): { valid: boolean; error?: string } {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { valid: false, error: 'Quantity must be a positive integer' }
    }
    if (maxStock && quantity > maxStock) {
      return { valid: false, error: `Maximum quantity is ${maxStock}` }
    }
    return { valid: true }
  }

  static validateCartItem(product: Product, quantity: number): { valid: boolean; error?: string } {
    const productValidation = this.validateProduct(product)
    if (!productValidation.valid) {
      return productValidation
    }

    const quantityValidation = this.validateQuantity(quantity, product.stockCount)
    if (!quantityValidation.valid) {
      return quantityValidation
    }

    return { valid: true }
  }
}

// Cart reducer with enhanced error handling
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM_START': {
      CartLogger.info(`Starting add item operation for item: ${action.payload.itemId}`)
      return {
        ...state,
        loading: { ...state.loading, addItem: true }
      }
    }

    case 'ADD_ITEM_SUCCESS': {
      const newItems = [...state.items, action.payload]
      const newTotal = CartCalculator.calculateTotal(newItems)
      const newItemCount = CartCalculator.calculateItemCount(newItems)

      CartLogger.info(`Successfully added item: ${action.payload.id}`, {
        itemCount: newItemCount,
        total: newTotal
      })

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        loading: { ...state.loading, addItem: false },
        lastSync: new Date()
      }
    }

    case 'ADD_ITEM_FAILURE': {
      CartLogger.error(`Failed to add item: ${action.payload.itemId}`, action.payload.error)
      return {
        ...state,
        loading: { ...state.loading, addItem: false },
        errors: [...state.errors, {
          id: `add-${action.payload.itemId}-${Date.now()}`,
          operation: 'add_item',
          message: action.payload.error,
          timestamp: new Date(),
          recoverable: true
        }]
      }
    }

    case 'REMOVE_ITEM_START': {
      CartLogger.info(`Starting remove item operation for item: ${action.payload.itemId}`)
      return {
        ...state,
        loading: { ...state.loading, removeItem: true }
      }
    }

    case 'REMOVE_ITEM_SUCCESS': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const newTotal = CartCalculator.calculateTotal(newItems)
      const newItemCount = CartCalculator.calculateItemCount(newItems)

      CartLogger.info(`Successfully removed item: ${action.payload}`, {
        remainingItems: newItemCount,
        total: newTotal
      })

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        loading: { ...state.loading, removeItem: false },
        lastSync: new Date()
      }
    }

    case 'REMOVE_ITEM_FAILURE': {
      CartLogger.error(`Failed to remove item: ${action.payload.itemId}`, action.payload.error)
      return {
        ...state,
        loading: { ...state.loading, removeItem: false },
        errors: [...state.errors, {
          id: `remove-${action.payload.itemId}-${Date.now()}`,
          operation: 'remove_item',
          message: action.payload.error,
          timestamp: new Date(),
          recoverable: true
        }]
      }
    }

    case 'UPDATE_QUANTITY_START': {
      CartLogger.info(`Starting quantity update for item: ${action.payload.itemId}`)
      return {
        ...state,
        loading: { ...state.loading, updateQuantity: true }
      }
    }

    case 'UPDATE_QUANTITY_SUCCESS': {
      const { itemId, quantity } = action.payload
      const newItems = state.items.map(item =>
        item.id === itemId
          ? { ...item, quantity, lastModified: new Date() }
          : item
      )
      const newTotal = CartCalculator.calculateTotal(newItems)

      CartLogger.info(`Successfully updated quantity for item: ${itemId}`, {
        newQuantity: quantity,
        total: newTotal
      })

      return {
        ...state,
        items: newItems,
        total: newTotal,
        loading: { ...state.loading, updateQuantity: false },
        lastSync: new Date()
      }
    }

    case 'UPDATE_QUANTITY_FAILURE': {
      CartLogger.error(`Failed to update quantity for item: ${action.payload.itemId}`, action.payload.error)

      // Rollback to previous quantity
      const newItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.previousQuantity, lastModified: new Date() }
          : item
      )
      const newTotal = CartCalculator.calculateTotal(newItems)

      return {
        ...state,
        items: newItems,
        total: newTotal,
        loading: { ...state.loading, updateQuantity: false },
        errors: [...state.errors, {
          id: `update-${action.payload.itemId}-${Date.now()}`,
          operation: 'update_quantity',
          message: action.payload.error,
          timestamp: new Date(),
          recoverable: true
        }]
      }
    }

    case 'CLEAR_CART': {
      CartLogger.info('Cart cleared')
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        lastSync: new Date()
      }
    }

    case 'LOAD_CART': {
      CartLogger.info('Cart loaded from storage', {
        itemCount: action.payload.itemCount,
        total: action.payload.total
      })
      return action.payload
    }

    case 'SYNC_START': {
      CartLogger.info('Starting cart synchronization')
      return {
        ...state,
        loading: { ...state.loading, syncCart: true }
      }
    }

    case 'SYNC_SUCCESS': {
      CartLogger.info('Cart synchronization successful', {
        itemCount: action.payload.items.length,
        total: action.payload.total
      })
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.items.length,
        loading: { ...state.loading, syncCart: false },
        lastSync: new Date()
      }
    }

    case 'SYNC_FAILURE': {
      CartLogger.error('Cart synchronization failed', action.payload)
      return {
        ...state,
        loading: { ...state.loading, syncCart: false },
        errors: [...state.errors, {
          id: `sync-${Date.now()}`,
          operation: 'sync_cart',
          message: action.payload,
          timestamp: new Date(),
          recoverable: true
        }]
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: { ...state.loading, ...action.payload }
      }
    }

    case 'ADD_ERROR': {
      return {
        ...state,
        errors: [...state.errors, action.payload]
      }
    }

    case 'CLEAR_ERROR': {
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      }
    }

    case 'SET_ONLINE': {
      CartLogger.info(`Connection status changed: ${action.payload ? 'online' : 'offline'}`)
      return {
        ...state,
        isOnline: action.payload
      }
    }

    case 'ADD_PENDING_OPERATION': {
      return {
        ...state,
        pendingOperations: [...state.pendingOperations, action.payload]
      }
    }

    case 'REMOVE_PENDING_OPERATION': {
      return {
        ...state,
        pendingOperations: state.pendingOperations.filter(op => op.id !== action.payload)
      }
    }

    default:
      return state
  }
}

// Cart calculation utility
class CartCalculator {
  static calculateTotal(items: CartItem[]): number {
    try {
      return items.reduce((sum, item) => {
        const itemTotal = item.product.price * item.quantity
        return sum + itemTotal
      }, 0)
    } catch (error) {
      CartLogger.error('Error calculating cart total', error)
      return 0
    }
  }

  static calculateItemCount(items: CartItem[]): number {
    try {
      return items.reduce((sum, item) => sum + item.quantity, 0)
    } catch (error) {
      CartLogger.error('Error calculating item count', error)
      return 0
    }
  }
}

// Cart persistence utility
class CartPersistence {
  private static readonly STORAGE_KEY = 'enhanced_cart'
  private static readonly BACKUP_KEY = 'enhanced_cart_backup'

  static save(cartState: CartState): void {
    try {
      const serializedState = JSON.stringify({
        ...cartState,
        lastSync: cartState.lastSync?.toISOString()
      })
      localStorage.setItem(this.STORAGE_KEY, serializedState)

      // Create backup every 10 saves
      const saveCount = parseInt(localStorage.getItem('cart_save_count') || '0') + 1
      if (saveCount % 10 === 0) {
        localStorage.setItem(this.BACKUP_KEY, serializedState)
      }
      localStorage.setItem('cart_save_count', saveCount.toString())

      CartLogger.info('Cart state saved to localStorage')
    } catch (error) {
      CartLogger.error('Failed to save cart to localStorage', error)
    }
  }

  static load(): CartState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (!saved) return null

      const parsed = JSON.parse(saved)
      return {
        ...parsed,
        lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
        items: parsed.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          lastModified: new Date(item.lastModified)
        }))
      }
    } catch (error) {
      CartLogger.error('Failed to load cart from localStorage', error)
      return this.loadBackup()
    }
  }

  static loadBackup(): CartState | null {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY)
      if (!backup) return null

      const parsed = JSON.parse(backup)
      CartLogger.info('Loaded cart from backup')
      return {
        ...parsed,
        lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
        items: parsed.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          lastModified: new Date(item.lastModified)
        }))
      }
    } catch (error) {
      CartLogger.error('Failed to load cart backup', error)
      return null
    }
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.BACKUP_KEY)
    localStorage.removeItem('cart_save_count')
    CartLogger.info('Cart storage cleared')
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: {
    addItem: false,
    removeItem: false,
    updateQuantity: false,
    syncCart: false,
    calculateTotal: false
  },
  lastSync: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingOperations: [],
  errors: []
}

/**
 * Enhanced Cart Provider Component
 * Implements optimistic updates, error handling, and synchronization
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const router = useRouter()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = CartPersistence.load()
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: savedCart })
    }
  }, [])

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    CartPersistence.save(state)
  }, [state])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-sync when coming back online
  useEffect(() => {
    if (state.isOnline && state.pendingOperations.length > 0) {
      syncCart()
    }
  }, [state.isOnline])

  // Validate cart item
  const validateCartItem = useCallback((product: Product, quantity: number) => {
    return CartValidator.validateCartItem(product, quantity)
  }, [])

  // Get item by ID
  const getItemById = useCallback((id: string) => {
    return state.items.find(item => item.id === id)
  }, [state.items])

  // Calculate total with error handling
  const calculateTotal = useCallback(() => {
    return CartCalculator.calculateTotal(state.items)
  }, [state.items])

  // Get accessibility label for loading states
  const getAccessibilityLabel = useCallback((operation: keyof CartLoadingStates) => {
    const labels = {
      addItem: state.loading.addItem ? 'Adding item to cart' : 'Add item to cart',
      removeItem: state.loading.removeItem ? 'Removing item from cart' : 'Remove item from cart',
      updateQuantity: state.loading.updateQuantity ? 'Updating item quantity' : 'Update item quantity',
      syncCart: state.loading.syncCart ? 'Synchronizing cart' : 'Sync cart',
      calculateTotal: state.loading.calculateTotal ? 'Calculating total' : 'Calculate total'
    }
    return labels[operation]
  }, [state.loading])

  // Add item with optimistic updates
  const addItem = async (
    product: Product,
    quantity = 1,
    size?: string,
    color?: string
  ): Promise<CartOperationResult> => {
    // Validate input
    const validation = validateCartItem(product, quantity)
    if (!validation.valid) {
      CartLogger.warn('Cart item validation failed', validation.error)
      return { success: false, error: validation.error }
    }

    // Check authentication
    const customerId = localStorage.getItem('customer_id')
    if (!customerId) {
      // Store intent for after login
      try {
        localStorage.setItem('pending_add_to_cart', JSON.stringify({ product, quantity, size, color }))
      } catch (error) {
        CartLogger.error('Failed to store pending cart operation', error)
      }

      const returnUrl = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/'

      try {
        localStorage.setItem('post_login_redirect', returnUrl)
      } catch (error) {
        CartLogger.error('Failed to store return URL', error)
      }

      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      return { success: false, error: 'AUTH_REQUIRED' }
    }

    const itemId = `${product.id}-${size || 'default'}-${color || 'default'}`
    dispatch({ type: 'ADD_ITEM_START', payload: { itemId } })

    // Optimistic update
    const optimisticItem: CartItem = {
      id: itemId,
      product,
      quantity,
      selectedSize: size,
      selectedColor: color,
      addedAt: new Date(),
      lastModified: new Date()
    }

    dispatch({ type: 'ADD_ITEM_SUCCESS', payload: optimisticItem })

    try {
      // API call
      const response = await apiAddToCart({
        product_id: parseInt(product.id, 10),
        product_quantity: quantity,
        product_variant_id: null,
        product_variant_data: size || color ? [size || '', color || ''] : null,
        customer_id: customerId
      })

      if (response.success) {
        CartLogger.info('Successfully added item to cart via API', { itemId })
        return { success: true, itemId }
      } else {
        CartLogger.error('API failed to add item', response.error)
        // Rollback optimistic update
        dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: itemId })
        dispatch({ type: 'ADD_ITEM_FAILURE', payload: { itemId, error: response.error || 'ADD_TO_CART_FAILED' } })
        return { success: false, error: response.error || 'ADD_TO_CART_FAILED' }
      }
    } catch (error) {
      CartLogger.error('Exception during add to cart', error)
      // Rollback optimistic update
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: itemId })
      dispatch({ type: 'ADD_ITEM_FAILURE', payload: { itemId, error: 'ADD_TO_CART_EXCEPTION' } })
      return { success: false, error: 'ADD_TO_CART_EXCEPTION' }
    }
  }

  // Remove item with optimistic updates
  const removeItem = async (id: string): Promise<CartOperationResult> => {
    const existingItem = getItemById(id)
    if (!existingItem) {
      return { success: false, error: 'Item not found in cart' }
    }

    dispatch({ type: 'REMOVE_ITEM_START', payload: { itemId: id } })

    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: id })

    try {
      // Extract product ID from cart item ID
      const productId = id.split('-')[0]
      const response = await apiRemoveCartItem(productId)

      if (response.success) {
        CartLogger.info('Successfully removed item from cart via API', { itemId: id })
        return { success: true, itemId: id }
      } else {
        CartLogger.error('API failed to remove item', response.error)
        // Rollback optimistic update
        dispatch({ type: 'ADD_ITEM_SUCCESS', payload: existingItem })
        dispatch({ type: 'REMOVE_ITEM_FAILURE', payload: { itemId: id, error: response.error || 'REMOVE_FROM_CART_FAILED' } })
        return { success: false, error: response.error || 'REMOVE_FROM_CART_FAILED' }
      }
    } catch (error) {
      CartLogger.error('Exception during remove from cart', error)
      // Rollback optimistic update
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: existingItem })
      dispatch({ type: 'REMOVE_ITEM_FAILURE', payload: { itemId: id, error: 'REMOVE_FROM_CART_EXCEPTION' } })
      return { success: false, error: 'REMOVE_FROM_CART_EXCEPTION' }
    }
  }

  // Update quantity with optimistic updates
  const updateQuantity = async (id: string, quantity: number): Promise<CartOperationResult> => {
    const existingItem = getItemById(id)
    if (!existingItem) {
      return { success: false, error: 'Item not found in cart' }
    }

    // Validate quantity
    const validation = CartValidator.validateQuantity(quantity, existingItem.product.stockCount)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    if (quantity <= 0) {
      return removeItem(id)
    }

    dispatch({ type: 'UPDATE_QUANTITY_START', payload: { itemId: id } })

    // Optimistic update
    dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', payload: { itemId: id, quantity } })

    try {
      const response = await apiUpdateCartItem(id, quantity)

      if (response.success) {
        CartLogger.info('Successfully updated item quantity via API', { itemId: id, quantity })
        return { success: true, itemId: id }
      } else {
        CartLogger.error('API failed to update quantity', response.error)
        // Rollback optimistic update
        dispatch({ type: 'UPDATE_QUANTITY_FAILURE', payload: {
          itemId: id,
          error: response.error || 'UPDATE_QUANTITY_FAILED',
          previousQuantity: existingItem.quantity
        } })
        return { success: false, error: response.error || 'UPDATE_QUANTITY_FAILED' }
      }
    } catch (error) {
      CartLogger.error('Exception during quantity update', error)
      // Rollback optimistic update
      dispatch({ type: 'UPDATE_QUANTITY_FAILURE', payload: {
        itemId: id,
        error: 'UPDATE_QUANTITY_EXCEPTION',
        previousQuantity: existingItem.quantity
      } })
      return { success: false, error: 'UPDATE_QUANTITY_EXCEPTION' }
    }
  }

  // Clear cart
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  // Sync cart with API
  const syncCart = useCallback(async () => {
    if (!state.isOnline) {
      CartLogger.warn('Cannot sync cart: offline')
      return
    }

    dispatch({ type: 'SYNC_START' })

    try {
      const [cartResponse, totalResponse] = await Promise.all([
        apiGetCart(),
        apiGetCartTotal()
      ])

      if (cartResponse.success && totalResponse.success) {
        // Transform API cart data to local format
        const syncedItems: CartItem[] = [] // Transform cartResponse.data.items as needed
        const syncedTotal = parseFloat(totalResponse.data?.total || '0') || 0

        dispatch({ type: 'SYNC_SUCCESS', payload: { items: syncedItems, total: syncedTotal } })
        CartLogger.info('Cart synchronized successfully')
      } else {
        const error = cartResponse.error || totalResponse.error || 'SYNC_FAILED'
        dispatch({ type: 'SYNC_FAILURE', payload: error })
      }
    } catch (error) {
      CartLogger.error('Exception during cart sync', error)
      dispatch({ type: 'SYNC_FAILURE', payload: 'SYNC_EXCEPTION' })
    }
  }, [state.isOnline])

  // Retry failed operation
  const retryFailedOperation = useCallback(async (operationId: string) => {
    const operation = state.pendingOperations.find(op => op.id === operationId)
    if (!operation) return

    dispatch({ type: 'REMOVE_PENDING_OPERATION', payload: operationId })

    // Retry based on operation type
    switch (operation.type) {
      case 'add':
        await addItem(operation.data.product, operation.data.quantity, operation.data.size, operation.data.color)
        break
      case 'remove':
        await removeItem(operation.itemId)
        break
      case 'update':
        await updateQuantity(operation.itemId, operation.data.quantity)
        break
    }
  }, [state.pendingOperations])

  // Resume pending add to cart after login
  useEffect(() => {
    try {
      const customerId = localStorage.getItem('customer_id')
      const pending = localStorage.getItem('pending_add_to_cart')
      if (customerId && pending) {
        const { product, quantity, size, color } = JSON.parse(pending)
        void addItem(product, quantity, size, color)
        localStorage.removeItem('pending_add_to_cart')
      }
    } catch (error) {
      CartLogger.error('Failed to resume pending cart operation', error)
    }
  }, [])

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncCart,
    retryFailedOperation,
    validateCartItem,
    calculateTotal,
    getItemById,
    hasPendingOperations: state.pendingOperations.length > 0,
    getAccessibilityLabel
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Hook to use enhanced cart context
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Export types for external use
