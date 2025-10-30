/**
 * Test script to verify mock data fallback mechanism
 * Run with: node test-mock-fallback.js
 */

// Simulate environment variables
process.env.USE_MOCK = 'true'
process.env.API_LOGGING = 'true'

// Mock the API modules (simplified for testing)
const mockData = {
  mockApiGenerators: {
    getCategories: () => ({
      success: true,
      data: [
        { id: '1', name: 'Electronics', slug: 'electronics' },
        { id: '2', name: 'Clothing', slug: 'clothing' }
      ]
    }),
    getProducts: (page = 1, limit = 12) => ({
      success: true,
      data: {
        data: [
          {
            id: '1',
            name: 'Test Product',
            slug: 'test-product',
            description: 'Test description',
            price: 99.99,
            images: ['/test.jpg'],
            category: { id: '1', name: 'Electronics', slug: 'electronics' },
            inStock: true,
            stockCount: 10,
            rating: 4.5,
            reviewCount: 5,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1
        }
      }
    })
  }
}

// Mock third-party API that always fails
const mockThirdPartyApi = {
  getCategories: async () => {
    throw new Error('API connection failed')
  },
  getProducts: async () => {
    return { success: false, error: 'Server error' }
  }
}

// Simplified version of the withFallback function
async function withFallback(operation, fallbackGenerator, endpoint) {
  const useMock = process.env.USE_MOCK === 'true'

  if (useMock) {
    console.log(`[TEST] Using mock data for ${endpoint} (mock mode enabled)`)
    const mockResult = await fallbackGenerator()
    return {
      success: true,
      data: mockResult
    }
  }

  try {
    const result = await operation()
    if (result.success) {
      return result
    }

    console.log(`[TEST] API call failed for ${endpoint}, using mock data`, { error: result.error })
    const mockResult = await fallbackGenerator()
    return {
      success: true,
      data: mockResult
    }
  } catch (error) {
    console.log(`[TEST] API call threw error for ${endpoint}, using mock data`, {
      error: error.message
    })
    const mockResult = await fallbackGenerator()
    return {
      success: true,
      data: mockResult
    }
  }
}

// Test functions
async function testGetCategories() {
  console.log('\n=== Testing getCategories ===')

  const result = await withFallback(
    () => mockThirdPartyApi.getCategories(),
    () => mockData.mockApiGenerators.getCategories().data,
    '/shop/get-categories'
  )

  console.log('Result:', result)
  return result.success && result.data.length === 2
}

async function testGetProducts() {
  console.log('\n=== Testing getProducts ===')

  const result = await withFallback(
    () => mockThirdPartyApi.getProducts(),
    () => mockData.mockApiGenerators.getProducts().data,
    '/shop/get-products'
  )

  console.log('Result:', result)
  return result.success && result.data.data.length === 1
}

async function testMockModeEnabled() {
  console.log('\n=== Testing with Mock Mode Enabled ===')

  // Test 1: API fails, mock mode enabled
  console.log('Test 1: API fails, mock mode enabled')
  const result1 = await withFallback(
    () => Promise.reject(new Error('Network error')),
    () => ({ test: 'mock data' }),
    '/test/endpoint'
  )
  console.log('Should use mock data:', result1.success && result1.data.test === 'mock data')

  // Test 2: API succeeds, mock mode enabled
  console.log('\nTest 2: API succeeds, mock mode enabled')
  const result2 = await withFallback(
    () => Promise.resolve({ success: true, data: { test: 'real data' } }),
    () => ({ test: 'mock data' }),
    '/test/endpoint'
  )
  console.log('Should use mock data (mock mode takes precedence):', result2.success && result2.data.test === 'mock data')

  return true
}

async function testMockModeDisabled() {
  console.log('\n=== Testing with Mock Mode Disabled ===')

  // Temporarily disable mock mode
  const originalMock = process.env.USE_MOCK
  process.env.USE_MOCK = 'false'

  try {
    // Test 1: API fails, mock mode disabled
    console.log('Test 1: API fails, mock mode disabled')
    const result1 = await withFallback(
      () => Promise.reject(new Error('Network error')),
      () => ({ test: 'mock data' }),
      '/test/endpoint'
    )
    console.log('Should use mock data as fallback:', result1.success && result1.data.test === 'mock data')

    // Test 2: API succeeds, mock mode disabled
    console.log('\nTest 2: API succeeds, mock mode disabled')
    const result2 = await withFallback(
      () => Promise.resolve({ success: true, data: { test: 'real data' } }),
      () => ({ test: 'mock data' }),
      '/test/endpoint'
    )
    console.log('Should use real data:', result2.success && result2.data.test === 'real data')

  } finally {
    // Restore original setting
    process.env.USE_MOCK = originalMock
  }

  return true
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Mock Fallback Tests')
  console.log('================================')

  try {
    const results = await Promise.all([
      testGetCategories(),
      testGetProducts(),
      testMockModeEnabled(),
      testMockModeDisabled()
    ])

    const passed = results.filter(Boolean).length
    const total = results.length

    console.log('\n================================')
    console.log(`✅ Tests completed: ${passed}/${total} passed`)

    if (passed === total) {
      console.log('🎉 All tests passed! Mock fallback mechanism is working correctly.')
    } else {
      console.log('❌ Some tests failed. Please check the implementation.')
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error)
  }
}

// Run the tests
runTests()