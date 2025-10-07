'use client'

/**
 * Enhanced Product Context with Context7 best practices
 * Includes caching, debouncing, prefetching, analytics, and accessibility
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse } from '../lib/types'
import {
  getCategories,
  getProducts,
  getProduct,
  getFeaturedProducts,
  getRelatedProducts,
  clearApiCache,
  getApiPerformanceMetrics
} from '../lib/api'

// Types for context state
interface ProductState {
  // Data
  products: Product[]
  categories: Category[]
  brands: any[]
  featuredProducts: Product[]
  currentProduct: Product | null
  relatedProducts: Product[]

  // Search and filters
  searchQuery: string
  filters: ProductFilter
  sortBy: ProductFilter['sortBy']

  // Pagination
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPrevPage: boolean

  // Loading states
  loading: {
    products: boolean
    categories: boolean
    brands: boolean
    product: boolean
    featured: boolean
    related: boolean
    search: boolean
  }

  // Errors
  errors: {
    products?: string
    categories?: string
    brands?: string
    product?: string
    featured?: string
    related?: string
    search?: string
  }

  // Analytics
  viewHistory: string[]
  searchHistory: string[]
  lastViewedProduct?: string
}

// Action types
type ProductAction =
  | { type: 'SET_LOADING'; key: keyof ProductState['loading']; value: boolean }
  | { type: 'SET_ERROR'; key: keyof ProductState['errors']; value: string | undefined }
  | { type: 'SET_PRODUCTS'; payload: PaginatedResponse<Product> }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_FEATURED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CURRENT_PRODUCT'; payload: Product }
  | { type: 'SET_RELATED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<ProductFilter> }
  | { type: 'SET_SORT_BY'; payload: ProductFilter['sortBy'] }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_TO_VIEW_HISTORY'; payload: string }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_CACHE' }
  | { type: 'PREFETCH_PRODUCT'; payload: string }

// Initial state
const initialState: ProductState = {
  products: [],
  categories: [],
  brands: [],
  featuredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  searchQuery: '',
  filters: {},
  sortBy: 'newest',
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  hasNextPage: false,
  hasPrevPage: false,
  loading: {
    products: false,
    categories: false,
    brands: false,
    product: false,
    featured: false,
    related: false,
    search: false,
  },
  errors: {},
  viewHistory: [],
  searchHistory: [],
}

// Reducer
function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.value },
      }

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.value },
      }

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.data,
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.totalPages,
        totalProducts: action.payload.pagination.total,
        hasNextPage: action.payload.pagination.page < action.payload.pagination.totalPages,
        hasPrevPage: action.payload.pagination.page > 1,
        loading: { ...state.loading, products: false },
        errors: { ...state.errors, products: undefined },
      }

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        loading: { ...state.loading, categories: false },
        errors: { ...state.errors, categories: undefined },
      }

    case 'SET_FEATURED_PRODUCTS':
      return {
        ...state,
        featuredProducts: action.payload,
        loading: { ...state.loading, featured: false },
        errors: { ...state.errors, featured: undefined },
      }

    case 'SET_CURRENT_PRODUCT':
      return {
        ...state,
        currentProduct: action.payload,
        lastViewedProduct: action.payload.id,
        loading: { ...state.loading, product: false },
        errors: { ...state.errors, product: undefined },
      }

    case 'SET_RELATED_PRODUCTS':
      return {
        ...state,
        relatedProducts: action.payload,
        loading: { ...state.loading, related: false },
        errors: { ...state.errors, related: undefined },
      }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        loading: { ...state.loading, search: false },
        errors: { ...state.errors, search: undefined },
      }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {},
        sortBy: 'newest',
        currentPage: 1,
      }

    case 'ADD_TO_VIEW_HISTORY':
      const newViewHistory = [action.payload, ...state.viewHistory.filter(id => id !== action.payload)].slice(0, 50)
      return {
        ...state,
        viewHistory: newViewHistory,
      }

    case 'ADD_TO_SEARCH_HISTORY':
      const newSearchHistory = [action.payload, ...state.searchHistory.filter(term => term !== action.payload)].slice(0, 20)
      return {
        ...state,
        searchHistory: newSearchHistory,
      }

    case 'CLEAR_CACHE':
      clearApiCache()
      return state

    case 'PREFETCH_PRODUCT':
      // Prefetch logic handled in useEffect
      return state

    default:
      return state
  }
}

// Context
const ProductContext = createContext<{
  state: ProductState
  actions: {
    fetchProducts: (page?: number, limit?: number) => Promise<void>
    fetchProduct: (slug: string) => Promise<void>
    fetchRelatedProducts: (productId: string, limit?: number) => Promise<void>
    searchProducts: (query: string) => Promise<void>
    clearCache: () => void
    prefetchProduct: (slug: string) => void
    trackProductView: (productId: string) => void
    getPerformanceMetrics: () => any
  }
  stableActions: {
    fetchCategories: () => Promise<void>
    fetchFeaturedProducts: (limit?: number) => Promise<void>
    setFilters: (filters: Partial<ProductFilter>) => void
    setSortBy: (sortBy: ProductFilter['sortBy']) => void
    resetFilters: () => void
  }
} | null>(null)

// Provider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Logger utility
  const logger = useMemo(() => ({
    info: (message: string, data?: any) => {
      console.log(`[ProductContext] ${message}`, data)
    },
    warn: (message: string, data?: any) => {
      console.warn(`[ProductContext] ${message}`, data)
    },
    error: (message: string, data?: any) => {
      console.error(`[ProductContext] ${message}`, data)
    },
  }), [])

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (query.trim()) {
        dispatch({ type: 'SET_LOADING', key: 'search', value: true })
        dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query })

        try {
          logger.info('Searching products', { query })
          const response = await getProducts({ search: query }, 1, 20)

          if (response.success && response.data) {
            dispatch({ type: 'SET_PRODUCTS', payload: response.data })
            dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
          } else {
            dispatch({ type: 'SET_ERROR', key: 'search', value: response.error || 'Search failed' })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Search failed'
          dispatch({ type: 'SET_ERROR', key: 'search', value: errorMessage })
          logger.error('Search error', { query, error: errorMessage })
        } finally {
          dispatch({ type: 'SET_LOADING', key: 'search', value: false })
        }
      }
    }, 300) // 300ms debounce
  }, [logger])

  // Prefetch product
  const prefetchProduct = useCallback((slug: string) => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current)
    }

    prefetchTimeoutRef.current = setTimeout(async () => {
      try {
        logger.info('Prefetching product', { slug })
        await getProduct(slug)
      } catch (error) {
        logger.warn('Prefetch failed', { slug, error })
      }
    }, 100) // Small delay to avoid immediate prefetch
  }, [logger])

  // Actions
  const actions = useMemo(() => ({
    fetchProducts: async (page = 1, limit = 12) => {
      dispatch({ type: 'SET_LOADING', key: 'products', value: true })

      try {
        logger.info('Fetching products', { page, limit, filters: state.filters, sortBy: state.sortBy })
        const filters: ProductFilter = {
          ...state.filters,
          sortBy: state.sortBy,
        }

        const response = await getProducts(filters, page, limit)

        if (response.success && response.data) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', key: 'products', value: response.error || 'Failed to fetch products' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products'
        dispatch({ type: 'SET_ERROR', key: 'products', value: errorMessage })
        logger.error('Fetch products error', { page, limit, error: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', key: 'products', value: false })
      }
    },


    fetchProduct: async (slug: string) => {
      dispatch({ type: 'SET_LOADING', key: 'product', value: true })

      try {
        logger.info('Fetching product', { slug })
        const response = await getProduct(slug)

        if (response.success && response.data) {
          dispatch({ type: 'SET_CURRENT_PRODUCT', payload: response.data })
          dispatch({ type: 'ADD_TO_VIEW_HISTORY', payload: response.data.id })

          // Track analytics
          if (typeof window !== 'undefined') {
            // Send to analytics service
            logger.info('Product viewed', { productId: response.data.id, productName: response.data.name })
          }
        } else {
          dispatch({ type: 'SET_ERROR', key: 'product', value: response.error || 'Failed to fetch product' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product'
        dispatch({ type: 'SET_ERROR', key: 'product', value: errorMessage })
        logger.error('Fetch product error', { slug, error: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', key: 'product', value: false })
      }
    },

    fetchRelatedProducts: async (productId: string, limit = 4) => {
      dispatch({ type: 'SET_LOADING', key: 'related', value: true })

      try {
        logger.info('Fetching related products', { productId, limit })
        const response = await getRelatedProducts(productId, limit)

        if (response.success && response.data) {
          dispatch({ type: 'SET_RELATED_PRODUCTS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', key: 'related', value: response.error || 'Failed to fetch related products' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch related products'
        dispatch({ type: 'SET_ERROR', key: 'related', value: errorMessage })
        logger.error('Fetch related products error', { productId, limit, error: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', key: 'related', value: false })
      }
    },

    searchProducts: async (query: string) => {
      debouncedSearch(query)
    },

    clearCache: () => {
      dispatch({ type: 'CLEAR_CACHE' })
      logger.info('Cache cleared')
    },

    prefetchProduct,

    trackProductView: (productId: string) => {
      dispatch({ type: 'ADD_TO_VIEW_HISTORY', payload: productId })
      logger.info('Product view tracked', { productId })
    },

    getPerformanceMetrics: () => {
      return getApiPerformanceMetrics()
    },
  }), [state.filters, state.sortBy, debouncedSearch, prefetchProduct, logger])

  // Separate actions that don't depend on state to avoid infinite loops
  const stableActions = useMemo(() => ({
    fetchCategories: async () => {
      dispatch({ type: 'SET_LOADING', key: 'categories', value: true })

      try {
        logger.info('Fetching categories')
        const response = await getCategories()

        if (response.success && response.data) {
          dispatch({ type: 'SET_CATEGORIES', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', key: 'categories', value: response.error || 'Failed to fetch categories' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories'
        dispatch({ type: 'SET_ERROR', key: 'categories', value: errorMessage })
        logger.error('Fetch categories error', { error: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', key: 'categories', value: false })
      }
    },

    fetchFeaturedProducts: async (limit = 6) => {
      dispatch({ type: 'SET_LOADING', key: 'featured', value: true })

      try {
        logger.info('Fetching featured products', { limit })
        const response = await getFeaturedProducts(limit)

        if (response.success && response.data) {
          dispatch({ type: 'SET_FEATURED_PRODUCTS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', key: 'featured', value: response.error || 'Failed to fetch featured products' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch featured products'
        dispatch({ type: 'SET_ERROR', key: 'featured', value: errorMessage })
        logger.error('Fetch featured products error', { limit, error: errorMessage })
      } finally {
        dispatch({ type: 'SET_LOADING', key: 'featured', value: false })
      }
    },

    setFilters: (filters: Partial<ProductFilter>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters })
      logger.info('Filters updated', { filters })
    },

    setSortBy: (sortBy: ProductFilter['sortBy']) => {
      dispatch({ type: 'SET_SORT_BY', payload: sortBy })
      logger.info('Sort updated', { sortBy })
    },

    resetFilters: () => {
      dispatch({ type: 'RESET_FILTERS' })
      logger.info('Filters reset')
    }
  }), [logger])

  // Load initial data
  useEffect(() => {
    stableActions.fetchCategories()
    stableActions.fetchFeaturedProducts()
  }, [stableActions])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current)
      }
    }
  }, [])

  // Accessibility: Announce loading states
  useEffect(() => {
    const loadingStates = Object.entries(state.loading).filter(([, isLoading]) => isLoading)
    if (loadingStates.length > 0) {
      const message = `Loading ${loadingStates.map(([key]) => key).join(', ')}`
      // Use screen reader announcement
      if (typeof window !== 'undefined') {
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', 'polite')
        announcement.setAttribute('aria-atomic', 'true')
        announcement.style.position = 'absolute'
        announcement.style.left = '-10000px'
        announcement.style.width = '1px'
        announcement.style.height = '1px'
        announcement.style.overflow = 'hidden'
        announcement.textContent = message
        document.body.appendChild(announcement)
        setTimeout(() => document.body.removeChild(announcement), 1000)
      }
    }
  }, [state.loading])

  // Analytics: Track page views and interactions
  useEffect(() => {
    if (state.lastViewedProduct && typeof window !== 'undefined') {
      // Track product view analytics
      logger.info('Analytics: Product page view', { productId: state.lastViewedProduct })
    }
  }, [state.lastViewedProduct, logger])

  const value = useMemo(() => ({ state, actions, stableActions }), [state, actions, stableActions])

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

// Custom hooks
export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export function useProduct(productId?: string) {
  const { state, actions } = useProducts()

  useEffect(() => {
    if (productId && !state.currentProduct) {
      actions.fetchProduct(productId)
    }
  }, [productId, state.currentProduct, actions])

  return {
    product: state.currentProduct,
    loading: state.loading.product,
    error: state.errors.product,
    fetchProduct: actions.fetchProduct,
  }
}

export function useProductSearch() {
  const { state, actions } = useProducts()

  return {
    searchQuery: state.searchQuery,
    searchHistory: state.searchHistory,
    loading: state.loading.search,
    error: state.errors.search,
    searchProducts: actions.searchProducts,
  }
}

export function useProductFilters() {
  const { state, stableActions } = useProducts()

  return {
    filters: state.filters,
    sortBy: state.sortBy,
    setFilters: stableActions.setFilters,
    setSortBy: stableActions.setSortBy,
    resetFilters: stableActions.resetFilters,
  }
}

export function useProductAnalytics() {
  const { state, actions } = useProducts()

  return {
    viewHistory: state.viewHistory,
    searchHistory: state.searchHistory,
    trackProductView: actions.trackProductView,
    getPerformanceMetrics: actions.getPerformanceMetrics,
  }
}

// Export types
export type { ProductState, ProductAction }