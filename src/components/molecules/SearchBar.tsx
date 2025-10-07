'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface SearchBarProps {
    placeholder?: string
    onSearch: (query: string) => void
    defaultValue?: string
    showClearButton?: boolean
    autoFocus?: boolean
}

/**
 * Search bar component with real-time search and clear functionality
 */
export function SearchBar({
    placeholder = 'Search products...',
    onSearch,
    defaultValue = '',
    showClearButton = true,
    autoFocus = false
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue)
    const [isFocused, setIsFocused] = useState(false)

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query)
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [query, onSearch])

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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    fullWidth
                    className={`pl-10 pr-${showClearButton && query ? '20' : '4'} transition-all duration-200 ${isFocused ? 'ring-2 ring-primary-500' : ''
                        }`}
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

            {/* Search Suggestions or Results could be added here */}
            {isFocused && query && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-theme-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {/* Search suggestions would go here */}
                    <div className="p-3 text-sm text-secondary-600">
                        Press Enter to search for "{query}"
                    </div>
                </div>
            )}
        </form>
    )
}

interface SearchFiltersProps {
    onFilterChange: (filters: any) => void
    categories?: Array<{ id: string; name: string }>
    brands?: string[]
}

/**
 * Search filters component for advanced product filtering
 */
export function SearchFilters({ onFilterChange, categories = [], brands = [] }: SearchFiltersProps) {
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        priceRange: { min: 0, max: 1000 },
        sizes: [] as string[],
        colors: [] as string[],
        rating: 0,
        inStock: false
    })

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="bg-white p-4 rounded-theme-lg border border-secondary-200 space-y-4">
            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category
                </label>
                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input w-full"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Brand Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Brand
                </label>
                <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="input w-full"
                >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>

            {/* Size Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Size
                </label>
                <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => {
                                const newSizes = filters.sizes.includes(size)
                                    ? filters.sizes.filter(s => s !== size)
                                    : [...filters.sizes, size]
                                handleFilterChange('sizes', newSizes)
                            }}
                            className={`px-3 py-1 text-sm border rounded ${filters.sizes.includes(size)
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-white text-secondary-700 border-secondary-300 hover:border-primary-300'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Color
                </label>
                <div className="flex flex-wrap gap-2">
                    {['Red', 'Blue', 'Green', 'Black', 'White', 'Gray'].map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => {
                                const newColors = filters.colors.includes(color)
                                    ? filters.colors.filter(c => c !== color)
                                    : [...filters.colors, color]
                                handleFilterChange('colors', newColors)
                            }}
                            className={`px-3 py-1 text-sm border rounded ${filters.colors.includes(color)
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-white text-secondary-700 border-secondary-300 hover:border-primary-300'
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Price Range
                </label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            min: Number(e.target.value)
                        })}
                        className="w-20"
                    />
                    <span className="self-center text-secondary-500">to</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            max: Number(e.target.value)
                        })}
                        className="w-20"
                    />
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Minimum Rating
                </label>
                <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="input w-full"
                >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={1}>1+ Stars</option>
                </select>
            </div>

            {/* In Stock Filter */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="inStock" className="text-sm text-secondary-700">
                    In stock only
                </label>
            </div>

            {/* Clear Filters */}
            <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => {
                    const resetFilters = {
                        category: '',
                        brand: '',
                        priceRange: { min: 0, max: 1000 },
                        sizes: [],
                        colors: [],
                        rating: 0,
                        inStock: false
                    }
                    setFilters(resetFilters)
                    onFilterChange(resetFilters)
                }}
            >
                Clear Filters
            </Button>
        </div>
    )
}