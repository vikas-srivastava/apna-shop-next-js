'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'custom'

interface ThemeContextType {
    theme: ThemeMode
    setTheme: (theme: ThemeMode) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme Provider Component
 * Manages global theme state and applies theme to document
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>('light')

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeMode
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        // Remove existing theme classes
        root.removeAttribute('data-theme')
        root.classList.remove('dark', 'light')

        // Apply new theme
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark')
            root.classList.add('dark')
        } else if (theme === 'custom') {
            root.setAttribute('data-theme', 'custom')
        } else {
            root.classList.add('light')
        }

        // Save to localStorage
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(current => current === 'light' ? 'dark' : 'light')
    }

    const value: ThemeContextType = {
        theme,
        setTheme,
        toggleTheme,
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