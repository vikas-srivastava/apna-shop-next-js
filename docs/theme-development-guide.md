# Theme Development Guide

## Overview

This guide explains how to create and integrate new themes into the Next.js eCommerce application. The theme system is designed to be purely presentational, affecting only styling and layout while maintaining identical functionality across all themes.

## Theme Architecture

### Theme Components

1. **Theme Configuration** (`public/theme.yml`) - YAML definitions
2. **CSS Variables** (`src/styles/themes.css`) - Dynamic styling
3. **Theme Provider** - Runtime theme management
4. **Theme Switcher** - UI for theme selection

### Theme vs Core Separation

- **Core**: Functionality, API integration, business logic
- **Theme**: Colors, typography, spacing, visual design

## Creating a New Theme

### Step 1: Define Theme in YAML

Add your theme to `public/theme.yml`:

```yaml
themes:
  your-theme-name:
    name: "Your Theme Name"
    type: "light" # or "dark"
    description: "Brief description of your theme"
    colors:
      primary:
        50: "#f0f9ff"
        100: "#e0f2fe"
        200: "#bae6fd"
        300: "#7dd3fc"
        400: "#38bdf8"
        500: "#0ea5e9" # Main primary color
        600: "#0284c7"
        700: "#0369a1"
        800: "#075985"
        900: "#0c4a6e"
      secondary:
        50: "#ffffff"
        100: "#f9fafb"
        200: "#f3f4f6"
        300: "#e5e7eb"
        400: "#d1d5db"
        500: "#9ca3af" # Main secondary color
        600: "#6b7280"
        700: "#4b5563"
        800: "#374151"
        900: "#1f2937"
      accent:
        50: "#eff6ff"
        100: "#dbeafe"
        200: "#bfdbfe"
        300: "#93c5fd"
        400: "#60a5fa"
        500: "#3b82f6" # Accent color
        600: "#2563eb"
        700: "#1d4ed8"
        800: "#1e40af"
        900: "#1e3a8a"
      success:
        500: "#16a34a"
      warning:
        50: "#fffbeb"
        100: "#fef3c7"
        200: "#fde68a"
        300: "#fcd34d"
        400: "#fbbf24"
        500: "#f59e0b"
        600: "#d97706"
        700: "#b45309"
        800: "#92400e"
        900: "#78350f"
      error:
        500: "#dc2626"
      text:
        primary: "#111827" # Main text color
        secondary: "#4b5563" # Secondary text
        accent: "#2563eb" # Link/accent text
        success: "#166534"
        warning: "#92400e"
        error: "#b91c1c"
    typography:
      fontFamily:
        sans: ["Inter", "system-ui", "sans-serif"]
        serif: ["Georgia", "serif"]
        mono: ["JetBrains Mono", "monospace"]
      fontWeight:
        normal: 400
        medium: 500
        semibold: 600
        bold: 700
      fontSize:
        xs: "0.75rem"
        sm: "0.875rem"
        base: "1rem"
        lg: "1.125rem"
        xl: "1.25rem"
        "2xl": "1.5rem"
        "3xl": "1.875rem"
        "4xl": "2.25rem"
        "5xl": "3rem"
        "6xl": "3.75rem"
```

### Step 2: Add CSS Variables

Add your theme's CSS variables to `src/styles/themes.css`:

```css
[data-theme="your-theme-name"] {
  --color-primary-50: 240, 249, 255;
  --color-primary-100: 224, 242, 254;
  --color-primary-200: 186, 230, 253;
  --color-primary-300: 125, 211, 252;
  --color-primary-400: 56, 189, 248;
  --color-primary-500: 14, 165, 233;
  --color-primary-600: 2, 132, 199;
  --color-primary-700: 3, 105, 161;
  --color-primary-800: 7, 89, 133;
  --color-primary-900: 12, 74, 110;

  --color-secondary-50: 248, 250, 252;
  --color-secondary-100: 241, 245, 249;
  --color-secondary-200: 226, 232, 240;
  --color-secondary-300: 203, 213, 225;
  --color-secondary-400: 148, 163, 184;
  --color-secondary-500: 100, 116, 139;
  --color-secondary-600: 71, 85, 105;
  --color-secondary-700: 51, 65, 85;
  --color-secondary-800: 30, 41, 59;
  --color-secondary-900: 15, 23, 42;

  --color-accent-50: 239, 246, 255;
  --color-accent-100: 219, 234, 254;
  --color-accent-200: 191, 219, 254;
  --color-accent-300: 147, 197, 253;
  --color-accent-400: 96, 165, 250;
  --color-accent-500: 59, 130, 246;
  --color-accent-600: 37, 99, 235;
  --color-accent-700: 29, 78, 216;
  --color-accent-800: 30, 64, 175;
  --color-accent-900: 30, 58, 138;

  --color-success-500: 22, 163, 74;
  --color-warning-50: 255, 251, 235;
  --color-warning-100: 254, 243, 199;
  --color-warning-200: 253, 230, 138;
  --color-warning-300: 252, 211, 77;
  --color-warning-400: 251, 191, 36;
  --color-warning-500: 245, 158, 11;
  --color-warning-600: 217, 119, 6;
  --color-warning-700: 180, 83, 9;
  --color-warning-800: 146, 64, 14;
  --color-warning-900: 120, 53, 15;
  --color-error-500: 220, 38, 38;

  --color-text-primary: 15, 23, 42;
  --color-text-secondary: 71, 85, 105;
  --color-text-accent: 37, 99, 235;
  --color-text-success: 21, 128, 61;
  --color-text-warning: 146, 64, 14;
  --color-text-error: 185, 28, 28;

  --text-primary: 15, 23, 42;
  --text-secondary: 71, 85, 105;
  --text-accent: 37, 99, 235;
  --text-success: 21, 128, 61;
  --text-warning: 146, 64, 14;
  --text-error: 185, 28, 28;
}
```

### Step 3: Test Theme Loading

1. Start the development server: `npm run dev`
2. Open the theme switcher component
3. Verify your theme appears in the dropdown
4. Select your theme and check that colors update correctly

## Theme Development Best Practices

### Color Harmony

- Use a consistent color palette (3-5 main colors)
- Ensure sufficient contrast ratios (WCAG AA compliance)
- Test colors in both light and dark contexts
- Consider color blindness accessibility

### Typography

- Choose readable font combinations
- Maintain consistent font scales
- Ensure proper line heights and spacing
- Test font rendering across devices

### Spacing and Layout

- Use consistent spacing scales
- Maintain proper visual hierarchy
- Ensure responsive behavior
- Test on various screen sizes

### Component Overrides

Themes can override component-specific styles by targeting data attributes:

```css
[data-theme="your-theme"] .btn-primary {
  background-color: rgb(var(--color-primary-500));
  border-radius: 8px;
}

[data-theme="your-theme"] .card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Advanced Theme Features

### Dynamic Theme Properties

Themes can include custom properties:

```yaml
your-theme:
  name: "Dynamic Theme"
  customProperties:
    borderRadius: "12px"
    shadowIntensity: 0.15
```

### Theme Variants

Create theme variants for different contexts:

```yaml
themes:
  brand-light:
    name: "Brand Light"
    type: "light"
    variant: "brand"
  brand-dark:
    name: "Brand Dark"
    type: "dark"
    variant: "brand"
```

### Conditional Styling

Use CSS custom properties for conditional styling:

```css
[data-theme="minimal"] {
  --button-shadow: none;
  --card-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

[data-theme="bold"] {
  --button-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
  --card-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}
```

## Theme Validation Checklist

### Before Committing

- [ ] Theme loads correctly in theme switcher
- [ ] All color variables are defined
- [ ] Text contrast meets WCAG AA standards
- [ ] Theme works in both light and dark modes
- [ ] Responsive design is maintained
- [ ] Typography is readable on all screen sizes
- [ ] Interactive elements have proper hover/focus states
- [ ] Theme doesn't break existing functionality

### Cross-Browser Testing

- [ ] Chrome/Chromium browsers
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing

- [ ] Color contrast ratios
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus indicators
- [ ] Semantic HTML structure

## Theme Management

### Runtime Theme Switching

Themes can be switched programmatically:

```typescript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();

// Switch to a specific theme
setTheme("your-theme-name");

// Get current theme
console.log("Current theme:", theme);
```

### URL-Based Theme Selection

Themes can be set via URL parameters:

```
https://yourapp.com?theme=your-theme-name
```

### Default Theme Configuration

Set default theme in environment variables:

```env
NEXT_PUBLIC_DEFAULT_THEME=classic-light
```

## Troubleshooting

### Theme Not Loading

1. Check YAML syntax in `theme.yml`
2. Verify CSS variables are properly defined
3. Ensure theme name matches between YAML and CSS
4. Check browser console for errors

### Colors Not Applying

1. Verify CSS custom property names
2. Check that components use CSS variables
3. Ensure proper CSS specificity
4. Test with browser dev tools

### Performance Issues

1. Minimize CSS custom properties (keep under 100)
2. Use CSS containment where possible
3. Avoid complex CSS calculations
4. Test theme switching performance

## Example Theme: Minimalist Blue

Here's a complete example of a minimalist blue theme:

### YAML Configuration

```yaml
minimalist-blue:
  name: "Minimalist Blue"
  type: "light"
  description: "Clean, minimal design with blue accents"
  colors:
    primary:
      50: "#eff6ff"
      100: "#dbeafe"
      200: "#bfdbfe"
      300: "#93c5fd"
      400: "#60a5fa"
      500: "#3b82f6"
      600: "#2563eb"
      700: "#1d4ed8"
      800: "#1e40af"
      900: "#1e3a8a"
    secondary:
      50: "#f8fafc"
      100: "#f1f5f9"
      200: "#e2e8f0"
      300: "#cbd5e1"
      400: "#94a3b8"
      500: "#64748b"
      600: "#475569"
      700: "#334155"
      800: "#1e293b"
      900: "#0f172a"
    text:
      primary: "#0f172a"
      secondary: "#475569"
      accent: "#2563eb"
```

### CSS Variables

```css
[data-theme="minimalist-blue"] {
  --color-primary-500: 59, 130, 246;
  --color-secondary-500: 100, 116, 139;
  --text-primary: 15, 23, 42;
  --text-secondary: 71, 85, 105;
  --text-accent: 37, 99, 235;
  /* ... additional variables */
}
```

This theme development guide provides a comprehensive foundation for creating consistent, accessible, and maintainable themes within the Next.js eCommerce application.
