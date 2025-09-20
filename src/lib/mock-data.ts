/**
 * Comprehensive mock data for e-commerce API endpoints
 * Provides realistic fallback data when API is unavailable or in mock mode
 */

import { ApiProduct, Category, Product, User, Order, OrderItem, Review, WishlistItem, Address, ApiResponse } from './types'

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
    name: 'Programming Book',
    slug: 'programming-book',
    description: 'Comprehensive guide to modern web development with practical examples.',
    price: '49.99',
    old_price: null,
    qty: 30,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
    brand: {
      id: 4,
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
    id: 5,
    name: 'Garden Tools Set',
    slug: 'garden-tools-set',
    description: 'Complete set of essential gardening tools for home and professional use.',
    price: '89.99',
    old_price: '99.99',
    qty: 20,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48b60103fc96?w=400&h=400&fit=crop'],
    brand: {
      id: 5,
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
    id: 6,
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip yoga mat with excellent cushioning and eco-friendly materials.',
    price: '39.99',
    old_price: null,
    qty: 40,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'],
    brand: {
      id: 6,
      name: 'ZenFitness',
      slug: 'zenfitness'
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
    id: 7,
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Latest iPhone with Pro camera system, A17 Pro chip, and titanium design.',
    price: '999.99',
    old_price: '1099.99',
    qty: 15,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'],
    brand: {
      id: 7,
      name: 'Apple',
      slug: 'apple'
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
    id: 8,
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Flagship Android smartphone with AI features and premium display.',
    price: '799.99',
    old_price: null,
    qty: 20,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'],
    brand: {
      id: 8,
      name: 'Samsung',
      slug: 'samsung'
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
    id: 9,
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Iconic sneakers with visible Air cushioning and modern design.',
    price: '149.99',
    old_price: '179.99',
    qty: 30,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'],
    brand: {
      id: 9,
      name: 'Nike',
      slug: 'nike'
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
    id: 10,
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Professional laptop with M3 chip, stunning Liquid Retina XDR display.',
    price: '2499.99',
    old_price: null,
    qty: 8,
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'],
    brand: {
      id: 7,
      name: 'Apple',
      slug: 'apple'
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
    id: 11,
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise canceling wireless headphones with premium sound.',
    price: '349.99',
    old_price: '399.99',
    qty: 12,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'],
    brand: {
      id: 10,
      name: 'Sony',
      slug: 'sony'
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
    id: 12,
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'Running shoes with responsive Boost technology and superior comfort.',
    price: '189.99',
    old_price: null,
    qty: 25,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'],
    brand: {
      id: 11,
      name: 'Adidas',
      slug: 'adidas'
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
    id: 13,
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    description: 'Ultra-portable laptop with InfinityEdge display and premium build quality.',
    price: '1299.99',
    old_price: '1399.99',
    qty: 10,
    images: ['https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'],
    brand: {
      id: 12,
      name: 'Dell',
      slug: 'dell'
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
    name: 'Levi\'s 501 Jeans',
    slug: 'levis-501-jeans',
    description: 'Classic straight fit jeans with the perfect blend of comfort and style.',
    price: '89.99',
    old_price: null,
    qty: 35,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop'],
    brand: {
      id: 13,
      name: 'Levi\'s',
      slug: 'levis'
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
    name: 'Canon EOS R5',
    slug: 'canon-eos-r5',
    description: 'Professional mirrorless camera with 45MP full-frame sensor and 8K video.',
    price: '3899.99',
    old_price: null,
    qty: 5,
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop'],
    brand: {
      id: 14,
      name: 'Canon',
      slug: 'canon'
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
    id: 16,
    name: 'Rolex Submariner',
    slug: 'rolex-submariner',
    description: 'Iconic luxury dive watch with ceramic bezel and automatic movement.',
    price: '8500.00',
    old_price: null,
    qty: 3,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop'],
    brand: {
      id: 15,
      name: 'Rolex',
      slug: 'rolex'
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
    id: 17,
    name: 'Dyson V15 Detect',
    slug: 'dyson-v15-detect',
    description: 'Cordless vacuum with laser dust detection and powerful suction.',
    price: '699.99',
    old_price: '749.99',
    qty: 8,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop'],
    brand: {
      id: 16,
      name: 'Dyson',
      slug: 'dyson'
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
    id: 18,
    name: 'Peloton Bike',
    slug: 'peloton-bike',
    description: 'Interactive exercise bike with live and on-demand classes.',
    price: '2495.00',
    old_price: null,
    qty: 6,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop'],
    brand: {
      id: 17,
      name: 'Peloton',
      slug: 'peloton'
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
    id: 19,
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    description: 'Handheld gaming console with vibrant 7-inch OLED screen.',
    price: '349.99',
    old_price: null,
    qty: 18,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop'],
    brand: {
      id: 18,
      name: 'Nintendo',
      slug: 'nintendo'
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
    id: 20,
    name: 'Gucci Marmont Bag',
    slug: 'gucci-marmont-bag',
    description: 'Iconic quilted leather shoulder bag with GG Supreme canvas.',
    price: '2290.00',
    old_price: null,
    qty: 4,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop'],
    brand: {
      id: 19,
      name: 'Gucci',
      slug: 'gucci'
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
    id: 21,
    name: 'Tesla Model 3',
    slug: 'tesla-model-3',
    description: 'Electric sedan with autopilot, 358 miles range, and premium interior.',
    price: '39990.00',
    old_price: null,
    qty: 2,
    images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=400&fit=crop'],
    brand: {
      id: 20,
      name: 'Tesla',
      slug: 'tesla'
    },
    categories: [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  }
]

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

// Mock Reviews
export const mockReviews = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    user: {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date().toISOString()
    },
    rating: 5,
    title: 'Excellent sound quality!',
    comment: 'These headphones provide amazing sound quality and comfort. Highly recommended!',
    verified: true,
    helpful: 12,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    productId: '1',
    userId: '2',
    user: {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      createdAt: new Date().toISOString()
    },
    rating: 4,
    title: 'Good value for money',
    comment: 'Solid build quality and good battery life. Minor issues with the app connectivity.',
    verified: true,
    helpful: 8,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock Wishlist
export const mockWishlist = [
  {
    id: '1',
    productId: '2',
    product: mockApiProducts[1] as any,
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    productId: '6',
    product: mockApiProducts[5] as any,
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock Blog Posts
export const mockBlogPosts = [
  {
    id: '1',
    title: 'Top 10 Fitness Gadgets for 2024',
    slug: 'top-10-fitness-gadgets-2024',
    excerpt: 'Discover the latest fitness technology that can help you achieve your health goals.',
    content: 'Full blog post content here...',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@blog.com'
    },
    category: 'Fitness',
    tags: ['fitness', 'gadgets', 'health'],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
  }
]

// Mock Brands
export const mockBrands = [
  {
    id: '1',
    name: 'AudioTech',
    slug: 'audiotech',
    description: 'Premium audio equipment for professionals and enthusiasts',
    logo: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: '2',
    name: 'FitTech',
    slug: 'fittech',
    description: 'Innovative fitness technology for a healthier lifestyle',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center'
  }
]

// Mock Payments
export const mockPayments = [
  {
    id: '1',
    orderId: 'ORD-001',
    amount: 333.99,
    method: 'razorpay',
    status: 'completed',
    transactionId: 'txn_123456789',
    createdAt: new Date().toISOString()
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
  getProducts: (page = 1, limit = 12, filters: Partial<ProductFilter> = {}) => {
    let filteredProducts = [...mockApiProducts]

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(cat => cat.id.toString() === filters.category)
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
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price)
        const minPrice = filters.priceRange.min || 0
        const maxPrice = filters.priceRange.max || Infinity
        return price >= minPrice && price <= maxPrice
      })
    }

    // Apply rating filter
    if (filters.rating) {
      // For mock data, we'll assume all products have at least 4 stars
      // In real implementation, this would filter by actual ratings
      filteredProducts = filteredProducts.filter(() => Math.random() > 0.3) // Random filter for demo
    }

    // Apply in stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => product.qty > 0)
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          break
        case 'price-desc':
          filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
          break
        case 'newest':
          // For mock data, sort by ID (higher ID = newer)
          filteredProducts.sort((a, b) => b.id - a.id)
          break
        case 'popularity':
          // Random sort for demo
          filteredProducts.sort(() => Math.random() - 0.5)
          break
        case 'rating':
          // Random sort for demo
          filteredProducts.sort(() => Math.random() - 0.5)
          break
        default:
          break
      }
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
  getFeaturedProducts: (limit = 6) => createMockApiResponse(mockApiProducts.slice(0, limit)),
  getRelatedProducts: (productId: string, limit = 4) => {
    const related = mockApiProducts.filter(p => p.id.toString() !== productId).slice(0, limit)
    return createMockApiResponse(related)
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
  getProductReviews: () => createMockApiResponse(JSON.stringify(mockReviews)),
  addProductReview: () => createMockApiResponse('Review added successfully'),
  getWishlist: () => createMockApiResponse(JSON.stringify(mockWishlist)),
  addToWishlist: () => createMockApiResponse(null),
  removeFromWishlist: () => createMockApiResponse(null),
  searchProducts: (query: string) => {
    const filtered = mockApiProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
    return createMockApiResponse(filtered)
  },
  subscribeToNewsletter: () => createMockApiResponse('Successfully subscribed to newsletter'),
  submitContactQuery: () => createMockApiResponse('Contact query submitted successfully'),
  getBlogPosts: () => createMockApiResponse(mockBlogPosts),
  getBrands: () => createMockApiResponse(mockBrands),
  getPayments: () => createMockApiResponse(mockPayments),
  // Additional endpoints for comprehensive coverage
  sendForgotPasswordOtp: () => createMockApiResponse({ message: 'OTP sent successfully', otp: '123456' }),
  resetPassword: () => createMockApiResponse('Password reset successfully'),
  createOrder: () => createMockApiResponse({ order_id: 'ORD-123', message: 'Order created successfully' }),
  updateOrderStatus: () => createMockApiResponse('Order status updated successfully'),
  savePaymentDetail: () => createMockApiResponse('Payment details saved successfully'),
  getOrderAddress: () => createMockApiResponse(mockOrders[0].shippingAddress),
  addOrderAddress: () => createMockApiResponse('Address added successfully'),
  createRazorpayOrder: () => createMockApiResponse({ id: 'order_123', amount: 1000, currency: 'INR' }),
  verifyRazorpayPayment: () => createMockApiResponse({ status: 'success', payment_id: 'pay_123' }),
  getBlogCategories: () => createMockApiResponse(['Technology', 'Lifestyle', 'Health']),
  getBlogAuthors: () => createMockApiResponse([{ id: '1', name: 'John Doe', email: 'john@example.com' }]),
  addBlogComment: () => createMockApiResponse('Comment added successfully'),
  getContentBlocks: () => createMockApiResponse([{ id: '1', title: 'Hero Section', content: 'Welcome to our store' }]),
  getPages: () => createMockApiResponse([{ id: '1', title: 'About Us', slug: 'about', content: 'About content' }]),
  getOrderShipments: () => createMockApiResponse([{ id: '1', tracking_number: 'TN123456', carrier: 'FedEx', status: 'shipped' }]),
  trackOrder: () => createMockApiResponse({ status: 'in_transit', estimated_delivery: '2024-01-15' }),
  getShippingRates: () => createMockApiResponse([{ method: 'standard', rate: 10.99 }, { method: 'express', rate: 19.99 }]),
  getShippingProviders: () => createMockApiResponse(['FedEx', 'UPS', 'DHL']),
  processRefund: () => createMockApiResponse('Refund processed successfully'),
  getRefundDetails: () => createMockApiResponse({ id: '1', amount: 50.00, status: 'processed' }),
  getSubscriptions: () => createMockApiResponse([{ email: 'user@example.com', subscribed: true }]),
  getSubscriptionByEmail: () => createMockApiResponse({ email: 'user@example.com', subscribed: true })
}