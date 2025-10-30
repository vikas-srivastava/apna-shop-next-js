# Theme Development Guide

## Overview

This guide explains how to create and integrate new themes into the Next.js eCommerce application. The theme system is designed to be purely presentational, affecting only styling and layout while maintaining identical functionality across all themes.

## Theme Architecture

### Theme Components

1.  **Theme Configuration** (`public/theme.yml`) - YAML definitions
2.  **CSS Variables** (`src/styles/themes.css`) - Dynamic styling
3.  **Theme Provider** - Runtime theme management
4.  **Theme Switcher** - UI for theme selection

### Theme vs Core Separation

-   **Core**: Functionality, API integration, business logic
-   **Theme**: Colors, typography, spacing, visual design

## Step-by-Step Guide for Building a New Theme

### Step 1: Define Theme in YAML

Add your theme to `public/theme.yml`. This file acts as the central registry for all themes and their core design tokens. Ensure the `name` field is unique and descriptive.

```yaml
themes:
  your-theme-name:
    name: "Your Theme Name"
    type: "light" # or "dark" - indicates the base mode for the theme
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

Add your theme's CSS variables to `src/styles/themes.css`. These variables will be applied to the `[data-theme="your-theme-name"]` selector, ensuring they only apply when your theme is active. The values should correspond to the colors and other tokens defined in your `theme.yml`.

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

1.  Start the development server: `npm run dev`
2.  Open the theme switcher component (usually in the header or settings).
3.  Verify your new theme appears in the dropdown.
4.  Select your theme and check that colors, fonts, and other styles update correctly across the application.

## Naming Conventions, Folder Layout, and Best Practices

### Naming Conventions

*   **Theme Names**: Use kebab-case (e.g., `minimalist-blue`, `dark-delight`).
*   **Color Variables**: `--color-{category}-{shade}` (e.g., `--color-primary-500`, `--color-text-primary`).
*   **Font Variables**: `--font-{property}` (e.g., `--font-size-base`, `--font-weight-bold`).
*   **Spacing Variables**: `--spacing-{size}` (e.g., `--spacing-4`, `--spacing-8`).

### Folder Layout

Since themes are primarily defined through `public/theme.yml` and `src/styles/themes.css`, there isn't a separate folder for each theme. All theme-specific CSS variables reside in `src/styles/themes.css`.

### Best Practices

*   **Centralized Definition**: Always define new themes and their core design tokens in `public/theme.yml` first.
*   **CSS Variables for Styling**: Use CSS custom properties (`var(--your-variable)`) for all theme-dependent styling within components and global CSS.
*   **Theme-Agnostic Components**: Ensure your React components are not hardcoded with colors or fonts. They should consume the CSS variables, making them automatically adapt to the active theme.
*   **Accessibility**: Always consider accessibility (WCAG AA compliance) when defining colors and typography, especially contrast ratios.
*   **Performance**: Keep the number of CSS variables manageable to avoid performance overhead.

## How to Override Styles, Extend Components, and Configure Colors/Fonts

### Overriding Styles

To override styles for a specific theme, target the `[data-theme="your-theme-name"]` attribute in `src/styles/themes.css` or in component-specific CSS modules if necessary. For example:

```css
/* In src/styles/themes.css */
[data-theme="your-theme-name"] {
  /* Override global variables */
  --color-primary-500: 100, 100, 255; /* A custom blue for this theme */

  /* Apply specific styles to elements */
  .btn-primary {
    background-color: rgb(var(--color-primary-500));
    border-radius: 8px;
  }
}
```

### Extending Components

Components are designed to be reusable. If a component needs a theme-specific visual variation, consider using props to pass theme-dependent classes or styles, or leverage CSS variables. Avoid duplicating component logic for different themes.

```tsx
// Example: A button that changes color based on theme variables
function ThemeButton({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-[rgb(var(--color-primary-500))] text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Configuring Colors and Fonts

*   **Colors**: Defined in `public/theme.yml` and then translated into CSS variables in `src/styles/themes.css`. Tailwind CSS is configured to use these CSS variables, allowing you to use classes like `bg-primary-500` which will dynamically resolve to the current theme's primary color.
*   **Fonts**: Font families and weights are also defined in `public/theme.yml` and exposed as CSS variables. You can configure `tailwind.config.ts` to use these variables for font stacks.

## Instructions to Switch Themes Locally or at Runtime

### Locally (Development)

1.  **URL Parameter**: Append `?theme=your-theme-name` to your local development URL (e.g., `http://localhost:3000?theme=minimalist-blue`).
2.  **Environment Variable**: Set `NEXT_PUBLIC_DEFAULT_THEME=your-theme-name` in your `.env.local` file. This will set the default theme when the application starts.

### At Runtime (User Interaction)

Use the `ThemeSwitcher` component (typically found in the header or user settings) to allow users to select their preferred theme. This component interacts with the `ThemeContext` to update the `data-theme` attribute on the `html` element, triggering the CSS variable changes.

## Checklist for Consistency Across Themes

### Before Committing

-   [ ] **Theme Loading**: The new theme loads correctly when selected via the theme switcher or URL parameter.
-   [ ] **Color Definitions**: All color variables (primary, secondary, accent, text, semantic) are defined in `public/theme.yml` and `src/styles/themes.css`.
-   [ ] **Contrast Ratios**: Text and interactive elements meet WCAG AA contrast ratio standards in both light and dark contexts.
-   [ ] **Typography**: Font families, sizes, and weights are consistent and readable across the theme.
-   [ ] **Spacing & Layout**: Consistent spacing and responsive behavior are maintained across different screen sizes.
-   [ ] **Component Adaptation**: All core components (buttons, cards, inputs, navigation) adapt correctly to the new theme's styles.
-   [ ] **Functionality**: The new theme does not introduce any regressions or break existing application functionality.
-   [ ] **Cross-Browser Compatibility**: The theme renders correctly across major browsers (Chrome, Firefox, Safari, Edge).
-   [ ] **Accessibility**: Focus states, ARIA attributes, and semantic HTML are preserved and functional.
-   [ ] **Performance**: Theme switching is smooth and does not introduce noticeable performance degradation.

### Cross-Browser Testing

-   [ ] Chrome/Chromium browsers
-   [ ] Firefox
-   [ ] Safari
-   [ ] Edge
-   [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing

-   [ ] Color contrast ratios
-   [ ] Keyboard navigation
-   [ ] Screen reader compatibility
-   [ ] Focus indicators
-   [ ] Semantic HTML structure

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

1.  Check YAML syntax in `theme.yml`
2.  Verify CSS variables are properly defined
3.  Ensure theme name matches between YAML and CSS
4.  Check browser console for errors

### Colors Not Applying

1.  Verify CSS custom property names
2.  Check that components use CSS variables
3.  Ensure proper CSS specificity
4.  Test with browser dev tools

### Performance Issues

1.  Minimize CSS custom properties (keep under 100)
2.  Use CSS containment where possible
3.  Avoid complex CSS calculations
4.  Test theme switching performance

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
