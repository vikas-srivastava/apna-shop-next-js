/**
 * Core type definitions for the e-commerce application
 */

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    category: Category
    sizes?: string[]
    colors?: string[]
    inStock: boolean
    stockCount: number
    rating: number
    reviewCount: number
    tags: string[]
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    image?: string
    parentId?: string
    children?: Category[]
}

export interface ProductFilter {
    category?: string
    priceRange?: {
        min: number
        max: number
    }
    sizes?: string[]
    colors?: string[]
    inStock?: boolean
    rating?: number
    tags?: string[]
    sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popularity'
    search?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    createdAt: string
}

export interface Address {
    id: string
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
    isDefault: boolean
}

export interface Order {
    id: string
    orderNumber: string
    userId: string
    items: OrderItem[]
    shippingAddress: Address
    billingAddress: Address
    subtotal: number
    shipping: number
    tax: number
    total: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: string
    updatedAt: string
}

export interface OrderItem {
    id: string
    productId: string
    product: Product
    quantity: number
    price: number
    selectedSize?: string
    selectedColor?: string
}

export interface Review {
    id: string
    productId: string
    userId: string
    user: User
    rating: number
    title: string
    comment: string
    verified: boolean
    helpful: number
    createdAt: string
}

export interface WishlistItem {
    id: string
    productId: string
    product: Product
    addedAt: string
}

export interface Newsletter {
    email: string
    subscribed: boolean
    categories?: string[]
}