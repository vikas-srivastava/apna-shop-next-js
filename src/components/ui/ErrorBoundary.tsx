'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '../atoms/Button'
import { Typography } from '../atoms/Typography'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error?: Error
    errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        this.setState({
            error,
            errorInfo
        })

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: sendErrorToService(error, errorInfo)
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-error-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>

                            <Typography variant="h3" className="mb-2">
                                Something went wrong
                            </Typography>

                            <Typography variant="body" color="secondary" className="mb-6">
                                We encountered an unexpected error. Please try again or reload the page.
                            </Typography>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-secondary-50 p-4 rounded-lg mb-6 text-left">
                                    <Typography variant="caption" weight="semibold" className="mb-2">
                                        Error Details (Development):
                                    </Typography>
                                    <pre className="text-xs text-secondary-600 whitespace-pre-wrap">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <Button onClick={this.handleRetry} variant="outline">
                                    Try Again
                                </Button>
                                <Button onClick={this.handleReload}>
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Hook for functional components
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    )

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

    return WrappedComponent
}