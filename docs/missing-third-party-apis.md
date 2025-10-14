# Missing Third-Party API Integrations

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
