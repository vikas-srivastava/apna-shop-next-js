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
            return mockApiGenerators.searchProducts(query)
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

// Base URL for the third-party API with multiple fallback options
const getApiBaseUrl = (): string => {
    // Priority order for API base URL
    const urls = [
        process.env.NEXT_PUBLIC_API_BASE_URL,
        process.env.THIRD_PARTY_API_URL,
        process.env.API_BASE_URL,
        'http://localhost:8000/api', // Common Laravel development port
        'http://localhost:3001/api', // Alternative development port
        'http://127.0.0.1:8000/api', // IPv4 localhost
        'http://localhost/api' // Fallback
    ]

    // Return the first non-empty URL
    for (const url of urls) {
        if (url && url.trim()) {
            return url.trim()
        }
    }

    return 'http://localhost/api' // Final fallback
}

const API_BASE_URL = getApiBaseUrl()

// Helper function to transform API product to frontend product
function transformApiProduct(apiProduct: ApiProduct): Product {
    try {
        // Use the first category or create a default one if no categories exist
        const category = (apiProduct.categories && apiProduct.categories.length > 0 && apiProduct.categories[0])
            ? {
                id: (apiProduct.categories[0].id || 0).toString(),
                name: apiProduct.categories[0].name || 'Uncategorized',
                slug: apiProduct.categories[0].slug || 'uncategorized',
            }
            : {
                id: '0',
                name: 'Uncategorized',
                slug: 'uncategorized',
            };

        // Parse price values, with fallbacks
        const price = parseFloat(apiProduct.price) || 0;
        const originalPrice = apiProduct.old_price ? (parseFloat(apiProduct.old_price) || 0) : undefined;

        // Ensure price is always a number
        const finalPrice = (typeof price === 'number' && !isNaN(price)) ? price : 0;
        const finalOriginalPrice = (originalPrice === undefined || (typeof originalPrice === 'number' && !isNaN(originalPrice)))
            ? originalPrice
            : 0;

        // Provide fallback images if API doesn't return any
        const images = (apiProduct.images && apiProduct.images.length > 0)
            ? apiProduct.images
            : [`/globe.svg`];

        return {
            id: apiProduct.id.toString(),
            name: apiProduct.name,
            slug: apiProduct.slug,
            description: apiProduct.description,
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            images,
            category,
            inStock: typeof apiProduct.qty === 'number' ? apiProduct.qty > 0 : true,
            stockCount: typeof apiProduct.qty === 'number' && apiProduct.qty >= 0 ? apiProduct.qty : 999,
            rating: 4.5, // Default rating since API doesn't return this in sample
            reviewCount: 0, // Default review count since API doesn't return this in sample
            tags: [], // API doesn't seem to return tags in the sample response
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add other fields as needed
        };
    } catch (error) {
        console.error('Error transforming product:', error, apiProduct);
        // Return a default product in case of transformation error
        return {
            id: 'error-' + Math.random().toString(36).substr(2, 9),
            name: 'Error Product',
            slug: 'error-product',
            description: 'Error occurred while loading product data',
            price: 0,
            images: [],
            category: {
                id: '0',
                name: 'Error Category',
                slug: 'error-category',
            },
            inStock: false,
            stockCount: 0,
            rating: 0,
            reviewCount: 0,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
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

    const maxRetries = 3;
    let lastError: any = null;

    // Try different base URLs if the primary one fails
    const fallbackUrls = [
        API_BASE_URL,
        'http://localhost:8000/api',
        'http://127.0.0.1:8000/api',
        'http://localhost:3001/api',
        'https://api.example.com' // Production fallback (should be configured)
    ];

    for (const baseUrl of fallbackUrls) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const url = `${baseUrl}${endpoint}`;
                if (!isMockMode) {
                    console.log(`Attempting API request to: ${url} (attempt ${attempt + 1})`);
                }

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Tenant': process.env.NEXT_PUBLIC_TENANT_ID || '',
                        'X-Requested-With': 'XMLHttpRequest', // For CSRF protection
                        ...(process.env.NEXT_PUBLIC_TOKEN ? {
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                        } : {}),
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

                    // Don't retry on client errors (4xx) except 429 (rate limit)
                    if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                        return { success: false, error: message } as ApiResponse<T>;
                    }

                    // For 5xx, network errors, and rate limits: capture and retry
                    lastError = new Error(message);

                    // If last attempt on last URL, break out and return failure
                    if (attempt === maxRetries && baseUrl === fallbackUrls[fallbackUrls.length - 1]) {
                        break;
                    }

                    // Exponential backoff before retrying (longer for rate limits)
                    const delay = response.status === 429 ? 5000 : Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                const data = await response.json().catch(() => ({}));
                return {
                    success: true,
                    data: (data as any).data || (data as any),
                };
            } catch (error: any) {
                lastError = error;

                // If this is a timeout or network error, try next URL
                if (error.name === 'TimeoutError' || error.name === 'TypeError') {
                    if (!isMockMode) {
                        console.warn(`Network error for ${baseUrl}, trying next fallback URL...`);
                    }
                    break; // Break inner loop to try next URL
                }

                // Only log on final attempt to reduce console noise
                if (attempt === maxRetries && baseUrl === fallbackUrls[fallbackUrls.length - 1]) {
                    if (!isMockMode) {
                        console.error(`API request failed for ${endpoint} (final attempt):`, error?.message || error);
                    }
                    break;
                }

                // Exponential backoff before next attempt
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    return {
        success: false,
        error: lastError instanceof Error ? lastError.message : 'Unable to connect to API server. Please check your connection and try again.',
    };
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

    // Add filters to query parameters
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sort_by', filters.sortBy)
    if (filters.rating) params.append('rating', filters.rating.toString())
    if (filters.inStock !== undefined) params.append('in_stock', filters.inStock.toString())
    if (filters.priceRange) {
        params.append('min_price', filters.priceRange.min.toString())
        params.append('max_price', filters.priceRange.max.toString())
    }
    if (filters.colors && filters.colors.length > 0) {
        params.append('colors', filters.colors.join(','))
    }
    if (filters.sizes && filters.sizes.length > 0) {
        params.append('sizes', filters.sizes.join(','))
    }

    // Get raw API response
    const response = await apiRequest<ApiProduct[]>(`/shop/get-products?${params.toString()}`)

    if (!response.success || !response.data) {
        return {
            success: false,
            error: response.error || 'Failed to fetch products'
        }
    }

    // Transform API products to frontend products
    // Handle both direct array and paginated response formats
    const productsData = Array.isArray(response.data) ? response.data : response.data.data || []
    const products = productsData.map(transformApiProduct)

    // Create paginated response structure
    // Note: Since the API doesn't return pagination info in the sample, we'll create default values
    const paginatedResponse: PaginatedResponse<Product> = {
        data: products,
        pagination: {
            page: page,
            limit: limit,
            total: products.length,
            totalPages: 1
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
    gender: 'male' | 'female'
    password_confirmation: string
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
export async function getUserProfile(): Promise<ApiResponse<{ user: string; role: string; tenant_id: string }>> {
    return apiRequest<{ user: string; role: string; tenant_id: string }>('/user/get-profile')
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData: {
    name: string
    email: string
    password?: string
    password_confirmation?: string
}): Promise<ApiResponse<string>> {
    return apiRequest<string>('/user/update-profile', {
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
    customer_id?: string
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
    return apiRequest<string>('/shop/wishlist')
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