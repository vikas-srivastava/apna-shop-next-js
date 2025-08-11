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
                primary: theme.colors.primary,
                secondary: theme.colors.secondary,
                accent: theme.colors.accent,
                success: theme.colors.success,
                error: theme.colors.error,
                warning: theme.colors.warning,
            },
            fontFamily: {
                sans: theme.fonts.sans.split(', '),
                serif: theme.fonts.serif.split(', '),
                mono: theme.fonts.mono.split(', '),
            },
            borderRadius: {
                'theme-sm': theme.layout.borderRadius.sm,
                'theme-md': theme.layout.borderRadius.md,
                'theme-lg': theme.layout.borderRadius.lg,
                'theme-xl': theme.layout.borderRadius.xl,
            },
            spacing: {
                'theme-xs': theme.layout.spacing.xs,
                'theme-sm': theme.layout.spacing.sm,
                'theme-md': theme.layout.spacing.md,
                'theme-lg': theme.layout.spacing.lg,
                'theme-xl': theme.layout.spacing.xl,
                'theme-2xl': theme.layout.spacing['2xl'],
                'theme-3xl': theme.layout.spacing['3xl'],
            },
            maxWidth: {
                'theme-container': theme.layout.containerMaxWidth,
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