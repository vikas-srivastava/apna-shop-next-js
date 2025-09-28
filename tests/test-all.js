#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Apna Shop
 * Runs all types of tests: unit, integration, performance, API, and application tests
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
    constructor() {
        this.results = {
            unit: null,
            integration: null,
            performance: null,
            api: null,
            application: null,
            security: null
        };
        this.startTime = Date.now();
        this.originalEnv = { ...process.env };
    }

    log(message, type = 'info') {
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

    // Enable mock mode for testing
    enableMockMode() {
        this.log('Enabling mock mode for testing...');
        process.env.NEXT_PUBLIC_USE_MOCK = 'true';
        this.writeEnvFile('.env.test', 'NEXT_PUBLIC_USE_MOCK=true\n');
    }

    // Restore original environment
    restoreEnvironment() {
        this.log('Restoring original environment...');
        Object.assign(process.env, this.originalEnv);
        if (fs.existsSync('.env.test')) {
            fs.unlinkSync('.env.test');
        }
    }

    writeEnvFile(filename, content) {
        try {
            fs.writeFileSync(filename, content);
            this.log(`Created ${filename}`);
        } catch (error) {
            this.log(`Failed to create ${filename}: ${error.message}`, 'error');
        }
    }

    // Run unit tests (Jest)
    async runUnitTests() {
        this.log('Running Unit Tests...');
        try {
            execSync('npm test -- --watchAll=false --passWithNoTests', {
                stdio: 'inherit',
                timeout: 300000 // 5 minutes
            });
            this.results.unit = { success: true, duration: Date.now() - this.startTime };
            this.log('✅ Unit tests passed', 'success');
        } catch (error) {
            this.results.unit = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ Unit tests failed: ${error.message}`, 'error');
        }
    }

    // Run integration tests
    async runIntegrationTests() {
        this.log('Running Integration Tests...');
        try {
            // Run Next.js build to check for integration issues
            execSync('npm run build', {
                stdio: 'inherit',
                timeout: 600000 // 10 minutes
            });
            this.results.integration = { success: true, duration: Date.now() - this.startTime };
            this.log('✅ Integration tests passed', 'success');
        } catch (error) {
            this.results.integration = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ Integration tests failed: ${error.message}`, 'error');
        }
    }

    // Run performance tests
    async runPerformanceTests() {
        this.log('Running Performance Tests...');
        try {
            // Run API performance tests
            execSync('node api-performance-tester.js', {
                stdio: 'inherit',
                timeout: 300000 // 5 minutes
            });

            // Run comprehensive performance suite
            execSync('node performance-test-suite.js', {
                stdio: 'inherit',
                timeout: 300000 // 5 minutes
            });

            this.results.performance = { success: true, duration: Date.now() - this.startTime };
            this.log('✅ Performance tests completed', 'success');
        } catch (error) {
            this.results.performance = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ Performance tests failed: ${error.message}`, 'error');
        }
    }

    // Run API tests
    async runApiTests() {
        this.log('Running API Tests...');
        try {
            // Run live API tests (with mock fallback)
            execSync('node test-live-api.js', {
                stdio: 'inherit',
                timeout: 180000 // 3 minutes
            });

            // Run comprehensive API tests
            execSync('node test-comprehensive-api.js', {
                stdio: 'inherit',
                timeout: 180000 // 3 minutes
            });

            this.results.api = { success: true, duration: Date.now() - this.startTime };
            this.log('✅ API tests completed', 'success');
        } catch (error) {
            this.results.api = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ API tests failed: ${error.message}`, 'error');
        }
    }

    // Run application tests
    async runApplicationTests() {
        this.log('Running Application Tests...');
        try {
            // Run application component tests
            execSync('node test-application-components.js', {
                stdio: 'inherit',
                timeout: 120000 // 2 minutes
            });

            // Run Next.js application validation
            execSync('node test-nextjs-app.js', {
                stdio: 'inherit',
                timeout: 120000 // 2 minutes
            });

            // Run mock fallback tests
            execSync('node test-mock-fallback.js', {
                stdio: 'inherit',
                timeout: 120000 // 2 minutes
            });

            this.results.application = { success: true, duration: Date.now() - this.startTime };
            this.log('✅ Application tests completed', 'success');
        } catch (error) {
            this.results.application = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ Application tests failed: ${error.message}`, 'error');
        }
    }

    // Run security tests
    async runSecurityTests() {
        this.log('Running Security Tests...');
        try {
            // Test security implementations
            const securityTest = await this.testSecurityImplementations();
            if (securityTest) {
                this.results.security = { success: true, duration: Date.now() - this.startTime };
                this.log('✅ Security tests passed', 'success');
            } else {
                throw new Error('Security tests failed');
            }
        } catch (error) {
            this.results.security = { success: false, error: error.message, duration: Date.now() - this.startTime };
            this.log(`❌ Security tests failed: ${error.message}`, 'error');
        }
    }

    // Test security implementations
    async testSecurityImplementations() {
        // Import security modules and test basic functionality
        try {
            const { validateEmail } = require('./src/lib/validation.ts');
            const { JWTUtils } = require('./src/lib/security.ts');

            // Test email validation
            const emailResult = validateEmail('test@example.com');
            if (!emailResult.valid) {
                throw new Error('Email validation failed');
            }

            // Test JWT generation
            const token = JWTUtils.generateAccessToken({ userId: 'test' });
            if (!token) {
                throw new Error('JWT generation failed');
            }

            // Test JWT verification
            const decoded = JWTUtils.verifyToken(token);
            if (!decoded) {
                throw new Error('JWT verification failed');
            }

            return true;
        } catch (error) {
            this.log(`Security test error: ${error.message}`, 'error');
            return false;
        }
    }

    // Generate test report
    generateReport() {
        const totalDuration = Date.now() - this.startTime;
        const report = {
            timestamp: new Date().toISOString(),
            totalDuration: `${(totalDuration / 1000).toFixed(2)}s`,
            results: this.results,
            summary: {
                total: Object.keys(this.results).length,
                passed: Object.values(this.results).filter(r => r && r.success).length,
                failed: Object.values(this.results).filter(r => r && !r.success).length
            }
        };

        // Write report to file
        const reportPath = path.join('performance-results', 'comprehensive-test-report.json');
        fs.mkdirSync('performance-results', { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        this.log(`\n📊 Test Report Generated: ${reportPath}`, 'info');
        this.log(`\n📈 Summary:`, 'info');
        this.log(`   Total Tests: ${report.summary.total}`, 'info');
        this.log(`   Passed: ${report.summary.passed}`, 'success');
        this.log(`   Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
        this.log(`   Total Duration: ${report.totalDuration}`, 'info');

        return report;
    }

    // Main test runner
    async runAllTests(options = {}) {
        const {
            skipUnit = false,
            skipIntegration = false,
            skipPerformance = false,
            skipApi = false,
            skipApplication = false,
            skipSecurity = false
        } = options;

        this.log('🚀 Starting Comprehensive Test Suite', 'info');
        this.log('='.repeat(50), 'info');

        // Enable mock mode
        this.enableMockMode();

        try {
            // Run tests in parallel where possible
            const testPromises = [];

            if (!skipUnit) testPromises.push(this.runUnitTests());
            if (!skipIntegration) testPromises.push(this.runIntegrationTests());
            if (!skipSecurity) testPromises.push(this.runSecurityTests());

            // Wait for initial tests
            await Promise.allSettled(testPromises);

            // Run performance and API tests (these need the app to be built)
            if (!skipPerformance) await this.runPerformanceTests();
            if (!skipApi) await this.runApiTests();
            if (!skipApplication) await this.runApplicationTests();

        } finally {
            // Always restore environment
            this.restoreEnvironment();
        }

        // Generate final report
        const report = this.generateReport();

        // Exit with appropriate code
        const hasFailures = Object.values(this.results).some(r => r && !r.success);
        process.exit(hasFailures ? 1 : 0);
    }

    // Run specific test types
    async runSpecificTests(testTypes) {
        const validTypes = ['unit', 'integration', 'performance', 'api', 'application', 'security'];

        for (const type of testTypes) {
            if (!validTypes.includes(type)) {
                this.log(`Invalid test type: ${type}`, 'error');
                continue;
            }

            switch (type) {
                case 'unit':
                    await this.runUnitTests();
                    break;
                case 'integration':
                    await this.runIntegrationTests();
                    break;
                case 'performance':
                    await this.runPerformanceTests();
                    break;
                case 'api':
                    await this.runApiTests();
                    break;
                case 'application':
                    await this.runApplicationTests();
                    break;
                case 'security':
                    await this.runSecurityTests();
                    break;
            }
        }

        this.generateReport();
    }
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    const testRunner = new TestRunner();

    if (args.length === 0) {
        // Run all tests
        testRunner.runAllTests();
    } else if (args[0] === '--help' || args[0] === '-h') {
        console.log(`
Comprehensive Test Runner for Apna Shop

Usage:
  node test-all.js                    # Run all tests
  node test-all.js unit               # Run only unit tests
  node test-all.js performance api    # Run specific test types
  node test-all.js --skip-performance # Skip performance tests

Available test types:
  unit          - Jest unit tests
  integration   - Build and integration tests
  performance   - API and performance benchmarks
  api           - API endpoint tests
  application   - Application component tests
  security      - Security implementation tests

Options:
  --skip-unit          Skip unit tests
  --skip-integration   Skip integration tests
  --skip-performance   Skip performance tests
  --skip-api           Skip API tests
  --skip-application   Skip application tests
  --skip-security      Skip security tests
  --help, -h           Show this help message

Examples:
  npm run test:all                    # Run all tests
  npm run test:performance           # Run only performance tests
  npm run test:api -- --skip-mock     # Run API tests without mock mode
        `);
    } else {
        // Parse arguments
        const skipOptions = {};
        const testTypes = [];

        for (const arg of args) {
            if (arg.startsWith('--skip-')) {
                const testType = arg.replace('--skip-', '');
                skipOptions[`skip${testType.charAt(0).toUpperCase() + testType.slice(1)}`] = true;
            } else {
                testTypes.push(arg);
            }
        }

        if (testTypes.length > 0) {
            testRunner.runSpecificTests(testTypes);
        } else {
            testRunner.runAllTests(skipOptions);
        }
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = TestRunner;