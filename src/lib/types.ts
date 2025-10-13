/**
 * Core type definitions for the e-commerce application
 */

// API Response Types (matching the actual API response structure)
export interface ApiProduct {
    id: number
    name: string
    slug: string
    description: string
    price: string  // API returns price as string
    old_price: string | null  // API returns old_price as string
    qty: number
    images?: string[]  // API may not return images
    brand: {
        id: number
        name: string
        slug: string
    }
    categories: Array<{
        id: number
        name: string
        slug: string
    }>
    rating?: number
    reviewCount?: number
    tags?: string[]
    created_at: string
    updated_at: string
    // Add other fields as needed from the API response
    [key: string]: any
}

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
    rating?: number
    reviewCount?: number
    tags?: string[]
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
    brand?: string
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

export interface UserResource {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    customer: {
        id: string;
        first_name: string;
        last_name: string;
        phone: string;
        gender: string;
    };
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

export interface CartItem {
    id: string
    product_id: number
    product_quantity: number
    product_name: string
    product_price: string
    product_image: string
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
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed' | 'refunded'
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
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