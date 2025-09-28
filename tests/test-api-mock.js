#!/usr/bin/env node

/**
 * Simple API test with mock mode enabled
 * Tests API endpoints directly with mock data
 */

const { spawn } = require('child_process');

async function testAPIs() {
    console.log('🚀 Testing APIs with mock mode...');

    // Set environment variable for mock mode
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';

    try {
        // Start the dev server with mock mode
        const server = spawn('npm', ['run', 'dev'], {
            stdio: 'inherit',
            env: { ...process.env, NEXT_PUBLIC_USE_MOCK: 'true' }
        });

        // Wait for server to start
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Run API performance test
        console.log('📊 Running API performance test...');
        const testProcess = spawn('node', ['api-performance-tester.js'], {
            stdio: 'inherit',
            env: { ...process.env, NEXT_PUBLIC_USE_MOCK: 'true' }
        });

        testProcess.on('close', (code) => {
            console.log(`API test completed with code ${code}`);
            server.kill();
            process.exit(code);
        });

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    testAPIs();
}