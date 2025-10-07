#!/bin/bash

# eCommerce Theme Setup Script
# This script initializes a new eCommerce theme with all necessary configurations

set -e

echo "🚀 Setting up eCommerce Theme..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Get project name
read -p "Enter project name: " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name is required"
    exit 1
fi

# Create Next.js project
echo "📦 Creating Next.js project..."
npx create-next-app@latest "$PROJECT_NAME" --typescript --tailwind --app --src-dir --import-alias "@/*" --yes

cd "$PROJECT_NAME"

# Install dependencies
echo "📦 Installing dependencies..."
npm install axios js-cookie framer-motion lucide-react react-icons @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
npm install rate-limiter-flexible express-rate-limit helmet express-validator
npm install -D @types/js-cookie @types/node @types/express @types/rate-limiter-flexible

# Copy memory bank (assuming it's in the same directory)
if [ -d "../.kilocode" ]; then
    echo "📋 Copying memory bank..."
    cp -r "../.kilocode" ".kilocode"
else
    echo "⚠️  Memory bank not found. Please copy .kilocode directory manually."
fi

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env.local << EOL
# Core Configuration
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_TOKEN=your-api-token

# Payment Gateways
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_SECRET_KEY=your_secret_key

# Security
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
EOL

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Read the memory bank files in .kilocode/rules/memory-bank/"
echo "2. Update .env.local with your actual API credentials"
echo "3. Run 'npm run dev' to start development"
echo "4. Follow the LLM instructions in docs/llm-instructions.md"
echo ""
echo "🎯 Happy coding!"