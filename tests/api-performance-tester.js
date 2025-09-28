#!/usr/bin/env node

/**
 * Comprehensive API Performance Tester
 * Tests API endpoints for response times, throughput, and reliability
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ApiPerformanceTester {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:3000/api';
        this.outputDir = options.outputDir || './performance-results';
        this.concurrency = options.concurrency || 10;
        this.duration = options.duration || 30000; // 30 seconds
        this.timeout = options.timeout || 10000; // 10 seconds

        this.results = {
            timestamp: new Date().toISOString(),
            config: { baseUrl: this.baseUrl, concurrency: this.concurrency, duration: this.duration },
            endpoints: {},
            summary: {}
        };

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Test all API endpoints
     */
    async testAllEndpoints() {
        console.log('🚀 Starting API Performance Testing...');

        const endpoints = this.getApiEndpoints();
        const testPromises = endpoints.map(endpoint => this.testEndpoint(endpoint));

        try {
            await Promise.all(testPromises);
            this.calculateSummary();
            this.generateReport();
            console.log('✅ API Performance Testing completed!');
        } catch (error) {
            console.error('❌ API Performance Testing failed:', error);
        }
    }

    /**
     * Get list of API endpoints to test
     */
    getApiEndpoints() {
        return [
            {
                name: 'Get Products',
                method: 'GET',
                url: '/products',
                headers: {},
                expectedStatus: 200
            },
            {
                name: 'Get Categories',
                method: 'GET',
                url: '/categories',
                headers: {},
                expectedStatus: 200
            },
            {
                name: 'Get Cart',
                method: 'GET',
                url: '/cart',
                headers: {},
                expectedStatus: 200
            },
            {
                name: 'User Login',
                method: 'POST',
                url: '/auth/login',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                },
                expectedStatus: [200, 401]
            },
            {
                name: 'User Registration',
                method: 'POST',
                url: '/auth/register',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    password_confirmation: 'password123'
                },
                expectedStatus: [200, 400]
            },
            {
                name: 'Product Search',
                method: 'GET',
                url: '/products/search',
                headers: {},
                params: { q: 'laptop', limit: 20 },
                expectedStatus: 200
            },
            {
                name: 'Create Order',
                method: 'POST',
                url: '/orders',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    items: [{ productId: 1, quantity: 1 }],
                    total: 1000,
                    currency: 'INR'
                },
                expectedStatus: [200, 400]
            },
            {
                name: 'Payment Creation',
                method: 'POST',
                url: '/payments/create-razorpay-order',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    amount: 1000,
                    currency: 'INR'
                },
                expectedStatus: [200, 400]
            }
        ];
    }

    /**
     * Test a single API endpoint
     */
    async testEndpoint(endpointConfig) {
        console.log(`📡 Testing ${endpointConfig.name}...`);

        const results = {
            name: endpointConfig.name,
            method: endpointConfig.method,
            url: endpointConfig.url,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            responseTimes: [],
            statusCodes: {},
            errorTypes: {},
            throughput: 0,
            averageResponseTime: 0,
            minResponseTime: Infinity,
            maxResponseTime: 0,
            p50: 0,
            p95: 0,
            p99: 0,
            errorRate: 0
        };

        const testStart = Date.now();
        const maxRequests = this.concurrency * 10; // Limit total requests
        let activeRequests = 0;
        let completedRequests = 0;

        // Create concurrent requests
        const makeRequest = async () => {
            if (completedRequests >= maxRequests || (Date.now() - testStart) >= this.duration) {
                return;
            }

            activeRequests++;
            const requestStart = Date.now();

            try {
                const response = await axios({
                    method: endpointConfig.method,
                    url: `${this.baseUrl}${endpointConfig.url}`,
                    headers: endpointConfig.headers,
                    params: endpointConfig.params,
                    data: endpointConfig.body,
                    timeout: this.timeout
                });

                const responseTime = Date.now() - requestStart;

                results.totalRequests++;
                results.successfulRequests++;
                results.responseTimes.push(responseTime);
                results.minResponseTime = Math.min(results.minResponseTime, responseTime);
                results.maxResponseTime = Math.max(results.maxResponseTime, responseTime);

                // Track status codes
                const statusCode = response.status;
                results.statusCodes[statusCode] = (results.statusCodes[statusCode] || 0) + 1;

                // Validate expected status
                const expectedStatuses = Array.isArray(endpointConfig.expectedStatus)
                    ? endpointConfig.expectedStatus
                    : [endpointConfig.expectedStatus];

                if (!expectedStatuses.includes(statusCode)) {
                    console.warn(`Unexpected status code ${statusCode} for ${endpointConfig.name}`);
                }

            } catch (error) {
                results.totalRequests++;
                results.failedRequests++;

                const responseTime = Date.now() - requestStart;
                results.responseTimes.push(responseTime);
                results.minResponseTime = Math.min(results.minResponseTime, responseTime);
                results.maxResponseTime = Math.max(results.maxResponseTime, responseTime);

                // Track error types
                const errorType = error.code || error.response?.status || 'UNKNOWN';
                results.errorTypes[errorType] = (results.errorTypes[errorType] || 0) + 1;

                // Track error status codes
                if (error.response?.status) {
                    results.statusCodes[error.response.status] = (results.statusCodes[error.response.status] || 0) + 1;
                }
            }

            activeRequests--;
            completedRequests++;

            // Continue making requests if we haven't reached limits
            if (completedRequests < maxRequests && (Date.now() - testStart) < this.duration) {
                setImmediate(makeRequest);
            }
        };

        // Start concurrent requests
        const promises = [];
        for (let i = 0; i < this.concurrency; i++) {
            promises.push(makeRequest());
        }

        // Wait for all requests to complete or timeout
        await Promise.race([
            new Promise(resolve => {
                const checkComplete = () => {
                    if (completedRequests >= maxRequests || (Date.now() - testStart) >= this.duration) {
                        resolve();
                    } else {
                        setTimeout(checkComplete, 100);
                    }
                };
                checkComplete();
            }),
            new Promise(resolve => setTimeout(resolve, this.duration))
        ]);

        // Calculate statistics
        if (results.responseTimes.length > 0) {
            results.responseTimes.sort((a, b) => a - b);
            results.averageResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
            results.p50 = results.responseTimes[Math.floor(results.responseTimes.length * 0.5)];
            results.p95 = results.responseTimes[Math.floor(results.responseTimes.length * 0.95)];
            results.p99 = results.responseTimes[Math.floor(results.responseTimes.length * 0.99)];
        }

        results.errorRate = (results.failedRequests / results.totalRequests) * 100;
        results.throughput = results.totalRequests / ((Date.now() - testStart) / 1000);

        this.results.endpoints[endpointConfig.name] = results;
        return results;
    }

    /**
     * Calculate overall summary
     */
    calculateSummary() {
        const endpoints = Object.values(this.results.endpoints);

        if (endpoints.length === 0) return;

        this.results.summary = {
            totalEndpoints: endpoints.length,
            totalRequests: endpoints.reduce((sum, ep) => sum + ep.totalRequests, 0),
            totalSuccessful: endpoints.reduce((sum, ep) => sum + ep.successfulRequests, 0),
            totalFailed: endpoints.reduce((sum, ep) => sum + ep.failedRequests, 0),
            averageThroughput: endpoints.reduce((sum, ep) => sum + ep.throughput, 0) / endpoints.length,
            averageResponseTime: endpoints.reduce((sum, ep) => sum + ep.averageResponseTime, 0) / endpoints.length,
            averageErrorRate: endpoints.reduce((sum, ep) => sum + ep.errorRate, 0) / endpoints.length,
            slowestEndpoint: endpoints.reduce((slowest, ep) =>
                ep.averageResponseTime > slowest.averageResponseTime ? ep : slowest
            ),
            fastestEndpoint: endpoints.reduce((fastest, ep) =>
                ep.averageResponseTime < fastest.averageResponseTime ? ep : fastest
            )
        };
    }

    /**
     * Generate performance report
     */
    generateReport() {
        const reportPath = path.join(this.outputDir, `api-performance-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

        const summaryPath = path.join(this.outputDir, 'api-performance-summary.txt');
        const summary = this.generateSummaryText();
        fs.writeFileSync(summaryPath, summary);

        console.log(`\n📋 API Performance Report Generated:`);
        console.log(`  Full Report: ${reportPath}`);
        console.log(`  Summary: ${summaryPath}`);
    }

    /**
     * Generate human-readable summary
     */
    generateSummaryText() {
        const { endpoints, summary } = this.results;

        return `
API PERFORMANCE TEST SUMMARY
============================
Generated: ${this.results.timestamp}

TEST CONFIGURATION
------------------
Base URL: ${this.baseUrl}
Concurrency: ${this.concurrency}
Duration: ${this.duration}ms
Timeout: ${this.timeout}ms

OVERALL SUMMARY
---------------
Total Endpoints: ${summary.totalEndpoints || 0}
Total Requests: ${summary.totalRequests || 0}
Successful Requests: ${summary.totalSuccessful || 0}
Failed Requests: ${summary.totalFailed || 0}
Average Throughput: ${summary.averageThroughput?.toFixed(2) || 0} req/sec
Average Response Time: ${summary.averageResponseTime?.toFixed(2) || 0}ms
Average Error Rate: ${summary.averageErrorRate?.toFixed(2) || 0}%

ENDPOINT DETAILS
----------------
${Object.values(endpoints).map(endpoint => `
${endpoint.name}
  Method: ${endpoint.method}
  URL: ${endpoint.url}
  Requests: ${endpoint.totalRequests}
  Success Rate: ${((endpoint.successfulRequests / endpoint.totalRequests) * 100).toFixed(2)}%
  Error Rate: ${endpoint.errorRate.toFixed(2)}%
  Avg Response Time: ${endpoint.averageResponseTime.toFixed(2)}ms
  Min Response Time: ${endpoint.minResponseTime.toFixed(2)}ms
  Max Response Time: ${endpoint.maxResponseTime.toFixed(2)}ms
  Throughput: ${endpoint.throughput.toFixed(2)} req/sec
  P50: ${endpoint.p50.toFixed(2)}ms
  P95: ${endpoint.p95.toFixed(2)}ms
  P99: ${endpoint.p99.toFixed(2)}ms
`).join('')}

PERFORMANCE ANALYSIS
--------------------
${this.generateAnalysis()}

RECOMMENDATIONS
---------------
${this.generateRecommendations()}
    `.trim();
    }

    /**
     * Generate performance analysis
     */
    generateAnalysis() {
        const analysis = [];
        const { endpoints, summary } = this.results;

        // Overall performance
        if (summary.averageResponseTime > 2000) {
            analysis.push('⚠️  SLOW OVERALL PERFORMANCE: Average response time > 2s');
        } else if (summary.averageResponseTime > 1000) {
            analysis.push('⚡ MODERATE PERFORMANCE: Average response time between 1-2s');
        } else {
            analysis.push('✅ GOOD PERFORMANCE: Average response time < 1s');
        }

        // Error rate analysis
        if (summary.averageErrorRate > 10) {
            analysis.push('🚨 HIGH ERROR RATE: Average error rate > 10%');
        } else if (summary.averageErrorRate > 5) {
            analysis.push('⚠️  ELEVATED ERROR RATE: Average error rate between 5-10%');
        } else {
            analysis.push('✅ LOW ERROR RATE: Average error rate < 5%');
        }

        // Throughput analysis
        if (summary.averageThroughput < 10) {
            analysis.push('⚠️  LOW THROUGHPUT: Average throughput < 10 req/sec');
        } else if (summary.averageThroughput < 50) {
            analysis.push('⚡ MODERATE THROUGHPUT: Average throughput between 10-50 req/sec');
        } else {
            analysis.push('✅ GOOD THROUGHPUT: Average throughput > 50 req/sec');
        }

        // Individual endpoint analysis
        Object.values(endpoints).forEach(endpoint => {
            if (endpoint.averageResponseTime > 5000) {
                analysis.push(`🚨 ${endpoint.name}: Very slow response time (${endpoint.averageResponseTime.toFixed(2)}ms)`);
            } else if (endpoint.errorRate > 20) {
                analysis.push(`🚨 ${endpoint.name}: High error rate (${endpoint.errorRate.toFixed(2)}%)`);
            }
        });

        return analysis.join('\n');
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const { endpoints, summary } = this.results;

        if (summary.averageResponseTime > 2000) {
            recommendations.push('• Implement caching for frequently accessed data');
            recommendations.push('• Optimize database queries and add indexes');
            recommendations.push('• Consider using a CDN for static assets');
        }

        if (summary.averageErrorRate > 5) {
            recommendations.push('• Add better error handling and logging');
            recommendations.push('• Implement circuit breaker pattern');
            recommendations.push('• Add request validation and sanitization');
        }

        if (summary.averageThroughput < 50) {
            recommendations.push('• Optimize server configuration');
            recommendations.push('• Consider horizontal scaling');
            recommendations.push('• Implement connection pooling');
        }

        // Specific endpoint recommendations
        Object.values(endpoints).forEach(endpoint => {
            if (endpoint.averageResponseTime > 3000) {
                recommendations.push(`• Optimize ${endpoint.name}: High response time (${endpoint.averageResponseTime.toFixed(2)}ms)`);
            }
            if (endpoint.errorRate > 15) {
                recommendations.push(`• Fix ${endpoint.name}: High error rate (${endpoint.errorRate.toFixed(2)}%)`);
            }
        });

        if (recommendations.length === 0) {
            recommendations.push('✅ All API endpoints are performing well');
        }

        return recommendations.map(rec => `  ${rec}`).join('\n');
    }
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    let options = {};

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--base-url':
            case '-b':
                options.baseUrl = args[++i];
                break;
            case '--concurrency':
            case '-c':
                options.concurrency = parseInt(args[++i]);
                break;
            case '--duration':
            case '-d':
                options.duration = parseInt(args[++i]);
                break;
            case '--timeout':
            case '-t':
                options.timeout = parseInt(args[++i]);
                break;
            case '--output-dir':
            case '-o':
                options.outputDir = args[++i];
                break;
            case '--help':
            case '-h':
                console.log(`
API Performance Tester Usage:
  node api-performance-tester.js [options]

Options:
  -b, --base-url <url>        API base URL (default: http://localhost:3000/api)
  -c, --concurrency <num>     Number of concurrent requests (default: 10)
  -d, --duration <ms>         Test duration in milliseconds (default: 30000)
  -t, --timeout <ms>          Request timeout in milliseconds (default: 10000)
  -o, --output-dir <dir>      Output directory for reports (default: ./performance-results)
  -h, --help                  Show this help message

Examples:
  node api-performance-tester.js -b http://localhost:3000/api -c 20 -d 60000
  node api-performance-tester.js --base-url https://api.example.com --concurrency 50
        `);
                return;
        }
    }

    const tester = new ApiPerformanceTester(options);
    tester.testAllEndpoints();
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = ApiPerformanceTester;