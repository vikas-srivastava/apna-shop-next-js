# Module Flows Documentation

This document outlines the key module flows in the eCommerce application, including authentication, cart management, checkout process, payment integrations, and API interactions.

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase
    participant A as Apna Shop API

    U->>F: Login/Register Request
    F->>S: Authenticate with Supabase
    S-->>F: JWT Token + User Data
    F->>A: API Request with Bearer Token
    A-->>F: Authenticated Response
    F-->>U: Login Success + Redirect
```

## Cart Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant C as CartContext
    participant A as API Proxy (/api/cart)
    participant T as Third-party API

    U->>F: Add to Cart
    F->>C: addItem(product, quantity)
    C->>A: POST /api/cart
    A->>T: Forward to /cart/cart
    T-->>A: Success Response
    A-->>C: Cart Updated
    C-->>F: State Updated
    F-->>U: UI Updated
```

## Wishlist Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant W as WishlistContext
    participant A as API Proxy
    participant T as Third-party API

    U->>F: Add to Wishlist
    F->>W: addItem(product)
    W->>W: Check if exists
    W->>A: POST /api/wishlist-add
    A->>T: Forward to /shop/wishlist-add
    T-->>A: Success Response
    A-->>W: Item Added
    W-->>F: State Updated
    F-->>U: Heart Icon Filled
```

## Checkout Process Flow

```mermaid
stateDiagram-v2
    [*] --> Cart: User clicks Checkout
    Cart --> Shipping: Cart has items
    Shipping --> Payment: Shipping details saved
    Payment --> Review: Payment method selected
    Review --> Processing: User confirms order
    Processing --> Confirmation: Order created successfully
    Processing --> Failed: Order creation failed
    Failed --> Review: User can retry
    Confirmation --> [*]: Order complete
```

## Payment Integration Flows

### Razorpay Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Proxy
    participant T as Third-party API
    participant R as Razorpay SDK

    U->>F: Select Razorpay Payment
    F->>A: POST /api/payments/create-razorpay-order
    A->>T: Forward to /shop/create-razorpay-order
    T-->>A: Order ID + Key
    A-->>F: Payment Config
    F->>R: Initialize Razorpay SDK
    R-->>U: Payment Modal
    U->>R: Complete Payment
    R->>F: Payment Success/Failure
    F->>A: POST /api/payments/verify
    A->>T: Forward to /shop/verify-razorpay-payment
    T-->>A: Verification Result
    A-->>F: Payment Confirmed
    F-->>U: Order Success
```

### Stripe Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Proxy
    participant S as Stripe SDK
    participant T as Third-party API

    U->>F: Select Stripe Payment
    F->>A: POST /api/payments/stripe/create-intent
    A->>T: Forward payment intent creation
    T-->>A: Client Secret
    A-->>F: Payment Intent
    F->>S: Initialize Stripe Elements
    S-->>U: Payment Form
    U->>S: Enter card details
    S->>F: Confirm Payment
    F->>A: Verify payment
    A->>T: Forward verification
    T-->>A: Payment confirmed
    A-->>F: Success response
    F-->>U: Order complete
```

### PayPal Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Proxy
    participant P as PayPal SDK
    participant T as Third-party API

    U->>F: Select PayPal Payment
    F->>A: POST /api/payments/paypal/create-order
    A->>T: Forward order creation
    T-->>A: PayPal Order ID
    A-->>F: Order Details
    F->>P: Initialize PayPal Buttons
    P-->>U: PayPal Login Modal
    U->>P: Login & Approve
    P->>F: Payment Approved
    F->>A: Capture payment
    A->>T: Forward capture request
    T-->>A: Payment captured
    A-->>F: Success response
    F-->>U: Order confirmed
```

## API Data Flow Architecture

```mermaid
graph TD
    A[Frontend Components] --> B[React Context]
    B --> C[API Service Layer]
    C --> D{Environment Check}
    D -->|Mock Mode| E[Mock Data Generators]
    D -->|Production| F[API Proxy Routes]
    F --> G[Third-party API]
    G --> H[External Services]
    H --> I[(Databases)]
    H --> J[Payment Gateways]
    H --> K[Shipping Providers]

    E --> L[Mock Responses]
    G --> M[Real API Responses]

    L --> C
    M --> C
    C --> B
    B --> A
```

## Order Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Proxy
    participant T as Third-party API
    participant DB as Database

    U->>F: View Orders
    F->>A: GET /api/orders
    A->>T: Forward to /shop/orders
    T->>DB: Query user orders
    DB-->>T: Order data
    T-->>A: Orders list
    A-->>F: Formatted orders
    F-->>U: Orders display

    U->>F: Create Order
    F->>A: POST /api/orders
    A->>T: Forward to /shop/create-order
    T->>DB: Save order
    DB-->>T: Order created
    T-->>A: Order confirmation
    A-->>F: Success response
    F-->>U: Order confirmation page
```

## Product Search and Filtering Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant P as ProductContext
    participant A as API Proxy
    participant T as Third-party API
    participant S as Search Index

    U->>F: Search/Filter Products
    F->>P: updateFilters/search
    P->>A: GET /api/products?filters=...
    A->>T: Forward to /shop/get-products
    T->>S: Query products
    S-->>T: Filtered results
    T-->>A: Product data
    A-->>F: Formatted products
    F-->>U: Product grid update
```

## Error Handling and Fallback Flow

```mermaid
flowchart TD
    A[User Action] --> B[API Request]
    B --> C{API Response}
    C -->|Success| D[Update UI]
    C -->|Network Error| E[Retry Logic]
    C -->|Server Error| F[Fallback to Mock]
    C -->|Auth Error| G[Redirect to Login]

    E --> H{Max Retries?}
    H -->|No| B
    H -->|Yes| I[Show Error Message]

    F --> J{Mock Available?}
    J -->|Yes| K[Use Mock Data]
    J -->|No| I

    K --> D
    I --> L[Error Boundary]
    G --> M[Login Page]
```

## Third-party Data Storage Integration

```mermaid
graph TD
    subgraph "Frontend Application"
        A[User Interface]
        B[API Service Layer]
        C[Context Providers]
    end

    subgraph "API Proxy Layer (/api/*)"
        D[Next.js API Routes]
        E[Request Forwarding]
        F[Response Normalization]
    end

    subgraph "Third-party Services"
        G[Apna Shop API]
        H[Payment Gateways]
        I[Shipping Providers]
        J[Email Services]
    end

    subgraph "Data Storage"
        K[(User Database)]
        L[(Order Database)]
        M[(Product Catalog)]
        N[(Payment Records)]
        O[(Analytics Data)]
    end

    A --> C
    C --> B
    B --> D
    D --> E
    E --> G
    E --> H
    E --> I
    E --> J

    G --> K
    G --> L
    G --> M
    H --> N
    I --> L
    J --> O

    F --> D
    D --> B
```

## Performance Monitoring Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as API Service
    participant M as Performance Monitor
    participant L as Logger

    F->>A: API Request
    A->>A: Start Timer
    A->>M: Record Request Start
    A->>A: Execute Request
    A->>A: End Timer
    A->>M: Record Metrics
    M->>L: Log Performance Data
    A-->>F: Response
    M->>M: Calculate Averages
```

## Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant T as Token Storage
    participant A as API Proxy
    participant S as Third-party API

    U->>F: Authenticated Request
    F->>T: Get Stored Token
    T-->>F: JWT Token
    F->>A: Request with Authorization Header
    A->>A: Validate Token Format
    A->>S: Forward with Token
    S->>S: Verify Token
    S-->>A: Authenticated Response
    A-->>F: Data
    F-->>U: Secure Content
```

## Caching Strategy Flow

```mermaid
flowchart TD
    A[API Request] --> B{Cache Check}
    B -->|Cache Hit| C[Return Cached Data]
    B -->|Cache Miss| D[Execute API Call]
    D --> E{Response Success?}
    E -->|Yes| F[Cache Response]
    E -->|No| G[Return Error]
    F --> H[Return Data]
    G --> I[Error Handling]
    C --> H
    H --> J[Update UI]
    I --> J
```

This documentation provides a comprehensive overview of the application's module flows, ensuring developers understand the data flow, error handling, and integration patterns throughout the system.

## Developer Onboarding Guide

### Getting Started

1. **Environment Setup**

   - Clone the repository and install dependencies with `npm install`
   - Copy `.env.example` to `.env` and configure API credentials
   - Run `npm run dev` to start the development server

2. **Understanding the Architecture**

   - Review the atomic design component structure in `src/components/`
   - Familiarize yourself with the service layer in `src/lib/`
   - Study the context providers in `src/contexts/`

3. **Key Concepts**
   - **ApiService**: Centralized API client with caching and monitoring
   - **Context Providers**: State management for auth, cart, products
   - **Atomic Design**: Component hierarchy (atoms → molecules → organisms)
   - **API Proxy**: Local `/api/*` routes proxy third-party API calls

### Development Workflow

1. **Feature Development**

   - Create components following atomic design principles
   - Use existing context providers for state management
   - Add API calls through ApiService methods
   - Test with mock data using `NEXT_PUBLIC_USE_MOCK=true`

2. **Code Organization**
   - Place reusable components in appropriate atomic folders
   - Add custom hooks in `src/hooks/`
   - Extend API services in `src/lib/`
   - Update context providers for new state needs

## Common Pitfalls and Solutions

### API Integration Issues

- **CORS Errors**: Always use local `/api/*` routes instead of direct third-party API calls
- **Authentication Failures**: Ensure `X-Tenant` header is set in API requests
- **Token Expiration**: Implement proper token refresh logic in AuthService

### State Management Problems

- **Context Not Updating**: Use proper dependency arrays in useEffect hooks
- **Race Conditions**: Implement optimistic updates with proper rollback
- **Memory Leaks**: Clean up subscriptions and timeouts in useEffect

### Component Architecture Issues

- **Prop Drilling**: Use context providers instead of passing props deeply
- **Re-rendering Issues**: Memoize expensive computations and callbacks
- **Accessibility**: Always include proper ARIA labels and semantic HTML

### Performance Bottlenecks

- **Large Bundle Size**: Lazy load components and use dynamic imports
- **API Call Frequency**: Implement caching and request deduplication
- **Image Loading**: Use Next.js Image component with proper sizing

## Testing Guidelines

### Unit Testing

- **Component Testing**: Test component rendering and user interactions
- **Hook Testing**: Test custom hooks with React Testing Library
- **Service Testing**: Mock API calls and test service methods
- **Utility Testing**: Test validation and calculation functions

### Integration Testing

- **API Integration**: Test complete API flows with mock responses
- **Context Integration**: Test context providers with real components
- **End-to-End Flows**: Test complete user journeys

### Testing Best Practices

- **Mock Data**: Use comprehensive mock data for consistent testing
- **Test Isolation**: Avoid test interdependencies
- **Accessibility Testing**: Include a11y checks in component tests
- **Performance Testing**: Monitor bundle size and runtime performance

### Test File Organization

```
src/
├── __tests__/                    # Test files
│   ├── components/              # Component tests
│   ├── hooks/                   # Hook tests
│   ├── lib/                     # Service tests
│   └── utils/                   # Utility tests
├── __mocks__/                   # Mock implementations
└── test-utils/                  # Testing utilities
```

## Scalability Considerations

### Performance Optimization

- **Code Splitting**: Use dynamic imports for route-based splitting
- **Image Optimization**: Implement responsive images with WebP format
- **Caching Strategy**: Multi-layer caching (memory, localStorage, HTTP)
- **Bundle Analysis**: Monitor bundle size with webpack-bundle-analyzer

### Architecture Scalability

- **Modular Services**: Keep services focused on single responsibilities
- **Context Splitting**: Split large contexts into smaller, focused providers
- **Component Libraries**: Extract reusable components into separate packages
- **API Rate Limiting**: Implement client-side rate limiting for API calls

### Database and API Considerations

- **Request Batching**: Combine multiple API calls when possible
- **Response Compression**: Enable gzip compression for API responses
- **Pagination**: Implement proper pagination for large datasets
- **Real-time Updates**: Consider WebSocket integration for live data

### Monitoring and Analytics

- **Error Tracking**: Implement error boundaries and logging
- **Performance Monitoring**: Track API response times and user interactions
- **User Analytics**: Monitor user behavior and conversion funnels
- **A/B Testing**: Framework for testing UI/UX variations

## Error Handling Best Practices

### Client-Side Error Handling

- **Network Errors**: Implement retry logic with exponential backoff
- **Validation Errors**: Provide clear, actionable error messages
- **Authentication Errors**: Handle token expiration gracefully
- **Offline Mode**: Provide offline functionality with local storage

### Server-Side Error Handling

- **API Errors**: Normalize error responses across different APIs
- **Timeout Handling**: Implement proper request timeouts
- **Rate Limiting**: Handle API rate limits with backoff strategies
- **Fallback Data**: Provide fallback UI states for failed requests

### Error Recovery

- **Automatic Retry**: Implement smart retry logic for transient failures
- **User Feedback**: Show clear error messages with recovery options
- **Graceful Degradation**: Maintain functionality when non-critical features fail
- **Error Boundaries**: Prevent cascading failures in component trees

## Security Considerations

### Authentication Security

- **Token Storage**: Use HttpOnly cookies for sensitive tokens
- **Session Management**: Implement proper session timeout and renewal
- **CSRF Protection**: Include CSRF tokens in state-changing requests
- **Password Policies**: Enforce strong password requirements

### API Security

- **Request Validation**: Validate all input data on client and server
- **Rate Limiting**: Implement client-side rate limiting
- **HTTPS Only**: Ensure all API calls use HTTPS in production
- **Header Security**: Sanitize and validate request headers

### Data Protection

- **Input Sanitization**: Sanitize user inputs to prevent XSS attacks
- **Data Encryption**: Encrypt sensitive data in local storage
- **Privacy Compliance**: Implement GDPR and privacy regulations
- **Audit Logging**: Log security-relevant events

## Testing Guidelines

### Testing Environment Setup

The application supports two testing modes:

- **Mock Mode** (`NEXT_PUBLIC_USE_MOCK=true`): Uses local mock data for development and testing
- **Live Mode** (`NEXT_PUBLIC_USE_MOCK=false`): Connects to live Apna Shop APIs

### Available Test Scripts

#### For Live API Testing (when server is available):

```bash
# Switch to live mode
echo "NEXT_PUBLIC_USE_MOCK=false" > .env

# Run live API tests
node test-live-api.js
```

#### For Application Component Testing:

```bash
# Run comprehensive component tests
node test-application-components.js

# Test running Next.js application
node test-nextjs-app.js
```

### Test Coverage

- **API Integration**: Tests all Apna Shop APIs endpoints
- **Service Layer**: Validates ApiService and AuthService functionality
- **Context Providers**: Tests CartProvider, ProductProvider, and AuthProvider
- **Component Structure**: Verifies atomic design implementation
- **Error Handling**: Tests fallback mechanisms and error recovery
- **Performance**: Monitors API response times and caching effectiveness

### Testing Best Practices

- **Mock First**: Use mock mode for development and unit testing
- **Integration Testing**: Test complete user flows with live data when available
- **Error Scenarios**: Test network failures, API errors, and edge cases
- **Performance Monitoring**: Track API performance and caching effectiveness
- **Accessibility**: Include a11y testing in component validation

## Deployment and DevOps

### Environment Management

- **Environment Variables**: Use different configs for dev/staging/production
- **Feature Flags**: Implement feature toggles for gradual rollouts
- **Configuration Management**: Centralize configuration in environment files
- **Secret Management**: Securely store API keys and secrets

### CI/CD Pipeline

- **Automated Testing**: Run tests on every push and PR
- **Code Quality**: Implement linting and formatting checks
- **Security Scanning**: Regular security vulnerability scans
- **Performance Monitoring**: Track performance regressions

### Monitoring and Alerting

- **Application Monitoring**: Track application health and errors
- **User Monitoring**: Monitor user experience and satisfaction
- **Business Metrics**: Track conversion rates and user engagement
- **Infrastructure Monitoring**: Monitor server and database performance
