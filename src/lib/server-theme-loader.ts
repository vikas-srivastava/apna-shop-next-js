import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'

export interface ThemeConfig {
    name?: string
    version?: string
    colors: {
        primary: Record<string, string>
        secondary: Record<string, string>
        accent: Record<string, string>
        success: Record<string, string>
        error: Record<string, string>
        warning: Record<string, string>
        // Text colors for better theme integration
        text: {
            primary: string
            secondary: string
            accent: string
            success: string
            error: string
            warning: string
        }
    }
    fonts: {
        sans: string
        serif: string
        mono: string
    }
    components: {
        button: {
            borderRadius: string
            fontWeight: string
            transition: string
        }
        card: {
            borderRadius: string
            shadow: string
            padding: string
        }
        input: {
            borderRadius: string
            borderWidth: string
            padding: string
            fontSize: string
        }
    }
    layout: {
        containerMaxWidth: string
        borderRadius: {
            sm: string
            md: string
            lg: string
            xl: string
        }
        spacing: {
            xs: string
            sm: string
            md: string
            lg: string
            xl: string
            '2xl': string
            '3xl': string
        }
    }
}

/**
 * Load theme configuration from theme.yml file
 * This function is called at build time to configure Tailwind CSS
 * Server-side only function
 */
export function loadTheme(): ThemeConfig {
    try {
        const themeFilePath = path.join(process.cwd(), 'theme.yml')
        const themeFile = fs.readFileSync(themeFilePath, 'utf8')
        const themeConfig = yaml.load(themeFile) as any

        // Merge with default theme structure
        return {
            ...getDefaultTheme(),
            ...themeConfig,
            colors: {
                ...getDefaultTheme().colors,
                ...themeConfig.colors,
                text: {
                    ...getDefaultTheme().colors.text,
                    ...themeConfig.colors?.text
                }
            }
        }
    } catch (error) {
        console.warn('Could not load theme.yml, using default theme')
        // Return default theme if file doesn't exist or is invalid
        return getDefaultTheme()
    }
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