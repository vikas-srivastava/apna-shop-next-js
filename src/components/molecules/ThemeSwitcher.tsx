'use client'

import { Sun, Moon, Palette } from 'lucide-react'
import { Button } from '../atoms/Button'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Theme switcher component for toggling between light, dark, and custom themes
 */
export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    const themes = [
        {
            key: 'light' as const,
            label: 'Light',
            icon: Sun,
            description: 'Clean and bright theme'
        },
        {
            key: 'dark' as const,
            label: 'Dark',
            icon: Moon,
            description: 'Easy on the eyes'
        },
        {
            key: 'custom' as const,
            label: 'Custom',
            icon: Palette,
            description: 'Your custom theme'
        }
    ]

    return (
        <div className="flex items-center gap-2">
            {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.key

                return (
                    <Button
                        key={themeOption.key}
                        variant={isActive ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setTheme(themeOption.key)}
                        className="flex items-center gap-2 px-3 py-2"
                        title={themeOption.description}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{themeOption.label}</span>
                    </Button>
                )
            })}
        </div>
    )
}

/**
 * Compact theme switcher that cycles through themes on click
 */
export function CompactThemeSwitcher() {
    const { theme, toggleTheme } = useTheme()

    const getIcon = () => {
        switch (theme) {
            case 'dark':
                return Moon
            case 'custom':
                return Palette
            default:
                return Sun
        }
    }

    const Icon = getIcon()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            title={`Current theme: ${theme}. Click to switch.`}
        >
            <Icon className="w-5 h-5" />
        </Button>
    )
}