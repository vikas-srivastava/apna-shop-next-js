'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { ProductGrid } from '@/components/organisms/ProductGrid'
import { SearchFilters } from '@/components/molecules/SearchBar'
import { ProductFilter, Product } from '@/lib/types'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/contexts/ProductContext'

// Utility functions
function getPriceRanges(products: Product[]) {
    if (!products.length) return []
    const prices = products.map(p => p.price || 0).filter(p => p > 0)
    if (!prices.length) return []
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min
    const step = Math.ceil(range / 4)
    const ranges = []
    for (let i = 0; i < 4; i++) {
        const rangeMin = min + i * step
        const rangeMax = i === 3 ? max : min + (i + 1) * step
        ranges.push({ min: rangeMin, max: rangeMax, label: `$${rangeMin} - $${rangeMax}` })
    }
    return ranges
}

function filterProducts(products: Product[], filters: ProductFilter) {
    return products.filter(product => {
        if (filters.category && product.category.name !== filters.category) return false
        if (filters.brand && (product as any).brand !== filters.brand) return false
        if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false
        if (filters.priceRange) {
            const price = product.price || 0
            if (price < filters.priceRange.min || price > filters.priceRange.max) return false
        }
        if (filters.rating && (product.rating || 0) < filters.rating) return false
        if (filters.inStock && !product.inStock) return false
        if (filters.sizes && filters.sizes.length && !filters.sizes.some(size => product.sizes?.includes(size))) return false
        if (filters.colors && filters.colors.length && !filters.colors.some(color => product.colors?.includes(color))) return false
        return true
    })
}

function sortProducts(products: Product[], sortBy: ProductFilter['sortBy']) {
    const sorted = [...products]
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price)
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price)
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        case 'popularity':
            return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        default:
            return sorted
    }
}

/**
 * Products page with filtering and search functionality
 */
export default function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [allProducts, setAllProducts] = useState<Product[]>([])

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

    // Fetch all products initially
    useEffect(() => {
        if (allProducts.length === 0 && !loading.products) {
            actions.fetchProducts(1, 1000) // Fetch with large limit
        }
    }, [allProducts.length, loading.products, actions])

    useEffect(() => {
        if (state.products.length > 0 && allProducts.length === 0) {
            setAllProducts(state.products)
        }
    }, [state.products, allProducts.length])

    // Generate dynamic filter options
    const dynamicCategories = useMemo(() => [...new Set(allProducts.map(p => p.category.name).filter(Boolean))], [allProducts])
    const dynamicBrands = useMemo(() => [...new Set(allProducts.map(p => (p as any).brand).filter(Boolean))], [allProducts])
    const priceRanges = useMemo(() => getPriceRanges(allProducts), [allProducts])

    // Filter and sort products client-side
    const filteredProducts = useMemo(() => {
        const filtered = filterProducts(allProducts, filters)
        return sortProducts(filtered, sortBy)
    }, [allProducts, filters, sortBy])

    const handleFilterChange = (newFilters: ProductFilter) => {
        stableActions.setFilters(newFilters)
        // Update URL
        const params = new URLSearchParams()
        if (newFilters.category) params.set('category', newFilters.category)
        if (newFilters.brand) params.set('brand', newFilters.brand)
        if (newFilters.search) params.set('search', newFilters.search)
        if (newFilters.priceRange) {
            params.set('minPrice', newFilters.priceRange.min.toString())
            params.set('maxPrice', newFilters.priceRange.max.toString())
        }
        if (newFilters.rating) params.set('rating', newFilters.rating.toString())
        if (newFilters.inStock) params.set('inStock', 'true')
        if (newFilters.sizes) params.set('sizes', newFilters.sizes.join(','))
        if (newFilters.colors) params.set('colors', newFilters.colors.join(','))
        router.push(`/products?${params.toString()}`)
    }

    const handleSortChange = (newSortBy: ProductFilter['sortBy']) => {
        stableActions.setSortBy(newSortBy)
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
                            categories={dynamicCategories.map(name => ({ id: name, name }))}
                            brands={dynamicBrands}
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
                                categories={dynamicCategories.map(name => ({ id: name, name }))}
                                brands={dynamicBrands}
                            />
                        </div>
                    )}

                    {/* Products Grid */}
                    <ProductGrid
                        initialProducts={filteredProducts}
                        columns={viewMode === 'grid' ? 3 : 2}
                    />
                </main>
            </div>
        </div>
    )
}