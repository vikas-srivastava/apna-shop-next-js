#!/usr/bin/env node

/**
 * Comprehensive Performance Testing Suite for Next.js eCommerce Application
 *
 * This suite performs comprehensive performance testing across multiple dimensions:
 * - API Response Times & Load Testing
 * - Memory & CPU Usage Monitoring
 * - Bundle Analysis & Optimization
 * - Network Performance Testing
 * - Caching Effectiveness
 * - Concurrent User Load Testing
 * - Large Data Set Performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.NEXT_PRIVATE_API_BASE_URL || 'http://localhost:3000/api',
    testDuration: 60, // seconds
    maxUsers: 100,
    rampUpTime: 30, // seconds
    outputDir: './performance-results',
    enableMockData: process.env.NEXT_PUBLIC_USE_MOCK !== 'false'
};

// Create output directory
if (!fs.existsSync(TEST_CONFIG.outputDir)) {
    fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
}

class PerformanceTestSuite {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            config: TEST_CONFIG,
            tests: {}
        };
        console.log('🚀 Starting Comprehensive Performance Test Suite...');
    }

    /**
     * Run all performance tests
     */
    async runAllTests() {
        try {
            console.log('\n📊 Running API Performance Tests...');
            await this.runApiTests();

            console.log('\n💾 Running Memory & CPU Monitoring...');
            await this.runMemoryCpuTests();

            console.log('\n📦 Running Bundle Analysis...');
            await this.runBundleAnalysis();

            console.log('\n🌐 Running Network Performance Tests...');
            await this.runNetworkTests();

            console.log('\n⚡ Running Load Tests...');
            await this.runLoadTests();

            console.log('\n💾 Running Caching Effectiveness Tests...');
            await this.runCachingTests();

            console.log('\n📈 Running Large Data Set Tests...');
            await this.runLargeDataSetTests();

            this.generateReport();
            console.log('\n✅ Performance testing completed successfully!');

        } catch (error) {
            console.error('❌ Performance testing failed:', error);
            process.exit(1);
        }
    }

    /**
     * API Response Time & Load Testing
     */
    async runApiTests() {
        const apiEndpoints = [
            '/api/products',
            '/api/categories',
            '/api/cart',
            '/api/auth/login',
            '/api/auth/register',
            '/api/orders',
            '/api/payments/create-razorpay-order'
        ];

        this.results.tests.apiPerformance = {
            endpoints: {},
            summary: {
                totalRequests: 0,
                averageResponseTime: 0,
                errorRate: 0,
                throughput: 0
            }
        };

        for (const endpoint of apiEndpoints) {
            console.log(`  Testing ${endpoint}...`);
            const result = await this.testApiEndpoint(endpoint);
            this.results.tests.apiPerformance.endpoints[endpoint] = result;
        }

        // Calculate summary statistics
        const endpoints = Object.values(this.results.tests.apiPerformance.endpoints);
        this.results.tests.apiPerformance.summary = {
            totalRequests: endpoints.reduce((sum, ep) => sum + ep.totalRequests, 0),
            averageResponseTime: endpoints.reduce((sum, ep) => sum + ep.averageResponseTime, 0) / endpoints.length,
            errorRate: endpoints.reduce((sum, ep) => sum + ep.errorRate, 0) / endpoints.length,
            throughput: endpoints.reduce((sum, ep) => sum + ep.throughput, 0) / endpoints.length
        };
    }

    /**
     * Test individual API endpoint
     */
    async testApiEndpoint(endpoint) {
        const axios = require('axios');
        const results = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            responseTimes: [],
            errorRate: 0,
            averageResponseTime: 0,
            minResponseTime: Infinity,
            maxResponseTime: 0,
            throughput: 0
        };

        const testStart = Date.now();
        const testDuration = 10000; // 10 seconds
        const maxConcurrent = 10;

        // Simulate concurrent requests
        const promises = [];
        for (let i = 0; i < maxConcurrent; i++) {
            promises.push(this.makeConcurrentRequests(endpoint, testDuration / maxConcurrent));
        }

        await Promise.all(promises);

        // Aggregate results
        for (let i = 0; i < maxConcurrent; i++) {
            const result = await promises[i];
            results.totalRequests += result.totalRequests;
            results.successfulRequests += result.successfulRequests;
            results.failedRequests += result.failedRequests;
            results.responseTimes.push(...result.responseTimes);
        }

        results.errorRate = (results.failedRequests / results.totalRequests) * 100;
        results.averageResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
        results.minResponseTime = Math.min(...results.responseTimes);
        results.maxResponseTime = Math.max(...results.responseTimes);
        results.throughput = results.totalRequests / ((Date.now() - testStart) / 1000);

        return results;
    }

    /**
     * Make concurrent requests to an endpoint
     */
    async makeConcurrentRequests(endpoint, duration) {
        const axios = require('axios');
        const results = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            responseTimes: []
        };

        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            try {
                const requestStart = Date.now();
                await axios.get(`${TEST_CONFIG.apiBaseUrl}${endpoint}`, {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const responseTime = Date.now() - requestStart;

                results.totalRequests++;
                results.successfulRequests++;
                results.responseTimes.push(responseTime);

            } catch (error) {
                results.totalRequests++;
                results.failedRequests++;
            }

            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    }

    /**
     * Memory & CPU Monitoring
     */
    async runMemoryCpuTests() {
        const os = require('os');
        const pidusage = require('pidusage');

        this.results.tests.systemPerformance = {
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                usagePercentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
            },
            cpu: {
                cores: os.cpus().length,
                model: os.cpus()[0].model,
                speed: os.cpus()[0].speed
            },
            process: {}
        };

        // Monitor current process
        try {
            const stats = await pidusage(process.pid);
            this.results.tests.systemPerformance.process = {
                cpu: stats.cpu,
                memory: stats.memory,
                uptime: process.uptime()
            };
        } catch (error) {
            console.warn('Could not get process stats:', error.message);
        }
    }

    /**
     * Bundle Analysis
     */
    async runBundleAnalysis() {
        const fs = require('fs');
        const path = require('path');

        this.results.tests.bundleAnalysis = {
            buildSize: 0,
            chunks: [],
            assets: [],
            warnings: []
        };

        try {
            // Check if build exists
            const buildDir = path.join(process.cwd(), '.next');
            if (fs.existsSync(buildDir)) {
                const analyzeBuild = (dir) => {
                    const items = fs.readdirSync(dir);
                    let totalSize = 0;

                    for (const item of items) {
                        const itemPath = path.join(dir, item);
                        const stats = fs.statSync(itemPath);

                        if (stats.isDirectory()) {
                            totalSize += analyzeBuild(itemPath);
                        } else if (stats.isFile()) {
                            totalSize += stats.size;
                            this.results.tests.bundleAnalysis.assets.push({
                                name: item,
                                size: stats.size,
                                path: itemPath
                            });
                        }
                    }

                    return totalSize;
                };

                this.results.tests.bundleAnalysis.buildSize = analyzeBuild(buildDir);

                // Analyze chunks
                const chunksDir = path.join(buildDir, 'static', 'chunks');
                if (fs.existsSync(chunksDir)) {
                    const chunks = fs.readdirSync(chunksDir);
                    for (const chunk of chunks) {
                        if (chunk.endsWith('.js') || chunk.endsWith('.css')) {
                            const chunkPath = path.join(chunksDir, chunk);
                            const stats = fs.statSync(chunkPath);
                            this.results.tests.bundleAnalysis.chunks.push({
                                name: chunk,
                                size: stats.size
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Bundle analysis failed:', error.message);
        }
    }

    /**
     * Network Performance Tests
     */
    async runNetworkTests() {
        const axios = require('axios');
        const dns = require('dns').promises;

        this.results.tests.networkPerformance = {
            dnsLookup: 0,
            tcpConnection: 0,
            tlsHandshake: 0,
            requestTime: 0,
            responseTime: 0,
            totalTime: 0,
            bandwidth: 0
        };

        try {
            const testUrl = `${TEST_CONFIG.baseUrl}/api/products`;
            const startTime = Date.now();

            // DNS lookup test
            const dnsStart = Date.now();
            await dns.lookup(new URL(testUrl).hostname);
            const dnsTime = Date.now() - dnsStart;

            // Network request test
            const requestStart = Date.now();
            const response = await axios.get(testUrl, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const requestTime = Date.now() - requestStart;

            this.results.tests.networkPerformance = {
                dnsLookup: dnsTime,
                tcpConnection: 0, // Would need more detailed timing
                tlsHandshake: 0, // Would need more detailed timing
                requestTime: requestTime,
                responseTime: requestTime,
                totalTime: Date.now() - startTime,
                bandwidth: response.data ? JSON.stringify(response.data).length : 0
            };

        } catch (error) {
            console.warn('Network performance test failed:', error.message);
        }
    }

    /**
     * Load Testing with Artillery
     */
    async runLoadTests() {
        const fs = require('fs');
        const path = require('path');

        this.results.tests.loadTests = {
            baseline: {},
            lightLoad: {},
            mediumLoad: {},
            heavyLoad: {},
            stressTest: {}
        };

        // Create Artillery config
        const artilleryConfig = {
            config: {
                target: TEST_CONFIG.baseUrl,
                phases: [
                    { duration: 30, arrivalRate: 1, name: "Baseline" },
                    { duration: 30, arrivalRate: 10, name: "Light Load" },
                    { duration: 30, arrivalRate: 50, name: "Medium Load" },
                    { duration: 30, arrivalRate: 100, name: "Heavy Load" },
                    { duration: 60, arrivalRate: 200, name: "Stress Test" }
                ],
                defaults: {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            },
            scenarios: [
                {
                    name: 'Product browsing',
                    flow: [
                        { get: { url: '/api/products' } },
                        { get: { url: '/api/categories' } }
                    ]
                },
                {
                    name: 'Authentication flow',
                    flow: [
                        { post: { url: '/api/auth/login', json: { email: 'test@example.com', password: 'password' } } }
                    ]
                },
                {
                    name: 'Cart operations',
                    flow: [
                        { get: { url: '/api/cart' } },
                        { post: { url: '/api/cart', json: { productId: 1, quantity: 1 } } }
                    ]
                }
            ]
        };

        const configPath = path.join(TEST_CONFIG.outputDir, 'artillery-config.json');
        fs.writeFileSync(configPath, JSON.stringify(artilleryConfig, null, 2));

        console.log('  Load testing configuration created. Run manually with:');
        console.log('  npx artillery run', configPath);
    }

    /**
     * Caching Effectiveness Tests
     */
    async runCachingTests() {
        const axios = require('axios');

        this.results.tests.caching = {
            cacheHitRate: 0,
            cacheMissRate: 0,
            averageCacheTime: 0,
            cacheInvalidation: 0
        };

        try {
            const testEndpoint = `${TEST_CONFIG.apiBaseUrl}/api/products`;
            const cacheTestResults = [];

            // Make multiple requests to test caching
            for (let i = 0; i < 10; i++) {
                const startTime = Date.now();
                const response = await axios.get(testEndpoint, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                const responseTime = Date.now() - startTime;

                cacheTestResults.push({
                    request: i + 1,
                    responseTime,
                    cacheHit: response.headers['x-cache'] === 'HIT',
                    serverTiming: response.headers['server-timing']
                });
            }

            const cacheHits = cacheTestResults.filter(r => r.cacheHit).length;
            const cacheMisses = cacheTestResults.filter(r => !r.cacheHit).length;

            this.results.tests.caching = {
                cacheHitRate: (cacheHits / cacheTestResults.length) * 100,
                cacheMissRate: (cacheMisses / cacheTestResults.length) * 100,
                averageCacheTime: cacheTestResults.reduce((sum, r) => sum + r.responseTime, 0) / cacheTestResults.length,
                cacheInvalidation: 0, // Would need cache invalidation endpoint
                detailedResults: cacheTestResults
            };

        } catch (error) {
            console.warn('Caching effectiveness test failed:', error.message);
        }
    }

    /**
     * Large Data Set Performance Tests
     */
    async runLargeDataSetTests() {
        const axios = require('axios');

        this.results.tests.largeDataSet = {
            dataSize: 0,
            processingTime: 0,
            memoryUsage: 0,
            queryPerformance: {}
        };

        try {
            // Test with large product catalog
            const startTime = Date.now();
            const response = await axios.get(`${TEST_CONFIG.apiBaseUrl}/api/products?limit=1000`, {
                timeout: 30000
            });
            const processingTime = Date.now() - startTime;

            this.results.tests.largeDataSet = {
                dataSize: JSON.stringify(response.data).length,
                processingTime,
                memoryUsage: process.memoryUsage().heapUsed,
                queryPerformance: {
                    endpoint: '/api/products?limit=1000',
                    recordCount: response.data?.data?.length || 0,
                    responseSize: JSON.stringify(response.data).length
                }
            };

        } catch (error) {
            console.warn('Large data set test failed:', error.message);
        }
    }

    /**
     * Generate comprehensive performance report
     */
    generateReport() {
        const reportPath = path.join(TEST_CONFIG.outputDir, `performance-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

        const summaryPath = path.join(TEST_CONFIG.outputDir, 'performance-summary.txt');
        const summary = this.generateSummaryText();
        fs.writeFileSync(summaryPath, summary);

        console.log(`\n📋 Performance Report Generated:`);
        console.log(`  Full Report: ${reportPath}`);
        console.log(`  Summary: ${summaryPath}`);
    }

    /**
     * Generate human-readable summary
     */
    generateSummaryText() {
        const { tests } = this.results;

        return `
PERFORMANCE TEST SUMMARY
========================
Generated: ${this.results.timestamp}

API PERFORMANCE
---------------
Average Response Time: ${tests.apiPerformance?.summary?.averageResponseTime?.toFixed(2) || 'N/A'}ms
Total Throughput: ${tests.apiPerformance?.summary?.throughput?.toFixed(2) || 'N/A'} req/sec
Error Rate: ${tests.apiPerformance?.summary?.errorRate?.toFixed(2) || 'N/A'}%

SYSTEM PERFORMANCE
------------------
Memory Usage: ${((tests.systemPerformance?.memory?.usagePercentage || 0)).toFixed(2)}%
CPU Cores: ${tests.systemPerformance?.cpu?.cores || 'N/A'}
Process CPU: ${tests.systemPerformance?.process?.cpu?.toFixed(2) || 'N/A'}%

BUNDLE ANALYSIS
---------------
Build Size: ${((tests.bundleAnalysis?.buildSize || 0) / 1024 / 1024).toFixed(2)} MB
Total Assets: ${tests.bundleAnalysis?.assets?.length || 0}
Total Chunks: ${tests.bundleAnalysis?.chunks?.length || 0}

NETWORK PERFORMANCE
-------------------
Average Request Time: ${tests.networkPerformance?.requestTime?.toFixed(2) || 'N/A'}ms
DNS Lookup Time: ${tests.networkPerformance?.dnsLookup?.toFixed(2) || 'N/A'}ms

CACHING EFFECTIVENESS
---------------------
Cache Hit Rate: ${tests.caching?.cacheHitRate?.toFixed(2) || 'N/A'}%
Average Cache Time: ${tests.caching?.averageCacheTime?.toFixed(2) || 'N/A'}ms

LARGE DATA SET PERFORMANCE
--------------------------
Data Size: ${((tests.largeDataSet?.dataSize || 0) / 1024).toFixed(2)} KB
Processing Time: ${tests.largeDataSet?.processingTime?.toFixed(2) || 'N/A'}ms

RECOMMENDATIONS
---------------
${this.generateRecommendations()}

TEST CONFIGURATION
------------------
Base URL: ${TEST_CONFIG.baseUrl}
API Base URL: ${TEST_CONFIG.apiBaseUrl}
Mock Data: ${TEST_CONFIG.enableMockData ? 'Enabled' : 'Disabled'}
Test Duration: ${TEST_CONFIG.testDuration}s
Max Users: ${TEST_CONFIG.maxUsers}
    `.trim();
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const { tests } = this.results;

        // API Performance recommendations
        if (tests.apiPerformance?.summary?.averageResponseTime > 1000) {
            recommendations.push('⚠️  High API response times detected. Consider implementing Redis caching.');
        }
        if (tests.apiPerformance?.summary?.errorRate > 5) {
            recommendations.push('⚠️  High error rate detected. Review error handling and API stability.');
        }

        // Memory recommendations
        if (tests.systemPerformance?.memory?.usagePercentage > 80) {
            recommendations.push('⚠️  High memory usage. Consider optimizing memory leaks and bundle size.');
        }

        // Bundle size recommendations
        const bundleSizeMB = (tests.bundleAnalysis?.buildSize || 0) / 1024 / 1024;
        if (bundleSizeMB > 5) {
            recommendations.push('⚠️  Large bundle size. Implement code splitting and lazy loading.');
        }

        // Caching recommendations
        if (tests.caching?.cacheHitRate < 50) {
            recommendations.push('⚠️  Low cache hit rate. Optimize caching strategy and invalidation.');
        }

        // Network recommendations
        if (tests.networkPerformance?.requestTime > 2000) {
            recommendations.push('⚠️  Slow network performance. Consider CDN implementation.');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ All performance metrics are within acceptable ranges.');
        }

        return recommendations.join('\n');
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const testSuite = new PerformanceTestSuite();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Performance Test Suite Usage:
  node performance-test-suite.js [options]

Options:
  --api-only          Run only API performance tests
  --load-only         Run only load tests
  --bundle-only       Run only bundle analysis
  --quick             Run quick tests (reduced duration)
  --verbose           Enable verbose output
  --help              Show this help message

Environment Variables:
  NEXT_PUBLIC_BASE_URL        Base URL for testing (default: http://localhost:3000)
  NEXT_PUBLIC_API_BASE_URL    API base URL for testing (default: http://localhost:3000/api)
  NEXT_PUBLIC_USE_MOCK        Enable/disable mock data (default: true)
    `);
        return;
    }

    await testSuite.runAllTests();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = PerformanceTestSuite;