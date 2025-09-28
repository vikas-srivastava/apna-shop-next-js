#!/usr/bin/env node

/**
 * Test Security Implementations
 * Tests validation, security utilities, and other security features
 */

const { validateEmail, validatePassword, validateName, sanitizeText } = require('../src/lib/validation.ts');
const { generateSecureToken, hashPassword, verifyPassword } = require('../src/lib/security.ts');

async function testSecurity() {
    console.log('🛡️  Testing Security Implementations...\n');

    // Test email validation
    console.log('📧 Testing Email Validation:');
    const emailTests = [
        { input: 'test@example.com', expected: true },
        { input: 'invalid-email', expected: false },
        { input: '', expected: false },
        { input: 'test@.com', expected: false }
    ];

    emailTests.forEach(test => {
        const result = validateEmail(test.input);
        const status = result.valid === test.expected ? '✅' : '❌';
        console.log(`  ${status} "${test.input}" -> ${result.valid}`);
    });

    // Test password validation
    console.log('\n🔒 Testing Password Validation:');
    const passwordTests = [
        { input: 'StrongPass123!', expected: true },
        { input: 'weak', expected: false },
        { input: 'nouppercase123!', expected: false },
        { input: 'NOLOWERCASE123!', expected: false },
        { input: 'NoNumbers!', expected: false },
        { input: 'NoSpecial123', expected: false }
    ];

    passwordTests.forEach(test => {
        const result = validatePassword(test.input);
        const status = result.valid === test.expected ? '✅' : '❌';
        console.log(`  ${status} "${test.input}" -> ${result.valid}`);
    });

    // Test name validation
    console.log('\n👤 Testing Name Validation:');
    const nameTests = [
        { input: 'John Doe', expected: true },
        { input: 'Jane', expected: true },
        { input: 'A', expected: false },
        { input: 'John123', expected: false },
        { input: 'John@Doe', expected: false }
    ];

    nameTests.forEach(test => {
        const result = validateName(test.input);
        const status = result.valid === test.expected ? '✅' : '❌';
        console.log(`  ${status} "${test.input}" -> ${result.valid}`);
    });

    // Test text sanitization
    console.log('\n🧹 Testing Text Sanitization:');
    const sanitizeTests = [
        { input: '<script>alert("xss")</script>Hello', expected: 'Hello' },
        { input: 'Normal text', expected: 'Normal text' },
        { input: 'Text with <b>tags</b>', expected: 'Text with tags' }
    ];

    sanitizeTests.forEach(test => {
        try {
            const result = sanitizeText(test.input);
            const status = result === test.expected ? '✅' : '❌';
            console.log(`  ${status} "${test.input}" -> "${result}"`);
        } catch (error) {
            console.log(`  ❌ "${test.input}" -> Error: ${error.message}`);
        }
    });

    // Test secure token generation
    console.log('\n🎫 Testing Secure Token Generation:');
    try {
        const token1 = generateSecureToken();
        const token2 = generateSecureToken();

        const tokensDifferent = token1 !== token2;
        const tokenLength = token1.length >= 32;

        console.log(`  ${tokensDifferent ? '✅' : '❌'} Tokens are unique`);
        console.log(`  ${tokenLength ? '✅' : '❌'} Token length >= 32 chars`);
        console.log(`  📝 Sample token: ${token1.substring(0, 20)}...`);
    } catch (error) {
        console.log(`  ❌ Token generation failed: ${error.message}`);
    }

    // Test password hashing
    console.log('\n🔐 Testing Password Hashing:');
    try {
        const password = 'TestPassword123!';
        const hash = await hashPassword(password);
        const isValid = await verifyPassword(password, hash);
        const isInvalid = await verifyPassword('WrongPassword', hash);

        console.log(`  ${hash ? '✅' : '❌'} Hash generated`);
        console.log(`  ${isValid ? '✅' : '❌'} Correct password verified`);
        console.log(`  ${!isInvalid ? '✅' : '❌'} Wrong password rejected`);
    } catch (error) {
        console.log(`  ❌ Password hashing failed: ${error.message}`);
    }

    console.log('\n🎉 Security tests completed!');
}

// Run tests
testSecurity().catch(console.error);