'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadThemeConfig } from '@/lib/theme-loader'
import type { ThemeConfig } from '@/lib/server-theme-loader'

type ThemeMode = 'light'

interface ThemeContextType {
    theme: ThemeMode
    currentTheme: string
    themeConfig: ThemeConfig | null
    availableThemes: string[]
    setTheme: (themeName: string) => void
    exportTheme: () => string
    importTheme: (themeData: string) => Promise<void>
    isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme Provider Component
 * Manages global theme state and applies theme variations to document
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<ThemeMode>('light') // Always light theme
    const [currentTheme, setCurrentTheme] = useState<string>('classic-light')
    const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null)
    const [availableThemes, setAvailableThemes] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('currentTheme') || 'classic-light'
        setCurrentTheme(savedTheme)
    }, [])

    // Load theme configuration
    useEffect(() => {
        const loadTheme = async () => {
            setIsLoading(true)
            try {
                const config = await loadThemeConfig()
                setThemeConfig(config)
                setAvailableThemes(Object.keys(config.themes || {}))
            } catch (error) {
                console.error('Failed to load theme configuration:', error)
                setThemeConfig(null)
                setAvailableThemes([])
            } finally {
                setIsLoading(false)
                // Always show the page after theme loading attempt, even if it fails
                setTimeout(() => {
                    document.documentElement.classList.add('theme-loaded')
                }, 100)
            }
        }

        loadTheme()
    }, [])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        // Apply theme mode class (always light)
        root.classList.remove('light', 'dark')
        root.classList.add('light')

        // Apply current theme CSS variables if available
        if (themeConfig && themeConfig.themes && themeConfig.themes[currentTheme]) {
            const currentThemeData = themeConfig.themes[currentTheme]

            // Set color variables
            Object.entries(currentThemeData.colors).forEach(([colorName, shades]) => {
                if (typeof shades === 'object' && shades !== null) {
                    Object.entries(shades).forEach(([shade, value]) => {
                        root.style.setProperty(`--color-${colorName}-${shade}`, value as string)
                    })
                }
            })

            // Set typography variables
            if (currentThemeData.typography) {
                Object.entries(currentThemeData.typography.fontFamily).forEach(([name, value]) => {
                    root.style.setProperty(`--font-${name}`, value as string)
                })
                Object.entries(currentThemeData.typography.fontSize).forEach(([name, value]) => {
                    root.style.setProperty(`--text-${name}`, value as string)
                })
                Object.entries(currentThemeData.typography.fontWeight).forEach(([name, value]) => {
                    root.style.setProperty(`--font-weight-${name}`, value as string)
                })
            }

            // Set text color variables for Typography component
            if (currentThemeData.colors.text) {
                Object.entries(currentThemeData.colors.text).forEach(([name, value]) => {
                    root.style.setProperty(`--text-${name}`, value as string)
                })
            }
        }

        // Save to localStorage
        localStorage.setItem('currentTheme', currentTheme)

        // Mark theme as loaded to prevent flash
        setTimeout(() => {
            root.classList.add('theme-loaded')
        }, 100)
    }, [currentTheme, themeConfig])

    const setTheme = (themeName: string) => {
        if (availableThemes.includes(themeName)) {
            setCurrentTheme(themeName)
        }
    }

    const exportTheme = (): string => {
        if (!themeConfig) return ''
        return JSON.stringify(themeConfig, null, 2)
    }

    const importTheme = async (themeData: string): Promise<void> => {
        try {
            const parsed = JSON.parse(themeData)
            // Validate theme structure
            if (parsed.themes && typeof parsed.themes === 'object') {
                setThemeConfig(parsed)
                setAvailableThemes(Object.keys(parsed.themes))
                // Apply first available theme
                const firstTheme = Object.keys(parsed.themes)[0]
                if (firstTheme) {
                    setCurrentTheme(firstTheme)
                }
            }
        } catch (error) {
            console.error('Failed to import theme:', error)
            throw new Error('Invalid theme data')
        }
    }

    const value: ThemeContextType = {
        theme,
        currentTheme,
        themeConfig,
        availableThemes,
        setTheme,
        exportTheme,
        importTheme,
        isLoading
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

/**
 * Hook to use theme context
 */
export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}