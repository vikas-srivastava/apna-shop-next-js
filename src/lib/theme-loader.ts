// Client-side theme loader (no fs imports)
import type { ThemeConfig } from './server-theme-loader'

/**
 * Load client-specific theme from API
 * @param client Client identifier
 */
export async function loadClientTheme(client: string = 'default'): Promise<ThemeConfig> {
    try {
        // In a real implementation, this would call your headless e-commerce API
        const response = await fetch(`/api/themes?client=${client}`)

        if (!response.ok) {
            throw new Error(`Failed to load theme for client: ${client}`)
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Failed to load client theme')
        }

        // Merge with default theme structure
        return {
            ...getDefaultTheme(),
            ...result.data,
            colors: {
                ...getDefaultTheme().colors,
                ...result.data.colors,
                text: {
                    ...getDefaultTheme().colors.text,
                    ...(result.data.colors?.text || {})
                }
            }
        }
    } catch (error) {
        console.warn(`Could not load client theme for ${client}, using default theme`, error)
        return getDefaultTheme()
    }
}

/**
 * Get default theme configuration
 */
function getDefaultTheme(): ThemeConfig {
    return {
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
                primary: 'var(--color-secondary-900)',
                secondary: 'var(--color-secondary-600)',
                accent: 'var(--color-accent-600)',
                success: 'var(--color-success-600)',
                error: 'var(--color-error-600)',
                warning: 'var(--color-warning-600)'
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