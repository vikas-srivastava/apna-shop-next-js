# System Architecture

## Overview

This is a Next.js 15 eCommerce frontend application with atomic design architecture, integrated with Apna Shop APIs through a centralized service layer.

## Source Code Structure

### Core Directories

```
src/
├── app/                 # Next.js app router pages and API routes
│   ├── api/            # API proxy routes for third-party integration
│   ├── components/     # Reusable UI components (atomic design)
│   │   ├── atoms/     # Basic components (Button, Input, Card)
│   │   ├── molecules/ # Composite components (FormField, ProductCard)
│   │   ├── organisms/ # Complex components (ProductGrid, ErrorBoundary)
│   │   ├── templates/ # Page templates
│   │   └── ui/        # Shared UI components
│   ├── contexts/      # React Context providers for state management
│   ├── hooks/         # Custom React hooks for API operations
│   ├── lib/           # Utility libraries and services
│   └── pages/         # Legacy pages router (minimal usage)
├── components/         # Additional component libraries
│   ├── auth/          # Authentication components
│   ├── checkout/      # Checkout flow components
│   └── organisms/     # Additional organisms
├── contexts/           # Global context providers
├── hooks/              # Additional custom hooks
├── lib/                # Core utilities and services
│   ├── api.ts         # Enhanced API service with caching and monitoring
│   ├── auth-service.ts # Authentication service
│   ├── third-party-api.ts # Third-party API integration
│   ├── types.ts       # TypeScript type definitions
│   └── mock-data.ts   # Mock data for testing
├── public/             # Static assets and images
└── docs/               # Documentation files
```

### Key Files

- `src/lib/api.ts` - ApiService class: Centralized API client with caching, monitoring, and error handling
- `src/lib/auth-service.ts` - AuthService class: Authentication service with localStorage persistence
- `src/lib/third-party-api.ts` - Third-party API integration functions
- `src/contexts/CartContext.tsx` - CartProvider component: Shopping cart state with CartValidator, CartCalculator, CartPersistence classes
- `src/contexts/ProductContext.tsx` - ProductProvider component: Product data state management
- `src/contexts/CheckoutContext.tsx` - CheckoutProvider component: Checkout flow state
- `src/contexts/ThemeContext.tsx` - ThemeProvider component: Theme management
- `src/contexts/WishlistContext.tsx` - WishlistProvider component: Wishlist state
- `src/components/auth/AuthProvider.tsx` - AuthProvider component: Authentication UI state
- `src/components/auth/SupabaseAuthProvider.tsx` - SupabaseAuthProvider component: Supabase authentication
- `next.config.ts` - Next.js configuration with CORS and build settings
- `.env` - Environment variables for API configuration

## Technical Decisions

### Frontend Framework

- **Next.js 15** with App Router for modern React development
- **React 19** for latest features and performance improvements
- **Tailwind CSS** for utility-first styling

### State Management

- **React Context API** for global state (Auth, Cart, Products)
- **Custom hooks** for API operations and business logic
- **Cookies** for client-side persistence

### API Integration

- **Axios** for HTTP client with interceptors
- **Centralized service layer** with error handling
- **Environment-based configuration** for different deployments

### Component Architecture

- **Atomic Design** (Atoms → Molecules → Organisms)
- **Reusable components** with consistent props interface
- **Error boundaries** for graceful error handling

## Design Patterns

### Service Layer Pattern

All API calls go through centralized services in `src/lib/api.ts` and `src/lib/auth-service.ts`:

```typescript
// Usage
import { ApiService } from "@/lib/api";
const products = await ApiService.getProducts();

import { AuthService } from "@/lib/auth-service";
await AuthService.login(email, password);
```

### Context Provider Pattern

State is managed through React Context providers with enhanced functionality:

```typescript
// App layout
<AuthProvider>
  <CartProvider>
    <ProductProvider>
      <CheckoutProvider>
        <App />
      </CheckoutProvider>
    </ProductProvider>
  </CartProvider>
</AuthProvider>
```

### Custom Hook Pattern

Business logic is encapsulated in custom hooks with TypeScript support:

```typescript
// Usage
const { login, loading, error } = useAuth();
const { addItem, removeItem } = useCart();
const { products, fetchProducts } = useProducts();
```

### Validation and Calculation Classes

Complex business logic is separated into dedicated classes:

```typescript
// Cart validation and calculations
class CartValidator {
  static validateProduct(product: Product): { valid: boolean; error?: string };
  static validateQuantity(
    quantity: number,
    maxStock?: number
  ): { valid: boolean; error?: string };
}

class CartCalculator {
  static calculateTotal(items: CartItem[]): number;
  static calculateItemCount(items: CartItem[]): number;
}

class CartPersistence {
  static save(cartState: CartState): void;
  static load(): CartState | null;
}
```

## Component Relationships

### Atomic Design Hierarchy

```
Atoms (Basic)
├── Button.js
├── Input.js
├── Card.js
├── LoadingSpinner.js
└── ErrorMessage.js

Molecules (Composite)
├── FormField.js (Input + ErrorMessage)
├── ProductCard.js (Card + Button + Image)
└── LoadingState.js (LoadingSpinner + Message)

Organisms (Complex)
├── ProductGrid.js (ProductCard + LoadingState)
├── ErrorBoundary.js (Error handling wrapper)
└── ServerProductGrid.js (SSR ProductGrid)
```

### Context Dependencies

- **AuthProvider**: Manages user authentication state with AuthService integration
- **CartProvider**: Manages shopping cart items and totals with CartValidator, CartCalculator, CartPersistence classes
- **ProductProvider**: Manages product data and search state with ApiService integration
- **CheckoutProvider**: Manages checkout flow state
- **ThemeProvider**: Manages theme state
- **WishlistProvider**: Manages wishlist state

## Critical Implementation Paths

### Authentication Flow

1. User submits login form
2. `AuthProvider.login()` calls `AuthService.login()`
3. Success: Store user data in localStorage and context
4. Failure: Display error message

### Product Loading Flow

1. Page component mounts
2. `useProducts` hook calls `ApiService.getProducts()`
3. Data stored in `ProductProvider`
4. Components re-render with new data

### Cart Operations Flow

1. User clicks "Add to Cart"
2. `CartProvider.addItem()` calls `ApiService.addToCart()`
3. Cart state updated locally and synced with API
4. UI reflects changes immediately

## Data Flow Architecture

### Unidirectional Data Flow

```
User Action → Component → Hook → Service → API
                                      ↓
Response ← Service ← Hook ← Component ← UI Update
```

### State Synchronization

- Local state updated optimistically for better UX
- API calls made in background to sync with server
- Error handling for failed operations

## Deployment Architecture

### Vercel Deployment

- Environment variables configured in Vercel dashboard
- CORS headers set in `next.config.mjs`
- Static assets served from `public/` directory

### API Proxy Strategy (Planned)

- Next.js API routes will proxy Apna Shop API calls
- Eliminates CORS issues in production
- Server-side API calls from `/api/*` routes
