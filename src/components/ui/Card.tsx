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
    const getVariantStyles = () => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: 'white',
                    border: '1px solid rgb(var(--color-secondary-200))',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    color: 'rgb(var(--text-primary))'
                }
            case 'outlined':
                return {
                    backgroundColor: 'white',
                    border: '2px solid rgb(var(--color-secondary-300))',
                    color: 'rgb(var(--text-primary))'
                }
            case 'elevated':
                return {
                    backgroundColor: 'white',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    color: 'rgb(var(--text-primary))'
                }
            case 'filled':
                return {
                    backgroundColor: 'rgb(var(--color-secondary-50))',
                    border: 'none',
                    color: 'rgb(var(--text-primary))'
                }
            default:
                return {
                    backgroundColor: 'white',
                    border: '1px solid rgb(var(--color-secondary-200))',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    color: 'rgb(var(--text-primary))'
                }
        }
    }

    return (
        <div
            className={clsx(
                // Base styles
                'rounded-lg transition-all duration-200',

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
            style={getVariantStyles()}
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
        <div
            className={clsx('mt-4 pt-4', className)}
            style={{ borderTop: '1px solid rgb(var(--color-secondary-200))' }}
        >
            {children}
        </div>
    )
}