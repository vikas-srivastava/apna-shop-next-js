'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react'
import { Product } from '@/lib/types'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '@/lib/api'

// Enhanced TypeScript types
export interface WishlistItem {
    id: string
    product: Product
    addedAt: Date
}

export interface WishlistOperationResult {
    success: boolean
    error?: string
    itemId?: string
}

interface WishlistState {
    items: WishlistItem[]
    itemCount: number
    loading: {
        addItem: boolean
        removeItem: boolean
    }
    lastSync: Date | null
    errors: WishlistError[]
}

interface WishlistError {
    id: string
    operation: string
    message: string
    timestamp: Date
    recoverable: boolean
}

type WishlistAction =
    | { type: 'ADD_ITEM_START'; payload: { itemId: string } }
    | { type: 'ADD_ITEM_SUCCESS'; payload: WishlistItem }
    | { type: 'ADD_ITEM_FAILURE'; payload: { itemId: string; error: string } }
    | { type: 'REMOVE_ITEM_START'; payload: { itemId: string } }
    | { type: 'REMOVE_ITEM_SUCCESS'; payload: string }
    | { type: 'REMOVE_ITEM_FAILURE'; payload: { itemId: string; error: string } }
    | { type: 'LOAD_WISHLIST'; payload: WishlistState }
    | { type: 'CLEAR_WISHLIST' }
    | { type: 'ADD_ERROR'; payload: WishlistError }
    | { type: 'CLEAR_ERROR'; payload: string }

interface WishlistContextType extends WishlistState {
    addItem: (product: Product) => Promise<WishlistOperationResult>
    removeItem: (id: string) => Promise<WishlistOperationResult>
    clearWishlist: () => void
    hasItem: (productId: string) => boolean
    getItemById: (id: string) => WishlistItem | undefined
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Logger utility for wishlist operations
class WishlistLogger {
    private static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
        const timestamp = new Date().toISOString()
        const logMessage = `[Wishlist ${timestamp}] ${message}`

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

// Wishlist validation utility
class WishlistValidator {
    static validateProduct(product: Product): { valid: boolean; error?: string } {
        if (!product || !product.id) {
            return { valid: false, error: 'Invalid product' }
        }
        return { valid: true }
    }
}

// Wishlist reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
    switch (action.type) {
        case 'ADD_ITEM_START': {
            WishlistLogger.info(`Starting add item operation for item: ${action.payload.itemId}`)
            return {
                ...state,
                loading: { ...state.loading, addItem: true }
            }
        }

        case 'ADD_ITEM_SUCCESS': {
            const newItems = [...state.items, action.payload]
            const newItemCount = newItems.length

            WishlistLogger.info(`Successfully added item: ${action.payload.id}`, {
                itemCount: newItemCount
            })

            return {
                ...state,
                items: newItems,
                itemCount: newItemCount,
                loading: { ...state.loading, addItem: false },
                lastSync: new Date()
            }
        }

        case 'ADD_ITEM_FAILURE': {
            WishlistLogger.error(`Failed to add item: ${action.payload.itemId}`, action.payload.error)
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
            WishlistLogger.info(`Starting remove item operation for item: ${action.payload.itemId}`)
            return {
                ...state,
                loading: { ...state.loading, removeItem: true }
            }
        }

        case 'REMOVE_ITEM_SUCCESS': {
            const newItems = state.items.filter(item => item.id !== action.payload)
            const newItemCount = newItems.length

            WishlistLogger.info(`Successfully removed item: ${action.payload}`, {
                remainingItems: newItemCount
            })

            return {
                ...state,
                items: newItems,
                itemCount: newItemCount,
                loading: { ...state.loading, removeItem: false },
                lastSync: new Date()
            }
        }

        case 'REMOVE_ITEM_FAILURE': {
            WishlistLogger.error(`Failed to remove item: ${action.payload.itemId}`, action.payload.error)
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

        case 'LOAD_WISHLIST': {
            WishlistLogger.info('Wishlist loaded from storage', {
                itemCount: action.payload.itemCount
            })
            return action.payload
        }

        case 'CLEAR_WISHLIST': {
            WishlistLogger.info('Wishlist cleared')
            return {
                ...state,
                items: [],
                itemCount: 0,
                lastSync: new Date()
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

        default:
            return state
    }
}

// Wishlist persistence utility
class WishlistPersistence {
    private static readonly STORAGE_KEY = 'wishlist'

    static save(wishlistState: WishlistState): void {
        try {
            const serializedState = JSON.stringify({
                ...wishlistState,
                lastSync: wishlistState.lastSync?.toISOString()
            })
            localStorage.setItem(this.STORAGE_KEY, serializedState)
            WishlistLogger.info('Wishlist state saved to localStorage')
        } catch (error) {
            WishlistLogger.error('Failed to save wishlist to localStorage', error)
        }
    }

    static load(): WishlistState | null {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY)
            if (!saved) return null

            const parsed = JSON.parse(saved)
            return {
                ...parsed,
                lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
                items: parsed.items.map((item: any) => ({
                    ...item,
                    addedAt: new Date(item.addedAt)
                }))
            }
        } catch (error) {
            WishlistLogger.error('Failed to load wishlist from localStorage', error)
            return null
        }
    }

    static clear(): void {
        localStorage.removeItem(this.STORAGE_KEY)
        WishlistLogger.info('Wishlist storage cleared')
    }
}

const initialState: WishlistState = {
    items: [],
    itemCount: 0,
    loading: {
        addItem: false,
        removeItem: false
    },
    lastSync: null,
    errors: []
}

/**
 * Wishlist Provider Component
 * Manages wishlist state with persistence and error handling
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(wishlistReducer, initialState)

    // Load wishlist from API and localStorage on mount
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                // First load from localStorage for immediate UI
                const savedWishlist = WishlistPersistence.load()
                if (savedWishlist) {
                    dispatch({ type: 'LOAD_WISHLIST', payload: savedWishlist })
                }

                // Then fetch from API to sync
                const apiResponse = await getWishlist()
                if (apiResponse.success && apiResponse.data) {
                    // Parse the API response (assuming it's a JSON string)
                    const apiWishlistItems = apiResponse.data

                    // Convert API format to our WishlistItem format
                    const apiItems: WishlistItem[] = apiWishlistItems.map((item: any) => ({
                        id: item.id || `api-${item.product_id}-${Date.now()}`,
                        product: {
                            id: item.product_id.toString(),
                            name: item.product_name || 'Unknown Product',
                            slug: item.product_slug || '',
                            description: '',
                            price: parseFloat(item.product_price || '0'),
                            images: [item.product_image || ''],
                            category: { id: '1', name: 'General', slug: 'general' },
                            inStock: true,
                            stockCount: 1,
                            rating: 4.0,
                            reviewCount: 0,
                            tags: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        },
                        addedAt: new Date(item.added_at || Date.now())
                    }))

                    // Merge with localStorage items, preferring API data
                    const mergedItems = [...apiItems]
                    const localItems = savedWishlist?.items || []

                    // Add local items that aren't in API
                    localItems.forEach(localItem => {
                        if (!mergedItems.some(apiItem => apiItem.product.id === localItem.product.id)) {
                            mergedItems.push(localItem)
                        }
                    })

                    const mergedState: WishlistState = {
                        items: mergedItems,
                        itemCount: mergedItems.length,
                        loading: { addItem: false, removeItem: false },
                        lastSync: new Date(),
                        errors: []
                    }

                    dispatch({ type: 'LOAD_WISHLIST', payload: mergedState })
                    WishlistLogger.info('Wishlist synced with API', { itemCount: mergedItems.length })
                }
            } catch (error) {
                WishlistLogger.error('Failed to load wishlist from API', error)
                // Keep localStorage data if API fails
            }
        }

        loadWishlist()
    }, [])

    // Save wishlist to localStorage whenever state changes
    useEffect(() => {
        WishlistPersistence.save(state)
    }, [state])

    // Check if product is in wishlist
    const hasItem = useCallback((productId: string) => {
        return state.items.some(item => item.product.id === productId)
    }, [state.items])

    // Get item by ID
    const getItemById = useCallback((id: string) => {
        return state.items.find(item => item.id === id)
    }, [state.items])

    // Add item to wishlist
    const addItem = async (product: Product): Promise<WishlistOperationResult> => {
        // Validate input
        const validation = WishlistValidator.validateProduct(product)
        if (!validation.valid) {
            WishlistLogger.warn('Wishlist item validation failed', validation.error)
            return { success: false, error: validation.error }
        }

        // Check if already in wishlist
        if (hasItem(product.id)) {
            return { success: false, error: 'Item already in wishlist' }
        }

        const itemId = `wishlist-${product.id}-${Date.now()}`
        dispatch({ type: 'ADD_ITEM_START', payload: { itemId } })

        // Optimistic update
        const wishlistItem: WishlistItem = {
            id: itemId,
            product,
            addedAt: new Date()
        }

        dispatch({ type: 'ADD_ITEM_SUCCESS', payload: wishlistItem })

        try {
            // Call API to add to wishlist
            const apiResponse = await apiAddToWishlist(parseInt(product.id))

            if (!apiResponse.success) {
                dispatch({ type: 'ADD_ITEM_FAILURE', payload: { itemId, error: apiResponse.error || 'Failed to add to wishlist' } })
                return { success: false, error: apiResponse.error || 'Failed to add to wishlist' }
            }

            WishlistLogger.info('Successfully added item to wishlist', { itemId })
            return { success: true, itemId }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist'
            dispatch({ type: 'ADD_ITEM_FAILURE', payload: { itemId, error: errorMessage } })
            return { success: false, error: errorMessage }
        }
    }

    // Remove item from wishlist
    const removeItem = async (id: string): Promise<WishlistOperationResult> => {
        const existingItem = getItemById(id)
        if (!existingItem) {
            return { success: false, error: 'Item not found in wishlist' }
        }

        dispatch({ type: 'REMOVE_ITEM_START', payload: { itemId: id } })

        // Optimistic update
        dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: id })

        try {
            // Call API to remove from wishlist
            const apiResponse = await apiRemoveFromWishlist(id)

            if (!apiResponse.success) {
                dispatch({ type: 'REMOVE_ITEM_FAILURE', payload: { itemId: id, error: apiResponse.error || 'Failed to remove from wishlist' } })
                return { success: false, error: apiResponse.error || 'Failed to remove from wishlist' }
            }

            WishlistLogger.info('Successfully removed item from wishlist', { itemId: id })
            return { success: true, itemId: id }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist'
            dispatch({ type: 'REMOVE_ITEM_FAILURE', payload: { itemId: id, error: errorMessage } })
            return { success: false, error: errorMessage }
        }
    }

    // Clear wishlist
    const clearWishlist = useCallback(() => {
        dispatch({ type: 'CLEAR_WISHLIST' })
    }, [])

    const value: WishlistContextType = {
        ...state,
        addItem,
        removeItem,
        clearWishlist,
        hasItem,
        getItemById
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}

/**
 * Hook to use wishlist context
 */
export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}