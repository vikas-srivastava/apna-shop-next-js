# Mock Mode Documentation

## Overview

This eCommerce application includes a comprehensive mock data fallback system that seamlessly switches to mock data when the real API is unavailable or when mock mode is explicitly enabled. This ensures the application remains functional during development, testing, and production scenarios where the API might be down.

## Features

- **Automatic Fallback**: Automatically switches to mock data when API calls fail
- **Explicit Mock Mode**: Can be enabled via environment variables for testing
- **Comprehensive Coverage**: Mock data for all major API endpoints
- **Realistic Data**: Mock data structure matches actual API responses
- **Performance Monitoring**: Tracks API performance and fallback usage
- **Detailed Logging**: Logs when mock data is used for debugging

## Environment Variables

### NEXT_PUBLIC_USE_MOCK

Controls whether the application should use mock data instead of real API calls.

```bash
# Enable mock mode
NEXT_PUBLIC_USE_MOCK=true

# Disable mock mode (default)
NEXT_PUBLIC_USE_MOCK=false
```

### Other Configuration Variables

```bash
# Cache settings
NEXT_PUBLIC_CACHE_ENABLED=true
NEXT_PUBLIC_CACHE_TTL=300000  # 5 minutes in milliseconds

# Logging settings
NEXT_PUBLIC_API_LOGGING=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Retry settings
NEXT_PUBLIC_MAX_RETRIES=3
```

## Usage Scenarios

### 1. Development with Mock Data

When building new features or testing UI components without a backend:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
```

### 2. API Unavailable Fallback

The system automatically falls back to mock data when:
- Network errors occur
- API returns 5xx errors
- API is completely unreachable
- CORS issues prevent API access

### 3. Testing Different Scenarios

Use mock mode to test various states:
- Empty data responses
- Error conditions
- Loading states
- Pagination scenarios

## Mock Data Coverage

The mock data includes realistic data for all major endpoints:

### Products & Categories
- Categories with hierarchical structure
- Products with variants, pricing, and inventory
- Featured and related products
- Product search and filtering

### Authentication
- User registration and login
- Profile management
- Password reset flows

### Shopping Cart
- Add/remove/update cart items
- Cart totals and calculations
- Cart persistence

### Orders & Checkout
- Order creation and management
- Order history and tracking
- Payment processing simulation

### Content & Reviews
- Blog posts and articles
- Product reviews and ratings
- Content management

### Additional Features
- Wishlist management
- Newsletter subscriptions
- Contact forms
- Brand and manufacturer data

## API Response Structure

All mock responses follow the standard API response format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

## Logging and Monitoring

### Automatic Logging

The system logs when mock data is used:

```
[INFO] Using mock data for /shop/get-products (mock mode enabled)
[WARN] API call failed for /shop/get-products, using mock data
```

### Performance Monitoring

Track API performance metrics:

```javascript
import { getApiPerformanceMetrics } from '@/lib/api'

const metrics = getApiPerformanceMetrics()
// Returns: { averageResponseTime, successRate, metrics[] }
```

## Testing Mock Scenarios

### Manual Testing

1. **Enable Mock Mode**:
   ```bash
   NEXT_PUBLIC_USE_MOCK=true npm run dev
   ```

2. **Simulate API Failures**:
   - Disconnect internet
   - Change API base URL to invalid endpoint
   - Use browser dev tools to block API requests

3. **Test Specific Endpoints**:
   ```javascript
   import { getProducts, getCategories } from '@/lib/api'

   // These will return mock data
   const products = await getProducts()
   const categories = await getCategories()
   ```

### Programmatic Testing

```javascript
import { isMockMode, setMockMode } from '@/lib/api'

// Check if mock mode is active
console.log('Mock mode:', isMockMode())

// Enable/disable mock mode at runtime
setMockMode(true)
```

## Mock Data Customization

### Adding New Mock Data

Edit `src/lib/mock-data.ts` to add new mock data:

```typescript
// Add new mock data
export const mockCustomData = {
  customEndpoint: {
    id: '1',
    name: 'Custom Data',
    value: 'test'
  }
}

// Add generator function
export const mockApiGenerators = {
  // ... existing generators
  getCustomData: () => createMockApiResponse(mockCustomData)
}
```

### Modifying Existing Data

Update the mock data objects in `src/lib/mock-data.ts`:

```typescript
export const mockApiProducts: ApiProduct[] = [
  {
    id: 1,
    name: 'Your Custom Product',
    // ... other properties
  }
  // ... more products
]
```

## Integration with Components

### Using in React Components

```typescript
import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/api'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        if (response.success) {
          setProducts(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Component will work with both real and mock data
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))
      )}
    </div>
  )
}
```

### Context Integration

The mock system works seamlessly with React contexts:

```typescript
// contexts/ProductContext.tsx
import { getProducts } from '@/lib/api'

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const response = await getProducts()
    if (response.success) {
      setProducts(response.data.data)
    }
  }

  // Works with both real API and mock data
  return (
    <ProductContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  )
}
```

## Troubleshooting

### Common Issues

1. **Mock data not loading**:
   - Check `NEXT_PUBLIC_USE_MOCK` environment variable
   - Verify `src/lib/mock-data.ts` syntax
   - Check browser console for errors

2. **API calls still going through**:
   - Ensure environment variable is set correctly
   - Check if API is actually failing (mock only activates on failure when mock mode is off)

3. **Mock data structure mismatch**:
   - Compare mock data structure with API documentation
   - Update mock data to match expected response format

### Debug Mode

Enable detailed logging:

```bash
NEXT_PUBLIC_API_LOGGING=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
```

## Best Practices

1. **Keep Mock Data Realistic**: Ensure mock data closely matches real API responses
2. **Test Both Modes**: Always test with both real API and mock data
3. **Update Mock Data**: Keep mock data updated as API changes
4. **Use for Development**: Leverage mock mode for faster development cycles
5. **Monitor Performance**: Use performance metrics to identify bottlenecks

## File Structure

```
src/
├── lib/
│   ├── api.ts              # Main API service with fallback logic
│   ├── mock-data.ts        # Comprehensive mock data definitions
│   ├── third-party-api.ts  # Real API client
│   └── types.ts           # TypeScript type definitions
├── contexts/               # React contexts using API services
├── hooks/                  # Custom hooks for API operations
└── components/             # UI components
```

## Contributing

When adding new API endpoints:

1. Add mock data to `src/lib/mock-data.ts`
2. Add generator function to `mockApiGenerators`
3. Update API service in `src/lib/api.ts`
4. Test with both mock and real API modes
5. Update this documentation

## Support

For issues with mock mode:
1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Test with a simple API call to isolate the issue
4. Check network tab for API request/response details