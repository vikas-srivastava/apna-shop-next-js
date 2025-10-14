'use client'

/**
 * Enhanced useProducts hook with Context7 best practices
 * Integrates with ProductContext and adds advanced features
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useProducts as useProductContext } from '../contexts/ProductContext'
import { Product, ProductFilter, Category } from '../lib/types'

// Enhanced types for the hook
interface UseProductsOptions {
  autoFetch?: boolean
  enableValidation?: boolean
  enableLogging?: boolean
  enableAccessibility?: boolean
  prefetchRelated?: boolean
  cacheTimeout?: number
}

interface UseProductsReturn {
  // Data
  products: Product[]
  categories: Category[]
  featuredProducts: Product[]
  currentProduct: Product | null
  relatedProducts: Product[]

  // State
  loading: {
    products: boolean
    categories: boolean
    product: boolean
    featured: boolean
    related: boolean
    search: boolean
  }
  errors: {
    products?: string
    categories?: string
    product?: string
    featured?: string
    related?: string
    search?: string
  }

  // Pagination
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }

  // Actions
  fetchProducts: (page?: number, limit?: number) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchFeaturedProducts: (limit?: number) => Promise<void>
  fetchProduct: (slug: string) => Promise<void>
  fetchRelatedProducts: (productId: string, limit?: number) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  setFilters: (filters: Partial<ProductFilter>) => void
  setSortBy: (sortBy: ProductFilter['sortBy']) => void
  resetFilters: () => void

  // Enhanced features
  validateProduct: (product: Product) => boolean
  getPerformanceMetrics: () => PerformanceMetrics
  clearCache: () => void
  prefetchProduct: (slug: string) => void

  // Accessibility
  announceToScreenReader: (message: string) => void
}

// Performance metrics type
interface PerformanceMetrics {
  metrics: Array<{
    operation: string
    startTime: number
    endTime?: number
    success?: boolean
    error?: string
    duration: number
  }>
  averageDuration: number
  totalOperations: number
  successRate: number
}

// Validation schemas
const PRODUCT_VALIDATION_SCHEMA = {
  required: ['id', 'name', 'slug', 'price'],
  types: {
    id: 'string',
    name: 'string',
    slug: 'string',
    price: 'number',
    images: 'array',
    inStock: 'boolean',
    stockCount: 'number',
    rating: 'number',
    reviewCount: 'number'
  }
}

// Logger utility
class ProductsLogger {
  private static enabled = process.env.NEXT_PUBLIC_PRODUCT_LOGGING !== 'false'

  static info(message: string, data?: unknown, enableLogging = true) {
    if (!this.enabled || !enableLogging) return

  }

  static warn(message: string, data?: unknown, enableLogging = true) {
    if (!this.enabled || !enableLogging) return
    console.warn(`[useProducts] ${message}`, data)
  }

  static error(message: string, data?: unknown, enableLogging = true) {
    if (!this.enabled || !enableLogging) return
    console.error(`[useProducts] ${message}`, data)
  }
}

// Data validator
class ProductValidator {
  static validateProduct(product: Product): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check required fields
    PRODUCT_VALIDATION_SCHEMA.required.forEach(field => {
      if (!product[field as keyof Product]) {
        errors.push(`Missing required field: ${field}`)
      }
    })

    // Check types
    Object.entries(PRODUCT_VALIDATION_SCHEMA.types).forEach(([field, expectedType]) => {
      const value = product[field as keyof Product]
      if (value !== undefined && typeof value !== expectedType) {
        errors.push(`Field ${field} should be ${expectedType}, got ${typeof value}`)
      }
    })

    // Custom validations
    if (product.price < 0) {
      errors.push('Price cannot be negative')
    }

    if (product.rating < 0 || product.rating > 5) {
      errors.push('Rating must be between 0 and 5')
    }

    if (product.stockCount < 0) {
      errors.push('Stock count cannot be negative')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateProducts(products: Product[]): { valid: Product[]; invalid: Product[]; errors: string[] } {
    const valid: Product[] = []
    const invalid: Product[] = []
    const errors: string[] = []

    products.forEach((product, index) => {
      const validation = this.validateProduct(product)
      if (validation.isValid) {
        valid.push(product)
      } else {
        invalid.push(product)
        errors.push(`Product at index ${index}: ${validation.errors.join(', ')}`)
      }
    })

    return { valid, invalid, errors }
  }
}

// Accessibility helper
class AccessibilityHelper {
  private static announcementElement: HTMLElement | null = null

  static init() {
    if (typeof window === 'undefined') return

    if (!this.announcementElement) {
      this.announcementElement = document.createElement('div')
      this.announcementElement.setAttribute('aria-live', 'polite')
      this.announcementElement.setAttribute('aria-atomic', 'true')
      this.announcementElement.style.position = 'absolute'
      this.announcementElement.style.left = '-10000px'
      this.announcementElement.style.width = '1px'
      this.announcementElement.style.height = '1px'
      this.announcementElement.style.overflow = 'hidden'
      document.body.appendChild(this.announcementElement)
    }
  }

  static announce(message: string) {
    if (!this.announcementElement) {
      this.init()
    }

    if (this.announcementElement) {
      this.announcementElement.textContent = message
      // Clear after announcement
      setTimeout(() => {
        if (this.announcementElement) {
          this.announcementElement.textContent = ''
        }
      }, 1000)
    }
  }
}

// Performance monitor
class ProductsPerformanceMonitor {
  private static metrics: Array<{
    operation: string
    startTime: number
    endTime?: number
    success?: boolean
    error?: string
  }> = []

  static start(operation: string) {
    const metric = {
      operation,
      startTime: Date.now()
    }
    this.metrics.push(metric)
    return this.metrics.length - 1
  }

  static end(index: number, success: boolean, error?: string) {
    if (this.metrics[index]) {
      this.metrics[index].endTime = Date.now()
      this.metrics[index].success = success
      this.metrics[index].error = error
    }
  }

  static getMetrics() {
    return this.metrics.map(metric => ({
      ...metric,
      duration: metric.endTime ? metric.endTime - metric.startTime : 0
    }))
  }

  static getAverageDuration(operation?: string): number {
    const relevantMetrics = operation
      ? this.metrics.filter(m => m.operation === operation && m.endTime)
      : this.metrics.filter(m => m.endTime)

    if (relevantMetrics.length === 0) return 0

    const total = relevantMetrics.reduce((sum, m) => sum + (m.endTime! - m.startTime), 0)
    return total / relevantMetrics.length
  }
}

// Main hook
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    autoFetch = true,
    enableValidation = true,
    enableLogging = true,
    enableAccessibility = true,
    prefetchRelated = true,
    cacheTimeout = 300000 // 5 minutes
  } = options

  // Use the existing ProductContext
  const context = useProductContext()

  // Enhanced state
  const [validatedProducts, setValidatedProducts] = useState<Product[]>([])
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  // Refs for performance tracking
  const fetchStartTime = useRef<number>(0)
  const operationId = useRef<number>(-1)

  // Initialize accessibility
  useEffect(() => {
    if (enableAccessibility) {
      AccessibilityHelper.init()
    }
  }, [enableAccessibility])

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      const now = Date.now()
      if (now - lastFetchTime > cacheTimeout) {
        ProductsLogger.info('Auto-fetching products on mount', undefined, enableLogging)
        context.stableActions.fetchCategories()
        context.stableActions.fetchFeaturedProducts()
        setLastFetchTime(now)
      }
    }
  }, [autoFetch, lastFetchTime, cacheTimeout, context.actions])

  // Validate products when they change
  useEffect(() => {
    if (enableValidation && context.state.products.length > 0) {
      const validation = ProductValidator.validateProducts(context.state.products)
      setValidatedProducts(validation.valid)

      if (validation.invalid.length > 0) {
        ProductsLogger.warn('Invalid products found', validation.errors, enableLogging)
        if (enableAccessibility) {
          AccessibilityHelper.announce(`${validation.invalid.length} products have validation errors`)
        }
      }
    } else {
      setValidatedProducts(context.state.products)
    }
  }, [context.state.products, enableValidation, enableAccessibility])

  // Enhanced fetch functions with logging and performance tracking
  const enhancedFetchProducts = useCallback(async (page = 1, limit = 12) => {
    operationId.current = ProductsPerformanceMonitor.start('fetchProducts')
    fetchStartTime.current = Date.now()

    ProductsLogger.info('Fetching products', { page, limit }, enableLogging)

    try {
      await context.actions.fetchProducts(page, limit)
      ProductsPerformanceMonitor.end(operationId.current, true)

      if (enableAccessibility) {
        AccessibilityHelper.announce(`Loaded ${context.state.products.length} products`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products'
      ProductsPerformanceMonitor.end(operationId.current, false, errorMessage)
      ProductsLogger.error('Fetch products failed', { error: errorMessage }, enableLogging)

      if (enableAccessibility) {
        AccessibilityHelper.announce('Failed to load products')
      }

      throw error
    }
  }, [context.actions, context.state.products.length, enableAccessibility])

  const enhancedFetchProduct = useCallback(async (slug: string) => {
    operationId.current = ProductsPerformanceMonitor.start('fetchProduct')
    fetchStartTime.current = Date.now()

    ProductsLogger.info('Fetching product', { slug }, enableLogging)

    try {
      await context.actions.fetchProduct(slug)
      ProductsPerformanceMonitor.end(operationId.current, true)

      if (enableAccessibility && context.state.currentProduct) {
        AccessibilityHelper.announce(`Loaded product: ${context.state.currentProduct.name}`)
      }

      // Prefetch related products if enabled
      if (prefetchRelated && context.state.currentProduct) {
        setTimeout(() => {
          context.actions.fetchRelatedProducts(context.state.currentProduct!.id)
        }, 100)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product'
      ProductsPerformanceMonitor.end(operationId.current, false, errorMessage)
      ProductsLogger.error('Fetch product failed', { slug, error: errorMessage }, enableLogging)

      if (enableAccessibility) {
        AccessibilityHelper.announce('Failed to load product')
      }

      throw error
    }
  }, [context.actions, context.state.currentProduct, enableAccessibility, prefetchRelated])

  const enhancedSearchProducts = useCallback(async (query: string) => {
    operationId.current = ProductsPerformanceMonitor.start('searchProducts')
    fetchStartTime.current = Date.now()

    ProductsLogger.info('Searching products', { query }, enableLogging)

    try {
      await context.actions.searchProducts(query)
      ProductsPerformanceMonitor.end(operationId.current, true)

      if (enableAccessibility) {
        const resultCount = context.state.products.length
        AccessibilityHelper.announce(`Found ${resultCount} products for "${query}"`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'
      ProductsPerformanceMonitor.end(operationId.current, false, errorMessage)
      ProductsLogger.error('Search failed', { query, error: errorMessage }, enableLogging)

      if (enableAccessibility) {
        AccessibilityHelper.announce('Search failed')
      }

      throw error
    }
  }, [context.actions, context.state.products.length, enableAccessibility])

  // Enhanced error messages
  const getUserFriendlyError = useCallback((error?: string): string => {
    if (!error) return ''

    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'Network Error': 'Unable to connect to the server. Please check your internet connection.',
      '404': 'The requested product was not found.',
      '500': 'Server error occurred. Please try again later.',
      'Timeout': 'Request timed out. Please try again.',
      'Validation Error': 'Some product data is invalid. Please refresh the page.',
    }

    return errorMap[error] || error
  }, [])

  // Performance metrics getter
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const metrics = ProductsPerformanceMonitor.getMetrics()
    const averageDuration = ProductsPerformanceMonitor.getAverageDuration()

    return {
      metrics,
      averageDuration,
      totalOperations: metrics.length,
      successRate: metrics.length > 0
        ? (metrics.filter(m => m.success).length / metrics.length) * 100
        : 0
    }
  }, [])

  // Product validation function
  const validateProduct = useCallback((product: Product): boolean => {
    const validation = ProductValidator.validateProduct(product)
    if (!validation.isValid) {
      ProductsLogger.warn('Product validation failed', validation.errors, enableLogging)
    }
    return validation.isValid
  }, [])

  // Screen reader announcement function
  const announceToScreenReader = useCallback((message: string) => {
    if (enableAccessibility) {
      AccessibilityHelper.announce(message)
    }
  }, [enableAccessibility])

  // Enhanced return object
  return useMemo(() => ({
    // Data
    products: validatedProducts,
    categories: context.state.categories,
    featuredProducts: context.state.featuredProducts,
    currentProduct: context.state.currentProduct,
    relatedProducts: context.state.relatedProducts,

    // State
    loading: context.state.loading,
    errors: {
      products: context.state.errors.products ? getUserFriendlyError(context.state.errors.products) : undefined,
      categories: context.state.errors.categories ? getUserFriendlyError(context.state.errors.categories) : undefined,
      product: context.state.errors.product ? getUserFriendlyError(context.state.errors.product) : undefined,
      featured: context.state.errors.featured ? getUserFriendlyError(context.state.errors.featured) : undefined,
      related: context.state.errors.related ? getUserFriendlyError(context.state.errors.related) : undefined,
      search: context.state.errors.search ? getUserFriendlyError(context.state.errors.search) : undefined,
    },

    // Pagination
    pagination: {
      currentPage: context.state.currentPage,
      totalPages: context.state.totalPages,
      totalProducts: context.state.totalProducts,
      hasNextPage: context.state.hasNextPage,
      hasPrevPage: context.state.hasPrevPage,
    },

    // Actions
    fetchProducts: enhancedFetchProducts,
    fetchCategories: context.stableActions.fetchCategories,
    fetchFeaturedProducts: context.stableActions.fetchFeaturedProducts,
    fetchProduct: enhancedFetchProduct,
    fetchRelatedProducts: context.actions.fetchRelatedProducts,
    searchProducts: enhancedSearchProducts,
    setFilters: context.stableActions.setFilters,
    setSortBy: context.stableActions.setSortBy,
    resetFilters: context.stableActions.resetFilters,

    // Enhanced features
    validateProduct,
    getPerformanceMetrics,
    clearCache: context.actions.clearCache,
    prefetchProduct: context.actions.prefetchProduct,

    // Accessibility
    announceToScreenReader,
  }), [
    validatedProducts,
    context.state,
    context.actions,
    getUserFriendlyError,
    enhancedFetchProducts,
    enhancedFetchProduct,
    enhancedSearchProducts,
    validateProduct,
    getPerformanceMetrics,
    announceToScreenReader,
  ])
}

// Export utilities for external use
export { ProductValidator, ProductsLogger, AccessibilityHelper, ProductsPerformanceMonitor }