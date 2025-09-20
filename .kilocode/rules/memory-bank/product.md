# Product Description

## Why This Project Exists

This is a modern, full-featured eCommerce frontend application built with Next.js, designed to provide a seamless online shopping experience. The project serves as a reusable theme/template for creating integrable eCommerce stores that can be easily deployed and customized.

## Problems It Solves

1. **CORS Issues in Production**: Eliminates browser CORS errors when deploying to platforms like Vercel by proxying third-party API calls through Next.js API routes
2. **Complex eCommerce Integration**: Provides a complete, production-ready integration with Foundry eCommerce API
3. **Scalable Component Architecture**: Implements atomic design principles for maintainable, reusable UI components
4. **State Management Complexity**: Centralizes API endpoints and state management using React Context
5. **Deployment Challenges**: Includes proper configuration for Vercel deployment with environment variable management

## How It Should Work

### User Experience Flow

1. **Browse Products**: Users can browse products by category, search, view featured/best-sellers/latest arrivals
2. **Authentication**: Secure login/registration with profile management and password reset
3. **Shopping Cart**: Add/remove/update items, view cart totals
4. **Checkout Process**: Complete order placement with multiple payment options (Razorpay integration)
5. **Order Management**: Track orders, view order history, manage addresses
6. **Content Consumption**: Blog posts, reviews, contact forms, newsletter subscriptions

### Technical Architecture

- **Frontend**: Next.js 15 with React 19, Tailwind CSS, Framer Motion
- **API Integration**: Centralized axios client with Foundry eCommerce API
- **State Management**: React Context providers (Auth, Cart, Product)
- **Component Design**: Atomic design (Atoms → Molecules → Organisms)
- **Deployment**: Vercel-ready with CORS headers and environment configuration

## User Experience Goals

### Performance

- Fast loading with server-side rendering for critical pages
- Optimized images and lazy loading
- Skeleton loaders and loading states for better perceived performance

### Accessibility

- Semantic HTML and ARIA labels
- Keyboard navigation support
- Screen reader compatibility

### Mobile-First Design

- Responsive design across all devices
- Touch-friendly interactions
- Optimized mobile checkout flow

### Security

- Secure token handling and storage
- Input validation and sanitization
- Environment variable protection

### Maintainability

- Modular component architecture
- Centralized API services
- Comprehensive error handling
- TypeScript-like JSDoc documentation
