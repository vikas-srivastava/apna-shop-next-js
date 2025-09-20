# Technology Stack

## Core Technologies

### Frontend Framework

- **Next.js 15.3.1**: React framework with App Router, SSR, and API routes
- **React 19.0.0**: Latest React with concurrent features and hooks
- **Tailwind CSS 4**: Utility-first CSS framework

### Development Tools

- **Node.js**: JavaScript runtime (version specified in package.json)
- **npm**: Package manager for dependency management
- **ESLint**: Code linting (configured in package.json scripts)

### UI/UX Libraries

- **Framer Motion 12.7.4**: Animation library for smooth transitions
- **Lucide React 0.488.0**: Icon library for consistent UI elements
- **React Icons 5.5.0**: Additional icon set
- **FontAwesome**: Icon and typography enhancement

### HTTP Client & API

- **Axios 1.9.0**: HTTP client with interceptors for API calls
- **js-cookie 3.0.5**: Client-side cookie management
- **jsonwebtoken 9.0.2**: JWT token handling

## Development Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- Git for version control

### Installation Steps

```bash
# Clone repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API credentials

# Start development server
npm run dev
```

### Environment Configuration

Required environment variables in `.env`:

```env
NEXT_PUBLIC_TENANT_ID=your_tenant_id
NEXT_PUBLIC_TOKEN=your_api_token
NEXT_PUBLIC_API_BASE_URL=https://foundryecom.com/api
```

## Build & Deployment

### Development

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

### Vercel Deployment

- Automatic deployment from GitHub
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `.next`

## Technical Constraints

### Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

### Performance Requirements

- First Contentful Paint < 2 seconds
- Lighthouse score > 90 for Core Web Vitals
- Bundle size < 500KB for initial load

### Security Considerations

- Environment variables for sensitive data
- Input validation on client and server
- Secure cookie configuration
- CORS headers for API protection

## Dependencies Overview

### Production Dependencies

- **next**: Core framework
- **react/react-dom**: UI library
- **axios**: API client
- **js-cookie**: Cookie management
- **framer-motion**: Animations
- **tailwindcss**: Styling
- **lucide-react**: Icons
- **react-icons**: Additional icons
- **@fortawesome/\***: FontAwesome icons

### Development Dependencies

- **@tailwindcss/postcss**: Tailwind CSS processing
- **tailwindcss**: CSS framework

## Tool Usage Patterns

### Code Organization

- **Atomic Design**: Components organized in atoms/molecules/organisms
- **Feature-based**: Related files grouped by functionality
- **Barrel exports**: Index files for clean imports

### API Integration

- **Centralized services**: All API calls through `apiService.js`
- **Error handling**: Consistent error responses across all services
- **Interceptors**: Request/response middleware for auth and logging
- **Server-side validation**: Use Zod or similar for API route validation
- **Proxy pattern**: Use Next.js API routes to proxy third-party APIs for CORS-free deployment
- **Edge runtime**: Use `runtime: 'edge'` for better performance on API routes
- **Type safety**: Full TypeScript support for API responses and requests
- **Request forwarding**: Forward headers, methods, and body from client to external API
- **Error normalization**: Standardize error responses across different APIs

### State Management

- **Context API**: Global state for auth, cart, products
- **Custom hooks**: Business logic encapsulation
- **Optimistic updates**: Immediate UI feedback with background sync

### Styling Approach

- **Utility-first**: Tailwind classes for rapid development
- **Component variants**: Consistent styling patterns
- **Responsive design**: Mobile-first approach

### Testing Strategy

- **Manual testing**: `test-api.js` for API endpoint verification
- **Integration testing**: End-to-end user flows
- **Performance testing**: Lighthouse and Web Vitals monitoring

## File Structure Conventions

### Component Naming

- PascalCase for component files (e.g., `ProductCard.js`)
- kebab-case for directories (e.g., `product-card/`)

### Import Organization

- React imports first
- Third-party libraries second
- Local imports last
- Alphabetical ordering within groups

### Third-Party API Integration Patterns

- **Proxy through API routes**: Avoid CORS by calling local `/api/*` routes that proxy to external APIs
- **Request forwarding**: Forward headers, methods, and body from client to external API
- **Error normalization**: Standardize error responses across different APIs
- **Caching strategies**: Implement appropriate caching for API responses
- **Rate limiting**: Handle API rate limits gracefully
- **Fallback handling**: Provide fallbacks when external APIs are unavailable

### API Route Patterns

- Use App Router API routes (`app/api/`) over Pages Router (`pages/api/`)
- Implement proper HTTP method handling (GET, POST, PUT, DELETE)
- Use catch-all routes (`[...slug]`) for dynamic API proxying
- Include proper TypeScript types for request/response objects
- Use Edge runtime for improved performance on proxy routes

### Environment Variables

- `NEXT_PUBLIC_*` prefix for client-side variables
- Server-side variables without prefix
- Consistent naming across environments
