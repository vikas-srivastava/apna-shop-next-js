#!/usr/bin/env node

/**
 * Simple Test Runner for All Security and Performance Tests
 * Runs all tests sequentially and provides a summary
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
    constructor() {
        this.results = {
            securityTests: null,
            apiPerformance: null,
            bundleAnalysis: null,
            systemMonitoring: null
        };
    }

    async runAllTests() {
        console.log('🧪 Running All Tests...\n');

        try {
            // 1. Security Tests
            console.log('🔒 Running Security Tests...');
            await this.runSecurityTests();

            // 2. API Performance Tests
            console.log('\n📊 Running API Performance Tests...');
            await this.runApiPerformanceTests();

            // 3. Bundle Analysis
            console.log('\n📦 Running Bundle Analysis...');
            await this.runBundleAnalysis();

            // 4. System Monitoring
            console.log('\n⚙️  Running System Monitoring...');
            await this.runSystemMonitoring();

            // Generate summary
            this.generateSummary();

        } catch (error) {
            console.error('❌ Test execution failed:', error.message);
            process.exit(1);
        }
    }

    async runSecurityTests() {
        return new Promise((resolve, reject) => {
            const child = spawn('node', ['tests/test-security.js'], { stdio: 'inherit' });

            child.on('close', (code) => {
                this.results.securityTests = { status: code === 0 ? 'passed' : 'failed', exitCode: code };
                resolve();
            });

            child.on('error', (error) => {
                this.results.securityTests = { status: 'error', error: error.message };
                resolve(); // Continue with other tests
            });
        });
    }

    async runApiPerformanceTests() {
        return new Promise((resolve, reject) => {
            const child = spawn('node', ['tests/api-performance-tester.js'], { stdio: 'inherit' });

            child.on('close', (code) => {
                this.results.apiPerformance = { status: code === 0 ? 'passed' : 'failed', exitCode: code };
                resolve();
            });

            child.on('error', (error) => {
                this.results.apiPerformance = { status: 'error', error: error.message };
                resolve();
            });
        });
    }

    async runBundleAnalysis() {
        return new Promise((resolve, reject) => {
            const child = spawn('node', ['tests/bundle-analyzer.js'], { stdio: 'inherit' });

            child.on('close', (code) => {
                this.results.bundleAnalysis = { status: code === 0 ? 'passed' : 'failed', exitCode: code };
                resolve();
            });

            child.on('error', (error) => {
                this.results.bundleAnalysis = { status: 'skipped', reason: 'bundle-analyzer.js not found or failed' };
                resolve();
            });
        });
    }

    async runSystemMonitoring() {
        return new Promise((resolve, reject) => {
            const child = spawn('node', ['tests/memory-cpu-monitor.js', '--duration', '30'], { stdio: 'inherit' });

            child.on('close', (code) => {
                this.results.systemMonitoring = { status: code === 0 ? 'passed' : 'failed', exitCode: code };
                resolve();
            });

            child.on('error', (error) => {
                this.results.systemMonitoring = { status: 'skipped', reason: 'memory-cpu-monitor.js not found or failed' };
                resolve();
            });
        });
    }

    generateSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('🧪 TEST EXECUTION SUMMARY');
        console.log('='.repeat(50));

        const { securityTests, apiPerformance, bundleAnalysis, systemMonitoring } = this.results;

        console.log(`🔒 Security Tests: ${this.formatStatus(securityTests)}`);
        console.log(`📊 API Performance: ${this.formatStatus(apiPerformance)}`);
        console.log(`📦 Bundle Analysis: ${this.formatStatus(bundleAnalysis)}`);
        console.log(`⚙️  System Monitoring: ${this.formatStatus(systemMonitoring)}`);

        const passedTests = [securityTests, apiPerformance, bundleAnalysis, systemMonitoring]
            .filter(test => test && test.status === 'passed').length;

        const totalTests = 4;

        console.log(`\n✅ ${passedTests}/${totalTests} tests passed`);

        if (passedTests === totalTests) {
            console.log('🎉 All tests completed successfully!');
        } else {
            console.log('⚠️  Some tests failed or were skipped. Check individual test outputs above.');
        }

        console.log('\n📁 Check performance-results/ directory for detailed reports');
        console.log('='.repeat(50));
    }

    formatStatus(testResult) {
        if (!testResult) return '❓ Not run';

        switch (testResult.status) {
            case 'passed': return '✅ Passed';
            case 'failed': return '❌ Failed';
            case 'error': return `❌ Error: ${testResult.error}`;
            case 'skipped': return `⏭️  Skipped: ${testResult.reason}`;
            default: return '❓ Unknown';
        }
    }
}

// Run tests
const runner = new TestRunner();
runner.runAllTests();