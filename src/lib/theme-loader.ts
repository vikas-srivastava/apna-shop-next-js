import * as yaml from 'js-yaml'
import type { ThemeConfig } from './server-theme-loader'

/**
 * Load theme configuration from YAML file
 */
export async function loadThemeConfig(): Promise<ThemeConfig> {
    try {
        const response = await fetch('/theme.yml')

        if (!response.ok) {
            throw new Error('Failed to load theme.yml')
        }

        const yamlContent = await response.text()
        const themeConfig = yaml.load(yamlContent) as any

        // Validate and structure the theme config
        return {
            version: themeConfig.version || '1.0.0',
            description: themeConfig.description || '',
            themes: themeConfig.themes || {},
            layout: themeConfig.layout || {},
            components: themeConfig.components || {},
            animation: themeConfig.animation || {}
        }
    } catch (error) {
        console.warn('Could not load theme.yml, using default theme', error)
        return getDefaultTheme()
    }
}

/**
 * Generate theme variations with color and font changes
 */
export function generateThemeVariations(baseTheme: any): ThemeVariation[] {
    const variations: ThemeVariation[] = []

    // Generate lighter variation
    variations.push({
        name: 'Light',
        colors: lightenColors(baseTheme.colors, 0.1),
        fonts: baseTheme.typography?.fontFamily || {}
    })

    // Generate darker variation
    variations.push({
        name: 'Dark',
        colors: darkenColors(baseTheme.colors, 0.1),
        fonts: baseTheme.typography?.fontFamily || {}
    })

    // Generate complementary color variation
    variations.push({
        name: 'Complementary',
        colors: generateComplementaryColors(baseTheme.colors),
        fonts: baseTheme.typography?.fontFamily || {}
    })

    return variations
}

/**
 * Lighten colors by a percentage
 */
function lightenColors(colors: any, amount: number): any {
    const lightened: any = {}

    Object.entries(colors).forEach(([colorName, shades]) => {
        if (typeof shades === 'object' && shades !== null) {
            lightened[colorName] = {}
            Object.entries(shades).forEach(([shade, value]) => {
                lightened[colorName][shade] = lightenColor(value as string, amount)
            })
        }
    })

    return lightened
}

/**
 * Darken colors by a percentage
 */
function darkenColors(colors: any, amount: number): any {
    const darkened: any = {}

    Object.entries(colors).forEach(([colorName, shades]) => {
        if (typeof shades === 'object' && shades !== null) {
            darkened[colorName] = {}
            Object.entries(shades).forEach(([shade, value]) => {
                darkened[colorName][shade] = darkenColor(value as string, amount)
            })
        }
    })

    return darkened
}

/**
 * Generate complementary colors
 */
function generateComplementaryColors(colors: any): any {
    const complementary: any = {}

    Object.entries(colors).forEach(([colorName, shades]) => {
        if (typeof shades === 'object' && shades !== null) {
            complementary[colorName] = {}
            Object.entries(shades).forEach(([shade, value]) => {
                complementary[colorName][shade] = getComplementaryColor(value as string)
            })
        }
    })

    return complementary
}

/**
 * Lighten a color by a percentage
 */
function lightenColor(color: string, amount: number): string {
    // Simple color manipulation - in a real implementation you'd use a proper color library
    if (color.startsWith('#')) {
        const num = parseInt(color.replace("#", ""), 16)
        const amt = Math.round(2.55 * amount * 100)
        const R = (num >> 16) + amt
        const G = (num >> 8 & 0x00FF) + amt
        const B = (num & 0x0000FF) + amt
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
    }
    return color
}

/**
 * Darken a color by a percentage
 */
function darkenColor(color: string, amount: number): string {
    return lightenColor(color, -amount)
}

/**
 * Get complementary color
 */
function getComplementaryColor(color: string): string {
    if (color.startsWith('#')) {
        const num = parseInt(color.replace("#", ""), 16)
        const R = (num >> 16)
        const G = (num >> 8 & 0x00FF)
        const B = (num & 0x0000FF)
        // Simple complementary calculation
        return "#" + ((0xFFFFFF ^ num) & 0xFFFFFF).toString(16).padStart(6, '0')
    }
    return color
}

/**
 * Theme variation interface
 */
export interface ThemeVariation {
    name: string
    colors: any
    fonts: any
}

/**
 * Get default theme configuration
 */
function getDefaultTheme(): ThemeConfig {
    return {
        name: "Default Theme",
        version: "1.0.0",
        colors: {
            primary: {
                '50': '#f0f9ff',
                '100': '#e0f2fe',
                '200': '#bae6fd',
                '300': '#7dd3fc',
                '400': '#38bdf8',
                '500': '#0ea5e9',
                '600': '#0284c7',
                '700': '#0369a1',
                '800': '#075985',
                '900': '#0c4a6e',
                '950': '#082f49'
            },
            secondary: {
                '50': '#f8fafc',
                '100': '#f1f5f9',
                '200': '#e2e8f0',
                '300': '#cbd5e1',
                '400': '#94a3b8',
                '500': '#64748b',
                '600': '#475569',
                '700': '#334155',
                '800': '#1e293b',
                '900': '#0f172a',
                '950': '#020617'
            },
            accent: {
                '50': '#fef2f2',
                '100': '#fee2e2',
                '200': '#fecaca',
                '300': '#fca5a5',
                '400': '#f87171',
                '500': '#ef4444',
                '600': '#dc2626',
                '700': '#b91c1c',
                '800': '#991b1b',
                '900': '#7f1d1d',
                '950': '#450a0a'
            },
            success: {
                '50': '#f0fdf4',
                '100': '#dcfce7',
                '200': '#bbf7d0',
                '300': '#86efac',
                '400': '#4ade80',
                '500': '#22c55e',
                '600': '#16a34a',
                '700': '#15803d',
                '800': '#166534',
                '900': '#14532d',
                '950': '#052e16'
            },
            error: {
                '50': '#fef2f2',
                '100': '#fee2e2',
                '200': '#fecaca',
                '300': '#fca5a5',
                '400': '#f87171',
                '500': '#ef4444',
                '600': '#dc2626',
                '700': '#b91c1c',
                '800': '#991b1b',
                '900': '#7f1d1d',
                '950': '#450a0a'
            },
            warning: {
                '50': '#fffbeb',
                '100': '#fef3c7',
                '200': '#fde68a',
                '300': '#fcd34d',
                '400': '#fbbf24',
                '500': '#f59e0b',
                '600': '#d97706',
                '700': '#b45309',
                '800': '#92400e',
                '900': '#78350f',
                '950': '#422006'
            },
            text: {
                primary: '#0f172a',
                secondary: '#475569',
                accent: '#dc2626',
                success: '#16a34a',
                error: '#dc2626',
                warning: '#d97706'
            }
        },
        fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
        },
        components: {
            button: {
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out'
            },
            card: {
                borderRadius: '12px',
                shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                padding: '1.5rem'
            },
            input: {
                borderRadius: '8px',
                borderWidth: '1px',
                padding: '0.75rem 1rem',
                fontSize: '1rem'
            }
        },
        layout: {
            containerMaxWidth: '1280px',
            borderRadius: {
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '16px'
            },
            spacing: {
                xs: '0.5rem',
                sm: '0.75rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem'
            }
        }
    }
}
