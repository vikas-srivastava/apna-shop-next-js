# Module Flows Documentation

This document outlines the key module flows in the eCommerce application, including authentication, cart management, checkout process, payment integrations, and API interactions.

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase
    participant A as Foundry API

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
        G[Foundry eCommerce API]
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
