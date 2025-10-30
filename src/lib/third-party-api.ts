/**
 * Third-party API service for e-commerce data
 * Connects to the Apna Shop eCommerce backend
 */

import { Product, Category, ProductFilter, PaginatedResponse, ApiResponse, User, ApiProduct } from './types'
import { mockApiGenerators, mockApiDelay } from './mock-data'

// Helper function to get mock response based on endpoint
async function getMockResponse(endpoint: string): Promise<ApiResponse<any> | null> {
    // Parse endpoint and query parameters
    const [path, queryString] = endpoint.split('?')
    const params = new URLSearchParams(queryString || '')

    // Map endpoints to mock generators
    const endpointMap: Record<string, () => ApiResponse<any>> = {
        '/shop/get-categories': mockApiGenerators.getCategories,
        '/shop/get-products': () => {
            const page = parseInt(params.get('page') || '1')
            const limit = parseInt(params.get('limit') || '12')
            return mockApiGenerators.getProducts(page, limit)
        },
        '/shop/products-featured': () => {
            const limit = parseInt(params.get('limit') || '6')
            return mockApiGenerators.getFeaturedProducts(limit)
        },
        '/shop/search': () => {
            const query = params.get('q') || ''
            // TODO: Implement searchProducts in mock-data.ts
            return { success: true, data: [] }
        },
        '/user/register': mockApiGenerators.registerUser,
        '/user/login': mockApiGenerators.loginUser,
        '/user/logout': () => ({ success: true, data: null }),
        '/user/get-profile': mockApiGenerators.getUserProfile,
        '/user/update-profile': () => ({ success: true, data: 'Profile updated successfully' }),
        '/user/auth/forgot-password/send-otp': mockApiGenerators.sendForgotPasswordOtp,
        '/user/auth/forgot-password/reset': mockApiGenerators.resetPassword,
        '/cart/cart': mockApiGenerators.getCart,
        '/cart/cart/total': mockApiGenerators.getCartTotal,
        '/shop/wishlist': mockApiGenerators.getWishlist,
        '/sitesetting/subscribe': mockApiGenerators.subscribeToNewsletter,
        '/sitesetting/unsubscribe': () => ({ success: true, data: 'Unsubscribed successfully' }),
        '/sitesetting/contact-queries': mockApiGenerators.submitContactQuery,
        '/sitesetting/subscriptions': mockApiGenerators.getSubscriptions,
        '/shop/reviews': mockApiGenerators.addProductReview,
        '/shop/create-order': mockApiGenerators.createOrder,
        '/shop/save-payment-detail': mockApiGenerators.savePaymentDetail,
        '/shop/get-payments': mockApiGenerators.getPayments,
        '/shop/create-razorpay-order': mockApiGenerators.createRazorpayOrder,
        '/shop/verify-razorpay-payment': mockApiGenerators.verifyRazorpayPayment,
        '/blog/get-posts': mockApiGenerators.getBlogPosts,
        '/blog/get-categoy': mockApiGenerators.getBlogCategories,
        '/blog/get-authors': mockApiGenerators.getBlogAuthors,
        '/blog/comments': mockApiGenerators.addBlogComment,
        '/cms/content-blocks': mockApiGenerators.getContentBlocks,
        '/cms/pages': mockApiGenerators.getPages,
        '/shipping/rates': mockApiGenerators.getShippingRates,
        '/shipping/providers': mockApiGenerators.getShippingProviders,
    }

    // Handle dynamic endpoints
    if (path.startsWith('/shop/product/')) {
        const slug = path.replace('/shop/product/', '')
        return mockApiGenerators.getProduct(slug)
    }

    if (path.startsWith('/shop/products/')) {
        const productId = path.replace('/shop/products/', '').split('/')[0]
        if (path.includes('/related')) {
            const limit = parseInt(params.get('limit') || '4')
            return mockApiGenerators.getRelatedProducts(productId, limit)
        }
    }

    if (path.startsWith('/cart/cart/')) {
        const itemId = path.replace('/cart/cart/', '')
        if (path.endsWith('/cart/' + itemId)) {
            return mockApiGenerators.updateCartItem()
        }
    }

    if (path.startsWith('/shop/wishlist-add')) {
        return mockApiGenerators.addToWishlist()
    }

    if (path.startsWith('/shop/wishlist-remove/')) {
        return mockApiGenerators.removeFromWishlist()
    }

    if (path.startsWith('/products/')) {
        const productId = path.split('/')[2]
        if (path.includes('/reviews')) {
            return mockApiGenerators.getProductReviews()
        }
        if (path.includes('/average-rating')) {
            return { success: true, data: { average_rating: '4.5' } }
        }
    }

    if (path.startsWith('/shop/update-status/')) {
        return mockApiGenerators.updateOrderStatus()
    }

    if (path.startsWith('/shop/orders/')) {
        const orderId = path.split('/')[3]
        if (path.includes('/address')) {
            return mockApiGenerators.getOrderAddress()
        }
        if (path.includes('/payments')) {
            return mockApiGenerators.getPayments()
        }
    }

    if (path.startsWith('/orders/')) {
        const orderId = path.split('/')[2]
        if (path.includes('/shipments')) {
            return mockApiGenerators.getOrderShipments()
        }
    }

    if (path.startsWith('/shipping/track/')) {
        const orderNumber = path.replace('/shipping/track/', '')
        return mockApiGenerators.trackOrder()
    }

    if (path.startsWith('/shop/')) {
        const id = path.split('/')[2]
        if (path.includes('/refund')) {
            return mockApiGenerators.getRefundDetails()
        }
    }

    if (path.startsWith('/sitesetting/subscription/')) {
        const email = path.replace('/sitesetting/subscription/', '')
        return mockApiGenerators.getSubscriptionByEmail()
    }

    // Check if endpoint has a direct mapping
    const generator = endpointMap[path]
    if (generator) {
        // Add small delay to simulate API call
        await mockApiDelay(100, 300)
        return generator()
    }

    // Return null if no mock found
    return null
}



// Helper function to transform API product to frontend product
function transformApiProduct(apiProduct: ApiProduct): Product {
    const price = parseFloat(apiProduct.price) || 0;
    const originalPrice = apiProduct.old_price ? parseFloat(apiProduct.old_price) : undefined;

    return {
        id: apiProduct.id.toString(),
        name: apiProduct.name,
        slug: apiProduct.slug,
        description: apiProduct.description,
        price: price,
        originalPrice: originalPrice,
        images: apiProduct.images || [],
        category: apiProduct.categories[0] || { id: '0', name: 'Uncategorized', slug: 'uncategorized' },
        inStock: apiProduct.qty > 0,
        stockCount: apiProduct.qty,
        rating: apiProduct.rating || 0,
        reviewCount: apiProduct.reviewCount || 0,
        tags: apiProduct.tags || [],
        createdAt: apiProduct.created_at,
        updatedAt: apiProduct.updated_at,
    };
}

// Helper function to make API requests with retry logic and fallback endpoints
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Check if mock mode is enabled
    const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (isMockMode) {
        console.log(`[MOCK MODE] Returning mock data for endpoint: ${endpoint}`)
        const mockResponse = await getMockResponse(endpoint)
        if (mockResponse) {
            return mockResponse as ApiResponse<T>
        }
        // If no mock found, fall back to real API (for development)
        console.warn(`[MOCK MODE] No mock data found for ${endpoint}, falling back to real API`)
    }

    const baseUrl = process.env.NEXT_PRIVATE_API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-Tenant': process.env.NEXT_PRIVATE_API_TENANT_ID || '',
                'X-Requested-With': 'XMLHttpRequest', // For CSRF protection
                ...(process.env.NEXT_PRIVATE_API_TOKEN ? {
                'Authorization': `Bearer ${process.env.NEXT_PRIVATE_API_TOKEN}`                } : {}),
                ...options.headers,
            },
            ...options,
            // Add timeout
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message =
                (errorData && ((errorData as any).message || (errorData as any).error)) ||
                `HTTP error! status: ${response.status}`;
            return { success: false, error: message } as ApiResponse<T>;
        }

        const data = await response.json().catch(() => ({}));
        return {
            success: true,
            data: (data as any).data || (data as any),
        };
    } catch (error: any) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unable to connect to API server. Please check your connection and try again.',
        };
    }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    return apiRequest<Category[]>('/shop/get-categories')
}

/**
 * Get products with filtering and pagination
 */
export async function getProducts(
    filters: ProductFilter = {},
    page = 1,
    limit = 12
): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    // Get raw API response
    const response = await apiRequest<any>(`/shop/get-products?${params.toString()}`)

    if (!response.success || !response.data) {
        return {
            success: false,
            error: response.error || 'Failed to fetch products'
        }
    }

    // Transform API products to frontend products
    const productsData = Array.isArray(response.data.data) ? response.data.data : []
    const products = productsData.map(transformApiProduct)

    // Create paginated response structure
    const paginatedResponse: PaginatedResponse<Product> = {
        data: products,
        pagination: {
            page: response.data.current_page || page,
            limit: response.data.per_page || limit,
            total: response.data.total || products.length,
            totalPages: response.data.last_page || 1
        }
    }

    return {
        success: true,
        data: paginatedResponse
    }
}

/**
 * Get a single product by slug
 */
export async function getProduct(slug: string): Promise<ApiResponse<Product>> {
    const response = await apiRequest<ApiProduct>(`/shop/product/${slug}`)

    if (!response.success || !response.data) {
        return {
            success: false,
            error: response.error || 'Failed to fetch product'
        }
    }

    // Transform API product to frontend product
    const product = transformApiProduct(response.data)

    return {
        success: true,
        data: product
    }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 6): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/shop/products-featured?limit=${limit}`)
}

/**
 * Get related products for a given product
 */
export async function getRelatedProducts(
    productId: string,
    limit = 4
): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/shop/products/${productId}/related?limit=${limit}`)
}

/**
 * User registration
 */
export async function registerUser(userData: {
    name: string
    email: string
    password: string
    gender: 'male' | 'female' | 'other'
    password_confirmation: string
    phone?: string
    birthday?: string
}): Promise<ApiResponse<{ user: string; customer_id: string }>> {
    return apiRequest<{ user: string; customer_id: string }>('/user/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    })
}

/**
 * User login
 */
export async function loginUser(credentials: {
    email: string
    password: string
}): Promise<ApiResponse<{ user: string; customer_id: string }>> {
    return apiRequest<{ user: string; customer_id: string }>('/user/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    })
}

/**
 * User logout
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
    return apiRequest<null>('/user/logout', {
        method: 'POST',
    })
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<ApiResponse<{ user: string; role: string; tenant_id: string; customer_id: string }>> {
    return apiRequest<{ user: string; role: string; tenant_id: string; customer_id: string }>('/user/get-profile')
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData: {
    name: string
    email: string
    password?: string
    password_confirmation?: string
}): Promise<ApiResponse<UserResource>> {
    return apiRequest<UserResource>('/user/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    })
}

/**
 * Forgot password - send reset link
 */
export async function forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

/**
 * Send password reset OTP
 */
export async function sendPasswordResetOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/user/auth/forgot-password/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

/**
 * Reset password with OTP
 */
export async function resetPasswordWithOtp(data: {
    email: string
    otp: string
    password: string
    password_confirmation: string
}): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/user/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

/**
 * Add product to cart
 */
export async function addToCart(productData: {
    product_id: number
    product_quantity: number
    product_variant_id?: number | null
    product_variant_data?: string[] | null
}): Promise<ApiResponse<string>> {
    return apiRequest<string>('/cart/cart', {
        method: 'POST',
        body: JSON.stringify(productData),
    })
}

/**
 * Update cart item
 */
export async function updateCartItem(
    itemId: string,
    quantity: number
): Promise<ApiResponse<string>> {
    return apiRequest<string>(`/cart/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ product_quantity: quantity }),
    })
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemId: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/cart/cart/${itemId}`, {
        method: 'DELETE',
    })
}

/**
 * Get cart items
 */
export async function getCart(): Promise<ApiResponse<{ items: string; total: string }>> {
    return apiRequest<{ items: string; total: string }>('/cart/cart')
}

/**
 * Get cart total
 */
export async function getCartTotal(): Promise<ApiResponse<{ total: string }>> {
    return apiRequest<{ total: string }>('/cart/cart/total')
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: number): Promise<ApiResponse<null>> {
    return apiRequest<null>('/shop/wishlist-add', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
    })
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/shop/wishlist-remove/${productId}`, {
        method: 'POST',
    })
}

/**
 * Get wishlist
 */
export async function getWishlist(): Promise<ApiResponse<string>> {
    return apiRequest<string>('/shop/wishlist', { method: 'POST' })
}

/**
 * Get orders
 */
export async function getOrders(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/shop/orders')
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({ q: query })
    return apiRequest<Product[]>(`/shop/search?${params.toString()}`)
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string): Promise<ApiResponse<string>> {
    return apiRequest<string>(`/products/${productId}/reviews`)
}

/**
 * Add product review
 */
export async function addProductReview(reviewData: {
    product_id: number
    review?: string | null
    rating: number
}): Promise<ApiResponse<string>> {
    return apiRequest<string>('/shop/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    })
}

/**
 * Get average product rating
 */
export async function getAverageRating(productId: string): Promise<ApiResponse<{ average_rating: string }>> {
    return apiRequest<{ average_rating: string }>(`/products/${productId}/average-rating`)
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<ApiResponse<string>> {
    return apiRequest<string>('/sitesetting/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<ApiResponse<string>> {
    return apiRequest<string>('/sitesetting/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

/**
 * Submit contact query
 */
export async function submitContactQuery(queryData: {
    full_name: string
    email: string
    phone_number: string
    message: string
}): Promise<ApiResponse<string>> {
    return apiRequest<string>('/sitesetting/contact-queries', {
        method: 'POST',
        body: JSON.stringify(queryData),
    })
}
/**
 * Get shipping rates
 */
export async function getShippingRates(data?: {
    weight?: number
    destination?: string
    provider?: string
}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    if (data?.weight) params.append('weight', data.weight.toString())
    if (data?.destination) params.append('destination', data.destination)
    if (data?.provider) params.append('provider', data.provider)

    return apiRequest<any[]>(`/shipping/rates?${params.toString()}`)
}

/**
 * Get shipping providers
 */
export async function getShippingProviders(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/shipping/providers')
}

/**
 * Get order shipments
 */
export async function getOrderShipments(orderId: string): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>(`/orders/${orderId}/shipments`)
}

/**
 * Track order by order number
 */
export async function trackOrder(orderNumber: string): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/shipping/track/${orderNumber}`)
}
/**
 * Get best selling products
 */
export async function getBestSellers(limit = 12): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/shop/best-sellers?limit=${limit}`)
}

/**
 * Get latest arrival products
 */
export async function getLatestArrivals(limit = 12): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/shop/latest-arrivals?limit=${limit}`)
}

/**
 * Log product view
 */
export async function logProductView(productId: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/shop/products/${productId}/log-view`, {
        method: 'POST',
    })
}

/**
 * Get recent product views
 */
export async function getRecentViews(limit = 10): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/shop/recent-views?limit=${limit}`)
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/shop/brands')
}

/**
 * Search brands
 */
export async function searchBrands(query: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({ q: query })
    return apiRequest<any[]>(`/shop/brands/search?${params.toString()}`)
}
