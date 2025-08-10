import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helper?: string
    variant?: 'default' | 'filled' | 'outlined'
    fullWidth?: boolean
}

/**
 * Input component with label, error, and helper text support
 * Uses theme-aware styling with CSS variables
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helper,
    variant = 'default',
    fullWidth = false,
    className,
    id,
    ...props
}, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
        <div className={clsx('flex flex-col gap-1', { 'w-full': fullWidth })}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-secondary-700"
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={clsx(
                    // Base styles
                    'input transition-colors duration-200 focus:outline-none',
                    // Variant styles
                    {
                        'border border-secondary-300 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500': variant === 'default',
                        'border-0 bg-secondary-100 focus:bg-white focus:ring-2 focus:ring-primary-500': variant === 'filled',
                        'border-2 border-secondary-300 bg-transparent focus:border-primary-500': variant === 'outlined',
                    },
                    // Error styles
                    {
                        'border-error-500 focus:border-error-500 focus:ring-error-500': error,
                    },
                    // Full width
                    {
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-sm text-error-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </span>
            )}
            {helper && !error && (
                <span className="text-sm text-secondary-500">
                    {helper}
                </span>
            )}
        </div>
    )
})