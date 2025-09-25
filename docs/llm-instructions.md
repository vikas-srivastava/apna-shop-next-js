# LLM Instructions for eCommerce Theme Cloning

## Overview

This document provides machine-readable instructions for Large Language Models (LLMs) to clone and adapt the Next.js eCommerce theme. Follow these instructions sequentially to recreate a fully functional eCommerce application.

## Prerequisites

- Node.js 18+ and npm installed
- Target eCommerce backend API documentation
- Payment gateway credentials (optional)
- Fresh Next.js 15 project initialized

## Phase 1: Project Initialization

### Step 1.1: Create Next.js Project

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --app --src-dir --import-alias "@/*"
cd [project-name]
```

### Step 1.2: Install Dependencies

```bash
npm install axios js-cookie framer-motion lucide-react react-icons @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
npm install -D @types/js-cookie
```

### Step 1.3: Configure Environment

Create `.env.local`:

```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_TOKEN=your-api-token
```

## Phase 2: File Structure Creation

### Step 2.1: Create Directory Structure

Execute these commands to create the complete directory structure:

```bash
# Core directories
mkdir -p src/app/api/{addresses,addresses/[id],cart,cart/[item_id],categories,orders,payments,payments/{create-razorpay-order,paypal/create-order,stripe/create-intent,verify},products,products/[slug],themes}
mkdir -p src/app/{about,accessibility,account/{addresses,orders,orders/page-old,payment-methods,profile,settings},affiliates,careers,cart,categories,checkout,contact,cookies,forgot-password,help,login,order-confirmation,press,privacy/{do-not-sell},products/[slug],reset-password,returns,shipping,size-guide,stores,sustainability,terms,test-supabase,track-order,wishlist}
mkdir -p src/components/{atoms,molecules,organisms,templates,ui,auth,checkout}
mkdir -p src/{contexts,hooks,lib,__tests__}
mkdir -p src/pages/api/auth
mkdir -p src/pages/auth
mkdir -p docs
mkdir -p public
```

### Step 2.2: Create Configuration Files

#### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  images: {
    domains: ["your-image-domain.com"],
  },
};

export default nextConfig;
```

#### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
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
```

### Step 3.2: Implement API Service (src/lib/api.ts)

```typescript
import axios, { AxiosInstance, AxiosResponse } from "axios";

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
          // Handle unauthorized
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

### Step 3.3: Create Context Providers

#### Cart Context (src/contexts/CartContext.tsx)

```typescript
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, CartState } from "@/lib/types";
import { apiService } from "@/lib/api";

interface CartContextType {
  state: CartState;
  addItem: (product: any, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "SET_CART"; payload: CartState }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return action.payload;
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      );
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
        itemCount: calculateItemCount(filteredItems),
      };
    case "UPDATE_ITEM":
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await apiService.getCart();
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const addItem = async (product: any, quantity: number) => {
    try {
      // Optimistic update
      const cartItem: CartItem = {
        id: `${product.id}_${Date.now()}`,
        product,
        quantity,
        price: product.price,
      };
      dispatch({ type: "ADD_ITEM", payload: cartItem });

      // API call
      await apiService.addToCart(product.id, quantity);
      await loadCart(); // Refresh from server
    } catch (error) {
      console.error("Failed to add item:", error);
      await loadCart(); // Revert on error
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
      await apiService.removeCartItem(itemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      await loadCart();
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity } });
      await apiService.updateCartItem(itemId, quantity);
    } catch (error) {
      console.error("Failed to update item:", error);
      await loadCart();
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

## Phase 4: Component Implementation

### Step 4.1: Create Basic Components

#### Button Component (src/components/atoms/Button.tsx)

```typescript
"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

#### Input Component (src/components/atoms/Input.tsx)

```typescript
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

## Phase 5: Page Implementation

### Step 5.1: Create Layout (src/app/layout.tsx)

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eCommerce Store",
  description: "Modern eCommerce store built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ProductProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
```

### Step 5.2: Create Home Page (src/app/page.tsx)

```typescript
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-4">
            Welcome to Our Store
          </Typography>
          <Typography variant="lead" className="mb-6">
            Discover amazing products at great prices
          </Typography>
          <Button size="lg">Shop Now</Button>
        </div>
      </section>

      <section>
        <Typography variant="h2" className="mb-6">
          Featured Products
        </Typography>
        <ProductGrid />
      </section>
    </div>
  );
}
```

## Phase 6: API Proxy Implementation

### Step 6.1: Create API Proxy Routes

#### Products API (src/app/api/products/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_USE_MOCK === "true"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/mock/products`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/get-products`;

    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "X-Tenant": process.env.NEXT_PUBLIC_TENANT_ID || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", data: [] },
      { status: 500 }
    );
  }
}
```

## Phase 7: Mock Data Implementation

### Step 7.1: Create Mock Data (src/lib/mock-data.ts)

```typescript
export const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    price: 99.99,
    images: ["/api/placeholder/300/300"],
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    stock: 50,
  },
  {
    id: "2",
    name: "Smart Watch",
    slug: "smart-watch",
    price: 299.99,
    images: ["/api/placeholder/300/300"],
    description: "Feature-rich smart watch with health tracking",
    category: "Electronics",
    stock: 25,
  },
  {
    id: "3",
    name: "Running Shoes",
    slug: "running-shoes",
    price: 129.99,
    images: ["/api/placeholder/300/300"],
    description: "Comfortable running shoes for all terrains",
    category: "Sports",
    stock: 100,
  },
  {
    id: "4",
    name: "Coffee Maker",
    slug: "coffee-maker",
    price: 79.99,
    images: ["/api/placeholder/300/300"],
    description: "Programmable coffee maker with thermal carafe",
    category: "Home",
    stock: 30,
  },
];

export const mockCart = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  customer: {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    phone: "+1234567890",
    gender: "male",
  },
};
```

### Step 7.2: Create Mock API Routes

#### Mock Products API (src/app/api/mock/products/route.ts)

```typescript
import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    message: "Products retrieved successfully",
    data: mockProducts,
  });
}
```

## Phase 8: Testing and Finalization

### Step 8.1: Create Utility Functions (src/lib/utils.ts)

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
```

### Step 8.2: Update Global Styles (src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Key Adaptation Points for Different Backends

### Backend API Changes

- Update all API endpoints in `src/lib/api.ts`
- Modify request/response interfaces in `src/lib/types.ts`
- Adjust authentication headers and tokens
- Update API proxy routes in `src/app/api/`

### Payment Gateway Changes

- Replace payment components in `src/components/checkout/`
- Update payment API routes
- Modify webhook handling
- Adjust payment flow logic

### Styling Customization

- Update Tailwind configuration
- Modify component styles
- Adjust responsive breakpoints
- Customize color scheme and typography

### Feature Customization

- Add/remove features based on requirements
- Modify component composition
- Extend context providers
- Add new API integrations

## Common Pitfalls to Avoid

- Direct API calls (always use proxy routes)
- Missing error boundaries
- Improper TypeScript types
- Inconsistent component naming
- Missing loading states
- Poor mobile responsiveness

## Performance Optimization Checklist

- [ ] Implement proper code splitting
- [ ] Use Next.js Image component
- [ ] Enable caching strategies
- [ ] Optimize bundle size
- [ ] Implement lazy loading
- [ ] Add service worker for caching

## Security Checklist

- [ ] Validate all user inputs
- [ ] Sanitize API responses
- [ ] Implement proper CORS headers
- [ ] Use HTTPS in production
- [ ] Secure token storage
- [ ] Rate limiting on API routes

## Testing Checklist

- [ ] Set up mock data for development
- [ ] Implement error handling
- [ ] Configure deployment (Vercel recommended)
- [ ] Test all user flows
- [ ] Verify responsive design
- [ ] Check accessibility compliance

## Final Steps

1. Run `npm run dev` to start development server
2. Test all functionality with mock data
3. Switch to live API by setting `NEXT_PUBLIC_USE_MOCK=false`
4. Configure your backend API endpoints
5. Deploy to Vercel or your preferred platform
6. Test payment integrations (if applicable)
7. Monitor performance and user experience

This completes the LLM cloning instructions for the eCommerce theme. The resulting application will be a fully functional, production-ready eCommerce frontend that can be easily adapted to different backend APIs and customized for various business needs.
