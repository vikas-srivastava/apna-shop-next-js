/**
 * Comprehensive mock data for e-commerce API endpoints
 * Provides realistic fallback data when API is unavailable or in mock mode
 */

import { ApiProduct, Category, Product, User, Order, OrderItem, Review, WishlistItem, Address, ApiResponse, CartItem } from './types'

// In-memory storage for mock operations
export const mockStorage = {
  cart: new Map<string, CartItem[]>(),
  orders: new Map<string, Order>(),
  addresses: new Map<string, Address[]>(),
  payments: new Map<string, any>()
}

// Initialize with default data
const defaultCartItems: CartItem[] = [
  {
    id: '1',
    product_id: 1,
    product_quantity: 2,
    product_name: 'Wireless Bluetooth Headphones',
    product_price: '299.99',
    product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    product_id: 3,
    product_quantity: 1,
    product_name: 'Cotton T-Shirt',
    product_price: '24.99',
    product_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
  }
]

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    phone: '+1234567890',
    isDefault: true
  },
  {
    id: 'addr-2',
    firstName: 'John',
    lastName: 'Doe',
    address1: '456 Business Ave',
    address2: 'Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'USA',
    phone: '+1234567890',
    isDefault: false
  }
]

// Initialize storage with default data
mockStorage.cart.set('default-user', defaultCartItems)
mockStorage.addresses.set('default-user', defaultAddresses)

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all occasions',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: '3',
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: '4',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: '5',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
  }
]

// Mock API Products (matching the actual API response structure)
export const mockApiProducts: ApiProduct[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: '299.99',
    old_price: '349.99',
    qty: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'],
    brand: {
      id: 1,
      name: 'AudioTech',
      slug: 'audiotech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity.',
    price: '199.99',
    old_price: null,
    qty: 15,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'],
    brand: {
      id: 2,
      name: 'FitTech',
      slug: 'fittech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      },
      {
        id: 5,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      }
    ]
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
    price: '24.99',
    old_price: '29.99',
    qty: 50,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'],
    brand: {
      id: 3,
      name: 'ComfortWear',
      slug: 'comfortwear'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      }
    ]
  },
  {
    id: 4,
    name: '4K Ultra HD Smart TV',
    slug: '4k-ultra-hd-smart-tv',
    description: '55-inch 4K Ultra HD Smart TV with HDR, built-in streaming apps, and voice control.',
    price: '799.99',
    old_price: '899.99',
    qty: 8,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'],
    brand: {
      id: 4,
      name: 'VisionTech',
      slug: 'visiontech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 5,
    name: 'Professional DSLR Camera',
    slug: 'professional-dslr-camera',
    description: '24MP DSLR camera with 4K video recording, interchangeable lenses, and advanced autofocus.',
    price: '1299.99',
    old_price: null,
    qty: 5,
    images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'],
    brand: {
      id: 5,
      name: 'PhotoPro',
      slug: 'photopro'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 6,
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.',
    price: '79.99',
    old_price: '99.99',
    qty: 30,
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop'],
    brand: {
      id: 6,
      name: 'GameGear',
      slug: 'gamegear'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 7,
    name: 'Designer Denim Jeans',
    slug: 'designer-denim-jeans',
    description: 'Premium quality designer denim jeans with perfect fit and comfortable stretch fabric.',
    price: '89.99',
    old_price: null,
    qty: 40,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
    brand: {
      id: 7,
      name: 'StyleCo',
      slug: 'styleco'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      }
    ]
  },
  {
    id: 8,
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    description: 'Lightweight running sneakers with advanced cushioning and breathable mesh upper.',
    price: '129.99',
    old_price: '149.99',
    qty: 25,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
    brand: {
      id: 8,
      name: 'RunFit',
      slug: 'runfit'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      },
      {
        id: 5,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      }
    ]
  },
  {
    id: 9,
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Genuine leather crossbody bag with adjustable strap and multiple compartments.',
    price: '159.99',
    old_price: null,
    qty: 15,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
    brand: {
      id: 9,
      name: 'LeatherLux',
      slug: 'leatherlux'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      }
    ]
  },
  {
    id: 10,
    name: 'JavaScript Programming Book',
    slug: 'javascript-programming-book',
    description: 'Comprehensive guide to modern JavaScript programming with practical examples and exercises.',
    price: '39.99',
    old_price: '49.99',
    qty: 60,
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'],
    brand: {
      id: 10,
      name: 'TechBooks',
      slug: 'techbooks'
    },
    categories: [
      {
        id: 3,
        name: 'Books',
        slug: 'books'
      }
    ]
  },
  {
    id: 11,
    name: 'Garden Hose Set',
    slug: 'garden-hose-set',
    description: '25-foot expandable garden hose with spray nozzle and storage bracket.',
    price: '34.99',
    old_price: null,
    qty: 35,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop'],
    brand: {
      id: 11,
      name: 'GardenPro',
      slug: 'gardenpro'
    },
    categories: [
      {
        id: 4,
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    ]
  },
  {
    id: 12,
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip yoga mat with carrying strap, perfect for home and studio workouts.',
    price: '29.99',
    old_price: '39.99',
    qty: 45,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'],
    brand: {
      id: 12,
      name: 'ZenFit',
      slug: 'zenfit'
    },
    categories: [
      {
        id: 5,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      }
    ]
  },
  {
    id: 13,
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    price: '49.99',
    old_price: null,
    qty: 20,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'],
    brand: {
      id: 1,
      name: 'AudioTech',
      slug: 'audiotech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 14,
    name: 'Winter Jacket',
    slug: 'winter-jacket',
    description: 'Warm and stylish winter jacket with water-resistant fabric and insulated lining.',
    price: '149.99',
    old_price: '179.99',
    qty: 18,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
    brand: {
      id: 3,
      name: 'ComfortWear',
      slug: 'comfortwear'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      }
    ]
  },
  {
    id: 15,
    name: 'Coffee Maker',
    slug: 'coffee-maker',
    description: '12-cup programmable coffee maker with thermal carafe and auto-shutoff feature.',
    price: '89.99',
    old_price: null,
    qty: 12,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'],
    brand: {
      id: 13,
      name: 'HomeEssentials',
      slug: 'homeessentials'
    },
    categories: [
      {
        id: 4,
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    ]
  },
  {
    id: 16,
    name: 'Dumbbell Set',
    slug: 'dumbbell-set',
    description: 'Adjustable dumbbell set with weights from 5-50 lbs, perfect for home workouts.',
    price: '199.99',
    old_price: '249.99',
    qty: 8,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'],
    brand: {
      id: 2,
      name: 'FitTech',
      slug: 'fittech'
    },
    categories: [
      {
        id: 5,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      }
    ]
  },
  {
    id: 17,
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    description: 'True wireless earbuds with active noise cancellation and 8-hour battery life.',
    price: '149.99',
    old_price: null,
    qty: 22,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop'],
    brand: {
      id: 1,
      name: 'AudioTech',
      slug: 'audiotech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  },
  {
    id: 18,
    name: 'Throw Blanket',
    slug: 'throw-blanket',
    description: 'Ultra-soft fleece throw blanket, perfect for couch or bed, machine washable.',
    price: '19.99',
    old_price: '24.99',
    qty: 55,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
    brand: {
      id: 13,
      name: 'HomeEssentials',
      slug: 'homeessentials'
    },
    categories: [
      {
        id: 4,
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    ]
  },
  {
    id: 19,
    name: 'Python Programming Book',
    slug: 'python-programming-book',
    description: 'Learn Python programming from basics to advanced concepts with real-world projects.',
    price: '44.99',
    old_price: null,
    qty: 28,
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'],
    brand: {
      id: 10,
      name: 'TechBooks',
      slug: 'techbooks'
    },
    categories: [
      {
        id: 3,
        name: 'Books',
        slug: 'books'
      }
    ]
  },
  {
    id: 20,
    name: 'Camping Tent',
    slug: 'camping-tent',
    description: '4-person waterproof camping tent with easy setup and durable construction.',
    price: '179.99',
    old_price: '199.99',
    qty: 10,
    images: ['https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=400&fit=crop'],
    brand: {
      id: 14,
      name: 'OutdoorGear',
      slug: 'outdoorgear'
    },
    categories: [
      {
        id: 5,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      }
    ]
  },
  {
    id: 21,
    name: 'Tablet Stand',
    slug: 'tablet-stand',
    description: 'Adjustable aluminum tablet stand with multiple viewing angles and cable management.',
    price: '29.99',
    old_price: null,
    qty: 40,
    images: ['https://images.unsplash.com/photo-1587614295999-6c1f4c4e98c8?w=400&h=400&fit=crop'],
    brand: {
      id: 4,
      name: 'VisionTech',
      slug: 'visiontech'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      },
      {
        id: 4,
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    ]
  },
  {
    id: 22,
    name: 'Sunglasses',
    slug: 'designer-sunglasses',
    description: 'Polarized designer sunglasses with UV protection and lightweight titanium frame.',
    price: '89.99',
    old_price: '109.99',
    qty: 30,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'],
    brand: {
      id: 7,
      name: 'StyleCo',
      slug: 'styleco'
    },
    categories: [
      {
        id: 2,
        name: 'Clothing',
        slug: 'clothing'
      }
    ]
  },
  {
    id: 23,
    name: 'Wall Art Print',
    slug: 'wall-art-print',
    description: 'Beautiful framed wall art print, ready to hang, adds style to any room.',
    price: '49.99',
    old_price: null,
    qty: 20,
    images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop'],
    brand: {
      id: 15,
      name: 'ArtisanDecor',
      slug: 'artisandecor'
    },
    categories: [
      {
        id: 4,
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    ]
  }
]
// Database-style indexes for optimized queries
export const productIndexes = {
  categoryIndex: new Map<string, ApiProduct[]>(),
  priceIndex: new Map<string, ApiProduct[]>(),
  ratingIndex: new Map<number, ApiProduct[]>(),
  searchIndex: new Map<string, ApiProduct[]>(),
  brandIndex: new Map<string, ApiProduct[]>(),
  inStockIndex: new Map<boolean, ApiProduct[]>()
}

// Initialize indexes
function initializeIndexes() {
  // Category index
  mockApiProducts.forEach(product => {
    product.categories.forEach(category => {
      if (!productIndexes.categoryIndex.has(category.id.toString())) {
        productIndexes.categoryIndex.set(category.id.toString(), [])
      }
      productIndexes.categoryIndex.get(category.id.toString())!.push(product)
    })
  })

  // Price index (buckets: 0-50, 50-100, 100-200, 200-500, 500+)
  const priceBuckets = ['0-50', '50-100', '100-200', '200-500', '500+']
  mockApiProducts.forEach(product => {
    const price = parseFloat(product.price)
    let bucket = '500+'
    if (price < 50) bucket = '0-50'
    else if (price < 100) bucket = '50-100'
    else if (price < 200) bucket = '100-200'
    else if (price < 500) bucket = '200-500'

    if (!productIndexes.priceIndex.has(bucket)) {
      productIndexes.priceIndex.set(bucket, [])
    }
    productIndexes.priceIndex.get(bucket)!.push(product)
  })

  // Rating index (simulate ratings: even IDs get 4.5, odd get 3.5)
  mockApiProducts.forEach(product => {
    const rating = product.id % 2 === 0 ? 4.5 : 3.5
    if (!productIndexes.ratingIndex.has(rating)) {
      productIndexes.ratingIndex.set(rating, [])
    }
    productIndexes.ratingIndex.get(rating)!.push(product)
  })

  // Search index (tokenize name, description, brand)
  mockApiProducts.forEach(product => {
    const searchText = `${product.name} ${product.description} ${product.brand.name}`.toLowerCase()
    const tokens = searchText.split(/\s+/).filter(token => token.length > 2)
    tokens.forEach(token => {
      if (!productIndexes.searchIndex.has(token)) {
        productIndexes.searchIndex.set(token, [])
      }
      productIndexes.searchIndex.get(token)!.push(product)
    })
  })

  // Brand index
  mockApiProducts.forEach(product => {
    const brandId = product.brand.id.toString()
    if (!productIndexes.brandIndex.has(brandId)) {
      productIndexes.brandIndex.set(brandId, [])
    }
    productIndexes.brandIndex.get(brandId)!.push(product)
  })

  // In-stock index
  mockApiProducts.forEach(product => {
    const inStock = product.qty > 0
    if (!productIndexes.inStockIndex.has(inStock)) {
      productIndexes.inStockIndex.set(inStock, [])
    }
    productIndexes.inStockIndex.get(inStock)!.push(product)
  })
}

// Initialize indexes on module load
initializeIndexes()


// Mock User Data
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  email_verified_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  customer: {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1234567890',
    gender: 'male'
  }
}

// Mock Auth Responses
export const mockAuthResponses = {
  register: {
    user: 'User registered successfully',
    customer_id: '1'
  },
  login: {
    user: 'Login successful',
    customer_id: '1'
  },
  profile: {
    user: JSON.stringify(mockUser),
    role: 'customer',
    tenant_id: 'tenant123'
  }
}

// Mock Cart Data
export const mockCart = {
  items: JSON.stringify([
    {
      id: '1',
      product_id: 1,
      product_quantity: 2,
      product_name: 'Wireless Bluetooth Headphones',
      product_price: '299.99',
      product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      product_id: 3,
      product_quantity: 1,
      product_name: 'Cotton T-Shirt',
      product_price: '24.99',
      product_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    }
  ]),
  total: '624.97'
}

// Mock Orders
export const mockOrders = [
  {
    id: 'ORD-001',
    orderNumber: 'ORD-001',
    userId: '1',
    items: [
      {
        id: 'item-1',
        productId: '1',
        product: mockApiProducts[0] as any,
        quantity: 1,
        price: 299.99
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true
    },
    billingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true
    },
    subtotal: 299.99,
    shipping: 10.00,
    tax: 24.00,
    total: 333.99,
    status: 'delivered' as const,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Helper function to get mock API response
export function createMockApiResponse<T>(data: T, success = true, message?: string): ApiResponse<T> {
  return {
    success,
    data,
    message: message || (success ? 'Success' : 'Error occurred')
  }
}

// Helper function to simulate API delay
export function mockApiDelay(minMs = 200, maxMs = 800): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Mock API response generators
export const mockApiGenerators = {
  getCategories: () => createMockApiResponse(mockCategories),
  getProducts: (page = 1, limit = 12, filters: Partial<any> = {}) => {
    let filteredProducts = [...mockApiProducts]

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some((cat: any) => cat.id.toString() === filters.category)
      )
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.name.toLowerCase().includes(searchTerm)
      )
    }

    // Apply price range filter
    if (filters.priceRange && (filters.priceRange.min !== undefined || filters.priceRange.max !== undefined)) {
      const minPrice = filters.priceRange.min || 0
      const maxPrice = filters.priceRange.max || Number.MAX_VALUE
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price)
        return price >= minPrice && price <= maxPrice
      })
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      // Since mock products don't have ratings, we'll simulate based on product ID
      // Products with even IDs get higher ratings
      filteredProducts = filteredProducts.filter(product =>
        (product.id % 2 === 0 ? 4.5 : 3.5) >= filters.rating
      )
    }

    // Apply in stock filter
    if (filters.inStock === true) {
      filteredProducts = filteredProducts.filter(product => product.qty > 0)
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(a.price)
        const priceB = parseFloat(b.price)

        switch (filters.sortBy) {
          case 'price-asc':
            return priceA - priceB
          case 'price-desc':
            return priceB - priceA
          case 'rating':
            // Simulate rating sort (even IDs = higher rating)
            return (b.id % 2) - (a.id % 2)
          case 'newest':
          default:
            return b.id - a.id // Newest first by ID
        }
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return createMockApiResponse({
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    })
  },
  getProduct: (slug: string) => {
    const product = mockApiProducts.find(p => p.slug === slug)
    return product ? createMockApiResponse(product) : createMockApiResponse(null, false, 'Product not found')
  },
  getFeaturedProducts: (limit = 6) => {
    // Feature exactly 4 products on home page (when limit is 6), allow custom limits for other uses
    const featuredCount = limit === 6 ? 4 : limit
    const featuredProducts = mockApiProducts.slice(0, featuredCount)
    return createMockApiResponse(featuredProducts)
  },
  registerUser: () => createMockApiResponse(mockAuthResponses.register),
  loginUser: () => createMockApiResponse(mockAuthResponses.login),
  getUserProfile: () => createMockApiResponse(mockAuthResponses.profile),
  getCart: () => createMockApiResponse(mockCart),
  getCartTotal: () => createMockApiResponse({ total: mockCart.total }),
  addToCart: () => createMockApiResponse('Product added to cart successfully'),
  updateCartItem: () => createMockApiResponse('Cart item updated successfully'),
  removeCartItem: () => createMockApiResponse(null),
  getOrders: () => createMockApiResponse(mockOrders),
  createOrder: () => createMockApiResponse({ order_id: 'ORD-123', message: 'Order created successfully' }),
  createRazorpayOrder: () => createMockApiResponse({ id: 'order_123', amount: 1000, currency: 'INR' }),
  verifyRazorpayPayment: () => createMockApiResponse({ status: 'success', payment_id: 'pay_123' }),
  getShippingRates: () => createMockApiResponse([
    {
      id: 'rate-1',
      provider: 'Delhivery',
      service: 'Standard Delivery',
      cost: 50.00,
      estimatedDays: 3,
      weightLimit: 5.0
    },
    {
      id: 'rate-2',
      provider: 'DTDC',
      service: 'Express Delivery',
      cost: 80.00,
      estimatedDays: 2,
      weightLimit: 5.0
    },
    {
      id: 'rate-3',
      provider: 'ShipRocket',
      service: 'Premium Delivery',
      cost: 120.00,
      estimatedDays: 1,
      weightLimit: 10.0
    }
  ]),
  getShippingProviders: () => createMockApiResponse([
    {
      id: 'delhivery',
      name: 'Delhivery',
      services: ['Standard Delivery', 'Express Delivery'],
      trackingUrl: 'https://www.delhivery.com/track',
      logo: '/shipping/delhivery-logo.png'
    },
    {
      id: 'dtdc',
      name: 'DTDC',
      services: ['Standard Delivery', 'Express Delivery', 'Premium Delivery'],
      trackingUrl: 'https://www.dtdc.in/tracking.asp',
      logo: '/shipping/dtdc-logo.png'
    },
    {
      id: 'shiprocket',
      name: 'ShipRocket',
      services: ['Standard Delivery', 'Express Delivery', 'Premium Delivery', 'Same Day'],
      trackingUrl: 'https://shiprocket.co/tracking',
      logo: '/shipping/shiprocket-logo.png'
    }
  ]),
  getOrderShipments: () => createMockApiResponse([
    {
      id: 'ship-001',
      orderId: 'ORD-001',
      trackingNumber: 'DLV123456789',
      provider: 'Delhivery',
      status: 'in_transit',
      shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      trackingEvents: [
        {
          status: 'picked_up',
          location: 'Mumbai Warehouse',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Package picked up from warehouse'
        },
        {
          status: 'in_transit',
          location: 'Delhi Transit Center',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Package in transit to destination'
        }
      ]
    }
  ]),
  trackOrder: () => createMockApiResponse({
    orderNumber: 'ORD-001',
    trackingNumber: 'DLV123456789',
    status: 'in_transit',
    provider: 'Delhivery',
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    trackingEvents: [
      {
        status: 'picked_up',
        location: 'Mumbai Warehouse',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package picked up from warehouse'
      },
      {
        status: 'in_transit',
        location: 'Delhi Transit Center',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package in transit to destination'
      }
    ]
  })
}