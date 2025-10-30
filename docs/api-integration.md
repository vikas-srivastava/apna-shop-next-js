# API Integration Documentation

## Overview

This Next.js application integrates with Apna Shop APIs through a comprehensive service layer that handles authentication, data fetching, caching, and error management. The integration is designed to be headless, allowing the frontend to work with different backend implementations while maintaining consistent functionality and a clear authentication flow.

## API Base Configuration

### Environment Variables

```env
NEXT_PUBLIC_USE_MOCK=false          # Enable/disable mock data
NEXT_PUBLIC_API_BASE_URL=https://apnashop.com/api  # Production API URL
NEXT_PRIVATE_API_BASE_URL=https://apnashop.com/api # Server-side API URL
NEXT_PUBLIC_TENANT_ID=your-tenant-id               # Multi-tenant identifier
NEXT_PUBLIC_TOKEN=your-api-token                   # Authentication token
NEXT_PRIVATE_TENANT_ID=your-tenant-id              # Server-side tenant ID
```

### Headers Configuration

All API requests include standard headers:

```typescript
{
  'Content-Type': 'application/json',
  'X-Tenant': process.env.NEXT_PUBLIC_TENANT_ID,
  'X-Requested-With': 'XMLHttpRequest',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
}
```

## Service Layer Architecture

### ApiService Class

The main API service class provides:

-   **Caching**: Request deduplication and response caching
-   **Monitoring**: Performance metrics and error tracking
-   **Circuit Breaker**: Automatic failure detection and recovery
-   **Fallbacks**: Mock data support for development/testing

```typescript
class ApiService {
  // Core methods
  static async getProducts(
    filters,
    page,
    limit
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
  static async getProduct(slug): Promise<ApiResponse<Product>>;
  static async registerUser(userData): Promise<ApiResponse<User>>;
  static async loginUser(credentials): Promise<ApiResponse<User>>;
  // ... additional methods
}
```

### Third-Party API Integration

Direct API calls are handled by `third-party-api.ts`:

```typescript
export async function getCategories(): Promise<ApiResponse<Category[]>>;
export async function getProducts(
  filters,
  page,
  limit
): Promise<ApiResponse<PaginatedResponse<Product>>>;
export async function registerUser(userData): Promise<ApiResponse<User>>;
```

## Authentication Flow and Token Management

### Auth Flow

The authentication flow typically involves:

1.  **User Login/Registration**: User provides credentials (email, password) through the UI.
2.  **API Call**: The frontend sends these credentials to the backend's login/register endpoint (e.g., `POST /user/login`).
3.  **Token Reception**: Upon successful authentication, the backend responds with an authentication token (e.g., JWT).
4.  **Token Storage**: The frontend stores this token securely, typically in `localStorage` or `sessionStorage` for client-side applications, or in HTTP-only cookies for server-side rendered applications to prevent XSS attacks.
5.  **Subsequent Requests**: For all subsequent authenticated API requests, this token is included in the `Authorization` header as a Bearer token.
6.  **Token Expiration/Refresh**: The system handles token expiration by either redirecting the user to the login page or attempting to refresh the token silently using a refresh token (if implemented by the backend).

### Token Management

-   **Storage**: Tokens are stored in `localStorage` (as seen in `ApiService` and `AuthService`) for easy access by client-side code.
-   **Retrieval**: The `getAuthToken()` method in `ApiService` retrieves the token before making authenticated requests.
-   **Invalidation**: Upon logout or receiving a 401 Unauthorized response, the token is removed from storage, and the user is redirected to the login page (`handleUnauthorized()` in `ApiService`).

### User Registration

```typescript
const response = await ApiService.registerUser({
  name: string,
  email: string,
  password: string,
  gender: "male" | "female" | "other",
  password_confirmation: string,
  phone: string,
  birthday: string,
});
```

**API Endpoint**: `POST /user/register`

**Response**:

```json
{
  "success": true,
  "data": {
    "user": "user@example.com",
    "customer_id": "12345"
  }
}
```

### User Login

```typescript
const response = await ApiService.loginUser({
  email: string,
  password: string,
});
```

**API Endpoint**: `POST /user/login`

**Response**:

```json
{
  "success": true,
  "data": {
    "user": "user@example.com",
    "customer_id": "12345"
  }
}
```

### Password Reset

```typescript
// Send OTP
const response = await ApiService.sendPasswordResetOtp(email);

// Reset with OTP
const response = await ApiService.resetPasswordWithOtp({
  email: string,
  otp: string,
  password: string,
  password_confirmation: string,
});
```

## Product Management

### Get Products with Filtering

```typescript
const response = await ApiService.getProducts(
  {
    category: string,
    search: string,
    priceRange: { min: number, max: number },
    rating: number,
    inStock: boolean,
    sortBy: "price-asc" | "price-desc" | "rating" | "newest",
  },
  (page = 1),
  (limit = 12)
);
```

**API Endpoint**: `GET /shop/get-products`

**Query Parameters**:

-   `page`: Page number
-   `limit`: Items per page
-   `category`: Category slug
-   `search`: Search query
-   `price_min`: Minimum price
-   `price_max`: Maximum price

**Response**:

```json
{
  "success": true,
  "data": {
    "data": [Product[]],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

### Get Single Product

```typescript
const response = await ApiService.getProduct(slug);
```

**API Endpoint**: `GET /shop/product/{slug}`

## Cart Management

### Add to Cart

```typescript
const response = await ApiService.addToCart({
  product_id: number,
  product_quantity: number,
  product_variant_id?: number,
  product_variant_data?: string[],
  customer_id?: string
})
```

**API Endpoint**: `POST /cart/cart`

### Update Cart Item

```typescript
const response = await ApiService.updateCartItem(itemId, quantity);
```

**API Endpoint**: `PUT /cart/cart/{item_id}`

### Get Cart

```typescript
const response = await ApiService.getCart();
```

**API Endpoint**: `GET /cart/cart`

**Response**:

```json
{
  "success": true,
  "data": {
    "items": "cart_items_json",
    "total": "total_amount"
  }
}
}
```

## Order Management

### Create Order

```typescript
const response = await ApiService.createOrder(orderData);
```

**API Endpoint**: `POST /shop/create-order`

### Get Orders

```typescript
const response = await ApiService.getOrders();
```

**API Endpoint**: `GET /shop/orders`

## Payment Integration

### Razorpay Integration

```typescript
// Create order
const response = await ApiService.createRazorpayOrder(orderData);

// Verify payment
const response = await ApiService.verifyRazorpayPayment(paymentData);
```

**API Endpoints**:

-   `POST /shop/create-razorpay-order`
-   `POST /shop/verify-razorpay-payment`

## Content Management

### Blog Posts

```typescript
const response = await ApiService.getBlogPosts();
```

**API Endpoint**: `GET /blog/get-posts`

### Categories

```typescript
const response = await ApiService.getCategories();
```

**API Endpoint**: `GET /shop/get-categories`

## Error Handling

### Response Format

All API responses follow a consistent structure:

```json
{
  "success": boolean,
  "data": any | null,
  "error": string | null
}
```

### Error Types

-   **Network Errors**: Connection failures, timeouts
-   **Authentication Errors**: Invalid tokens, expired sessions
-   **Validation Errors**: Invalid request data
-   **Server Errors**: 5xx responses, API downtime
-   **Client Errors**: 4xx responses, invalid requests

### Circuit Breaker Pattern

The application uses circuit breaker pattern for API resilience:

```typescript
const circuitBreaker = new CircuitBreaker(endpoint, operation, {
  failureThreshold: 5,
  recoveryTimeout: 60000,
  monitoringPeriod: 300000,
  successThreshold: 3,
});
```

## Caching Strategy

### Cache Configuration

```typescript
const API_CONFIG = {
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
  maxRetries: 3,
};
```

### Cache Keys

Cache keys are generated based on method, endpoint, and parameters:

```typescript
const cacheKey = `${method}:${endpoint}:${JSON.stringify(params)}`;
```

## Mock Data System

### Mock Mode

When `NEXT_PUBLIC_USE_MOCK=true`, the application uses mock data:

```typescript
if (API_CONFIG.useMock) {
  return { success: true, data: fallbackData };
}
```

### Mock Data Structure

Mock data is organized by endpoint in `mock-data.ts`:

```typescript
export const mockApiGenerators = {
  getCategories: () => ({ success: true, data: mockCategories }),
  getProducts: (page, limit) => ({ success: true, data: mockProducts }),
  // ... additional generators
};
```

## Performance Monitoring

### Metrics Collection

The API service tracks performance metrics:

```typescript
interface PerformanceMetrics {
  method: string;
  endpoint: string;
  duration: number;
  success: boolean;
  timestamp: number;
  error?: string;
}
```

### Monitoring Dashboard

Performance metrics are available via:

```typescript
const metrics = ApiService.getPerformanceMetrics();
```

## Security Considerations

### Request Signing

All requests include proper authentication headers and tenant identification.

### Input Validation

Client-side validation is implemented using custom validation functions:

```typescript
import { validateEmail, validatePassword } from "@/lib/validation";
```

### Rate Limiting

API requests are rate-limited to prevent abuse:

```typescript
// Rate limiting middleware in API routes
import rateLimit from "@/middleware/rate-limit";
```

## CORS Handling

### Proxy Strategy

To avoid CORS issues in production, API calls are proxied through Next.js API routes:

```typescript
// Client calls local API
fetch("/api/products");

// Next.js API route proxies to external API
fetch(`${process.env.API_BASE_URL}/shop/get-products`);
```

### API Route Structure

API routes are organized by feature:

```
src/app/api/
├── auth/          # Authentication routes
├── products/      # Product management
├── cart/          # Cart operations
├── orders/        # Order management
├── payments/      # Payment processing
└── themes/        # Theme management
```

## Development Workflow

### Adding New API Integration

1.  Add method to `ApiService` class
2.  Implement in `third-party-api.ts`
3.  Add mock data generator
4.  Update TypeScript types
5.  Add error handling and caching
6.  Test with both mock and live data

### Testing API Integration

```bash
# Test with mock data
NEXT_PUBLIC_USE_MOCK=true npm run dev

# Test with live API
NEXT_PUBLIC_USE_MOCK=false npm run dev
```

### Debugging API Issues

1.  Check browser network tab for request details
2.  Verify environment variables are set correctly
3.  Check API service logs in browser console
4.  Test with mock data to isolate issues
5.  Verify CORS headers and authentication

## Known Issues, Assumptions, or Areas Needing Improvement

*   **Inconsistent Error Handling**: While a general error handling structure exists, specific error responses from the backend might not always be consistently mapped to user-friendly messages. This could lead to generic error messages for specific issues.
*   **Token Refresh Mechanism**: The current token management primarily focuses on storing and invalidating tokens. A more robust solution would include a token refresh mechanism to seamlessly renew expired tokens without requiring the user to log in again.
*   **API Client Structure**: The `ApiService` and `third-party-api.ts` files could be further refined to reduce redundancy and improve clarity, especially if the number of API endpoints grows significantly.
*   **Backend API Documentation**: Assumptions are made about the backend API's behavior and response structures. Any discrepancies between the actual backend and these assumptions could lead to integration issues.
*   **Security Enhancements**: While basic security measures like rate limiting and input validation are in place, further enhancements like more granular access control, advanced bot detection, and comprehensive vulnerability scanning could be considered.

This comprehensive API integration ensures reliable, performant, and maintainable communication between the Next.js frontend and Apna Shop backend services.

## Missing Third-Party API Integrations

## Overview

Based on the current integration status (~40% of Apna Shop APIs endpoints integrated), this document outlines the remaining 60% of APIs that need implementation for full eCommerce functionality. Core features (authentication, products, cart) are complete, but major gaps exist in orders, payments, blog, shipping, refunds, reviews, and subscriptions.

## Orders

**Priority: High**

Endpoints:

- `GET /shop/orders` - Get orders (Purpose: Retrieve user's order history)
- `POST /shop/create-order` - Create order (Purpose: Place new orders)
- `PUT /shop/update-status/{order_id}` - Update order status (Purpose: Modify order status)
- `POST /shop/save-payment-detail` - Save payment (Purpose: Store payment information)
- `GET /shop/orders/{orderId}/address` - Get order address (Purpose: Retrieve shipping address for order)
- `POST /shop/orders/{orderId}/address` - Add order address (Purpose: Add/update shipping address)

## Payments

**Priority: High**

Endpoints:

- `GET /shop/get-payments` - Get payments (Purpose: Retrieve payment history)
- `POST /shop/add-payments` - Add payment (Purpose: Process new payments)
- `GET /shop/get-order-payments/{orderId}` - Get order payments (Purpose: Get payments for specific order)
- `POST /shop/create-razorpay-order` - Create Razorpay order (Purpose: Initialize Razorpay payment)
- `POST /shop/verify-razorpay-payment` - Verify Razorpay payment (Purpose: Confirm payment completion)

## Blog & Content

**Priority: Medium**

Endpoints:

- `GET /blog/get-posts` - Get blog posts (Purpose: Retrieve blog articles)
- `GET /blog/get-categoy` - Get blog categories (Purpose: Get blog category list)
- `GET /blog/get-authors` - Get blog authors (Purpose: Retrieve author information)
- `POST /blog/comments` - Add comment (Purpose: Submit comments on blog posts)
- `GET /cms/content-blocks` - Get content blocks (Purpose: Retrieve CMS content)
- `GET /cms/pages` - Get pages (Purpose: Get static pages content)

## Reviews & Ratings

**Priority: Medium**

Endpoints:

- `POST /shop/reviews` - Add review (Purpose: Submit product reviews)
- `GET /products/{productId}/reviews` - Get product reviews (Purpose: Retrieve reviews for a product)
- `GET /products/{productId}/average-rating` - Get average rating (Purpose: Get product's average rating)

## Shipping & Tracking

**Priority: High**

Endpoints:

- `GET /orders/{order}/shipments` - Track shipment (Purpose: Get shipment details)
- `GET /shipping/track/{orderNumber}` - Track order (Purpose: Track order by number)
- `POST /shipping/rates` - Get shipping rates (Purpose: Calculate shipping costs)
- `GET /shipping/providers` - Get shipping providers (Purpose: List available shipping providers)

## Refunds & Support

**Priority: Medium**

Endpoints:

- `GET /shop/{id}/refund` - Get refund details (Purpose: Retrieve refund information)
- `POST /shop/{id}/refund` - Process refund (Purpose: Initiate refund process)
- `POST /sitesetting/contact-queries` - Submit contact query (Purpose: Handle customer support queries)

## Subscriptions

**Priority: Low**

Endpoints:

- `POST /sitesetting/subscribe` - Subscribe to newsletter (Purpose: Newsletter subscription)
- `POST /sitesetting/unsubscribe` - Unsubscribe from newsletter (Purpose: Newsletter unsubscription)
- `GET /sitesetting/subscriptions` - Get subscriptions (Purpose: Retrieve subscription list)
- `GET /sitesetting/subscription/{email}` - Get subscription by email (Purpose: Check subscription status)
