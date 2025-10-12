'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { loadThemeConfig } from '@/lib/theme-loader';
import type { ThemeConfig } from '@/lib/server-theme-loader';

type ThemeMode = 'light';

interface ThemeContextType {
    theme: ThemeMode;
    currentTheme: string;
    themeConfig: ThemeConfig | null;
    availableThemes: string[];
    setTheme: (themeName: string) => void;
    exportTheme: () => string;
    importTheme: (themeData: string) => Promise<void>;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ✅ ThemeProvider
 * Manages theme config, applies CSS variables, and provides context globally.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<ThemeMode>('light'); // Static light mode
    const [currentTheme, setCurrentTheme] = useState<string>(process.env.NEXT_PUBLIC_THEME_SOURCE || 'classic-light');
    const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
    const [availableThemes, setAvailableThemes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);



    // Initialize from localStorage only on client
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('currentTheme');
        if (saved) setCurrentTheme(saved);
    }, []);

    // Load YAML theme configuration
    useEffect(() => {
        let isMounted = true;
        const loadTheme = async () => {
            try {
                setIsLoading(true);
                const config = await loadThemeConfig();
                if (!isMounted) return;

                setThemeConfig(config);
                const themeKeys = Object.keys(config.themes || {});
                setAvailableThemes(themeKeys);

                // Fallback: ensure currentTheme is valid
                if (!themeKeys.includes(currentTheme)) {
                    setCurrentTheme(themeKeys[0] || 'classic-light');
                }
            } catch (err) {
                console.error('❌ Failed to load theme config:', err);
                if (isMounted) {
                    setThemeConfig(null);
                    setAvailableThemes([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    document.documentElement.classList.add('theme-loaded');
                }
            }
        };

        loadTheme();
        return () => {
            isMounted = false;
        };
    }, []);

    // Apply CSS variables when theme or config changes
    useEffect(() => {
        if (!themeConfig || !themeConfig.themes || !themeConfig.themes[currentTheme])
            return;

        const root = document.documentElement;
        const themeData = themeConfig.themes[currentTheme];
        console.log(`🎨 Applying theme: ${currentTheme}`, themeData.colors);

        // Reset previous vars
        const prevVars = Array.from(root.style).filter((v) =>
            v.startsWith('--color-')
        );
        prevVars.forEach((v) => root.style.removeProperty(v));

        // Always apply light mode
        root.classList.remove('light', 'dark');
        root.classList.add('light');

        // Apply color variables
        Object.entries(themeData.colors || {}).forEach(([colorName, shades]) => {
            if (typeof shades === 'object' && shades !== null) {
                Object.entries(shades).forEach(([shade, value]) => {
                    root.style.setProperty(`--color-${colorName}-${shade}`, String(value));
                });
            }
        });

        // Apply text color shortcuts
        if (themeData.colors?.text) {
            Object.entries(themeData.colors.text).forEach(([key, val]) => {
                root.style.setProperty(`--text-${key}`, String(val));
            });
        }
        // Apply theme accent variables for neutral backgrounds
        root.style.setProperty('--background-accent', 'var(--theme-accent-bg, #fff7f0)');
        root.style.setProperty('--foreground-accent', 'var(--theme-accent-text, #1a1a1a)');
        root.style.setProperty('--theme-primary', 'var(--color-primary-500)');
        root.style.setProperty('--theme-surface-bg', 'var(--color-secondary-50)');

        // Typography
        if (themeData.typography) {
            Object.entries(themeData.typography.fontFamily || {}).forEach(
                ([key, val]) => root.style.setProperty(`--font-${key}`, String(val))
            );
            Object.entries(themeData.typography.fontSize || {}).forEach(
                ([key, val]) => root.style.setProperty(`--text-${key}`, String(val))
            );
            Object.entries(themeData.typography.fontWeight || {}).forEach(
                ([key, val]) => root.style.setProperty(`--font-weight-${key}`, String(val))
            );
        }

        // Persist choice
        localStorage.setItem('currentTheme', currentTheme);
    }, [currentTheme, themeConfig]);

    // Change theme
    const setTheme = (themeName: string) => {
        if (availableThemes.includes(themeName)) {
            setCurrentTheme(themeName);
            localStorage.setItem('currentTheme', themeName);
        } else {
            console.warn(`⚠️ Tried to set invalid theme: ${themeName}`);
        }
    };

    // Export YAML theme as JSON
    const exportTheme = (): string => {
        return themeConfig ? JSON.stringify(themeConfig, null, 2) : '';
    };

    // Import theme JSON
    const importTheme = async (themeData: string): Promise<void> => {
        try {
            const parsed = JSON.parse(themeData);
            if (parsed.themes && typeof parsed.themes === 'object') {
                setThemeConfig(parsed);
                const keys = Object.keys(parsed.themes);
                setAvailableThemes(keys);
                setCurrentTheme(keys[0] || 'classic-light');
            } else {
                throw new Error('Invalid theme data structure');
            }
        } catch (err) {
            console.error('❌ Failed to import theme:', err);
            throw new Error('Invalid theme data');
        }
    };

    const value: ThemeContextType = {
        theme,
        currentTheme,
        themeConfig,
        availableThemes,
        setTheme,
        exportTheme,
        importTheme,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {!isLoading && children}
        </ThemeContext.Provider>
    );
}

/**
 * ✅ Safe useTheme Hook
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        console.warn('⚠️ useTheme() called outside <ThemeProvider>.');
        // Optional fallback instead of throwing
        return {
            theme: 'light',
            currentTheme: 'classic-light',
            themeConfig: null,
            availableThemes: [],
            setTheme: () => { },
            exportTheme: () => '',
            importTheme: async () => { },
            isLoading: true,
        };
    }
    return context;
}
