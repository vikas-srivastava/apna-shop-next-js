import type { Config } from 'tailwindcss'
import { loadTheme } from './src/lib/server-theme-loader'

// Load theme configuration at build time
const theme = loadTheme()

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: theme.colors?.primary || {},
                secondary: theme.colors?.secondary || {},
                accent: theme.colors?.accent || {},
                success: theme.colors?.success || {},
                error: theme.colors?.error || {},
                warning: theme.colors?.warning || {},
                text: theme.colors?.text || {},
            },
            fontFamily: {
                sans: theme.fonts?.sans?.split(', ') || ['Inter', 'system-ui', 'sans-serif'],
                serif: theme.fonts?.serif?.split(', ') || ['Georgia', 'serif'],
                mono: theme.fonts?.mono?.split(', ') || ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'theme-sm': theme.layout?.borderRadius?.sm || '4px',
                'theme-md': theme.layout?.borderRadius?.md || '8px',
                'theme-lg': theme.layout?.borderRadius?.lg || '12px',
                'theme-xl': theme.layout?.borderRadius?.xl || '16px',
            },
            spacing: {
                'theme-xs': theme.layout?.spacing?.xs || '0.5rem',
                'theme-sm': theme.layout?.spacing?.sm || '0.75rem',
                'theme-md': theme.layout?.spacing?.md || '1rem',
                'theme-lg': theme.layout?.spacing?.lg || '1.5rem',
                'theme-xl': theme.layout?.spacing?.xl || '2rem',
                'theme-2xl': theme.layout?.spacing?.['2xl'] || '3rem',
                'theme-3xl': theme.layout?.spacing?.['3xl'] || '4rem',
            },
            maxWidth: {
                'theme-container': theme.layout?.containerMaxWidth || '1280px',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
        },
    },
    plugins: [],
}

export default config