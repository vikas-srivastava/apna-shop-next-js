'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { ProductGrid } from '@/components/organisms/ProductGrid'
import { SearchFilters } from '@/components/molecules/SearchBar'
import { ProductFilter } from '@/lib/types'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/contexts/ProductContext'

/**
 * Products page with filtering and search functionality
 */
export default function ProductsPage() {
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const { state, actions, stableActions } = useProducts()
    const { filters, sortBy, categories, brands, loading, errors } = state

    // Initialize filters from URL params
    useEffect(() => {
        if (!searchParams) return

        const initialFilters: ProductFilter = {}

        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const search = searchParams.get('search')
        const minPrice = searchParams.get('minPrice') || searchParams.get('min_price')
        const maxPrice = searchParams.get('maxPrice') || searchParams.get('max_price')
        const rating = searchParams.get('rating')
        const inStock = searchParams.get('inStock')
        const sizes = searchParams.get('sizes')
        const colors = searchParams.get('colors')

        if (category) initialFilters.category = category
        if (brand) initialFilters.brand = brand
        if (search) initialFilters.search = search
        if (rating) initialFilters.rating = parseFloat(rating)
        if (inStock) initialFilters.inStock = inStock === 'true'

        if (sizes) {
            initialFilters.sizes = sizes.split(',').map(s => s.trim())
        }

        if (colors) {
            initialFilters.colors = colors.split(',').map(c => c.trim())
        }

        if (minPrice || maxPrice) {
            initialFilters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : 1000
            }
        }

        stableActions.setFilters(initialFilters)
    }, [searchParams, stableActions])

    const handleFilterChange = (newFilters: any) => {
        stableActions.setFilters(newFilters)
        // Trigger fetch with new filters synchronously
        actions.fetchProducts(1, 12)
    }

    const handleSortChange = (newSortBy: ProductFilter['sortBy']) => {
        stableActions.setSortBy(newSortBy)
        // Trigger fetch with new sort synchronously
        actions.fetchProducts(1, 12)
    }

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'popularity', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
    ] as const

    return (
        <div className="container-theme py-8">
            {/* Page Header */}
            <div className="mb-8">
                <Typography variant="h2" weight="bold" className="mb-4">
                    {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
                </Typography>
                {filters.category && (
                    <Typography variant="body" color="secondary">
                        Showing products in {filters.category}
                    </Typography>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <SlidersHorizontal className="w-5 h-5" />
                            <Typography variant="subtitle" weight="semibold">
                                Filters
                            </Typography>
                        </div>
                        <SearchFilters
                            onFilterChange={handleFilterChange}
                            categories={categories}
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3 space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-theme-lg border border-secondary-200">
                        {/* Mobile Filter Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <Typography variant="caption" color="secondary">
                                    Sort by:
                                </Typography>
                                <select
                                    value={sortBy || 'newest'}
                                    onChange={(e) => handleSortChange(e.target.value as ProductFilter['sortBy'])}
                                    className="input py-2 px-3 text-sm min-w-0"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-secondary-100 rounded-theme-md p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="!p-2"
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="!p-2"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="lg:hidden">
                            <SearchFilters
                                onFilterChange={handleFilterChange}
                                categories={categories}
                            />
                        </div>
                    )}

                    {/* Products Grid */}
                    <ProductGrid
                        filters={filters}
                        columns={viewMode === 'grid' ? 3 : 2}
                    />
                </main>
            </div>
        </div>
    )
}