# Apna Shop APIs Documentation

This document contains the complete OpenAPI specification for the Apna Shop APIs that this Next.js application integrates with.

## API Base URL

```
http://localhost/api
```

## Authentication

All API endpoints require authentication using Bearer tokens in the Authorization header:

```
Authorization: Bearer {API_TOKEN}
X-Tenant: {TENANT_ID}
```

## Core Endpoints

### Authentication

- `POST /user/register` - User registration
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `GET /user/get-profile` - Get user profile
- `PUT /user/update-profile` - Update profile
- `POST /user/forgot-password` - Send password reset link
- `POST /user/auth/forgot-password/send-otp` - Send OTP for password reset
- `POST /user/auth/forgot-password/reset` - Reset password with OTP

### Products

- `GET /shop/get-products` - Get all products
- `GET /shop/product/{slug}` - Get product by slug
- `GET /shop/products-featured` - Featured products
- `GET /shop/best-sellers` - Best sellers
- `GET /shop/latest-arrivals` - Latest arrivals
- `GET /shop/search` - Search products
- `POST /shop/products/{id}/log-view` - Log product view
- `GET /shop/recent-views` - Get recent views
- `POST /shop/wishlist` - Get wishlist
- `POST /shop/wishlist-add` - Add to wishlist
- `POST /shop/wishlist-remove/{productId}` - Remove from wishlist

### Cart

- `GET /cart/cart` - Get cart
- `POST /cart/cart` - Add to cart
- `PUT /cart/cart/{item_id}` - Update cart item
- `DELETE /cart/cart/{item_id}` - Remove from cart
- `GET /cart/cart/total` - Get cart total

### Orders

- `GET /shop/orders` - Get orders
- `POST /shop/create-order` - Create order
- `PUT /shop/update-status/{order_id}` - Update order status
- `POST /shop/save-payment-detail` - Save payment
- `GET /shop/orders/{orderId}/address` - Get order address
- `POST /shop/orders/{orderId}/address` - Add order address

### Payments

- `GET /shop/get-payments` - Get payments
- `POST /shop/add-payments` - Add payment
- `GET /shop/get-order-payments/{orderId}` - Get order payments
- `POST /shop/create-razorpay-order` - Create Razorpay order
- `POST /shop/verify-razorpay-payment` - Verify Razorpay payment

### Categories & Brands

- `GET /shop/get-categories` - Get categories
- `GET /shop/brands` - Get brands
- `GET /shop/brands/search` - Search brands

### Blog & Content

- `GET /blog/get-posts` - Get blog posts
- `GET /blog/get-categoy` - Get blog categories
- `GET /blog/get-authors` - Get blog authors
- `POST /blog/comments` - Add comment
- `GET /cms/content-blocks` - Get content blocks
- `GET /cms/pages` - Get pages

### Reviews & Ratings

- `POST /shop/reviews` - Add review
- `GET /products/{productId}/reviews` - Get product reviews
- `GET /products/{productId}/average-rating` - Get average rating

### Shipping & Tracking

- `GET /orders/{order}/shipments` - Track shipment
- `GET /shipping/track/{orderNumber}` - Track order
- `POST /shipping/rates` - Get shipping rates
- `GET /shipping/providers` - Get shipping providers

### Refunds & Support

- `GET /shop/{id}/refund` - Get refund details
- `POST /shop/{id}/refund` - Process refund
- `POST /sitesetting/contact-queries` - Submit contact query

### Subscriptions

- `POST /sitesetting/subscribe` - Subscribe to newsletter
- `POST /sitesetting/unsubscribe` - Unsubscribe from newsletter
- `GET /sitesetting/subscriptions` - Get subscriptions
- `GET /sitesetting/subscription/{email}` - Get subscription by email

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object|null
}
```

## Error Responses

- `401` - Authentication required
- `422` - Validation errors
- `404` - Resource not found
- `500` - Server error

## Data Types

### UserResource

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "email_verified_at": "datetime|null",
  "created_at": "datetime|null",
  "updated_at": "datetime|null",
  "customer": {
    "id": "string",
    "first_name": "string",
    "last_name": "string",
    "phone": "string",
    "gender": "string"
  }
}
```

### RegisterRequest

```json
{
  "name": "string",
  "email": "email",
  "password": "string",
  "gender": "male|female|other",
  "phone": "string|null",
  "birthday": "datetime|null",
  "password_confirmation": "string"
}
```

### LoginRequest

```json
{
  "email": "email",
  "password": "string"
}
```

## Integration Notes

- All requests require `X-Tenant` header with tenant ID
- Authentication uses Bearer tokens
- File uploads are supported for product images
- Pagination is available on list endpoints
- Search functionality supports query parameters
- Cart operations are session-based
- Payment integration with Razorpay
- Shipping providers include Delhivery, DTDC, ShipRocket, etc.

## CORS Considerations

Since this API will be proxied through Next.js API routes to avoid CORS issues in production, the frontend should call local `/api/*` endpoints instead of direct third-party URLs.
