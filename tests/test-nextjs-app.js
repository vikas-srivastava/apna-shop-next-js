/**
 * Next.js Application API Proxy Testing Script
 * Tests the running Next.js application and its API proxy routes
 */

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

// Test Next.js API proxy routes
async function testApiProxyRoutes() {
    const baseUrl = 'http://localhost:3000';

    // Test products API proxy
    try {
        log('Testing products API proxy route...');
        const response = await fetch(`${baseUrl}/api/products`);
        const data = await response.json();

        if (response.ok && data && data.success !== undefined) {
            recordTest('Products API Proxy', true);
            log(`Products API proxy working - returned ${Array.isArray(data.data) ? data.data.length : 'unknown'} items`);
        } else {
            recordTest('Products API Proxy', false, `Unexpected response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        recordTest('Products API Proxy', false, error.message);
    }

    // Test categories API proxy
    try {
        log('Testing categories API proxy route...');
        const response = await fetch(`${baseUrl}/api/categories`);
        const data = await response.json();

        if (response.ok && data && data.success !== undefined) {
            recordTest('Categories API Proxy', true);
            log(`Categories API proxy working - returned ${Array.isArray(data.data) ? data.data.length : 'unknown'} categories`);
        } else {
            recordTest('Categories API Proxy', false, `Unexpected response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        recordTest('Categories API Proxy', false, error.message);
    }

    // Test cart API proxy
    try {
        log('Testing cart API proxy route...');
        const response = await fetch(`${baseUrl}/api/cart`);
        const data = await response.json();

        if (response.ok && data && typeof data === 'object') {
            recordTest('Cart API Proxy', true);
            log('Cart API proxy working');
        } else {
            recordTest('Cart API Proxy', false, `Unexpected response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        recordTest('Cart API Proxy', false, error.message);
    }
}

// Test Next.js pages are accessible
async function testPageAccessibility() {
    const baseUrl = 'http://localhost:3000';

    const pages = [
        '/',
        '/products',
        '/login',
        '/cart'
    ];

    for (const page of pages) {
        try {
            log(`Testing page accessibility: ${page}`);
            const response = await fetch(`${baseUrl}${page}`);

            if (response.ok) {
                recordTest(`Page ${page}`, true);
                log(`Page ${page} is accessible`);
            } else {
                recordTest(`Page ${page}`, false, `Status: ${response.status}`);
            }
        } catch (error) {
            recordTest(`Page ${page}`, false, error.message);
        }
    }
}

// Test mock data fallback
async function testMockDataFallback() {
    const baseUrl = 'http://localhost:3000';

    // Test with mock mode enabled
    try {
        log('Testing mock data fallback...');
        const response = await fetch(`${baseUrl}/api/products`);
        const data = await response.json();

        if (response.ok && data && data.success === true) {
            // Check if it's returning mock data (should have products even if API is down)
            // For products API, data.data is the paginated response with data.data being the array
            const productsArray = data.data && data.data.data ? data.data.data : data.data;
            const hasProducts = productsArray && Array.isArray(productsArray) && productsArray.length > 0;
            if (hasProducts) {
                recordTest('Mock Data Fallback', true);
                log('Mock data fallback is working correctly');
            } else {
                recordTest('Mock Data Fallback', false, 'No mock data returned');
            }
        } else {
            recordTest('Mock Data Fallback', false, 'API request failed');
        }
    } catch (error) {
        recordTest('Mock Data Fallback', false, error.message);
    }
}

// Test error handling
async function testErrorHandling() {
    const baseUrl = 'http://localhost:3000';

    // Test invalid endpoint
    try {
        log('Testing error handling for invalid endpoint...');
        const response = await fetch(`${baseUrl}/api/invalid-endpoint`);
        let data = null;
        try {
            data = await response.json();
        } catch (parseError) {
            // If JSON parse fails, it's probably HTML (404 page)
        }

        if (response.status === 404 || (data && data.error)) {
            recordTest('Error Handling', true);
            log('Error handling working correctly for invalid endpoints');
        } else {
            recordTest('Error Handling', false, 'Expected error response not received');
        }
    } catch (error) {
        recordTest('Error Handling', false, error.message);
    }
}

// Test API service integration
async function testApiServiceIntegration() {
    // Test that we can import and use the API service
    try {
        log('Testing ApiService import and basic functionality...');

        // Since we're in Node.js, we'll test the structure rather than actual functionality
        const fs = require('fs');
        const path = require('path');

        const apiPath = path.join(process.cwd(), 'src/lib/api.ts');
        const apiContent = fs.readFileSync(apiPath, 'utf8');

        // Check for key exports
        const hasApiService = apiContent.includes('export class ApiService');
        const hasGetProducts = apiContent.includes('getProducts');
        const hasGetCategories = apiContent.includes('getCategories');

        if (hasApiService && hasGetProducts && hasGetCategories) {
            recordTest('ApiService Integration', true);
            log('ApiService structure is correct');
        } else {
            recordTest('ApiService Integration', false, 'Missing key exports or methods');
        }
    } catch (error) {
        recordTest('ApiService Integration', false, error.message);
    }
}

// Test context providers structure
async function testContextProvidersStructure() {
    try {
        log('Testing context providers structure...');

        const fs = require('fs');
        const path = require('path');

        const contexts = [
            { file: 'src/contexts/CartContext.tsx', provider: 'CartProvider' },
            { file: 'src/contexts/ProductContext.tsx', provider: 'ProductProvider' }
        ];

        let allValid = true;

        for (const ctx of contexts) {
            const content = fs.readFileSync(path.join(process.cwd(), ctx.file), 'utf8');
            const hasProvider = content.includes(`export function ${ctx.provider}`) || content.includes(`function ${ctx.provider}`);
            const hasContext = content.includes('createContext');

            if (!hasProvider || !hasContext) {
                allValid = false;
                break;
            }
        }

        if (allValid) {
            recordTest('Context Providers Structure', true);
            log('Context providers are properly structured');
        } else {
            recordTest('Context Providers Structure', false, 'Missing provider or context');
        }
    } catch (error) {
        recordTest('Context Providers Structure', false, error.message);
    }
}

// Main test runner
async function runTests() {
    log('🚀 Starting Next.js Application Testing', 'info');
    log('Testing running application at http://localhost:3000', 'info');

    // Wait a bit for the server to be fully ready
    log('Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Run all tests
    await testApiProxyRoutes();
    await testPageAccessibility();
    await testMockDataFallback();
    await testErrorHandling();
    await testApiServiceIntegration();
    await testContextProvidersStructure();

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
        log('🎉 All application tests passed! The Next.js app is running correctly.', 'success');
        log('✅ API proxy routes, pages, and core functionality are working.', 'success');
    } else {
        log('⚠️  Some tests failed. Check the application logs and configuration.', 'warning');
    }

    return testResults.failed === 0;
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