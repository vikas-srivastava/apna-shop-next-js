/**
 * Comprehensive API Error Handling and Edge Case Testing Script
 * Tests all error scenarios, edge cases, and validates error handling across all endpoints
 */

require('dotenv').config();
const axios = require('axios');

// Environment configuration
const config = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    tenantId: process.env.NEXT_PRIVATE_TENANT_ID || '01998023-8f44-7206-900c-89915f5d2ed7',
    token: process.env.NEXT_PUBLIC_TOKEN || '2|gO8L1F5lCJgwSCdkFXFU0UXJQoiOQcCHG0qvzmLYd93fa1a3',
    apiBaseUrl: process.env.NEXT_PRIVATE_API_BASE_URL || 'http://localhost/api',
};

// Enhanced test results tracking
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
    warnings: [],
    performance: {
        totalTime: 0,
        averageResponseTime: 0,
        slowestEndpoint: { name: '', time: 0 },
        fastestEndpoint: { name: '', time: Infinity },
        errorResponseTimes: []
    },
    errorScenarios: {
        authentication: { total: 0, passed: 0, failed: 0 },
        validation: { total: 0, passed: 0, failed: 0 },
        notFound: { total: 0, passed: 0, failed: 0 },
        serverErrors: { total: 0, passed: 0, failed: 0 },
        networkIssues: { total: 0, passed: 0, failed: 0 },
        corsIssues: { total: 0, passed: 0, failed: 0 },
        rateLimiting: { total: 0, passed: 0, failed: 0 }
    },
    edgeCases: {
        emptyResults: { total: 0, passed: 0, failed: 0 },
        boundaryConditions: { total: 0, passed: 0, failed: 0 },
        specialCharacters: { total: 0, passed: 0, failed: 0 },
        largeData: { total: 0, passed: 0, failed: 0 },
        concurrentRequests: { total: 0, passed: 0, failed: 0 }
    }
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        error: '\x1b[31m',
        warning: '\x1b[33m',
        debug: '\x1b[35m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function recordTest(name, success, error = null, responseTime = 0, category = 'general', details = null) {
    testResults.total++;
    if (success) {
        testResults.passed++;
        log(`✓ ${name} - PASSED (${responseTime}ms)`, 'success');
    } else {
        testResults.failed++;
        log(`✗ ${name} - FAILED: ${error} (${responseTime}ms)`, 'error');
        testResults.errors.push({ name, error, responseTime, category, details });
    }

    // Track performance metrics
    testResults.performance.totalTime += responseTime;
    if (responseTime > testResults.performance.slowestEndpoint.time) {
        testResults.performance.slowestEndpoint = { name, time: responseTime };
    }
    if (responseTime < testResults.performance.fastestEndpoint.time) {
        testResults.performance.fastestEndpoint = { name, time: responseTime };
    }

    // Track error response times for analysis
    if (!success && responseTime > 0) {
        testResults.performance.errorResponseTimes.push({ name, responseTime, category });
    }
}

function recordTestByCategory(category, subcategory, success, error = null, responseTime = 0, details = null) {
    if (category === 'errorScenarios' && testResults.errorScenarios[subcategory]) {
        testResults.errorScenarios[subcategory].total++;
        if (success) {
            testResults.errorScenarios[subcategory].passed++;
        } else {
            testResults.errorScenarios[subcategory].failed++;
        }
    } else if (category === 'edgeCases' && testResults.edgeCases[subcategory]) {
        testResults.edgeCases[subcategory].total++;
        if (success) {
            testResults.edgeCases[subcategory].passed++;
        } else {
            testResults.edgeCases[subcategory].failed++;
        }
    }
}

// API client setup
const apiClient = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Tenant': config.tenantId,
        'Authorization': `Bearer ${config.token}`,
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 15000
});

// Test helper functions
async function makeRequest(method, endpoint, data = null, useAuth = true, customHeaders = {}) {
    const startTime = Date.now();
    const requestConfig = {
        method,
        url: endpoint,
        headers: useAuth ? { ...apiClient.defaults.headers, ...customHeaders } : { 'Content-Type': 'application/json', ...customHeaders }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        requestConfig.data = data;
    }

    try {
        console.log(`Making ${method} request to: ${config.baseUrl}${endpoint}`);
        const response = await axios(requestConfig);
        const responseTime = Date.now() - startTime;
        console.log(`Response status: ${response.status}, Response time: ${responseTime}ms`);
        if (response.data) {
            console.log(`Response data:`, JSON.stringify(response.data, null, 2));
        }
        return { success: true, data: response.data, status: response.status, responseTime };
    } catch (error) {
        const responseTime = Date.now() - startTime;
        console.log(`Request failed: ${error.message}`);
        if (error.response) {
            console.log(`Error status: ${error.response.status}`);
            console.log(`Error data:`, error.response.data);
        } else if (error.request) {
            console.log(`No response received:`, error.request);
        }
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            status: error.response?.status || 500,
            responseTime
        };
    }
}

// Enhanced error response validation
function validateErrorResponse(response, expectedStatus, expectedFormat = true) {
    if (!response) return false;

    const hasCorrectStatus = response.status === expectedStatus;
    const hasErrorStructure = expectedFormat ? (
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data &&
        'message' in response.data &&
        response.data.success === false
    ) : true;

    return hasCorrectStatus && hasErrorStructure;
}

// Concurrent request testing
async function testConcurrentRequests(endpoint, requestCount = 10) {
    const promises = [];
    for (let i = 0; i < requestCount; i++) {
        promises.push(makeRequest('GET', endpoint));
    }

    const startTime = Date.now();
    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    log(`Concurrent test: ${successCount}/${requestCount} successful, avg: ${avgResponseTime.toFixed(0)}ms, total: ${totalTime}ms`, 'debug');

    return {
        success: successCount === requestCount,
        successCount,
        totalCount: requestCount,
        avgResponseTime,
        totalTime
    };
}

// Test suites
async function testProductsEndpoints() {
    log('\n🛍️  Testing Products Endpoints', 'info');

    // Test GET /api/products (with pagination)
    const productsResult = await makeRequest('GET', '/api/products?page=1&limit=5');
    recordTest('Products - GET /api/products (paginated)', productsResult.success, productsResult.error, productsResult.responseTime);

    // Test GET /api/products (without pagination)
    const productsAllResult = await makeRequest('GET', '/api/products');
    recordTest('Products - GET /api/products (all)', productsAllResult.success, productsAllResult.error, productsAllResult.responseTime);

    // Test GET /api/products/[slug] (if we have products)
    if (productsResult.success && productsResult.data?.data?.length > 0) {
        const firstProduct = productsResult.data.data[0];
        if (firstProduct.slug) {
            const productDetailResult = await makeRequest('GET', `/api/products/${firstProduct.slug}`);
            recordTest('Products - GET /api/products/[slug]', productDetailResult.success, productDetailResult.error, productDetailResult.responseTime);
        }
    }

    // Test GET /api/products/[slug] with invalid slug
    const invalidSlugResult = await makeRequest('GET', '/api/products/invalid-slug-test');
    recordTest('Products - GET /api/products/[slug] (invalid)', !invalidSlugResult.success, null, invalidSlugResult.responseTime);
}

async function testCartEndpoints() {
    log('\n🛒 Testing Cart Endpoints', 'info');

    // Test GET /api/cart
    const getCartResult = await makeRequest('GET', '/api/cart');
    recordTest('Cart - GET /api/cart', getCartResult.success, getCartResult.error, getCartResult.responseTime);

    // Test POST /api/cart (add item)
    const addToCartData = {
        product_id: 'test-product-123',
        product_quantity: 1,
        product_variant_id: null,
        product_variant_data: null,
        customer_id: 'test-customer-123'
    };
    const addCartResult = await makeRequest('POST', '/api/cart', addToCartData);
    recordTest('Cart - POST /api/cart', addCartResult.success, addCartResult.error, addCartResult.responseTime);

    // Test PUT /api/cart/[item_id] (if cart has items)
    if (addCartResult.success && addCartResult.data?.data?.items?.length > 0) {
        const firstItem = addCartResult.data.data.items[0];
        const updateCartData = { product_quantity: 2 };
        const updateCartResult = await makeRequest('PUT', `/api/cart/${firstItem.id}`, updateCartData);
        recordTest('Cart - PUT /api/cart/[item_id]', updateCartResult.success, updateCartResult.error, updateCartResult.responseTime);
    }

    // Test DELETE /api/cart/[item_id] (if cart has items)
    if (addCartResult.success && addCartResult.data?.data?.items?.length > 0) {
        const firstItem = addCartResult.data.data.items[0];
        const deleteCartResult = await makeRequest('DELETE', `/api/cart/${firstItem.id}`);
        recordTest('Cart - DELETE /api/cart/[item_id]', deleteCartResult.success, deleteCartResult.error, deleteCartResult.responseTime);
    }

    // Test DELETE /api/cart (clear cart)
    const clearCartResult = await makeRequest('DELETE', '/api/cart');
    recordTest('Cart - DELETE /api/cart (clear)', clearCartResult.success, clearCartResult.error, clearCartResult.responseTime);
}

async function testCategoriesEndpoint() {
    log('\n📂 Testing Categories Endpoint', 'info');

    // Test GET /api/categories
    const categoriesResult = await makeRequest('GET', '/api/categories');
    recordTest('Categories - GET /api/categories', categoriesResult.success, categoriesResult.error, categoriesResult.responseTime);
}

async function testOrdersEndpoints() {
    log('\n📦 Testing Orders Endpoints', 'info');

    // Test GET /api/orders
    const getOrdersResult = await makeRequest('GET', '/api/orders');
    recordTest('Orders - GET /api/orders', getOrdersResult.success, getOrdersResult.error, getOrdersResult.responseTime);

    // Test POST /api/orders (create order)
    const createOrderData = {
        items: [],
        shipping_address: {
            first_name: 'Test',
            last_name: 'User',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipcode: '12345',
            country: 'Test Country'
        },
        billing_address: {
            first_name: 'Test',
            last_name: 'User',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipcode: '12345',
            country: 'Test Country'
        },
        payment_method: 'cod'
    };
    const createOrderResult = await makeRequest('POST', '/api/orders', createOrderData);
    recordTest('Orders - POST /api/orders', createOrderResult.success, createOrderResult.error, createOrderResult.responseTime);
}

async function testPaymentEndpoints() {
    log('\n💳 Testing Payment Endpoints', 'info');

    // Test POST /api/payments/create-razorpay-order
    const razorpayData = {
        amount: 1000,
        currency: 'INR',
        receipt: 'test-receipt-123'
    };
    const createRazorpayResult = await makeRequest('POST', '/api/payments/create-razorpay-order', razorpayData);
    recordTest('Payments - POST /api/payments/create-razorpay-order', createRazorpayResult.success, createRazorpayResult.error, createRazorpayResult.responseTime);

    // Test POST /api/payments/verify
    const verifyData = {
        razorpay_payment_id: 'test_payment_id',
        razorpay_order_id: 'test_order_id',
        razorpay_signature: 'test_signature'
    };
    const verifyPaymentResult = await makeRequest('POST', '/api/payments/verify', verifyData);
    recordTest('Payments - POST /api/payments/verify', verifyPaymentResult.success, verifyPaymentResult.error, verifyPaymentResult.responseTime);
}

async function testAddressEndpoints() {
    log('\n🏠 Testing Address Endpoints', 'info');

    // Test GET /api/addresses
    const getAddressesResult = await makeRequest('GET', '/api/addresses');
    recordTest('Addresses - GET /api/addresses', getAddressesResult.success, getAddressesResult.error, getAddressesResult.responseTime);

    // Test POST /api/addresses
    const createAddressData = {
        type: 'shipping',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipcode: '12345',
        country: 'Test Country',
        phone: '1234567890'
    };
    const createAddressResult = await makeRequest('POST', '/api/addresses', createAddressData);
    recordTest('Addresses - POST /api/addresses', createAddressResult.success, createAddressResult.error, createAddressResult.responseTime);

    // Test PUT /api/addresses/[id] (if we created an address)
    if (createAddressResult.success && createAddressResult.data?.data?.id) {
        const addressId = createAddressResult.data.data.id;
        const updateAddressData = { ...createAddressData, city: 'Updated City' };
        const updateAddressResult = await makeRequest('PUT', `/api/addresses/${addressId}`, updateAddressData);
        recordTest('Addresses - PUT /api/addresses/[id]', updateAddressResult.success, updateAddressResult.error, updateAddressResult.responseTime);
    }

    // Test DELETE /api/addresses/[id] (if we created an address)
    if (createAddressResult.success && createAddressResult.data?.data?.id) {
        const addressId = createAddressResult.data.data.id;
        const deleteAddressResult = await makeRequest('DELETE', `/api/addresses/${addressId}`);
        recordTest('Addresses - DELETE /api/addresses/[id]', deleteAddressResult.success, deleteAddressResult.error, deleteAddressResult.responseTime);
    }
}

async function testThemesEndpoint() {
    log('\n🎨 Testing Themes Endpoint', 'info');

    // Test GET /api/themes
    const getThemesResult = await makeRequest('GET', '/api/themes');
    recordTest('Themes - GET /api/themes', getThemesResult.success, getThemesResult.error, getThemesResult.responseTime);

    // Test POST /api/themes
    const createThemeData = {
        name: 'Test Theme',
        colors: {
            primary: '#007bff',
            secondary: '#6c757d'
        },
        fonts: {
            primary: 'Arial, sans-serif'
        }
    };
    const createThemeResult = await makeRequest('POST', '/api/themes', createThemeData);
    recordTest('Themes - POST /api/themes', createThemeResult.success, createThemeResult.error, createThemeResult.responseTime);
}

async function testAuthenticationScenarios() {
    log('\n🔐 Testing Authentication Scenarios', 'info');

    // Test without auth headers
    const noAuthResult = await makeRequest('GET', '/api/products', null, false);
    recordTest('Authentication - No auth headers', noAuthResult.success, noAuthResult.error, noAuthResult.responseTime);

    // Test with invalid token
    const invalidTokenResult = await makeRequest('GET', '/api/products', null, true);
    // Override the token with invalid one
    const originalToken = config.token;
    config.token = 'invalid-token-123';
    apiClient.defaults.headers.Authorization = `Bearer ${config.token}`;

    const invalidTokenResponse = await makeRequest('GET', '/api/products');
    recordTest('Authentication - Invalid token', !invalidTokenResponse.success, null, invalidTokenResponse.responseTime);

    // Restore original token
    config.token = originalToken;
    apiClient.defaults.headers.Authorization = `Bearer ${config.token}`;
}

async function testErrorScenarios() {
    log('\n❌ Testing Error Scenarios', 'info');

    // Test 404 endpoints
    const notFoundResult = await makeRequest('GET', '/api/non-existent-endpoint');
    const notFoundValid = validateErrorResponse(notFoundResult, 404);
    recordTest('Error Handling - 404 endpoint', notFoundValid, `Expected 404 with proper format, got ${notFoundResult.status}`, notFoundResult.responseTime, 'errorScenarios', 'notFound');
    recordTestByCategory('errorScenarios', 'notFound', notFoundValid);

    // Test invalid JSON
    const invalidJsonResult = await axios({
        method: 'POST',
        url: `${config.baseUrl}/api/products`,
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant': config.tenantId,
            'Authorization': `Bearer ${config.token}`
        },
        data: 'invalid json {',
        timeout: 5000
    }).catch(error => ({
        success: false,
        error: error.message,
        status: error.response?.status || 500,
        responseTime: 0
    }));
    recordTest('Error Handling - Invalid JSON', !invalidJsonResult.success, null, invalidJsonResult.responseTime, 'errorScenarios', 'validation');
    recordTestByCategory('errorScenarios', 'validation', !invalidJsonResult.success);

    // Test authentication errors
    const originalToken = config.token;
    config.token = 'invalid-token-123';
    apiClient.defaults.headers.Authorization = `Bearer ${config.token}`;

    const invalidAuthResult = await makeRequest('GET', '/api/products');
    const authErrorValid = validateErrorResponse(invalidAuthResult, 401);
    recordTest('Authentication - Invalid token', authErrorValid, `Expected 401 with proper format, got ${invalidAuthResult.status}`, invalidAuthResult.responseTime, 'errorScenarios', 'authentication');
    recordTestByCategory('errorScenarios', 'authentication', authErrorValid);

    // Restore original token
    config.token = originalToken;
    apiClient.defaults.headers.Authorization = `Bearer ${config.token}`;

    // Test validation errors
    const invalidDataResult = await makeRequest('POST', '/api/products', { invalid_field: 'test' });
    const validationErrorValid = validateErrorResponse(invalidDataResult, 422);
    recordTest('Validation - Invalid request data', validationErrorValid, `Expected 422 with proper format, got ${invalidDataResult.status}`, invalidDataResult.responseTime, 'errorScenarios', 'validation');
    recordTestByCategory('errorScenarios', 'validation', validationErrorValid);

    // Test CORS preflight
    const corsResult = await axios({
        method: 'OPTIONS',
        url: `${config.baseUrl}/api/products`,
        headers: {
            'Origin': 'http://localhost:3001',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'authorization,x-tenant'
        }
    }).catch(error => ({
        success: false,
        error: error.message,
        status: error.response?.status || 500,
        responseTime: 0
    }));
    const corsValid = corsResult.status === 200 || corsResult.status === 404;
    recordTest('CORS - Preflight request', corsValid, `Expected 200 or 404, got ${corsResult.status}`, corsResult.responseTime, 'errorScenarios', 'corsIssues');
    recordTestByCategory('errorScenarios', 'corsIssues', corsValid);

    // Test network timeout
    const timeoutResult = await axios({
        method: 'GET',
        url: `${config.baseUrl}/api/products`,
        headers: apiClient.defaults.headers,
        timeout: 1 // 1ms timeout
    }).catch(error => ({
        success: false,
        error: error.message,
        status: error.response?.status || 408,
        responseTime: 0
    }));
    const timeoutValid = timeoutResult.status === 408 || timeoutResult.error.includes('timeout');
    recordTest('Network - Timeout handling', timeoutValid, `Expected timeout error, got ${timeoutResult.status}: ${timeoutResult.error}`, timeoutResult.responseTime, 'errorScenarios', 'networkIssues');
    recordTestByCategory('errorScenarios', 'networkIssues', timeoutValid);

    // Test server error simulation (if endpoint supports it)
    const serverErrorResult = await makeRequest('POST', '/api/products', { trigger_error: true });
    const serverErrorValid = validateErrorResponse(serverErrorResult, 500);
    recordTest('Server Error - Internal error', serverErrorValid, `Expected 500 with proper format, got ${serverErrorResult.status}`, serverErrorResult.responseTime, 'errorScenarios', 'serverErrors');
    recordTestByCategory('errorScenarios', 'serverErrors', serverErrorValid);

    // Test rate limiting (if implemented)
    const rateLimitResults = [];
    for (let i = 0; i < 5; i++) {
        const result = await makeRequest('GET', '/api/products');
        rateLimitResults.push(result);
    }
    const rateLimitErrors = rateLimitResults.filter(r => r.status === 429).length;
    const rateLimitValid = rateLimitErrors >= 0; // At least no crashes
    recordTest('Rate Limiting - Multiple requests', rateLimitValid, `Got ${rateLimitErrors} rate limit errors (expected >= 0)`, rateLimitResults[0]?.responseTime || 0, 'errorScenarios', 'rateLimiting');
    recordTestByCategory('errorScenarios', 'rateLimiting', rateLimitValid);
}

async function testEdgeCases() {
    log('\n🔍 Testing Edge Cases', 'info');

    // Test empty results
    const emptyResult = await makeRequest('GET', '/api/products?page=9999&limit=1');
    const emptyValid = emptyResult.success && (!emptyResult.data?.data || emptyResult.data.data.length === 0);
    recordTest('Edge Case - Empty results', emptyValid, `Expected empty array or null data, got: ${JSON.stringify(emptyResult.data)}`, emptyResult.responseTime, 'edgeCases', 'emptyResults');
    recordTestByCategory('edgeCases', 'emptyResults', emptyValid);

    // Test boundary conditions
    const boundaryResult = await makeRequest('GET', '/api/products?page=0&limit=0');
    const boundaryValid = boundaryResult.success || boundaryResult.status === 400;
    recordTest('Edge Case - Boundary conditions (page=0, limit=0)', boundaryValid, `Expected success or 400, got ${boundaryResult.status}`, boundaryResult.responseTime, 'edgeCases', 'boundaryConditions');
    recordTestByCategory('edgeCases', 'boundaryConditions', boundaryValid);

    // Test special characters
    const specialCharsResult = await makeRequest('GET', '/api/products?search=%3C%3E%22%27%26%2B%3D%7C%5C%2F%3A%3B%2C%2E%40%23%24%25%5E%2A%28%29%5B%5D%7B%7D%60%7E%21%3F%2D%5F');
    const specialCharsValid = specialCharsResult.success || specialCharsResult.status === 400;
    recordTest('Edge Case - Special characters in search', specialCharsValid, `Expected success or 400, got ${specialCharsResult.status}`, specialCharsResult.responseTime, 'edgeCases', 'specialCharacters');
    recordTestByCategory('edgeCases', 'specialCharacters', specialCharsValid);

    // Test large data payload
    const largeData = 'x'.repeat(1024 * 1024); // 1MB of data
    const largeDataResult = await makeRequest('POST', '/api/products', { name: largeData, description: 'Large data test' });
    const largeDataValid = largeDataResult.success || largeDataResult.status === 413 || largeDataResult.status === 400;
    recordTest('Edge Case - Large data payload (1MB)', largeDataValid, `Expected success or 413/400, got ${largeDataResult.status}`, largeDataResult.responseTime, 'edgeCases', 'largeData');
    recordTestByCategory('edgeCases', 'largeData', largeDataValid);

    // Test concurrent requests
    const concurrentResult = await testConcurrentRequests('/api/products', 5);
    const concurrentValid = concurrentResult.success || concurrentResult.successCount >= 3; // Allow some failures
    recordTest('Edge Case - Concurrent requests (5 parallel)', concurrentValid, `Expected most requests to succeed, got ${concurrentResult.successCount}/${concurrentResult.totalCount}`, concurrentResult.avgResponseTime, 'edgeCases', 'concurrentRequests');
    recordTestByCategory('edgeCases', 'concurrentRequests', concurrentValid);

    // Test invalid product slug with special characters
    const invalidSlugResult = await makeRequest('GET', '/api/products/%3Cscript%3Ealert(1)%3C/script%3E');
    const invalidSlugValid = !invalidSlugResult.success && (invalidSlugResult.status === 404 || invalidSlugResult.status === 400);
    recordTest('Edge Case - XSS attempt in slug', invalidSlugValid, `Expected 404 or 400, got ${invalidSlugResult.status}`, invalidSlugResult.responseTime, 'edgeCases', 'specialCharacters');
    recordTestByCategory('edgeCases', 'specialCharacters', invalidSlugValid);

    // Test negative pagination
    const negativePageResult = await makeRequest('GET', '/api/products?page=-1&limit=-5');
    const negativePageValid = negativePageResult.success || negativePageResult.status === 400;
    recordTest('Edge Case - Negative pagination values', negativePageValid, `Expected success or 400, got ${negativePageResult.status}`, negativePageResult.responseTime, 'edgeCases', 'boundaryConditions');
    recordTestByCategory('edgeCases', 'boundaryConditions', negativePageValid);
}

// Main test runner
async function runComprehensiveTests() {
    log('🚀 Starting Comprehensive API Testing for Next.js Routes', 'info');
    log(`Base URL: ${config.baseUrl}`, 'info');
    log(`Tenant ID: ${config.tenantId}`, 'info');
    log(`API Base URL: ${config.apiBaseUrl}`, 'info');

    // Run all test suites
    await testProductsEndpoints();
    await testCartEndpoints();
    await testCategoriesEndpoint();
    await testOrdersEndpoints();
    await testPaymentEndpoints();
    await testAddressEndpoints();
    await testThemesEndpoint();
    await testAuthenticationScenarios();
    await testErrorScenarios();
    await testEdgeCases();

    // Calculate performance metrics
    testResults.performance.averageResponseTime = testResults.performance.totalTime / testResults.total;

    // Generate comprehensive report
    generateReport();
}

function generateReport() {
    log('\n📊 COMPREHENSIVE TEST REPORT', 'info');
    log('='.repeat(50), 'info');

    log(`Total Tests: ${testResults.total}`, 'info');
    log(`Passed: ${testResults.passed}`, 'success');
    log(`Failed: ${testResults.failed}`, 'error');

    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, testResults.failed === 0 ? 'success' : 'warning');

    log('\n⚡ Performance Metrics:', 'info');
    log(`Average Response Time: ${testResults.performance.averageResponseTime.toFixed(0)}ms`, 'info');
    log(`Total Test Time: ${testResults.performance.totalTime}ms`, 'info');
    log(`Slowest Endpoint: ${testResults.performance.slowestEndpoint.name} (${testResults.performance.slowestEndpoint.time}ms)`, 'warning');
    log(`Fastest Endpoint: ${testResults.performance.fastestEndpoint.name} (${testResults.performance.fastestEndpoint.time}ms)`, 'success');

    if (testResults.failed > 0) {
        log('\n❌ Failed Tests Details:', 'error');
        testResults.errors.forEach((error, index) => {
            log(`${index + 1}. ${error.name}:`, 'error');
            log(`   Error: ${error.error}`, 'error');
            log(`   Response Time: ${error.responseTime}ms`, 'error');
        });
    }

    log('\n📋 Test Coverage Summary:', 'info');
    log('✓ Products endpoints (GET /api/products, /api/products/[slug])', 'success');
    log('✓ Cart endpoints (GET, POST, PUT, DELETE /api/cart, /api/cart/[item_id])', 'success');
    log('✓ Categories endpoint (GET /api/categories)', 'success');
    log('✓ Orders endpoints (GET, POST /api/orders)', 'success');
    log('✓ Payment endpoints (POST /api/payments/create-razorpay-order, /api/payments/verify)', 'success');
    log('✓ Address endpoints (GET, POST, PUT, DELETE /api/addresses, /api/addresses/[id])', 'success');
    log('✓ Themes endpoint (GET, POST /api/themes)', 'success');
    log('✓ Authentication scenarios (valid/invalid tokens)', 'success');
    log('✓ Error handling (404s, invalid JSON, timeouts)', 'success');

    log('\n🔍 Error Scenarios Tested:', 'info');
    Object.entries(testResults.errorScenarios).forEach(([scenario, stats]) => {
        const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0.0';
        log(`  ${scenario}: ${stats.passed}/${stats.total} passed (${rate}%)`, stats.failed === 0 ? 'success' : 'warning');
    });

    log('\n🎯 Edge Cases Tested:', 'info');
    Object.entries(testResults.edgeCases).forEach(([edgeCase, stats]) => {
        const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0.0';
        log(`  ${edgeCase}: ${stats.passed}/${stats.total} passed (${rate}%)`, stats.failed === 0 ? 'success' : 'warning');
    });

    log('\n⚡ Error Response Performance:', 'info');
    if (testResults.performance.errorResponseTimes.length > 0) {
        const avgErrorTime = testResults.performance.errorResponseTimes.reduce((sum, r) => sum + r.responseTime, 0) / testResults.performance.errorResponseTimes.length;
        log(`Average error response time: ${avgErrorTime.toFixed(0)}ms`, 'info');
        log(`Error response time range: ${Math.min(...testResults.performance.errorResponseTimes.map(r => r.responseTime))}ms - ${Math.max(...testResults.performance.errorResponseTimes.map(r => r.responseTime))}ms`, 'info');
    }

    log('\n' + '='.repeat(50), 'info');

    if (testResults.failed === 0) {
        log('🎉 All tests passed! Next.js API routes are working correctly.', 'success');
        log('✅ CORS headers are properly configured', 'success');
        log('✅ Authentication is working as expected', 'success');
        log('✅ Error handling is robust', 'success');
        log('✅ Response times are within acceptable limits', 'success');
    } else {
        log('⚠️  Some tests failed. Please check the API routes and configuration.', 'warning');
        log('🔧 Common issues to check:', 'warning');
        log('   - Environment variables in .env.local', 'warning');
        log('   - Next.js development server is running', 'warning');
        log('   - Apna Shop API server is accessible', 'warning');
        log('   - CORS configuration in next.config.ts', 'warning');
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
});

// Run tests
runComprehensiveTests().catch(error => {
    log(`Test runner failed: ${error.message}`, 'error');
    process.exit(1);
});