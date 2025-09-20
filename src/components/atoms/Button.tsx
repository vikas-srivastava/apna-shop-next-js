import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    loading?: boolean
    fullWidth?: boolean
    asChild?: boolean
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

    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'btn-primary'
            case 'secondary':
                return 'btn-secondary'
            case 'outline':
                return 'btn-outline'
            case 'ghost':
                return 'btn-ghost'
            case 'danger':
                return 'btn-danger'
            default:
                return 'btn-primary'
        }
    }

    const buttonElement = (
        <button
            className={clsx(
                // Base styles
                'inline-flex items-center justify-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md',

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

                // Variant styles
                getVariantClasses(),

                className
            )}
            disabled={loading || disabled}
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

    // If asChild is true, we need to handle the case where this button is used as a child of another component
    // This is typically used with Radix UI or similar libraries
    if (asChild) {
        // For now, just return the button element as is
        // In a full implementation, you'd use a library like @radix-ui/react-slot
        return buttonElement
    }

    return buttonElement
}