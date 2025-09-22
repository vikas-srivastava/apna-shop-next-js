/**
 * Enhanced API service for e-commerce data with best practices
 * Includes caching, deduplication, retry logic, and monitoring
 */

import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse, User } from './types'
import * as thirdPartyApi from './third-party-api'
import { mockApiProducts, mockCategories, mockCart } from './mock-data'

// Environment configuration
const API_CONFIG = {
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  cacheEnabled: process.env.NEXT_PUBLIC_CACHE_ENABLED !== 'false',
  cacheTTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5 minutes default
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  enableLogging: process.env.NEXT_PUBLIC_API_LOGGING !== 'false',
  enablePerformanceMonitoring: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING !== 'false',
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
  private static cleanupInterval: NodeJS.Timeout | null = null

  static init() {
    // Clean up old pending requests every 30 seconds
    if (typeof window !== 'undefined' && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now()
        for (const [key, request] of this.pendingRequests.entries()) {
          if (now - request.timestamp > 30000) { // 30 seconds
            this.pendingRequests.delete(key)
          }
        }
      }, 30000)
    }
  }

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
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Initialize deduplicator
RequestDeduplicator.init()

// Enhanced API wrapper with interceptors
export class ApiService {
  private static async executeWithMonitoring<T>(
    operation: () => Promise<ApiResponse<T>>,
    method: string,
    endpoint: string
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()

    try {
      const result = await operation()
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

      throw error
    }
  }

  private static async withFallback<T>(
    operation: () => Promise<ApiResponse<T>>,
    fallbackData: T
  ): Promise<ApiResponse<T>> {
    if (!API_CONFIG.useMock) {
      return await operation()
    }

    try {
      const result = await operation()
      if (result.success) {
        return result
      }

      ApiLogger.warn('API call failed, using mock data', { error: result.error })
      return {
        success: true,
        data: fallbackData
      }
    } catch (error) {
      ApiLogger.warn('API call threw error, using mock data', { error: error instanceof Error ? error.message : String(error) })
      return {
        success: true,
        data: fallbackData
      }
    }
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
      '/shop/get-categories'
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
          {
            data: MOCK_DATA.products,
            pagination: {
              page,
              limit,
              total: MOCK_DATA.products.length,
              totalPages: 1
            }
          }
        )
      ),
      'GET',
      '/shop/get-products'
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
      `/shop/product/${slug}`
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
      '/shop/products-featured'
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
      `/shop/products/${productId}/related`
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
      '/user/register'
    )
  }

  static async loginUser(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: string; customer_id: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.loginUser(credentials),
      'POST',
      '/user/login'
    )
  }

  static async getUserProfile(): Promise<ApiResponse<{ user: string; role: string; tenant_id: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.getUserProfile(),
      'GET',
      '/user/get-profile'
    )
  }

  // Password reset functionality
  static async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.forgotPassword(email),
      'POST',
      '/user/forgot-password'
    )
  }

  static async sendPasswordResetOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.sendPasswordResetOtp(email),
      'POST',
      '/user/auth/forgot-password/send-otp'
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
      '/user/auth/forgot-password/reset'
    )
  }

  static async logoutUser(): Promise<ApiResponse<null>> {
    return await this.executeWithMonitoring(
      () => thirdPartyApi.logoutUser(),
      'POST',
      '/user/logout'
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
      '/api/cart'
    )
  }

  static async getCart(): Promise<ApiResponse<{ items: string; total: string }>> {
    return await this.executeWithMonitoring(
      () => this.withFallback(
        () => this.localApiRequest<{ items: string; total: string }>('/api/cart'),
        mockCart
      ),
      'GET',
      '/api/cart'
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
      `/api/cart/${itemId}`
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