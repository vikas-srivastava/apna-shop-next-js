# API Integration Documentation

## Overview

This Next.js application integrates with Apna Shop APIs through a comprehensive service layer that handles authentication, data fetching, caching, and error management. The integration is designed to be headless, allowing the frontend to work with different backend implementations while maintaining consistent functionality.

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

- **Caching**: Request deduplication and response caching
- **Monitoring**: Performance metrics and error tracking
- **Circuit Breaker**: Automatic failure detection and recovery
- **Fallbacks**: Mock data support for development/testing

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

## Authentication Flow

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

- `page`: Page number
- `limit`: Items per page
- `category`: Category slug
- `search`: Search query
- `price_min`: Minimum price
- `price_max`: Maximum price

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

- `POST /shop/create-razorpay-order`
- `POST /shop/verify-razorpay-payment`

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

- **Network Errors**: Connection failures, timeouts
- **Authentication Errors**: Invalid tokens, expired sessions
- **Validation Errors**: Invalid request data
- **Server Errors**: 5xx responses, API downtime
- **Client Errors**: 4xx responses, invalid requests

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

1. Add method to `ApiService` class
2. Implement in `third-party-api.ts`
3. Add mock data generator
4. Update TypeScript types
5. Add error handling and caching
6. Test with both mock and live data

### Testing API Integration

```bash
# Test with mock data
NEXT_PUBLIC_USE_MOCK=true npm run dev

# Test with live API
NEXT_PUBLIC_USE_MOCK=false npm run dev
```

### Debugging API Issues

1. Check browser network tab for request details
2. Verify environment variables are set correctly
3. Check API service logs in browser console
4. Test with mock data to isolate issues
5. Verify CORS headers and authentication

This comprehensive API integration ensures reliable, performant, and maintainable communication between the Next.js frontend and Apna Shop backend services.
