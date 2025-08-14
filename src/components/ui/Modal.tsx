'use client'

import { ReactNode, useEffect } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface ModalProps {
    children: ReactNode
    isOpen: boolean
    onClose: () => void
    title?: string
    className?: string
}

/**
 * Modal component for displaying content in an overlay
 * Uses theme-aware styling with CSS variables
 */
export function Modal({
    children,
    isOpen,
    onClose,
    title,
    className,
}: ModalProps) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'auto'
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className={clsx(
                    'bg-white rounded-theme-lg shadow-xl w-full max-w-md',
                    'transform transition-all duration-300 ease-in-out',
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || onClose !== undefined) && (
                    <div className="flex items-center justify-between p-4 border-b border-secondary-200">
                        {title && (
                            <h3 className="text-lg font-semibold text-secondary-900">
                                {title}
                            </h3>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1 text-secondary-500 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface ModalHeaderProps {
    children: ReactNode
    className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
    return (
        <div className={clsx('mb-4', className)}>
            {children}
        </div>
    )
}

interface ModalContentProps {
    children: ReactNode
    className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
    return (
        <div className={clsx('flex-1', className)}>
            {children}
        </div>
    )
}

interface ModalFooterProps {
    children: ReactNode
    className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div className={clsx('mt-4 pt-4 border-t border-secondary-200', className)}>
            {children}
        </div>
    )
}