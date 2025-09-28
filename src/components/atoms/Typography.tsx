'use client'

import { ReactNode, ElementType } from 'react'
import { clsx } from 'clsx'
import { useTheme } from '@/contexts/ThemeContext'

interface TypographyProps {
    as?: ElementType
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'subtitle' | 'caption' | 'overline'
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'inherit'
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
    style?: React.CSSProperties
    children: ReactNode
}

/**
 * Typography component for consistent text styling
 * Supports semantic HTML elements and various text styles
 * Uses theme-aware styling with CSS variables
 */
export function Typography({
    as,
    variant = 'body',
    weight = 'normal',
    color = 'inherit',
    align = 'left',
    className,
    style,
    children,
    ...props
}: TypographyProps) {
    const { currentTheme } = useTheme()

    // Auto-determine HTML element if not specified
    const Component = as || getDefaultElement(variant)

    return (
        <Component
            className={clsx(
                // Base styles
                'font-sans transition-colors duration-200',

                // Variant styles
                {
                    'text-4xl lg:text-5xl font-bold leading-tight': variant === 'h1',
                    'text-3xl lg:text-4xl font-bold leading-tight': variant === 'h2',
                    'text-2xl lg:text-3xl font-semibold leading-snug': variant === 'h3',
                    'text-xl lg:text-2xl font-semibold leading-snug': variant === 'h4',
                    'text-lg lg:text-xl font-medium leading-normal': variant === 'h5',
                    'text-base lg:text-lg font-medium leading-normal': variant === 'h6',
                    'text-base leading-relaxed': variant === 'body',
                    'text-lg font-medium leading-normal': variant === 'subtitle',
                    'text-sm leading-normal': variant === 'caption',
                    'text-xs uppercase tracking-wider font-medium': variant === 'overline',
                },

                // Weight styles
                {
                    'font-light': weight === 'light',
                    'font-normal': weight === 'normal',
                    'font-medium': weight === 'medium',
                    'font-semibold': weight === 'semibold',
                    'font-bold': weight === 'bold',
                },

                // Color styles with theme awareness
                {
                    'text-[var(--text-primary)]': color === 'primary' || color === 'inherit',
                    'text-[var(--text-secondary)]': color === 'secondary',
                    'text-[var(--text-accent)]': color === 'accent',
                    'text-[var(--text-success)]': color === 'success',
                    'text-[var(--text-error)]': color === 'error',
                    'text-[var(--text-warning)]': color === 'warning',
                },

                // Alignment styles
                {
                    'text-left': align === 'left',
                    'text-center': align === 'center',
                    'text-right': align === 'right',
                    'text-justify': align === 'justify',
                },

                className
            )}
            style={style}
            {...props}
        >
            {children}
        </Component>
    )
}

/**
 * Get default HTML element for each variant
 */
function getDefaultElement(variant: string): ElementType {
    switch (variant) {
        case 'h1':
            return 'h1'
        case 'h2':
            return 'h2'
        case 'h3':
            return 'h3'
        case 'h4':
            return 'h4'
        case 'h5':
            return 'h5'
        case 'h6':
            return 'h6'
        case 'subtitle':
            return 'p'
        case 'caption':
            return 'span'
        case 'overline':
            return 'span'
        default:
            return 'p'
    }
}
