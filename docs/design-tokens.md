# Design Tokens Documentation

## Overview

Design tokens are the fundamental building blocks of the theme system. They provide a centralized way to manage design decisions like colors, typography, spacing, and other visual properties. This system uses CSS custom properties (variables) to implement design tokens, allowing for dynamic theme switching and consistent design application.

## Token Categories

### Color Tokens

Color tokens are organized in a systematic scale from 50 (lightest) to 900 (darkest):

#### Primary Colors

```css
--color-primary-50: 249, 250, 251; /* Lightest */
--color-primary-100: 243, 244, 246;
--color-primary-200: 229, 231, 235;
--color-primary-300: 209, 213, 219;
--color-primary-400: 156, 163, 175;
--color-primary-500: 107, 114, 128; /* Main primary */
--color-primary-600: 75, 85, 99;
--color-primary-700: 55, 65, 81;
--color-primary-800: 31, 41, 55;
--color-primary-900: 17, 24, 39; /* Darkest */
```

#### Secondary Colors

```css
--color-secondary-50: 255, 255, 255;
--color-secondary-100: 249, 250, 251;
--color-secondary-200: 243, 244, 246;
--color-secondary-300: 229, 231, 235;
--color-secondary-400: 209, 213, 219;
--color-secondary-500: 156, 163, 175; /* Main secondary */
--color-secondary-600: 107, 114, 128;
--color-secondary-700: 75, 85, 99;
--color-secondary-800: 55, 65, 81;
--color-secondary-900: 31, 41, 55;
```

#### Accent Colors

```css
--color-accent-50: 239, 246, 255;
--color-accent-100: 219, 234, 254;
--color-accent-200: 191, 219, 254;
--color-accent-300: 147, 197, 253;
--color-accent-400: 96, 165, 250;
--color-accent-500: 59, 130, 246; /* Main accent */
--color-accent-600: 37, 99, 235;
--color-accent-700: 29, 78, 216;
--color-accent-800: 30, 64, 175;
--color-accent-900: 30, 58, 138;
```

#### Semantic Colors

```css
--color-success-500: 22, 163, 74; /* Green for success states */
--color-warning-500: 245, 158, 11; /* Amber for warnings */
--color-error-500: 220, 38, 38; /* Red for errors */
```

#### Text Colors

```css
--color-text-primary: 17, 24, 39; /* Main text color */
--color-text-secondary: 75, 85, 99; /* Secondary text */
--color-text-accent: 37, 99, 235; /* Links, accents */
--color-text-success: 22, 101, 52; /* Success text */
--color-text-warning: 146, 64, 14; /* Warning text */
--color-text-error: 185, 28, 28; /* Error text */
```

## Typography Tokens

### Font Families

```css
--font-sans: "Inter", "system-ui", "sans-serif";
--font-serif: "Georgia", "serif";
--font-mono: "JetBrains Mono", "monospace";
```

### Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Font Sizes

```css
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px */
--font-size-5xl: 3rem; /* 48px */
--font-size-6xl: 3.75rem; /* 60px */
```

## Spacing Tokens

### Spacing Scale

```css
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-5: 1.25rem; /* 20px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-10: 2.5rem; /* 40px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
--spacing-20: 5rem; /* 80px */
--spacing-24: 6rem; /* 96px */
```

### Layout Spacing

```css
--container-padding: 1rem;
--section-spacing: 2rem;
--component-spacing: 1rem;
```

## Border Radius Tokens

```css
--border-radius-none: 0;
--border-radius-sm: 0.125rem; /* 2px */
--border-radius: 0.25rem; /* 4px */
--border-radius-md: 0.375rem; /* 6px */
--border-radius-lg: 0.5rem; /* 8px */
--border-radius-xl: 0.75rem; /* 12px */
--border-radius-2xl: 1rem; /* 16px */
--border-radius-3xl: 1.5rem; /* 24px */
--border-radius-full: 9999px; /* Fully rounded */
```

## Shadow Tokens

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## Component-Specific Tokens

### Buttons

```css
--button-border-radius: 0.5rem;
--button-font-weight: 600;
--button-transition: all 0.2s ease-in-out;
--button-padding-x: 1rem;
--button-padding-y: 0.5rem;
```

### Cards

```css
--card-border-radius: 0.75rem;
--card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--card-padding: 1.5rem;
--card-border-width: 1px;
```

### Inputs

```css
--input-border-radius: 0.5rem;
--input-border-width: 1px;
--input-padding: 0.75rem 1rem;
--input-font-size: 1rem;
--input-height: 2.5rem;
```

## Using Design Tokens

### In CSS

```css
.my-component {
  background-color: rgb(var(--color-primary-500));
  color: rgb(var(--color-text-primary));
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow);
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}
```

### In Tailwind CSS (via tailwind.config.ts)

```typescript
colors: {
    primary: {
        50: 'rgb(var(--color-primary-50) / <alpha-value>)',
        100: 'rgb(var(--color-primary-100) / <alpha-value>)',
        // ... other shades
        500: 'rgb(var(--color-primary-500) / <alpha-value>)',
        // ... other shades
        900: 'rgb(var(--color-primary-900) / <alpha-value>)',
    },
    // ... other color categories
}
```

### In Components

```tsx
function MyButton({ variant = "primary" }) {
  return (
    <button
      className={clsx("px-4 py-2 rounded-md font-semibold transition-colors", {
        "bg-primary-500 text-white hover:bg-primary-600": variant === "primary",
        "bg-secondary-100 text-secondary-900 hover:bg-secondary-200":
          variant === "secondary",
      })}
    >
      Click me
    </button>
  );
}
```

## Theme-Specific Token Overrides

Each theme can override tokens to customize appearance:

### Light Theme Example

```css
:root {
  --color-primary-500: 59, 130, 246; /* Blue */
  --color-text-primary: 17, 24, 39; /* Dark text */
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Dark Theme Example

```css
[data-theme="dark"] {
  --color-primary-500: 96, 165, 250; /* Lighter blue */
  --color-text-primary: 248, 250, 252; /* Light text */
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3);
}
```

## Adding New Tokens

### 1. Define in CSS Variables

```css
:root {
  --color-tertiary-500: 168, 85, 247; /* New tertiary color */
  --spacing-0-5: 0.125rem; /* New spacing value */
}
```

### 2. Update Tailwind Config

```typescript
// tailwind.config.ts
colors: {
    tertiary: 'rgb(var(--color-tertiary-500) / <alpha-value>)',
},
spacing: {
    '0.5': 'var(--spacing-0-5)',
}
```

### 3. Use in Components

```tsx
<div className="bg-tertiary text-primary-500 p-0.5">New token usage</div>
```

## Token Naming Conventions

### Colors

- `--color-{category}-{shade}` (e.g., `--color-primary-500`)
- Categories: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `text`
- Shades: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

### Typography

- `--font-{property}` (e.g., `--font-size-base`, `--font-weight-bold`)
- `--text-{variant}` (e.g., `--text-primary`, `--text-secondary`)

### Spacing

- `--spacing-{size}` (e.g., `--spacing-4`, `--spacing-8`)

### Other

- `--border-radius-{size}` (e.g., `--border-radius-md`)
- `--shadow-{size}` (e.g., `--shadow-lg`)

## Token Validation

### Contrast Requirements

- Text on background: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### Accessibility

- Color tokens should support both light and dark themes
- Text colors should maintain readability
- Focus indicators should be clearly visible

### Performance

- Limit total CSS custom properties to under 200
- Use efficient CSS selectors for theme overrides
- Minimize CSS calculations in token usage

## Migration Guide

### From Hardcoded Values to Tokens

**Before:**

```css
.button {
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
}
```

**After:**

```css
.button {
  background-color: rgb(var(--color-primary-500));
  color: rgb(var(--text-primary));
  border-radius: var(--border-radius-md);
  padding: var(--spacing-2) var(--spacing-4);
}
```

### Component Refactoring

1. Identify hardcoded values in components
2. Replace with appropriate design tokens
3. Test across all themes
4. Update component documentation

## Best Practices

### Token Organization

- Group related tokens together
- Use consistent naming patterns
- Document token purposes and usage
- Version token changes

### Theme Compatibility

- Ensure all themes define required tokens
- Provide fallback values for optional tokens
- Test token combinations across themes
- Maintain design consistency

### Maintenance

- Regularly audit token usage
- Remove unused tokens
- Update tokens based on design system changes
- Document token relationships and dependencies

This design token system provides a solid foundation for scalable, maintainable, and themeable design systems in the Next.js eCommerce application.
