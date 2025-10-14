# Next.js Theme System Documentation

## Overview

This is a modern, full-featured eCommerce frontend application built with Next.js 15, designed as a reusable theme/template for creating integrable eCommerce stores. The project serves as a foundation for multiple theme development under a Headless API system, where the only differences between themes are styling and layout, not functionality.

## Purpose

The primary goal of this project is to provide a scalable, themeable eCommerce frontend that can be easily customized and deployed for different clients while maintaining consistent functionality and API integration.

## Key Features

- **Multi-Theme Support**: Dynamic theme switching with CSS variables and YAML-based theme configuration
- **Headless API Integration**: Centralized API service layer with Apna Shop backend integration
- **Atomic Design Architecture**: Modular component structure following atomic design principles
- **TypeScript Support**: Full type safety throughout the application
- **Performance Optimized**: Server-side rendering, caching, and optimized loading states
- **Security Hardened**: Input validation, rate limiting, and secure API handling

## Theme Architecture

Themes are implemented through:

- **CSS Variables**: Dynamic color schemes and design tokens
- **YAML Configuration**: Theme definitions in `public/theme.yml`
- **Runtime Switching**: Theme selection via UI components and URL parameters
- **Fallback System**: Graceful degradation and mock data support

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_TOKEN=your-api-token
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Theme Switching

Themes can be switched via:

- Theme switcher component in the UI
- URL parameters: `?theme=classic-light`
- Environment variables for default theme

## Available Themes

- **Classic Light**: Neutral, professional theme
- **Ocean Breeze**: Calming aqua-blue theme
- **Sunset Glow**: Warm orange-pink theme
- **Vibrant Orange**: High-contrast orange theme
- **Arctic Frost**: Minimal icy mint-blue theme
- **Emerald Forest**: Rich natural greens theme
- **Midnight Dark**: Elegant dark theme
- **Dark Delight**: Alternative dark theme
- **Royal Amethyst**: Regal purple-gold theme

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── atoms/          # Basic components (Button, Input)
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   └── ui/             # Shared UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
│   ├── api.ts          # API service layer
│   └── types.ts        # TypeScript definitions
└── styles/             # Theme CSS files
```

## API Integration

The application integrates with Apna Shop APIs through a centralized service layer:

- **Authentication**: Login, registration, password reset
- **Products**: Catalog, search, filtering, details
- **Cart**: Add/remove/update items, totals
- **Orders**: Order history, tracking, management
- **Payments**: Razorpay integration
- **Content**: Blog posts, CMS content

## Development Guidelines

- Follow atomic design principles for component organization
- Use TypeScript for type safety
- Implement proper error handling and loading states
- Maintain consistent API response structures
- Document new features and API endpoints

## Deployment

The application is optimized for Vercel deployment with:

- Automatic builds from Git
- Environment variable configuration
- CORS-free API proxying
- Static asset optimization

## Contributing

1. Follow the established code structure
2. Add proper TypeScript types
3. Include tests for new features
4. Update documentation as needed
5. Ensure theme compatibility

## License

This project is licensed under the MIT License.
