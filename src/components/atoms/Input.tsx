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
                    className="text-sm font-medium"
                    style={{ color: 'rgb(var(--text-primary))' }}
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={clsx(
                    // Base styles with theme variables
                    'transition-colors duration-200 focus:outline-none rounded-md px-3 py-2 text-base',
                    // Dynamic theme-based styling
                    'border focus:ring-2',
                    {
                        // Default variant
                        'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20': variant === 'default',
                        // Filled variant
                        'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20': variant === 'filled',
                        // Outlined variant
                        'border-2 border-gray-300 bg-transparent focus:border-blue-500': variant === 'outlined',
                    },
                    // Error styles
                    {
                        'border-red-500 focus:border-red-500 focus:ring-red-500/20': error,
                    },
                    // Full width
                    {
                        'w-full': fullWidth,
                    },
                    className
                )}
                style={{
                    color: 'rgb(var(--text-primary))',
                    backgroundColor: variant === 'filled' ? 'rgb(var(--color-secondary-100))' : 'white',
                    borderColor: error ? 'rgb(var(--text-error))' : 'rgb(var(--color-secondary-300))',
                }}
                {...props}
            />
            {error && (
                <span
                    className="text-sm flex items-center gap-1"
                    style={{ color: 'rgb(var(--text-error))' }}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </span>
            )}
            {helper && !error && (
                <span
                    className="text-sm"
                    style={{ color: 'rgb(var(--text-secondary))' }}
                >
                    {helper}
                </span>
            )}
        </div>
    )
})

Input.displayName = 'Input'