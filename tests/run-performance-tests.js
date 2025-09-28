#!/usr/bin/env node

/**
 * Performance Test Runner
 * Orchestrates all performance testing tools and generates comprehensive reports
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class PerformanceTestRunner {
    constructor(options = {}) {
        this.outputDir = options.outputDir || './performance-results';
        this.baseUrl = options.baseUrl || 'http://localhost:3000';
        this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:3000/api';
        this.testDuration = options.testDuration || 60; // seconds
        this.concurrency = options.concurrency || 10;
        this.enableLighthouse = options.enableLighthouse !== false;
        this.enableLoadTest = options.enableLoadTest !== false;
        this.enableBundleAnalysis = options.enableBundleAnalysis !== false;

        this.results = {
            timestamp: new Date().toISOString(),
            config: options,
            testResults: {},
            summary: {},
            recommendations: []
        };

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Run all performance tests
     */
    async runAllTests() {
        console.log('🚀 Starting Comprehensive Performance Test Suite...\n');

        const testStart = Date.now();

        try {
            // 1. API Performance Tests
            console.log('📡 Running API Performance Tests...');
            await this.runApiTests();

            // 2. Bundle Analysis
            if (this.enableBundleAnalysis) {
                console.log('\n📦 Running Bundle Analysis...');
                await this.runBundleAnalysis();
            }

            // 3. Lighthouse Performance Audit
            if (this.enableLighthouse) {
                console.log('\n🔍 Running Lighthouse Performance Audit...');
                await this.runLighthouseAudit();
            }

            // 4. Load Testing
            if (this.enableLoadTest) {
                console.log('\n⚡ Running Load Tests...');
                await this.runLoadTests();
            }

            // 5. Memory & CPU Monitoring
            console.log('\n📊 Running Memory & CPU Monitoring...');
            await this.runMemoryCpuMonitoring();

            // Generate comprehensive report
            this.generateComprehensiveReport();

            const totalDuration = (Date.now() - testStart) / 1000;
            console.log(`\n✅ All performance tests completed in ${totalDuration.toFixed(2)} seconds!`);

        } catch (error) {
            console.error('❌ Performance testing failed:', error);
            process.exit(1);
        }
    }

    /**
     * Run API performance tests
     */
    async runApiTests() {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, 'api-performance-tester.js');</search >
</search_and_replace >
            const output = path.join(this.outputDir, 'api-performance-results.json');

            const child = spawn('node', [scriptPath,
                '--base-url', this.apiBaseUrl,
                '--concurrency', this.concurrency.toString(),
                '--duration', '30000',
                '--output-dir', this.outputDir
            ], { stdio: 'inherit' });

            child.on('close', (code) => {
                if (code === 0) {
                    try {
                        const results = JSON.parse(fs.readFileSync(output, 'utf8'));
                        this.results.testResults.apiPerformance = results;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`API tests failed with exit code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }

    /**
     * Run bundle analysis
     */
    async runBundleAnalysis() {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, 'bundle-analyzer.js');

            const child = spawn('node', [scriptPath], { stdio: 'inherit' });

            child.on('close', (code) => {
                if (code === 0) {
                    try {
                        const results = JSON.parse(fs.readFileSync('bundle-analysis-report.json', 'utf8'));
                        this.results.testResults.bundleAnalysis = results;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Bundle analysis failed with exit code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }

    /**
     * Run Lighthouse performance audit
     */
    async runLighthouseAudit() {
        return new Promise((resolve, reject) => {
            const lighthouseConfig = path.join(__dirname, 'lighthouse-config.json');
            const output = path.join(this.outputDir, 'lighthouse-report.json');

            const child = spawn('npx', ['lighthouse-ci', 'autorun', '--config', lighthouseConfig], {
                stdio: 'inherit',
                env: { ...process.env, LHCI_BUILD_CONTEXT__CURRENT_HASH: Date.now().toString() }
            });

            child.on('close', (code) => {
                if (code === 0) {
                    // Lighthouse CI generates its own reports
                    this.results.testResults.lighthouse = { status: 'completed', output };
                    resolve();
                } else {
                    console.warn(`⚠️  Lighthouse audit failed with exit code ${code}, continuing...`);
                    this.results.testResults.lighthouse = { status: 'failed', exitCode: code };
                    resolve(); // Don't fail the entire test suite
                }
            });

            child.on('error', (error) => {
                console.warn('⚠️  Lighthouse not available, skipping...', error.message);
                this.results.testResults.lighthouse = { status: 'skipped', reason: 'not_available' };
                resolve();
            });
        });
    }

    /**
     * Run load tests with Artillery
     */
    async runLoadTests() {
        return new Promise((resolve, reject) => {
            const configPath = path.join(__dirname, 'load-test-config.yml');
            const output = path.join(this.outputDir, 'load-test-report.json');

            const child = spawn('npx', ['artillery', 'run', '--config', configPath, '--output', output], {
                stdio: 'inherit'
            });

            child.on('close', (code) => {
                if (code === 0) {
                    try {
                        const results = JSON.parse(fs.readFileSync(output, 'utf8'));
                        this.results.testResults.loadTests = results;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    console.warn(`⚠️  Load tests failed with exit code ${code}, continuing...`);
                    this.results.testResults.loadTests = { status: 'failed', exitCode: code };
                    resolve(); // Don't fail the entire test suite
                }
            });

            child.on('error', (error) => {
                console.warn('⚠️  Artillery not available, skipping load tests...', error.message);
                this.results.testResults.loadTests = { status: 'skipped', reason: 'not_available' };
                resolve();
            });
        });
    }

    /**
     * Run memory and CPU monitoring
     */
    async runMemoryCpuMonitoring() {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, 'memory-cpu-monitor.js');
            const output = path.join(this.outputDir, 'memory-cpu-report.json');

            const child = spawn('node', [scriptPath,
                '--duration', this.testDuration.toString(),
                '--output-dir', this.outputDir,
                '--csv'
            ], { stdio: 'inherit' });

            child.on('close', (code) => {
                if (code === 0) {
                    try {
                        const results = JSON.parse(fs.readFileSync(output, 'utf8'));
                        this.results.testResults.systemPerformance = results;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Memory/CPU monitoring failed with exit code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }

    /**
     * Generate comprehensive report
     */
    generateComprehensiveReport() {
        this.calculateOverallSummary();
        this.generateRecommendations();

        const reportPath = path.join(this.outputDir, `comprehensive-performance-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

        const summaryPath = path.join(this.outputDir, 'performance-summary.txt');
        const summary = this.generateSummaryText();
        fs.writeFileSync(summaryPath, summary);

        console.log(`\n📋 Comprehensive Performance Report Generated:`);
        console.log(`  Full Report: ${reportPath}`);
        console.log(`  Summary: ${summaryPath}`);
    }

    /**
     * Calculate overall summary
     */
    calculateOverallSummary() {
        const { testResults } = this.results;

        this.results.summary = {
            testDuration: this.testDuration,
            baseUrl: this.baseUrl,
            apiBaseUrl: this.apiBaseUrl,
            timestamp: new Date().toISOString(),

            // API Performance Summary
            apiPerformance: testResults.apiPerformance?.summary || {},

            // Bundle Analysis Summary
            bundleAnalysis: testResults.bundleAnalysis ? {
                totalSize: testResults.bundleAnalysis.summary?.totalSize || 0,
                totalFiles: testResults.bundleAnalysis.summary?.totalFiles || 0,
                largestFiles: testResults.bundleAnalysis.summary?.largestFiles || []
            } : {},

            // System Performance Summary
            systemPerformance: testResults.systemPerformance?.summary || {},

            // Test Status
            testStatus: {
                apiPerformance: testResults.apiPerformance ? 'completed' : 'failed',
                bundleAnalysis: testResults.bundleAnalysis ? 'completed' : 'failed',
                lighthouse: testResults.lighthouse?.status || 'failed',
                loadTests: testResults.loadTests?.status || 'failed',
                systemPerformance: testResults.systemPerformance ? 'completed' : 'failed'
            }
        };
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const { testResults, summary } = this.results;

        // API Performance recommendations
        if (summary.apiPerformance.averageResponseTime > 2000) {
            recommendations.push({
                category: 'API Performance',
                priority: 'high',
                title: 'High API Response Times',
                description: `Average response time is ${summary.apiPerformance.averageResponseTime?.toFixed(2)}ms`,
                actions: [
                    'Implement Redis caching for frequently accessed data',
                    'Optimize database queries and add indexes',
                    'Consider using a CDN for static assets',
                    'Implement connection pooling'
                ]
            });
        }

        // Bundle size recommendations
        if (testResults.bundleAnalysis) {
            const bundleSizeMB = (summary.bundleAnalysis.totalSize || 0) / 1024 / 1024;
            if (bundleSizeMB > 5) {
                recommendations.push({
                    category: 'Bundle Size',
                    priority: 'high',
                    title: 'Large Bundle Size',
                    description: `Bundle size is ${bundleSizeMB.toFixed(2)} MB`,
                    actions: [
                        'Implement code splitting and lazy loading',
                        'Remove unused dependencies',
                        'Use dynamic imports for route-based splitting',
                        'Optimize static asset imports'
                    ]
                });
            }
        }

        // System performance recommendations
        if (testResults.systemPerformance) {
            const { memory, cpu } = summary.systemPerformance;
            if (memory?.average > 80) {
                recommendations.push({
                    category: 'System Performance',
                    priority: 'medium',
                    title: 'High Memory Usage',
                    description: `Average memory usage is ${memory?.average?.toFixed(2)}%`,
                    actions: [
                        'Optimize memory usage in application code',
                        'Implement memory leak detection',
                        'Consider increasing server memory',
                        'Optimize garbage collection'
                    ]
                });
            }

            if (cpu?.average > 80) {
                recommendations.push({
                    category: 'System Performance',
                    priority: 'medium',
                    title: 'High CPU Usage',
                    description: `Average CPU usage is ${cpu?.average?.toFixed(2)}%`,
                    actions: [
                        'Optimize CPU-intensive operations',
                        'Implement caching for expensive computations',
                        'Consider load balancing',
                        'Profile and optimize bottlenecks'
                    ]
                });
            }
        }

        // Error rate recommendations
        if (summary.apiPerformance.averageErrorRate > 5) {
            recommendations.push({
                category: 'Reliability',
                priority: 'high',
                title: 'High Error Rate',
                description: `Average error rate is ${summary.apiPerformance.averageErrorRate?.toFixed(2)}%`,
                actions: [
                    'Add comprehensive error handling',
                    'Implement circuit breaker pattern',
                    'Add request validation and sanitization',
                    'Improve logging and monitoring'
                ]
            });
        }

        this.results.recommendations = recommendations;
    }

    /**
     * Generate human-readable summary
     */
    generateSummaryText() {
        const { summary, recommendations } = this.results;

        return `
COMPREHENSIVE PERFORMANCE TEST SUMMARY
======================================
Generated: ${this.results.timestamp}

TEST CONFIGURATION
------------------
Base URL: ${this.baseUrl}
API Base URL: ${this.apiBaseUrl}
Test Duration: ${this.testDuration} seconds
Concurrency: ${this.concurrency}

OVERALL RESULTS
---------------
${this.generateOverallResults()}

DETAILED ANALYSIS
-----------------
${this.generateDetailedAnalysis()}

RECOMMENDATIONS
---------------
${recommendations.map((rec, index) =>
            `${index + 1}. ${rec.priority.toUpperCase()}: ${rec.title}
   ${rec.description}
   Actions: ${rec.actions.map(action => `• ${action}`).join('\n           ')}`
        ).join('\n\n')}

TEST STATUS
-----------
API Performance: ${summary.testStatus?.apiPerformance || 'N/A'}
Bundle Analysis: ${summary.testStatus?.bundleAnalysis || 'N/A'}
Lighthouse: ${summary.testStatus?.lighthouse || 'N/A'}
Load Tests: ${summary.testStatus?.loadTests || 'N/A'}
System Performance: ${summary.testStatus?.systemPerformance || 'N/A'}

NEXT STEPS
----------
1. Review detailed reports in the performance-results directory
2. Implement high-priority recommendations
3. Re-run tests to measure improvements
4. Set up continuous performance monitoring
5. Consider production load testing before deployment
    `.trim();
    }

    /**
     * Generate overall results section
     */
    generateOverallResults() {
        const { summary } = this.results;
        const lines = [];

        if (summary.apiPerformance.averageResponseTime) {
            lines.push(`API Response Time: ${summary.apiPerformance.averageResponseTime.toFixed(2)}ms`);
        }

        if (summary.apiPerformance.averageThroughput) {
            lines.push(`API Throughput: ${summary.apiPerformance.averageThroughput.toFixed(2)} req/sec`);
        }

        if (summary.apiPerformance.averageErrorRate) {
            lines.push(`API Error Rate: ${summary.apiPerformance.averageErrorRate.toFixed(2)}%`);
        }

        if (summary.bundleAnalysis.totalSize) {
            const bundleSizeMB = (summary.bundleAnalysis.totalSize / 1024 / 1024).toFixed(2);
            lines.push(`Bundle Size: ${bundleSizeMB} MB`);
        }

        if (summary.systemPerformance.memory?.average) {
            lines.push(`Memory Usage: ${summary.systemPerformance.memory.average.toFixed(2)}%`);
        }

        if (summary.systemPerformance.cpu?.average) {
            lines.push(`CPU Usage: ${summary.systemPerformance.cpu.average.toFixed(2)}%`);
        }

        return lines.join('\n');
    }

    /**
     * Generate detailed analysis section
     */
    generateDetailedAnalysis() {
        const { testResults } = this.results;
        const lines = [];

        if (testResults.apiPerformance) {
            lines.push('API PERFORMANCE:');
            lines.push(`  • Total Endpoints: ${testResults.apiPerformance.summary?.totalEndpoints || 0}`);
            lines.push(`  • Total Requests: ${testResults.apiPerformance.summary?.totalRequests || 0}`);
            lines.push(`  • Slowest Endpoint: ${testResults.apiPerformance.summary?.slowestEndpoint?.name || 'N/A'}`);
            lines.push(`  • Fastest Endpoint: ${testResults.apiPerformance.summary?.fastestEndpoint?.name || 'N/A'}`);
        }

        if (testResults.bundleAnalysis) {
            lines.push('\nBUNDLE ANALYSIS:');
            lines.push(`  • Total Files: ${testResults.bundleAnalysis.summary?.totalFiles || 0}`);
            lines.push(`  • Largest Files: ${testResults.bundleAnalysis.summary?.largestFiles?.length || 0}`);
            lines.push(`  • Recommendations: ${testResults.bundleAnalysis.recommendations?.length || 0}`);
        }

        if (testResults.systemPerformance) {
            lines.push('\nSYSTEM PERFORMANCE:');
            lines.push(`  • Memory Range: ${testResults.systemPerformance.summary?.memory?.min?.toFixed(2)}% - ${testResults.systemPerformance.summary?.memory?.max?.toFixed(2)}%`);
            lines.push(`  • CPU Range: ${testResults.systemPerformance.summary?.cpu?.min?.toFixed(2)}% - ${testResults.systemPerformance.summary?.cpu?.max?.toFixed(2)}%`);
        }

        return lines.join('\n');
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
            case '--api-base-url':
            case '-a':
                options.apiBaseUrl = args[++i];
                break;
            case '--duration':
            case '-d':
                options.testDuration = parseInt(args[++i]);
                break;
            case '--concurrency':
            case '-c':
                options.concurrency = parseInt(args[++i]);
                break;
            case '--output-dir':
            case '-o':
                options.outputDir = args[++i];
                break;
            case '--skip-lighthouse':
                options.enableLighthouse = false;
                break;
            case '--skip-load-test':
                options.enableLoadTest = false;
                break;
            case '--skip-bundle-analysis':
                options.enableBundleAnalysis = false;
                break;
            case '--help':
            case '-h':
                console.log(`
Performance Test Runner Usage:
  node run-performance-tests.js [options]

Options:
  -b, --base-url <url>              Base URL for testing (default: http://localhost:3000)
  -a, --api-base-url <url>          API base URL for testing (default: http://localhost:3000/api)
  -d, --duration <seconds>          Test duration in seconds (default: 60)
  -c, --concurrency <num>           Number of concurrent requests (default: 10)
  -o, --output-dir <dir>            Output directory for reports (default: ./performance-results)
  --skip-lighthouse                 Skip Lighthouse performance audit
  --skip-load-test                  Skip Artillery load testing
  --skip-bundle-analysis            Skip bundle analysis
  -h, --help                        Show this help message

Examples:
  node run-performance-tests.js -b http://localhost:3000 -d 120 -c 20
  node run-performance-tests.js --skip-lighthouse --skip-load-test
  node run-performance-tests.js --base-url https://myapp.com --api-base-url https://api.myapp.com
        `);
                return;
        }
    }

    const runner = new PerformanceTestRunner(options);
    runner.runAllTests();
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = PerformanceTestRunner;