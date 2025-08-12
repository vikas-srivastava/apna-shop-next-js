import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
    children: ReactNode
    variant?: 'default' | 'outlined' | 'elevated' | 'filled'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    hover?: boolean
}

/**
 * Card component for content containers
 * Uses theme-aware styling with CSS variables
 */
export function Card({
    children,
    variant = 'default',
    padding = 'md',
    className,
    hover = false,
}: CardProps) {
    return (
        <div
            className={clsx(
                // Base styles
                'card rounded-theme-lg transition-all duration-200 text-[var(--text-primary)]',

                // Variant styles
                {
                    'bg-white border border-secondary-200 shadow-sm': variant === 'default',
                    'bg-white border-2 border-secondary-300': variant === 'outlined',
                    'bg-white shadow-lg border-0': variant === 'elevated',
                    'bg-secondary-50 border-0': variant === 'filled',
                },

                // Padding styles
                {
                    'p-0': padding === 'none',
                    'p-3': padding === 'sm',
                    'p-4': padding === 'md',
                    'p-6': padding === 'lg',
                    'p-8': padding === 'xl',
                },

                // Hover effects
                {
                    'hover:shadow-md hover:scale-[1.02] cursor-pointer': hover,
                },

                className
            )}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps {
    children: ReactNode
    className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={clsx('mb-4', className)}>
            {children}
        </div>
    )
}

interface CardContentProps {
    children: ReactNode
    className?: string
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={clsx('flex-1', className)}>
            {children}
        </div>
    )
}

interface CardFooterProps {
    children: ReactNode
    className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={clsx('mt-4 pt-4 border-t border-secondary-200', className)}>
            {children}
        </div>
    )
}