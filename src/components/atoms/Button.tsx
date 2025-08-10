import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    loading?: boolean
    fullWidth?: boolean
    children: ReactNode
}

/**
 * Button component with multiple variants and sizes
 * Uses theme-aware styling with CSS variables
 */
export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className,
    disabled,
    children,
    ...props
}: ButtonProps) {
    // Extract asChild from props to prevent it from reaching the DOM
    const { asChild, ...buttonProps } = props

    return (
        <button
            className={clsx(
                // Base styles
                'btn inline-flex items-center justify-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

                // Variant styles
                {
                    'btn-primary bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500': variant === 'primary',
                    'btn-secondary bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus-visible:ring-secondary-500': variant === 'secondary',
                    'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus-visible:ring-primary-500': variant === 'outline',
                    'text-secondary-700 hover:bg-secondary-100 focus-visible:ring-secondary-500': variant === 'ghost',
                    'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500': variant === 'danger',
                },

                // Size styles
                {
                    'px-3 py-2 text-sm': size === 'sm',
                    'px-4 py-2.5 text-base': size === 'md',
                    'px-6 py-3 text-lg': size === 'lg',
                    'px-8 py-4 text-xl': size === 'xl',
                },

                // Full width
                {
                    'w-full': fullWidth,
                },

                className
            )}
            disabled={disabled || loading}
            {...buttonProps}  // Spread remaining props without asChild
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    )
}