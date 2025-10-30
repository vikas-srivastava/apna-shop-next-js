/**
 * Enhanced API service for e-commerce data with best practices
 * Includes caching, deduplication, retry logic, and monitoring
 */

import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse, User, Order } from './types'
import * as thirdPartyApi from './third-party-api'
import { mockApiProducts, mockCategories, mockCart } from './mock-data'

// Environment configuration
const API_CONFIG = {
  useMock: process.env.USE_MOCK === 'true',
  cacheEnabled: process.env.CACHE_ENABLED !== 'false',
  cacheTTL: parseInt(process.env.CACHE_TTL || '300000'), // 5 minutes default
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  enableLogging: process.env.API_LOGGING !== 'false',
  enablePerformanceMonitoring: process.env.PERFORMANCE_MONITORING !== 'false',
}

// Mock data for fallback - using the comprehensive mock data
const MOCK_DATA = {
  categories: mockCategories,
  products: mockApiProducts.map(product => ({
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: parseFloat(product.price),
    originalPrice: product.old_price ? parseFloat(product.old_price) : undefined,
    images: product.images,
    category: product.categories && product.categories.length > 0 ? {
      id: product.categories[0].id.toString(),
      name: product.categories[0].name,
      slug: product.categories[0].slug
    } : {
      id: '1',
      name: 'Electronics',
      slug: 'electronics'
    },
    inStock: product.qty > 0,
    stockCount: product.qty,
    rating: 4.5,
    reviewCount: 5,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as Product[],
}

// Cache interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// Request deduplication
interface PendingRequest<T> {
  promise: Promise<T>
  timestamp: number
}

// Performance monitoring
interface PerformanceMetrics {
  method: string
  endpoint: string
  duration: number
  success: boolean
  timestamp: number
  error?: string
}

// Logger utility
class ApiLogger {
  private static log(level: 'info' | 'warn' | 'error', message: string, data?: unknown) {
    if (!API_CONFIG.enableLogging) return

    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

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

  static info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  static warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  static error(message: string, data?: unknown) {
    this.log('error', message, data)
  }
}

// Performance monitor
class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = []
  private static maxMetrics = 100

  static recordMetric(metric: PerformanceMetrics) {
    if (!API_CONFIG.enablePerformanceMonitoring) return

    this.metrics.push(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift() // Remove oldest
    }

    ApiLogger.info(`API Performance: ${metric.method} ${metric.endpoint} - ${metric.duration}ms`, {
      success: metric.success,
      error: metric.error
    })
  }

  static getMetrics() {
    return [...this.metrics]
  }

  static getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / this.metrics.length
  }

  static getSuccessRate(): number {
    if (this.metrics.length === 0) return 0
    const successful = this.metrics.filter(m => m.success).length
    return (successful / this.metrics.length) * 100
  }
}

// Cache implementation
class ApiCache {
  private static cache = new Map<string, CacheEntry<unknown>>()

  static get<T>(key: string): T | null {
    if (!API_CONFIG.cacheEnabled) return null

    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    ApiLogger.info(`Cache hit for key: ${key}`)
    return entry.data as T
  }

  static set<T>(key: string, data: T, ttl = API_CONFIG.cacheTTL): void {
    if (!API_CONFIG.cacheEnabled) return

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })

    ApiLogger.info(`Cache set for key: ${key}`)
  }

  static clear(): void {
    this.cache.clear()
    ApiLogger.info('Cache cleared')
  }

  static size(): number {
    return this.cache.size
  }
}

// Request deduplication
class RequestDeduplicator {
  private static pendingRequests = new Map<string, PendingRequest<unknown>>()

  static get<T>(key: string): Promise<T> | null {
    const request = this.pendingRequests.get(key)
    if (!request) return null

    const now = Date.now()
    if (now - request.timestamp > 30000) { // 30 seconds timeout
      this.pendingRequests.delete(key)
      return null
    }

    ApiLogger.info(`Deduplication hit for key: ${key}`)
    return request.promise as Promise<T>
  }

  static set<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    })
  }

  static clear(): void {
    this.pendingRequests.clear()
  }
}
import { circuitBreaker } from './circuit-breaker';

// Enhanced API wrapper with interceptors
export class ApiService {
  private static async executeWithMonitoring<T>(
    operation: () => Promise<ApiResponse<T>>,
    method: string,
    endpoint: string,
    fallbackData: T
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()

    try {
      const result = await circuitBreaker.executeWithBreaker(
        endpoint,
        operation,
        {
          failureThreshold: 5,
          recoveryTimeout: 60000, // 1 minute
          monitoringPeriod: 300000, // 5 minutes
          successThreshold: 3,
        }
      );
      const duration = Date.now() - startTime

      PerformanceMonitor.recordMetric({
        method,
        endpoint,
        duration,
        success: result.success,
        timestamp: startTime,
        error: result.error
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      PerformanceMonitor.recordMetric({
        method,
        endpoint,
        duration,
        success: false,
        timestamp: startTime,
        error: error instanceof Error ? error.message : String(error)
      })

      ApiLogger.warn(`Circuit breaker is open for ${endpoint}. Returning fallback data.`)
      return { success: true, data: fallbackData };
    }
  }

  private static async withFallback<T>(
    operation: () => Promise<ApiResponse<T>>,
    fallbackData: T
  ): Promise<ApiResponse<T>> {
    if (API_CONFIG.useMock) {
      ApiLogger.info('Using mock data (mock mode enabled)');
      return {
        success: true,
        data: fallbackData
      };
    }

    return await operation()
  }
  private static async localApiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      ApiLogger.error(`Local API request failed for ${endpoint}`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      }
    }
  }

  private static generateCacheKey(method: string, endpoint: string, params?: unknown): string {
    const paramStr = params ? JSON.stringify(params) : ''
    return `${method}:${endpoint}:${paramStr}`
  }

  private static async cachedRequest<T>(
    cacheKey: string,
    operation: () => Promise<ApiResponse<T>>,
    ttl?: number
  ): Promise<ApiResponse<T>> {
    // Check cache first
    const cached = ApiCache.get<T>(cacheKey)
    if (cached !== null) {
      return { success: true, data: cached }
    }

    // Check deduplication
    const deduped = RequestDeduplicator.get<ApiResponse<T>>(cacheKey)
    if (deduped) {
      return await deduped
    }

    // Execute request
    const promise = operation()
    RequestDeduplicator.set(cacheKey, promise)

    const result = await promise

    // Cache successful responses
    if (result.success && result.data) {
      ApiCache.set(cacheKey, result.data, ttl)
    }

    return result
  }
  private static applyFiltersToMockData(
    filters: ProductFilter,
    page: number,
    limit: number
  ): PaginatedResponse<Product> {
    let filteredProducts = [...MOCK_DATA.products]

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category?.id === filters.category
      )
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply price range filter
    if (filters.priceRange && (filters.priceRange.min !== undefined || filters.priceRange.max !== undefined)) {
      const minPrice = filters.priceRange.min || 0
      const maxPrice = filters.priceRange.max || Number.MAX_VALUE
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price
        return price >= minPrice && price <= maxPrice
      })
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.rating >= filters.rating!
      )
    }

    // Apply in stock filter
    if (filters.inStock === true) {
      filteredProducts = filteredProducts.filter(product => product.inStock)
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    }
  }

  // Public API methods
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    const cacheKey = this.generateCacheKey('GET', '/shop/get-categories')

    return await this.executeWithMonitoring(
      () => this.cachedRequest(
        cacheKey,
        () => this.withFallback(
          () => thirdPartyApi.getCategories(),
          MOCK_DATA.categories
        )
      ),
      'GET',
      '/shop/get-categories',
      MOCK_DATA.categories
    )
  }

  static async getProducts(
    filters: ProductFilter = {},
    page = 1,
    limit = 12
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const cacheKey = this.generateCacheKey('GET', '/shop/get-products', { filters, page, limit })

    return await this.executeWithMonitoring(
      () => this.cachedRequest(
        cacheKey,
        () => this.withFallback(
          () => thirdPartyApi.getProducts(filters, page, limit),
          this.applyFiltersToMockData(filters, page, limit)
        )
      ),
      'GET',
      '/shop/get-products',
      this.applyFiltersToMockData(filters, page, limit)
    )
  }

  static async getProduct(slug: string): Promise<ApiResponse<Product>> {
    const cacheKey = this.generateCacheKey('GET', `/shop/product/${slug}`)

    return await this.executeWithMonitoring(
      () => this.cachedRequest(
        cacheKey,
        () => this.withFallback(
          () => thirdPartyApi.getProduct(slug),
          MOCK_DATA.products[0]
        )
      ),
      'GET',
      `/shop/product/${slug}`,
      MOCK_DATA.products[0]
    )
  }

  static async getFeaturedProducts(limit = 6): Promise<ApiResponse<Product[]>> {
    const cacheKey = this.generateCacheKey('GET', '/shop/products-featured', { limit })

    return await this.executeWithMonitoring(
      () => this.cachedRequest(
        cacheKey,
        () => this.withFallback(
          () => thirdPartyApi.getFeaturedProducts(limit),
          MOCK_DATA.products.slice(0, limit)
        )
      ),
      'GET',
      '/shop/products-featured',
      MOCK_DATA.products.slice(0, limit)
    )
  }

  static async getRelatedProducts(
    productId: string,
    limit = 4
  ): Promise<ApiResponse<Product[]>> {
    const cacheKey = this.generateCacheKey('GET', `/shop/products/${productId}/related`, { limit })

    return await this.executeWithMonitoring(
      () => this.cachedRequest(
        cacheKey,
        () => this.withFallback(
          () => thirdPartyApi.getRelatedProducts(productId, limit),
          MOCK_DATA.products.slice(0, limit)
        )
      ),
      'GET',
      `/shop/products/${productId}/related`,
      MOCK_DATA.products.slice(0, limit)
    )
  }

  // Additional methods for auth, cart, etc. can be added here
  static async registerUser(userData: {
    name: string
    email: string
    password: string
    gender: 'male' | 'female'
    password_confirmation: string
  }): Promise<ApiResponse<{ user: string; customer_id: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.registerUser(userData),
      'POST',
      '/user/register',
      { user: '', customer_id: '' }
    )
  }

  static async loginUser(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: string; customer_id: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.loginUser(credentials),
      'POST',
      '/user/login',
      { user: '', customer_id: '' }
    )
  }

  static async getUserProfile(): Promise<ApiResponse<{ user: string; role: string; tenant_id: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.getUserProfile(),
      'GET',
      '/user/get-profile',
      { user: '', role: '', tenant_id: '' }
    )
  }

  // Password reset functionality
  static async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.forgotPassword(email),
      'POST',
      '/user/forgot-password',
      { message: '' }
    )
  }

  static async sendPasswordResetOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.sendPasswordResetOtp(email),
      'POST',
      '/user/auth/forgot-password/send-otp',
      { message: '' }
    )
  }

  static async resetPasswordWithOtp(data: {
    email: string
    otp: string
    password: string
    password_confirmation: string
  }): Promise<ApiResponse<{ message: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.resetPasswordWithOtp(data),
      'POST',
      '/user/auth/forgot-password/reset',
      { message: '' }
    )
  }

  static async logoutUser(): Promise<ApiResponse<null>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.logoutUser(),
      'POST',
      '/user/logout',
      null
    )
  }

  static async addToCart(productData: {
    product_id: number
    product_quantity: number
    product_variant_id?: number | null
    product_variant_data?: string[] | null
    customer_id?: string
  }): Promise<ApiResponse<string>> {
    // Clear cart-related cache
    ApiCache.clear()

    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<string>('/api/cart', {
          method: 'POST',
          body: JSON.stringify(productData),
        }),
        'Product added to cart successfully'
      ),
      'POST',
      '/api/cart',
      'Product added to cart successfully'
    )
  }

  static async getCart(): Promise<ApiResponse<{ items: string; total: string }>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<{ items: string; total: string }>('/api/cart'),
        mockCart
      ),
      'GET',
      '/api/cart',
      mockCart
    )
  }
  static async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<string>> {
    // Clear cart-related cache
    ApiCache.clear()

    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<string>(`/api/cart/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ product_quantity: quantity }),
        }),
        'Cart item updated successfully'
      ),
      'PUT',
      `/api/cart/${itemId}`,
      'Cart item updated successfully'
    )
  }

  static async removeCartItem(itemId: string): Promise<ApiResponse<null>> {
    // Clear cart-related cache
    ApiCache.clear()

    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<null>(`/api/cart/${itemId}`, {
          method: 'DELETE',
        }),
        null
      ),
      'DELETE',
      `/api/cart/${itemId}`
    )
  }

  static async getCartTotal(): Promise<ApiResponse<{ total: string }>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<{ total: string }>('/api/cart/total'),
        { total: mockCart.total }
      ),
      'GET',
      '/api/cart/total'
    )
  }

  // Wishlist methods
  static async getWishlist(): Promise<ApiResponse<string>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => thirdPartyApi.getWishlist(),
        '[]' // Empty wishlist as fallback
      ),
      'POST',
      '/shop/wishlist'
    )
  }

  static async addToWishlist(productId: number): Promise<ApiResponse<null>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => thirdPartyApi.addToWishlist(productId),
        null
      ),
      'POST',
      '/shop/wishlist-add'
    )
  }

  static async removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => thirdPartyApi.removeFromWishlist(productId),
        null
      ),
      'POST',
      `/shop/wishlist-remove/${productId}`
    )
  }

  // Orders methods
  static async getOrders(): Promise<ApiResponse<Order[]>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => thirdPartyApi.getOrders(),
        [] // Empty orders array as fallback
      ),
      'GET',
      '/shop/orders'
    )
  }

  // Utility methods
  // Utility methods
  static clearCache(): void {
    ApiCache.clear()
  }

  static getCacheSize(): number {
    return ApiCache.size()
  }

  static getPerformanceMetrics() {
    return {
      averageResponseTime: PerformanceMonitor.getAverageResponseTime(),
      successRate: PerformanceMonitor.getSuccessRate(),
      metrics: PerformanceMonitor.getMetrics()
    }
  }
}

export const getWishlist = ApiService.getWishlist.bind(ApiService)
export const addToWishlist = ApiService.addToWishlist.bind(ApiService)
export const removeFromWishlist = ApiService.removeFromWishlist.bind(ApiService)
export const getOrders = ApiService.getOrders.bind(ApiService)

// Export utility functions
// Export the enhanced API functions
export const getCategories = ApiService.getCategories.bind(ApiService)
export const getProducts = ApiService.getProducts.bind(ApiService)
export const getProduct = ApiService.getProduct.bind(ApiService)
export const getFeaturedProducts = ApiService.getFeaturedProducts.bind(ApiService)
export const getRelatedProducts = ApiService.getRelatedProducts.bind(ApiService)
export const registerUser = ApiService.registerUser.bind(ApiService)
export const loginUser = ApiService.loginUser.bind(ApiService)
export const getUserProfile = ApiService.getUserProfile.bind(ApiService)
export const addToCart = ApiService.addToCart.bind(ApiService)
export const getCart = ApiService.getCart.bind(ApiService)
export const updateCartItem = ApiService.updateCartItem.bind(ApiService)
export const removeCartItem = ApiService.removeCartItem.bind(ApiService)
export const getCartTotal = ApiService.getCartTotal.bind(ApiService)

// Export utility functions
export const clearApiCache = ApiService.clearCache.bind(ApiService)
export const getApiCacheSize = ApiService.getCacheSize.bind(ApiService)
export const getApiPerformanceMetrics = ApiService.getPerformanceMetrics.bind(ApiService)

// Export types for external use
export type { Product, Category, ProductFilter, PaginatedResponse, ApiResponse, User }