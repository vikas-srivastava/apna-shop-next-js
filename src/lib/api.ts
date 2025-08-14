/**
 * API service for e-commerce data
 * Connects to third-party API service
 */

import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse } from './types'
import * as thirdPartyApi from './third-party-api'

/**
 * Get all categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    return await thirdPartyApi.getCategories()
}

/**
 * Get products with filtering and pagination
 */
export async function getProducts(
    filters: ProductFilter = {},
    page = 1,
    limit = 12
): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return await thirdPartyApi.getProducts(filters, page, limit)
}

/**
 * Get a single product by slug
 */
export async function getProduct(slug: string): Promise<ApiResponse<Product>> {
    return await thirdPartyApi.getProduct(slug)
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 6): Promise<ApiResponse<Product[]>> {
    return await thirdPartyApi.getFeaturedProducts(limit)
}

/**
 * Get related products for a given product
 */
export async function getRelatedProducts(
    productId: string,
    limit = 4
): Promise<ApiResponse<Product[]>> {
    return await thirdPartyApi.getRelatedProducts(productId, limit)
}