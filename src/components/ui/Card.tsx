'use client'

import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    padding?: 'default' | 'none'
}

export function Card({ className, hover, padding = 'default', ...props }: CardProps) {
    return (
        <div
            className={clsx(
                'card',
                {
                    'hover:shadow-lg transition-shadow duration-300': hover,
                    'p-0': padding === 'none',
                },
                className
            )}
            {...props}
        />
    )
}
