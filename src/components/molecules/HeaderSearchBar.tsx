'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface HeaderSearchBarProps {
    placeholder?: string
    onSearch: (query: string) => void
    defaultValue?: string
    showClearButton?: boolean
    autoFocus?: boolean
}

/**
 * Header search bar component without debounced search
 * Used specifically in the header to avoid navigation conflicts
 */
export function HeaderSearchBar({
    placeholder = 'Search products...',
    onSearch,
    defaultValue = '',
    showClearButton = true,
    autoFocus = false
}: HeaderSearchBarProps) {
    const [query, setQuery] = useState(defaultValue)

    const handleClear = () => {
        setQuery('')
        onSearch('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-secondary-400" />
                </div>

                {/* Input Field */}
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    fullWidth
                    className={`pl-10 pr-${showClearButton && query ? '20' : '4'}`}
                />

                {/* Clear Button */}
                {showClearButton && query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    )
}