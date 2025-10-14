# System Architecture

## Overview

This is a Next.js 15 eCommerce frontend application with atomic design architecture, integrated with Apna Shop APIs through a centralized service layer. The system is designed for multi-theme support where themes only affect styling and layout, not functionality.

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

## Theme Architecture

### Theme System Components

1. **Theme Configuration** (`public/theme.yml`)

   - YAML-based theme definitions
   - Color palettes, typography, and spacing
   - Theme metadata (name, type, description)

2. **CSS Variables** (`src/styles/themes.css`)

   - Dynamic CSS custom properties
   - Theme-specific color schemes
   - Fallback values for compatibility

3. **Theme Provider** (`src/components/providers/theme-provider.tsx`)

   - React Context for theme state management
   - Dynamic theme loading from YAML
   - Runtime theme switching

4. **Theme Switcher** (`src/components/molecules/ThemeSwitcher.tsx`)
   - UI component for theme selection
   - Integration with next-themes library
   - Theme persistence

### Theme Loading Flow

```
1. App Initialization
   ↓
2. ThemeProvider loads theme names from /theme.yml
   ↓
3. CSS variables applied via data-theme attribute
   ↓
4. Components use CSS variables for styling
   ↓
5. Theme switcher allows runtime changes
```

## Component Architecture

### Atomic Design Hierarchy

```
Atoms (Basic)
├── Button.tsx          # Basic interactive element
├── Input.tsx           # Form input component
├── Typography.tsx      # Text styling component
├── LoadingSpinner.js   # Loading indicator
└── ErrorMessage.js     # Error display

Molecules (Composite)
├── FormField.js        # Input + ErrorMessage
├── ProductCard.js      # Card + Button + Image
├── HeaderSearchBar.tsx # Search input + button
├── ThemeSwitcher.tsx   # Theme selection UI
└── LoadingState.js     # LoadingSpinner + Message

Organisms (Complex)
├── ProductGrid.tsx     # ProductCard + LoadingState
├── Header.tsx          # Navigation + search + cart
├── Footer.tsx          # Site footer with links
├── ErrorBoundary.tsx   # Error handling wrapper
└── CheckoutSidebar.tsx # Checkout flow components
```

### Component Relationships

- **Atoms**: Pure, reusable UI primitives
- **Molecules**: Combinations of atoms forming functional units
- **Organisms**: Complex components combining molecules
- **Templates**: Page-level layouts using organisms
- **Pages**: Actual page implementations using templates

## State Management

### Context Providers

- **AuthProvider**: User authentication state
- **CartProvider**: Shopping cart items and totals
- **ProductProvider**: Product data and search state
- **CheckoutProvider**: Checkout flow state
- **ThemeProvider**: Theme management
- **WishlistProvider**: Wishlist state

### State Flow

```
User Action → Component → Hook → Context → API
                                      ↓
Response ← Context ← Hook ← Component ← UI Update
```

## API Integration

### Service Layer Pattern

All API calls go through centralized services:

```typescript
// Usage
import { ApiService } from "@/lib/api";
const products = await ApiService.getProducts();
```

### API Architecture

- **ApiService**: Main service class with caching and monitoring
- **ThirdPartyApi**: Direct API integration functions
- **Mock Data**: Fallback data for development/testing
- **Circuit Breaker**: Failure detection and recovery
- **Rate Limiting**: API request throttling

### Request Flow

```
Component → Hook → ApiService → CircuitBreaker → ThirdPartyApi → External API
                                      ↓
Response ← ApiService ← Hook ← Component ← UI Update
```

## Design Patterns

### Service Layer Pattern

Centralized API operations with consistent error handling:

```typescript
class ApiService {
  static async getProducts(): Promise<ApiResponse<Product[]>> {
    // Implementation with caching, monitoring, fallbacks
  }
}
```

### Context Provider Pattern

Global state management with React Context:

```typescript
<AuthProvider>
  <CartProvider>
    <ProductProvider>
      <App />
    </ProductProvider>
  </CartProvider>
</AuthProvider>
```

### Custom Hook Pattern

Business logic encapsulation:

```typescript
const { login, loading, error } = useAuth();
const { addItem, removeItem } = useCart();
const { products, fetchProducts } = useProducts();
```

### Validation and Calculation Classes

Complex business logic separation:

```typescript
class CartValidator {
  static validateProduct(product: Product): ValidationResult;
}

class CartCalculator {
  static calculateTotal(items: CartItem[]): number;
}
```

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

### Theme Switching Flow

1. User selects theme from switcher
2. `ThemeProvider.setTheme()` updates context
3. `data-theme` attribute changes on document
4. CSS variables update automatically
5. Components re-render with new theme

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

## Theme vs Core Separation

### Core Functionality (Theme Agnostic)

- API integration and data fetching
- Business logic and state management
- Component structure and props
- TypeScript types and interfaces
- Error handling and validation

### Theme-Specific Elements

- Color schemes and CSS variables
- Typography and spacing
- Component styling and layout
- Visual design elements
- Theme-specific assets

### Separation Benefits

- **Maintainability**: Core logic changes don't affect themes
- **Scalability**: New themes can be added without touching core code
- **Consistency**: All themes share the same functionality
- **Performance**: Theme switching is CSS-only, no JavaScript re-renders

## Deployment Architecture

### Vercel Deployment

- Environment variables configured in Vercel dashboard
- CORS headers set in `next.config.mjs`
- Static assets served from `public/` directory

### API Proxy Strategy

- Next.js API routes proxy Apna Shop API calls
- Eliminates CORS issues in production
- Server-side API calls from `/api/*` routes

## Development Workflow

### Theme Development

1. Add theme definition to `public/theme.yml`
2. Add CSS variables to `src/styles/themes.css`
3. Test theme switching functionality
4. Ensure responsive design across breakpoints

### Component Development

1. Follow atomic design principles
2. Use TypeScript for type safety
3. Implement proper error boundaries
4. Add loading states and accessibility features

### API Integration

1. Add methods to `ApiService` class
2. Implement in `third-party-api.ts`
3. Add mock data for testing
4. Update TypeScript types

This architecture ensures that themes are purely presentational while maintaining a robust, scalable core application.
