'use client'

import { Palette } from 'lucide-react'
import { Button } from '../atoms/Button'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Theme switcher component for selecting between available light themes
 */
export function ThemeSwitcher() {
    const { currentTheme, availableThemes, setTheme, themeConfig } = useTheme()

    const themeOptions = availableThemes.map(key => ({
        key,
        label: themeConfig?.themes?.[key]?.name || key,
        description: themeConfig?.themes?.[key]?.description || ''
    }))

    return (
        <div className="flex items-center gap-2">
            {themeOptions.map((themeOption) => {
                const isActive = currentTheme === themeOption.key
                const isAvailable = availableThemes.includes(themeOption.key)

                return (
                    <Button
                        key={themeOption.key}
                        variant={isActive ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => isAvailable && setTheme(themeOption.key)}
                        disabled={!isAvailable}
                        className="flex items-center gap-2 px-3 py-2"
                        title={themeOption.description}
                    >
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">{themeOption.label}</span>
                    </Button>
                )
            })}
        </div>
    )
}

/**
 * Compact theme switcher that cycles through available themes
 */
export function CompactThemeSwitcher() {
    const { currentTheme, availableThemes, setTheme, themeConfig } = useTheme()

    const getThemeLabel = () => {
        return themeConfig?.themes?.[currentTheme]?.name || currentTheme
    }

    const cycleTheme = () => {
        const currentIndex = availableThemes.indexOf(currentTheme)
        const nextIndex = (currentIndex + 1) % availableThemes.length
        setTheme(availableThemes[nextIndex])
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="p-2"
            title={`Current theme: ${getThemeLabel()}. Click to switch.`}
        >
            <Palette className="w-5 h-5" />
        </Button>
    )
}
