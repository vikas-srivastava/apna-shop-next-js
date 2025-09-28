/**
 * Artillery Load Test Processor
 * Handles dynamic data generation and custom test logic
 */

const faker = require('faker');

// User pool for realistic testing
const users = [];
const products = [];
const categories = [];

// Initialize test data
function initializeTestData() {
    // Generate test users
    for (let i = 0; i < 100; i++) {
        users.push({
            id: i + 1,
            email: faker.internet.email(),
            password: 'password123',
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber()
        });
    }

    // Generate test products
    for (let i = 0; i < 50; i++) {
        products.push({
            id: i + 1,
            name: faker.commerce.productName(),
            price: faker.commerce.price(10, 1000),
            category: faker.commerce.department(),
            sku: faker.random.alphaNumeric(8).toUpperCase()
        });
    }

    // Generate test categories
    for (let i = 0; i < 10; i++) {
        categories.push({
            id: i + 1,
            name: faker.commerce.department(),
            slug: faker.helpers.slugify(faker.commerce.department())
        });
    }
}

// Custom functions for Artillery
module.exports = {
    // Initialize before tests start
    beforeRequest: (requestParams, context, ee, next) => {
        if (users.length === 0) {
            initializeTestData();
        }

        // Add random user agent
        requestParams.headers['User-Agent'] = faker.internet.userAgent();

        // Add realistic headers
        requestParams.headers['Accept-Language'] = 'en-US,en;q=0.9';
        requestParams.headers['Accept-Encoding'] = 'gzip, deflate, br';
        requestParams.headers['Cache-Control'] = 'no-cache';

        return next();
    },

    // Generate random product search query
    generateSearchQuery: (context, events, done) => {
        context.vars.searchQuery = faker.commerce.productName().split(' ')[0];
        context.vars.limit = faker.random.number({ min: 5, max: 50 });
        return done();
    },

    // Generate random product for cart operations
    generateRandomProduct: (context, events, done) => {
        const product = products[faker.random.number({ min: 0, max: products.length - 1 })];
        context.vars.productId = product.id;
        context.vars.quantity = faker.random.number({ min: 1, max: 5 });
        return done();
    },

    // Generate random user credentials
    generateRandomUser: (context, events, done) => {
        const user = users[faker.random.number({ min: 0, max: users.length - 1 })];
        context.vars.email = user.email;
        context.vars.password = user.password;
        context.vars.userId = user.id;
        return done();
    },

    // Generate random order data
    generateOrderData: (context, events, done) => {
        const itemCount = faker.random.number({ min: 1, max: 3 });
        const items = [];

        for (let i = 0; i < itemCount; i++) {
            const product = products[faker.random.number({ min: 0, max: products.length - 1 })];
            items.push({
                productId: product.id,
                quantity: faker.random.number({ min: 1, max: 3 }),
                price: product.price
            });
        }

        context.vars.orderData = {
            items: items,
            total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            currency: 'INR',
            shippingAddress: {
                name: faker.name.findName(),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                postalCode: faker.address.zipCode(),
                country: 'India'
            }
        };

        return done();
    },

    // Generate payment data
    generatePaymentData: (context, events, done) => {
        context.vars.paymentData = {
            amount: faker.random.number({ min: 100, max: 50000 }),
            currency: 'INR',
            orderId: faker.random.alphaNumeric(10).toUpperCase(),
            customerId: faker.random.number({ min: 1, max: 100 })
        };
        return done();
    },

    // Custom response validation
    validateResponse: (requestParams, response, context, ee, next) => {
        // Check for common error patterns
        if (response.statusCode >= 500) {
            console.error(`Server error on ${requestParams.url}: ${response.statusCode}`);
            events.emit('error', `Server error: ${response.statusCode}`);
        }

        if (response.statusCode >= 400 && response.statusCode < 500) {
            console.warn(`Client error on ${requestParams.url}: ${response.statusCode}`);
        }

        // Check response time
        if (response.timings && response.timings.phases && response.timings.phases.total) {
            const responseTime = response.timings.phases.total;
            if (responseTime > 5000) {
                console.warn(`Slow response on ${requestParams.url}: ${responseTime}ms`);
            }
        }

        return next();
    },

    // Generate realistic browsing patterns
    generateBrowsingPattern: (context, events, done) => {
        const patterns = [
            'homepage',
            'products',
            'categories',
            'search',
            'product-detail',
            'cart',
            'checkout'
        ];

        context.vars.browsingPattern = faker.random.arrayElement(patterns);
        context.vars.sessionId = faker.random.alphaNumeric(16);
        context.vars.timestamp = new Date().toISOString();

        return done();
    },

    // Generate realistic user behavior
    generateUserBehavior: (context, events, done) => {
        const behaviors = {
            newUser: 0.3,
            returningUser: 0.5,
            powerUser: 0.2
        };

        const behaviorType = faker.random.weightedObject(behaviors);
        context.vars.userBehavior = behaviorType;

        switch (behaviorType) {
            case 'newUser':
                context.vars.actions = ['browse', 'search', 'view-product'];
                break;
            case 'returningUser':
                context.vars.actions = ['browse', 'add-to-cart', 'checkout'];
                break;
            case 'powerUser':
                context.vars.actions = ['search', 'add-to-cart', 'checkout', 'review'];
                break;
        }

        return done();
    },

    // Generate realistic product interaction
    generateProductInteraction: (context, events, done) => {
        const interactions = [
            'view',
            'add-to-wishlist',
            'add-to-cart',
            'compare',
            'share'
        ];

        context.vars.interaction = faker.random.arrayElement(interactions);
        context.vars.productId = faker.random.number({ min: 1, max: 50 });
        context.vars.interactionData = {
            source: faker.random.arrayElement(['homepage', 'search', 'category', 'related']),
            timestamp: new Date().toISOString(),
            sessionId: faker.random.alphaNumeric(16)
        };

        return done();
    },

    // Generate realistic cart abandonment scenarios
    generateCartScenario: (context, events, done) => {
        const scenarios = {
            completePurchase: 0.4,
            abandonCart: 0.3,
            modifyCart: 0.2,
            saveForLater: 0.1
        };

        const scenario = faker.random.weightedObject(scenarios);
        context.vars.cartScenario = scenario;

        switch (scenario) {
            case 'completePurchase':
                context.vars.actions = ['add-to-cart', 'checkout', 'payment'];
                break;
            case 'abandonCart':
                context.vars.actions = ['add-to-cart', 'browse', 'leave'];
                break;
            case 'modifyCart':
                context.vars.actions = ['add-to-cart', 'update-quantity', 'continue-shopping'];
                break;
            case 'saveForLater':
                context.vars.actions = ['add-to-cart', 'save-for-later', 'continue-shopping'];
                break;
        }

        return done();
    }
};