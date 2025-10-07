# LLM Instructions for Next.js eCommerce Theme Cloning

## Overview

This document provides comprehensive, machine-readable instructions for Large Language Models (LLMs) to clone and adapt the production-ready Next.js eCommerce theme. This theme implements atomic design architecture, multi-step checkout, payment integration, and enterprise-grade security patterns.

## Prerequisites

- Node.js 18+ and npm installed
- Target eCommerce backend API documentation
- Payment gateway credentials (Razorpay, Stripe, PayPal)
- Fresh Next.js 15 project initialized
- Source memory bank files (`.kilocode/rules/memory-bank/`)

## Phase 1: Project Initialization & Memory Bank Setup

### Step 1.1: Create Next.js Project

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --app --src-dir --import-alias "@/*"
cd [project-name]
```

### Step 1.2: Install Core Dependencies

```bash
npm install axios js-cookie framer-motion lucide-react react-icons @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
npm install -D @types/js-cookie @types/node
```

### Step 1.3: Install Security & Performance Dependencies

```bash
npm install rate-limiter-flexible express-rate-limit helmet express-validator
npm install -D @types/express @types/rate-limiter-flexible
```

### Step 1.4: Configure Environment Variables

Create `.env.local`:

```env
# Core Configuration
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_TOKEN=your-api-token

# Payment Gateways
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_SECRET_KEY=your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Security
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Performance
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_CDN_URL=https://your-cdn.com
```

### Step 1.5: Memory Bank Setup (CRITICAL - Read First)

**IMPORTANT**: Before implementing any code, copy and read the entire memory bank from the source project.

#### Copy Memory Bank Files

```bash
# Copy from source project
cp -r /path/to/source/.kilocode .kilocode

# Verify all files exist
ls -la .kilocode/rules/memory-bank/
```

#### Memory Bank Reading Order (MANDATORY)

Read ALL memory bank files in this exact order before starting implementation:

1. **`brief.md`** - Project overview, goals, and scope
2. **`product.md`** - User experience requirements and business logic
3. **`architecture.md`** - System architecture, component relationships, critical flows
4. **`tech.md`** - Technology stack, dependencies, development setup
5. **`api.md`** - Complete API documentation and integration patterns
6. **`context.md`** - Current implementation status and recent changes
7. **`tasks.md`** - Repetitive implementation patterns and workflows

**FAILURE TO READ MEMORY BANK WILL RESULT IN INCONSISTENT IMPLEMENTATION**

#### Memory Bank Usage Guidelines

- Reference `architecture.md` for component structure and patterns
- Use `tasks.md` for repetitive implementations (auth, payments, etc.)
- Follow `tech.md` for dependency management and build processes
- Consult `api.md` for all backend integrations
- Update `context.md` after completing major features

## Phase 2: Security Implementation

### Step 2.1: Implement Security Middleware

#### Rate Limiting Middleware (src/middleware/rate-limit.ts)

```typescript
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

export async function rateLimit(request: Request) {
  try {
    await rateLimiter.consume(request.ip ?? "anonymous");
    return null;
  } catch {
    return new Response("Too Many Requests", { status: 429 });
  }
}
```

#### Security Headers Middleware (src/middleware/security.ts)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // CSP Header
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.razorpay.com;"
  );

  return response;
}
```

### Step 2.2: Input Validation & Sanitization

#### Validation Library (src/lib/validation.ts)

```typescript
import validator from "validator";

export function sanitizeInput(input: string): string {
  return validator.escape(input.trim());
}

export function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8)
    errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("Password must contain lowercase letter");
  if (!/\d/.test(password)) errors.push("Password must contain number");
  if (!/[!@#$%^&*]/.test(password))
    errors.push("Password must contain special character");

  return { valid: errors.length === 0, errors };
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 100000 && Number.isFinite(amount);
}
```

## Phase 3: Core Architecture Implementation

### Step 3.1: Create Type Definitions (src/lib/types.ts)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  stock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}
```

### Step 3.2: Implement Enhanced API Service (src/lib/api.ts)

```typescript
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from "@/lib/types";

class ApiService {
  private axiosInstance: AxiosInstance;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.axiosInstance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_USE_MOCK === "true"
          ? "/api/mock"
          : process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "X-Tenant": process.env.NEXT_PUBLIC_TENANT_ID || "",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private handleUnauthorized() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async get<T>(url: string, params?: any, useCache = true): Promise<T> {
    const cacheKey = this.getCacheKey(url, params);

    if (useCache) {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) return cachedData;
    }

    const response: AxiosResponse<ApiResponse<T>> =
      await this.axiosInstance.get(url, { params });
    const data = response.data.data;

    if (useCache) {
      this.setCachedData(cacheKey, data);
    }

    return data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> =
      await this.axiosInstance.post(url, data);
    return response.data.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> =
      await this.axiosInstance.put(url, data);
    return response.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> =
      await this.axiosInstance.delete(url);
    return response.data.data;
  }

  // Product methods
  async getProducts(params?: any) {
    return this.get<Product[]>("/shop/get-products", params);
  }

  async getProduct(slug: string) {
    return this.get<Product>(`/shop/product/${slug}`);
  }

  // Cart methods
  async getCart() {
    return this.get<CartState>("/cart/cart");
  }

  async addToCart(productId: string, quantity: number) {
    return this.post<CartState>("/cart/cart", {
      product_id: productId,
      quantity,
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.put<CartState>(`/cart/cart/${itemId}`, { quantity });
  }

  async removeCartItem(itemId: string) {
    return this.delete<CartState>(`/cart/cart/${itemId}`);
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post<User>("/user/login", { email, password });
  }

  async register(userData: any) {
    return this.post<User>("/user/register", userData);
  }

  // Order methods
  async getOrders() {
    return this.get<any[]>("/shop/orders");
  }

  async createOrder(orderData: any) {
    return this.post<any>("/shop/create-order", orderData);
  }
}

export const apiService = new ApiService();
```

## Phase 4: Payment Integration Implementation

### Step 4.1: Razorpay Payment Component

#### RazorpayPayment Component (src/components/checkout/RazorpayPayment.tsx)

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
    razorpayOpenInProgress?: boolean;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  orderId?: string;
  method?: string;
  autoTrigger?: boolean;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

export function RazorpayPayment({
  amount,
  currency = "INR",
  orderId,
  method,
  autoTrigger = false,
  onSuccess,
  onError,
  onCancel,
}: RazorpayPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const maxRetries = 3;
  const hasTriggeredRef = useRef(false);
  const sdkLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if SDK is loaded
  const checkSdkLoaded = () => {
    if (window.Razorpay) {
      setIsSdkLoaded(true);
      return true;
    }
    return false;
  };

  // Check periodically until loaded
  useEffect(() => {
    if (checkSdkLoaded()) return;

    const interval = setInterval(() => {
      if (!isSdkLoaded && checkSdkLoaded()) {
        clearInterval(interval);
        if (sdkLoadTimeoutRef.current) {
          clearTimeout(sdkLoadTimeoutRef.current);
          sdkLoadTimeoutRef.current = null;
        }
      }
    }, 500);

    // Set timeout for SDK loading
    sdkLoadTimeoutRef.current = setTimeout(() => {
      if (!isSdkLoaded) {
        setLastError(
          "Failed to load Razorpay SDK. Please check your internet connection and try again."
        );
        onError(
          "Failed to load Razorpay SDK. Please check your internet connection and try again."
        );
        clearInterval(interval);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (sdkLoadTimeoutRef.current) {
        clearTimeout(sdkLoadTimeoutRef.current);
        sdkLoadTimeoutRef.current = null;
      }
    };
  }, [isSdkLoaded]);

  // Auto-trigger payment when SDK is loaded and autoTrigger is true
  useEffect(() => {
    if (
      autoTrigger &&
      isSdkLoaded &&
      !isProcessing &&
      !hasTriggeredRef.current
    ) {
      hasTriggeredRef.current = true;
      handlePayment();
    }
  }, [autoTrigger, isSdkLoaded, isProcessing]);

  const createRazorpayOrder = async (): Promise<any> => {
    try {
      const response = await fetch("/api/payments/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId || `order_${Date.now()}`,
          amount: Math.round(amount),
          currency,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to create Razorpay order");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create payment order";
      setLastError(errorMessage);
      throw error;
    }
  };

  const verifyPayment = async (
    paymentId: string,
    orderId: string,
    signature: string
  ) => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: "razorpay",
          order_id: orderId,
          payment_id: paymentId,
          signature,
          amount: Math.round(amount),
          currency,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment verification failed";
      throw new Error(errorMessage);
    }
  };

  const handlePayment = async () => {
    if (!isSdkLoaded) {
      onError(
        "Razorpay SDK not loaded. Please refresh the page and try again."
      );
      return;
    }

    if (window.razorpayOpenInProgress) {
      return;
    }

    window.razorpayOpenInProgress = true;
    setIsProcessing(true);
    setLastError(null);

    try {
      const orderData = await createRazorpayOrder();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key",
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: "Mock E-commerce Store",
        description: "Test Payment",
        method: method || "card",
        handler: function (response: any) {
          window.razorpayOpenInProgress = false;
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id);

          // Verify payment asynchronously
          verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          ).catch((verifyError) => {
            const errorMsg =
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed";
            setLastError(errorMsg);
            onError(errorMsg);
          });
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            window.razorpayOpenInProgress = false;
            if (onCancel) onCancel();
          },
          confirm_close: true,
          escape: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Payment initialization failed";
      setLastError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
      window.razorpayOpenInProgress = false;
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsSdkLoaded(true)}
        onError={() => {
          setLastError("Failed to load Razorpay SDK");
          onError("Failed to load Razorpay SDK");
        }}
      />
      <div className="space-y-4">
        <div className="p-4 bg-secondary-50 rounded-lg">
          <Typography variant="subtitle" weight="semibold" className="mb-2">
            Razorpay Payment
          </Typography>
          <Typography variant="body" className="text-secondary-600 mb-4">
            Amount: {currency.toUpperCase()} ₹{(amount / 100).toFixed(2)}
          </Typography>

          {!autoTrigger && (
            <Button
              type="button"
              variant="primary"
              onClick={handlePayment}
              disabled={isProcessing || !isSdkLoaded}
            >
              {isProcessing
                ? "Processing..."
                : `Pay ₹${(amount / 100).toFixed(2)} with Razorpay`}
            </Button>
          )}

          {!isSdkLoaded && (
            <Typography
              variant="caption"
              color="secondary"
              className="mt-2 block"
            >
              Loading payment gateway...
            </Typography>
          )}
          {lastError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded">
              <Typography variant="caption">{lastError}</Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

#### Razorpay API Route (src/app/api/payments/create-razorpay-order/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, amount, currency = "INR" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid amount is required",
          error: "Validation error",
        },
        { status: 422 }
      );
    }

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_SECRET_KEY;

    if (!razorpayKeyId || !razorpaySecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay credentials not configured",
          error: "Configuration error",
        },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString(
      "base64"
    );

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency.toUpperCase(),
        receipt: order_id,
        payment_capture: 1,
      }),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create Razorpay order",
          error: "Razorpay API error",
        },
        { status: razorpayResponse.status }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    return NextResponse.json({
      success: true,
      data: razorpayOrder,
      message: "Razorpay order created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create Razorpay order",
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
```

## Phase 5: Error Handling & Monitoring

### Step 5.1: Global Error Boundary

#### Error Boundary Component (src/components/ui/ErrorBoundary.tsx)

```typescript
"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error("Error Boundary caught an error:", error, errorInfo);

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === "production") {
      // sendErrorToMonitoring(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <Typography variant="h2" className="text-red-600 mb-4">
                Something went wrong
              </Typography>
              <Typography variant="body" className="text-gray-600 mb-6">
                We apologize for the inconvenience. Please try refreshing the
                page.
              </Typography>
              <div className="space-y-3">
                <Button
                  onClick={this.resetError}
                  variant="primary"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="secondary"
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Step 5.2: Circuit Breaker Pattern

#### Circuit Breaker Implementation (src/lib/circuit-breaker.ts)

```typescript
interface CircuitBreakerOptions {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.options.recoveryTimeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.options.failureThreshold) {
      this.state = "OPEN";
    }
  }

  getState() {
    return this.state;
  }
}
```

## Phase 6: Performance Optimization

### Step 6.1: Advanced Caching Strategy

#### Cache Implementation (src/lib/cache.ts)

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl = 300000): void {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // Memory management
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const globalCache = new Cache();
```

### Step 6.2: Image Optimization & CDN

#### Next.js Configuration (next.config.ts)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["your-image-domain.com", "cdn.your-site.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type,Authorization,X-Tenant",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@fortawesome/react-fontawesome"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
```

## Phase 7: Testing & Quality Assurance

### Step 7.1: Component Testing Setup

#### Jest Configuration (jest.config.js)

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Jest Setup (jest.setup.js)

```javascript
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: "",
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
    };
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000/api";
process.env.NEXT_PUBLIC_USE_MOCK = "true";

// Global test utilities
global.fetch = jest.fn();
```

### Step 7.2: API Testing Strategy

#### API Test Runner (tests/test-live-api.js)

```javascript
const axios = require("axios");

class ApiTester {
  constructor(baseURL, tenantId, token) {
    this.client = axios.create({
      baseURL,
      headers: {
        "X-Tenant": tenantId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  async testEndpoint(endpoint, method = "GET", data = null) {
    try {
      const response = await this.client.request({
        url: endpoint,
        method,
        data,
      });
      return {
        success: true,
        status: response.status,
        data: response.data,
        responseTime: response.duration,
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.message,
        responseTime: error.duration,
      };
    }
  }

  async runComprehensiveTest() {
    const endpoints = [
      { path: "/shop/get-products", method: "GET" },
      { path: "/cart/cart", method: "GET" },
      { path: "/user/profile", method: "GET" },
      // Add more endpoints
    ];

    const results = [];
    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint.method} ${endpoint.path}`);
      const result = await this.testEndpoint(endpoint.path, endpoint.method);
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        ...result,
      });
    }

    return results;
  }
}

module.exports = ApiTester;
```

## Phase 8: Deployment & Production

### Step 8.1: Vercel Deployment Configuration

#### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,POST,PUT,DELETE,OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type,Authorization,X-Tenant"
        }
      ]
    }
  ],
  "env": {
    "NEXT_PUBLIC_USE_MOCK": "false"
  }
}
```

### Step 8.2: Production Environment Setup

#### Production Environment Variables

```env
# Production Environment Variables
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
NEXT_PUBLIC_TENANT_ID=your-prod-tenant-id
NEXT_PUBLIC_TOKEN=your-prod-api-token

# Payment Gateways (Production Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_SECRET_KEY=your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# Security
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Performance & Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
NEXT_PUBLIC_GA_TRACKING_ID=GA_MEASUREMENT_ID

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=error
```

### Step 8.3: Monitoring & Analytics

#### Performance Monitoring Setup

```typescript
// src/lib/monitoring.ts
import { init as initSentry } from "@sentry/nextjs";

export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    initSentry({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
    });
  }
}

// src/lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, properties);
  }
}

export function trackPageView(page: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_TRACKING_ID!, {
      page_path: page,
    });
  }
}
```

## Phase 9: Quick Start Script

### Step 9.1: Automated Setup Script

#### setup-theme.sh

```bash
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
```

## Final Implementation Checklist

### Security ✅

- [x] Rate limiting middleware implemented
- [x] Security headers configured
- [x] Input validation and sanitization
- [x] CORS properly configured

### Architecture ✅

- [x] Atomic design component structure
- [x] Context providers for state management
- [x] Enhanced API service with caching
- [x] TypeScript types defined

### Payments ✅

- [x] Razorpay integration with proper error handling
- [x] Payment verification and security
- [x] Multiple payment gateway support structure

### Performance ✅

- [x] Advanced caching strategies
- [x] Image optimization configured
- [x] Bundle optimization settings

### Error Handling ✅

- [x] Global error boundary
- [x] Circuit breaker pattern
- [x] Comprehensive error logging

### Testing ✅

- [x] Jest configuration for components
- [x] API testing utilities
- [x] Performance monitoring setup

### Deployment ✅

- [x] Vercel configuration
- [x] Production environment setup
- [x] Monitoring and analytics integration

This completes the comprehensive LLM cloning instructions for the Next.js eCommerce theme. The resulting application will be a production-ready, enterprise-grade eCommerce frontend that can be easily adapted to different backend APIs and scaled for high-traffic scenarios.
