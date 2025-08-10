/**
 * Mock API service for e-commerce data
 * In a real application, these would be actual API calls
 */

import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse } from './types'

// Mock data
const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    {
        id: '2',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel for all occasions',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
    {
        id: '3',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and garden',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
        id: '4',
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and outdoor gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    }
]

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 299.99,
        originalPrice: 399.99,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop'
        ],
        category: mockCategories[0],
        colors: ['Black', 'White', 'Silver'],
        inStock: true,
        stockCount: 50,
        rating: 4.8,
        reviewCount: 124,
        tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-01T15:30:00Z'
    },
    {
        id: '2',
        name: 'Organic Cotton T-Shirt',
        slug: 'organic-cotton-t-shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.',
        price: 34.99,
        originalPrice: 44.99,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'
        ],
        category: mockCategories[1],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
        inStock: true,
        stockCount: 100,
        rating: 4.5,
        reviewCount: 89,
        tags: ['organic', 'cotton', 't-shirt', 'sustainable'],
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-25T12:00:00Z'
    },
    {
        id: '3',
        name: 'Smart Home Security Camera',
        slug: 'smart-home-security-camera',
        description: '4K Ultra HD security camera with night vision, two-way audio, and smart motion detection.',
        price: 199.99,
        images: [
            'https://images.unsplash.com/photo-1558618666-fbd5c64b29c3?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop'
        ],
        category: mockCategories[2],
        inStock: true,
        stockCount: 25,
        rating: 4.6,
        reviewCount: 67,
        tags: ['security', 'camera', 'smart-home', '4k'],
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-02-05T09:15:00Z'
    },
    {
        id: '4',
        name: 'Professional Yoga Mat',
        slug: 'professional-yoga-mat',
        description: 'Non-slip yoga mat made from eco-friendly materials. Perfect grip and cushioning for all yoga practices.',
        price: 79.99,
        originalPrice: 99.99,
        images: [
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506629905547-f4e84ad5ce10?w=600&h=600&fit=crop'
        ],
        category: mockCategories[3],
        colors: ['Purple', 'Blue', 'Green', 'Pink'],
        inStock: true,
        stockCount: 40,
        rating: 4.7,
        reviewCount: 156,
        tags: ['yoga', 'fitness', 'mat', 'eco-friendly'],
        createdAt: '2024-01-05T11:30:00Z',
        updatedAt: '2024-01-30T16:45:00Z'
    },
    {
        id: '5',
        name: 'Stainless Steel Water Bottle',
        slug: 'stainless-steel-water-bottle',
        description: 'Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 29.99,
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop'
        ],
        category: mockCategories[3],
        colors: ['Silver', 'Black', 'Blue', 'Pink'],
        inStock: true,
        stockCount: 75,
        rating: 4.4,
        reviewCount: 93,
        tags: ['water-bottle', 'insulated', 'stainless-steel'],
        createdAt: '2024-01-08T09:00:00Z',
        updatedAt: '2024-01-28T14:20:00Z'
    },
    {
        id: '6',
        name: 'Vintage Leather Jacket',
        slug: 'vintage-leather-jacket',
        description: 'Classic vintage-style leather jacket crafted from premium genuine leather. Timeless fashion piece.',
        price: 249.99,
        originalPrice: 349.99,
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
        ],
        category: mockCategories[1],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Brown'],
        inStock: true,
        stockCount: 15,
        rating: 4.9,
        reviewCount: 45,
        tags: ['leather', 'jacket', 'vintage', 'fashion'],
        createdAt: '2024-01-12T13:45:00Z',
        updatedAt: '2024-02-02T11:10:00Z'
    }
]

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    await delay(500) // Simulate network delay

    return {
        success: true,
        data: mockCategories
    }
}

/**
 * Get products with filtering and pagination
 */
export async function getProducts(
    filters: ProductFilter = {},
    page = 1,
    limit = 12
): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await delay(800) // Simulate network delay

    let filteredProducts = [...mockProducts]

    // Apply filters
    if (filters.category) {
        filteredProducts = filteredProducts.filter(
            product => product.category.slug === filters.category
        )
    }

    if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(
            product =>
                product.price >= filters.priceRange!.min &&
                product.price <= filters.priceRange!.max
        )
    }

    if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
            product => product.inStock === filters.inStock
        )
    }

    if (filters.rating) {
        filteredProducts = filteredProducts.filter(
            product => product.rating >= filters.rating!
        )
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(
            product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
    }

    if (filters.colors && filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter(
            product =>
                product.colors &&
                product.colors.some(color => filters.colors!.includes(color))
        )
    }

    if (filters.sizes && filters.sizes.length > 0) {
        filteredProducts = filteredProducts.filter(
            product =>
                product.sizes &&
                product.sizes.some(size => filters.sizes!.includes(size))
        )
    }

    // Apply sorting
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating)
                break
            case 'newest':
                filteredProducts.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                break
            case 'popularity':
                filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
                break
        }
    }

    // Apply pagination
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
        success: true,
        data: {
            data: paginatedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    }
}

/**
 * Get a single product by slug
 */
export async function getProduct(slug: string): Promise<ApiResponse<Product>> {
    await delay(600) // Simulate network delay

    const product = mockProducts.find(p => p.slug === slug)

    if (!product) {
        return {
            success: false,
            error: 'Product not found'
        }
    }

    return {
        success: true,
        data: product
    }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 6): Promise<ApiResponse<Product[]>> {
    await delay(400)

    // Return products with highest ratings
    const featured = mockProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit)

    return {
        success: true,
        data: featured
    }
}

/**
 * Get related products for a given product
 */
export async function getRelatedProducts(
    productId: string,
    limit = 4
): Promise<ApiResponse<Product[]>> {
    await delay(500)

    const currentProduct = mockProducts.find(p => p.id === productId)
    if (!currentProduct) {
        return { success: false, error: 'Product not found' }
    }

    // Get products from the same category, excluding current product
    const related = mockProducts
        .filter(p =>
            p.id !== productId &&
            p.category.id === currentProduct.category.id
        )
        .slice(0, limit)

    return {
        success: true,
        data: related
    }
}