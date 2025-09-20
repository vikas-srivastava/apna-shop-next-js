# System Architecture

## Overview

This is a Next.js 15 eCommerce frontend application with atomic design architecture, integrated with Foundry eCommerce API through a centralized service layer.

## Source Code Structure

### Core Directories

```
app/
├── components/           # Reusable UI components (atomic design)
│   ├── atoms/           # Basic components (Button, Input, Card)
│   ├── molecules/       # Composite components (FormField, ProductCard)
│   └── organisms/       # Complex components (ProductGrid, ErrorBoundary)
├── hooks/               # Custom React hooks for API operations
├── services/            # API service layer (axios clients)
├── context/             # React Context providers for state management
├── sections/            # Page sections (Hero, About, FAQ)
└── [page]/              # Next.js app router pages

context/                 # Global context providers
public/                  # Static assets and images
```

### Key Files

- `app/services/apiService.js` - Centralized API client with all Foundry eCommerce endpoints
- `context/AuthContext.js` - Authentication state management
- `context/CartContext.js` - Shopping cart state
- `context/ProductContext.js` - Product data state
- `next.config.mjs` - CORS configuration and build settings
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

All API calls go through centralized services in `app/services/apiService.js`:

```javascript
// Usage
import { productService } from "./services/apiService";
const products = await productService.getProducts();
```

### Context Provider Pattern

State is managed through React Context providers:

```javascript
// App layout
<AuthProvider>
  <CartProvider>
    <ProductProvider>
      <App />
    </ProductProvider>
  </CartProvider>
</AuthProvider>
```

### Custom Hook Pattern

Business logic is encapsulated in custom hooks:

```javascript
// Usage
const { login, loading, error } = useAuth();
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

- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart items and totals
- **ProductContext**: Manages product data and search state

## Critical Implementation Paths

### Authentication Flow

1. User submits login form
2. `AuthContext.login()` calls `authService.login()`
3. Success: Store user data in cookies and context
4. Failure: Display error message

### Product Loading Flow

1. Page component mounts
2. `useProducts` hook calls `productService.getProducts()`
3. Data stored in `ProductContext`
4. Components re-render with new data

### Cart Operations Flow

1. User clicks "Add to Cart"
2. `CartContext.addToCart()` calls `cartService.addToCart()`
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

- Next.js API routes will proxy Foundry API calls
- Eliminates CORS issues in production
- Server-side API calls from `/api/*` routes
