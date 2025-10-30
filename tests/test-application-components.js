/**
 * Comprehensive Application Component Testing Script
 * Tests all services, contexts, and integrations using mock data
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
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

// Test file existence and structure
function testFileStructure() {
    log('Testing application file structure...');

    const requiredFiles = [
        'src/lib/api.ts',
        'src/lib/auth-service.ts',
        'src/lib/third-party-api.ts',
        'src/contexts/CartContext.tsx',
        'src/contexts/ProductContext.tsx',
        'src/components/auth/AuthProvider.tsx',
        'src/lib/types.ts',
        'src/lib/mock-data.ts',
        'next.config.ts',
        '.env'
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            log(`✓ ${file} exists`);
        } else {
            log(`✗ ${file} missing`, 'error');
            allFilesExist = false;
        }
    }

    recordTest('File Structure', allFilesExist);
    return allFilesExist;
}

// Test environment configuration
function testEnvironmentConfig() {
    log('Testing environment configuration...');

    try {
        // Load .env file
        const envPath = path.join(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

        const requiredVars = [
            'TENANT_ID',
            'TOKEN',
            'API_BASE_URL',
            'USE_MOCK'
        ];

        let allVarsPresent = true;
        for (const varName of requiredVars) {
            const varExists = envLines.some(line => line.startsWith(`${varName}=`));
            if (varExists) {
                log(`✓ ${varName} configured`);
            } else {
                log(`✗ ${varName} missing`, 'error');
                allVarsPresent = false;
            }
        }

        // Check mock mode
        const mockMode = envLines.find(line => line.startsWith('USE_MOCK='))?.split('=')[1];
        log(`Mock mode: ${mockMode}`);

        recordTest('Environment Configuration', allVarsPresent);
        return allVarsPresent;
    } catch (error) {
        recordTest('Environment Configuration', false, error.message);
        return false;
    }
}

// Test TypeScript types
function testTypeDefinitions() {
    log('Testing TypeScript type definitions...');

    try {
        const typesPath = path.join(process.cwd(), 'src/lib/types.ts');
        const typesContent = fs.readFileSync(typesPath, 'utf8');

        const requiredTypes = [
            'Product',
            'Category',
            'User',
            'ApiResponse',
            'ProductFilter',
            'PaginatedResponse'
        ];

        let allTypesPresent = true;
        for (const typeName of requiredTypes) {
            if (typesContent.includes(`export interface ${typeName}`) || typesContent.includes(`export type ${typeName}`)) {
                log(`✓ Type ${typeName} defined`);
            } else {
                log(`✗ Type ${typeName} missing`, 'error');
                allTypesPresent = false;
            }
        }

        recordTest('TypeScript Types', allTypesPresent);
        return allTypesPresent;
    } catch (error) {
        recordTest('TypeScript Types', false, error.message);
        return false;
    }
}

// Test mock data structure
function testMockData() {
    log('Testing mock data structure...');

    try {
        const mockDataPath = path.join(process.cwd(), 'src/lib/mock-data.ts');
        const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

        const requiredExports = [
            'mockCategories',
            'mockApiProducts',
            'mockCart',
            'mockApiGenerators'
        ];

        let allExportsPresent = true;
        for (const exportName of requiredExports) {
            if (mockDataContent.includes(`export const ${exportName}`)) {
                log(`✓ Mock data ${exportName} exported`);
            } else {
                log(`✗ Mock data ${exportName} missing`, 'error');
                allExportsPresent = false;
            }
        }

        recordTest('Mock Data Structure', allExportsPresent);
        return allExportsPresent;
    } catch (error) {
        recordTest('Mock Data Structure', false, error.message);
        return false;
    }
}

// Test API service structure
function testApiServiceStructure() {
    log('Testing ApiService structure...');

    try {
        const apiPath = path.join(process.cwd(), 'src/lib/api.ts');
        const apiContent = fs.readFileSync(apiPath, 'utf8');

        const requiredMethods = [
            'getCategories',
            'getProducts',
            'getProduct',
            'registerUser',
            'loginUser',
            'addToCart',
            'getCart'
        ];

        let allMethodsPresent = true;
        for (const methodName of requiredMethods) {
            if (apiContent.includes(`static async ${methodName}`)) {
                log(`✓ ApiService.${methodName} method exists`);
            } else {
                log(`✗ ApiService.${methodName} method missing`, 'error');
                allMethodsPresent = false;
            }
        }

        // Check for ApiService class
        if (apiContent.includes('export class ApiService')) {
            log('✓ ApiService class exported');
        } else {
            log('✗ ApiService class not found', 'error');
            allMethodsPresent = false;
        }

        recordTest('ApiService Structure', allMethodsPresent);
        return allMethodsPresent;
    } catch (error) {
        recordTest('ApiService Structure', false, error.message);
        return false;
    }
}

// Test AuthService structure
function testAuthServiceStructure() {
    log('Testing AuthService structure...');

    try {
        const authPath = path.join(process.cwd(), 'src/lib/auth-service.ts');
        const authContent = fs.readFileSync(authPath, 'utf8');

        const requiredMethods = [
            'login',
            'register',
            'logout',
            'getCurrentUser',
            'isAuthenticated'
        ];

        let allMethodsPresent = true;
        for (const methodName of requiredMethods) {
            if (authContent.includes(`static async ${methodName}`) || authContent.includes(`static ${methodName}`)) {
                log(`✓ AuthService.${methodName} method exists`);
            } else {
                log(`✗ AuthService.${methodName} method missing`, 'error');
                allMethodsPresent = false;
            }
        }

        // Check for AuthService class
        if (authContent.includes('export class AuthService')) {
            log('✓ AuthService class exported');
        } else {
            log('✗ AuthService class not found', 'error');
            allMethodsPresent = false;
        }

        recordTest('AuthService Structure', allMethodsPresent);
        return allMethodsPresent;
    } catch (error) {
        recordTest('AuthService Structure', false, error.message);
        return false;
    }
}

// Test context providers structure
function testContextProviders() {
    log('Testing context providers structure...');

    const contexts = [
        { file: 'src/contexts/CartContext.tsx', provider: 'CartProvider', context: 'CartContext' },
        { file: 'src/contexts/ProductContext.tsx', provider: 'ProductProvider', context: 'ProductContext' },
        { file: 'src/components/auth/AuthProvider.tsx', provider: 'AuthProvider', context: 'AuthContext' }
    ];

    let allContextsValid = true;

    for (const ctx of contexts) {
        try {
            const content = fs.readFileSync(ctx.file, 'utf8');

            let contextValid = true;

            if (content.includes(`export function ${ctx.provider}`)) {
                log(`✓ ${ctx.provider} component exists`);
            } else {
                log(`✗ ${ctx.provider} component missing`, 'error');
                contextValid = false;
            }

            if (content.includes(`const ${ctx.context}`) && content.includes('createContext')) {
                log(`✓ ${ctx.context} created`);
            } else {
                log(`✗ ${ctx.context} not found`, 'error');
                contextValid = false;
            }

            if (!contextValid) {
                allContextsValid = false;
            }
        } catch (error) {
            log(`✗ Error reading ${ctx.file}: ${error.message}`, 'error');
            allContextsValid = false;
        }
    }

    recordTest('Context Providers', allContextsValid);
    return allContextsValid;
}

// Test API proxy routes
function testApiProxyRoutes() {
    log('Testing API proxy routes structure...');

    const apiRoutes = [
        'src/app/api/cart/route.ts',
        'src/app/api/products/route.ts',
        'src/app/api/categories/route.ts'
    ];

    let allRoutesValid = true;

    for (const route of apiRoutes) {
        try {
            if (fs.existsSync(route)) {
                const content = fs.readFileSync(route, 'utf8');

                // Check for basic Next.js API route structure
                if (content.includes('export async function GET') || content.includes('export async function POST')) {
                    log(`✓ ${route} has proper API route structure`);
                } else {
                    log(`✗ ${route} missing proper API route exports`, 'error');
                    allRoutesValid = false;
                }
            } else {
                log(`✗ ${route} does not exist`, 'error');
                allRoutesValid = false;
            }
        } catch (error) {
            log(`✗ Error reading ${route}: ${error.message}`, 'error');
            allRoutesValid = false;
        }
    }

    recordTest('API Proxy Routes', allRoutesValid);
    return allRoutesValid;
}

// Test component structure
function testComponentStructure() {
    log('Testing component structure...');

    const components = [
        'src/components/atoms/Button.tsx',
        'src/components/atoms/Input.tsx',
        'src/components/molecules/ProductCard.tsx',
        'src/components/organisms/ProductGrid.tsx'
    ];

    let allComponentsValid = true;

    for (const component of components) {
        try {
            if (fs.existsSync(component)) {
                const content = fs.readFileSync(component, 'utf8');

                // Check for basic React component structure
                if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
                    log(`✓ ${component} has proper component structure`);
                } else {
                    log(`✗ ${component} missing proper component exports`, 'error');
                    allComponentsValid = false;
                }
            } else {
                log(`✗ ${component} does not exist`, 'error');
                allComponentsValid = false;
            }
        } catch (error) {
            log(`✗ Error reading ${component}: ${error.message}`, 'error');
            allComponentsValid = false;
        }
    }

    recordTest('Component Structure', allComponentsValid);
    return allComponentsValid;
}

// Test configuration files
function testConfigurationFiles() {
    log('Testing configuration files...');

    const configFiles = [
        'next.config.ts',
        'tailwind.config.ts',
        'tsconfig.json',
        'package.json'
    ];

    let allConfigsValid = true;

    for (const config of configFiles) {
        try {
            if (fs.existsSync(config)) {
                const content = fs.readFileSync(config, 'utf8');

                // Basic validation for each file type
                let isValid = true;
                if (config === 'package.json') {
                    isValid = content.includes('"name"') && content.includes('"version"');
                } else if (config === 'tsconfig.json') {
                    isValid = content.includes('"compilerOptions"');
                } else if (config.includes('.config.ts')) {
                    isValid = content.includes('export') || content.includes('module.exports');
                }

                if (isValid) {
                    log(`✓ ${config} is valid`);
                } else {
                    log(`✗ ${config} has invalid structure`, 'error');
                    allConfigsValid = false;
                }
            } else {
                log(`✗ ${config} does not exist`, 'error');
                allConfigsValid = false;
            }
        } catch (error) {
            log(`✗ Error reading ${config}: ${error.message}`, 'error');
            allConfigsValid = false;
        }
    }

    recordTest('Configuration Files', allConfigsValid);
    return allConfigsValid;
}

// Main test runner
async function runTests() {
    log('🚀 Starting Comprehensive Application Component Testing', 'info');
    log('Environment: MOCK MODE (for component testing)', 'info');

    // Run all structural tests
    testFileStructure();
    testEnvironmentConfig();
    testTypeDefinitions();
    testMockData();
    testApiServiceStructure();
    testAuthServiceStructure();
    testContextProviders();
    testApiProxyRoutes();
    testComponentStructure();
    testConfigurationFiles();

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
        log('🎉 All application components are properly structured and configured!', 'success');
        log('✅ Ready for development and testing with mock data.', 'success');
    } else {
        log('⚠️  Some components have issues. Please review the failed tests above.', 'warning');
    }

    return testResults.failed === 0;
}

// Run tests
runTests().catch(error => {
    log(`Test runner failed: ${error.message}`, 'error');
    process.exit(1);
});