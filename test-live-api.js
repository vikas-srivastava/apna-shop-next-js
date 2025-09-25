/**
 * Comprehensive Live API Testing Script
 * Tests all services and integrations with live Apna Shop eCommerce API
 */

require('dotenv').config();

const axios = require('axios');

// Environment configuration
const config = {
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '01998023-8f44-7206-900c-89915f5d2ed7',
    token: process.env.NEXT_PUBLIC_TOKEN || '2|gO8L1F5lCJgwSCdkFXFU0UXJQoiOQcCHG0qvzmLYd93fa1a3',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/api',
};

// Test results tracking
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        error: '\x1b[31m',
        warning: '\x1b[33m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function recordTest(name, success, error = null) {
    testResults.total++;
    if (success) {
        testResults.passed++;
        log(`✓ ${name} - PASSED`, 'success');
    } else {
        testResults.failed++;
        log(`✗ ${name} - FAILED: ${error}`, 'error');
        testResults.errors.push({ name, error });
    }
}

// API client setup
const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Tenant': config.tenantId,
        'Authorization': `Bearer ${config.token}`,
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 10000
});

// Test functions
async function testApiConnectivity() {
    try {
        log('Testing API connectivity...');
        const response = await apiClient.get('/');

        if (response.status >= 200 && response.status < 300) {
            recordTest('API Connectivity', true);
            return true;
        } else {
            recordTest('API Connectivity', false, `Unexpected status: ${response.status}`);
            return false;
        }
    } catch (error) {
        recordTest('API Connectivity', false, error.message);
        return false;
    }
}

async function testCategories() {
    try {
        log('Testing categories endpoint...');
        const response = await apiClient.get('/shop/get-categories');

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            recordTest('Categories API', true);
            log(`Found ${response.data.data.length} categories`);
            return response.data.data;
        } else {
            recordTest('Categories API', false, 'Invalid response format');
            return null;
        }
    } catch (error) {
        recordTest('Categories API', false, error.message);
        return null;
    }
}

async function testProducts() {
    try {
        log('Testing products endpoint...');
        const response = await apiClient.get('/shop/get-products?page=1&limit=5');

        if (response.data && response.data.success && response.data.data) {
            const products = Array.isArray(response.data.data) ? response.data.data : response.data.data.data || [];
            if (products.length > 0) {
                recordTest('Products API', true);
                log(`Found ${products.length} products`);
                return products[0]; // Return first product for further testing
            } else {
                recordTest('Products API', false, 'No products returned');
                return null;
            }
        } else {
            recordTest('Products API', false, 'Invalid response format');
            return null;
        }
    } catch (error) {
        recordTest('Products API', false, error.message);
        return null;
    }
}

async function testProductDetail(product) {
    if (!product || !product.slug) {
        recordTest('Product Detail API', false, 'No product available for detail test');
        return;
    }

    try {
        log(`Testing product detail for: ${product.slug}`);
        const response = await apiClient.get(`/shop/product/${product.slug}`);

        log(`Product Detail Response: ${JSON.stringify(response.data, null, 2)}`);
        if (response.data && response.data.success && response.data.data) {
            recordTest('Product Detail API', true);
            return response.data.data;
        } else {
            recordTest('Product Detail API', false, 'Invalid response format');
        }
    } catch (error) {
        recordTest('Product Detail API', false, error.message);
    }
}

async function testUserRegistration() {
    try {
        log('Testing user registration...');
        const testUser = {
            name: `Test User ${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            password: 'TestPassword123!',
            gender: 'male',
            password_confirmation: 'TestPassword123!'
        };

        const response = await apiClient.post('/user/register', testUser);

        if (response.data && response.data.success && response.data.data) {
            recordTest('User Registration', true);
            log(`Registered user: ${response.data.data.user}`);
            return response.data.data;
        } else {
            recordTest('User Registration', false, response.data?.error || 'Registration failed');
        }
    } catch (error) {
        recordTest('User Registration', false, error.message);
    }
}

async function testUserLogin() {
    try {
        log('Testing user login...');
        const loginData = {
            email: 'test@example.com', // Use a known test account
            password: 'password123'
        };

        const response = await apiClient.post('/user/login', loginData);

        if (response.data && response.data.success && response.data.data) {
            recordTest('User Login', true);
            log(`Logged in user: ${response.data.data.user}`);
            return response.data.data;
        } else {
            recordTest('User Login', false, response.data?.error || 'Login failed');
        }
    } catch (error) {
        recordTest('User Login', false, error.message);
    }
}

async function testCartOperations() {
    try {
        log('Testing cart operations...');

        // First get cart
        const cartResponse = await apiClient.get('/cart/cart');
        if (!cartResponse.data || !cartResponse.data.success) {
            recordTest('Cart Operations', false, 'Failed to get cart');
            return;
        }

        // Try to add item to cart (if products exist)
        const productsResponse = await apiClient.get('/shop/get-products?page=1&limit=1');
        if (productsResponse.data && productsResponse.data.success) {
            const products = Array.isArray(productsResponse.data.data)
                ? productsResponse.data.data
                : productsResponse.data.data.data || [];

            if (products.length > 0) {
                const product = products[0];
                const addToCartData = {
                    product_id: product.id,
                    product_quantity: 1,
                    product_variant_id: null,
                    product_variant_data: null,
                    customer_id: 'test-customer-123'
                };

                try {
                    const addResponse = await apiClient.post('/cart/cart', addToCartData);
                    if (addResponse.data && addResponse.data.success) {
                        recordTest('Cart Operations', true);
                        log('Successfully added item to cart');
                    } else {
                        recordTest('Cart Operations', false, 'Failed to add item to cart');
                    }
                } catch (addError) {
                    recordTest('Cart Operations', false, `Add to cart error: ${addError.message}`);
                }
            } else {
                recordTest('Cart Operations', false, 'No products available for cart testing');
            }
        } else {
            recordTest('Cart Operations', false, 'Failed to get products for cart testing');
        }
    } catch (error) {
        recordTest('Cart Operations', false, error.message);
    }
}

async function testWishlistOperations() {
    try {
        log('Testing wishlist operations...');
        const response = await apiClient.post('/shop/wishlist');

        if (response.data && response.data.success) {
            recordTest('Wishlist Operations', true);
            log('Wishlist retrieved successfully');
        } else {
            recordTest('Wishlist Operations', false, 'Failed to get wishlist');
        }
    } catch (error) {
        recordTest('Wishlist Operations', false, error.message);
    }
}

async function testOrders() {
    try {
        log('Testing orders endpoint...');
        const response = await apiClient.get('/shop/orders');

        if (response.data && response.data.success) {
            recordTest('Orders API', true);
            log(`Found ${Array.isArray(response.data.data) ? response.data.data.length : 0} orders`);
        } else {
            recordTest('Orders API', false, 'Failed to get orders');
        }
    } catch (error) {
        recordTest('Orders API', false, error.message);
    }
}

// Main test runner
async function runTests() {
    log('🚀 Starting Comprehensive Live API Testing', 'info');
    log(`Environment: This Test is always checking third party API connections`, 'info');
    log(`API Base URL: ${config.apiBaseUrl}`, 'info');
    log(`Tenant ID: ${config.tenantId}`, 'info');

    // Basic connectivity test
    const isConnected = await testApiConnectivity();
    if (!isConnected) {
        log('❌ API server not accessible. Please ensure the Apna Shop eCommerce API is running locally.', 'error');
        return;
    }

    // Run all tests
    await testCategories();
    const firstProduct = await testProducts();
    await testProductDetail(firstProduct);
    await testUserRegistration();
    await testUserLogin();
    await testCartOperations();
    await testWishlistOperations();
    await testOrders();

    // Summary
    log('\n📊 Test Results Summary:', 'info');
    log(`Total Tests: ${testResults.total}`, 'info');
    log(`Passed: ${testResults.passed}`, 'success');
    log(`Failed: ${testResults.failed}`, 'error');

    if (testResults.failed > 0) {
        log('\n❌ Failed Tests:', 'error');
        testResults.errors.forEach((error, index) => {
            log(`${index + 1}. ${error.name}: ${error.error}`, 'error');
        });
    }

    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`\nSuccess Rate: ${successRate}%`, testResults.failed === 0 ? 'success' : 'warning');

    if (testResults.failed === 0) {
        log('🎉 All tests passed! The API integration is working correctly.', 'success');
    } else {
        log('⚠️  Some tests failed. Please check the API server and configuration.', 'warning');
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
});

// Run tests
runTests().catch(error => {
    log(`Test runner failed: ${error.message}`, 'error');
    process.exit(1);
});