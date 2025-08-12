'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadClientTheme, ThemeConfig } from '@/lib/theme-loader'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    theme: ThemeMode
    client: string
    clientTheme: ThemeConfig | null
    setTheme: (theme: ThemeMode) => void
    setClient: (client: string) => void
    toggleTheme: () => void
    isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme Provider Component
 * Manages global theme state and applies theme to document
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>('light')
    const [client, setClient] = useState<string>('default')
    const [clientTheme, setClientTheme] = useState<ThemeConfig | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeMode
        const savedClient = localStorage.getItem('client') || 'default'

        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }

        setClient(savedClient)

        // Add listener for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if no theme is saved in localStorage (i.e., using system preference)
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light')
            }
        }

        mediaQuery.addEventListener('change', handleChange)

        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    // Load client-specific theme
    useEffect(() => {
        const loadTheme = async () => {
            setIsLoading(true)
            try {
                const themeData = await loadClientTheme(client)
                setClientTheme(themeData)
            } catch (error) {
                console.error('Failed to load client theme:', error)
                setClientTheme(null)
            } finally {
                setIsLoading(false)
            }
        }

        if (client) {
            loadTheme()
        }
    }, [client])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Apply theme mode class
        root.classList.add(theme)

        // Apply client theme CSS variables if available
        if (clientTheme) {
            // Set color variables
            Object.entries(clientTheme.colors).forEach(([colorName, shades]) => {
                if (typeof shades === 'object' && shades !== null) {
                    Object.entries(shades).forEach(([shade, value]) => {
                        root.style.setProperty(`--color-${colorName}-${shade}`, value as string)
                    })
                }
            })

            // Set text color variables
            Object.entries(clientTheme.colors.text).forEach(([name, value]) => {
                root.style.setProperty(`--text-${name}`, value as string)
            })
        } else {
            // If no client theme, remove any existing CSS variables
            const colorProperties = Array.from(root.style).filter(prop =>
                prop.startsWith('--color-') || prop.startsWith('--text-')
            );
            colorProperties.forEach(prop => root.style.removeProperty(prop));
        }

        // Save to localStorage
        localStorage.setItem('theme', theme)
        localStorage.setItem('client', client)
    }, [theme, client, clientTheme])

    const toggleTheme = () => {
        setTheme(current => current === 'light' ? 'dark' : 'light')
    }

    const value: ThemeContextType = {
        theme,
        client,
        clientTheme,
        setTheme,
        setClient,
        toggleTheme,
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