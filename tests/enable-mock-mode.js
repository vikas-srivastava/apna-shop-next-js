#!/usr/bin/env node

/**
 * Enable mock mode for testing
 * Temporarily sets NEXT_PUBLIC_USE_MOCK=true for performance testing
 */

const fs = require('fs');
const path = require('path');

function enableMockMode() {
    const envPath = path.join(__dirname, '.env');
    const testEnvPath = path.join(__dirname, '.env.test');

    try {
        // Read current .env file
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Update or add NEXT_PUBLIC_USE_MOCK=true
        const lines = envContent.split('\n');
        let mockModeFound = false;

        const updatedLines = lines.map(line => {
            if (line.startsWith('NEXT_PUBLIC_USE_MOCK=')) {
                mockModeFound = true;
                return 'NEXT_PUBLIC_USE_MOCK=true';
            }
            return line;
        });

        if (!mockModeFound) {
            updatedLines.push('NEXT_PUBLIC_USE_MOCK=true');
        }

        // Write to .env.test for testing
        fs.writeFileSync(testEnvPath, updatedLines.join('\n'));

        console.log('✅ Mock mode enabled for testing');
        console.log('📄 Created .env.test with mock mode enabled');
        console.log('🔄 Run tests with: NEXT_PUBLIC_USE_MOCK=true npm run test:all');

    } catch (error) {
        console.error('❌ Failed to enable mock mode:', error.message);
        process.exit(1);
    }
}

function disableMockMode() {
    const testEnvPath = path.join(__dirname, '.env.test');

    try {
        if (fs.existsSync(testEnvPath)) {
            fs.unlinkSync(testEnvPath);
            console.log('✅ Mock mode disabled, removed .env.test');
        } else {
            console.log('ℹ️  No test environment file found');
        }
    } catch (error) {
        console.error('❌ Failed to disable mock mode:', error.message);
        process.exit(1);
    }
}

// CLI interface
const command = process.argv[2];

if (command === 'disable' || command === 'off') {
    disableMockMode();
} else if (command === 'enable' || command === 'on' || !command) {
    enableMockMode();
} else {
    console.log(`
Mock Mode Manager for Apna Shop

Usage:
  node enable-mock-mode.js          # Enable mock mode
  node enable-mock-mode.js enable   # Enable mock mode
  node enable-mock-mode.js on       # Enable mock mode
  node enable-mock-mode.js disable  # Disable mock mode
  node enable-mock-mode.js off      # Disable mock mode

This script creates .env.test with NEXT_PUBLIC_USE_MOCK=true for testing.
The original .env file remains unchanged.
    `);
}