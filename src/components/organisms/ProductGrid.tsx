'use client'

import { useState, useEffect } from 'react'
import { Typography } from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { ProductCard } from '../molecules/ProductCard'
import { Product, ProductFilter } from '@/lib/types'
import { useProducts } from '@/contexts/ProductContext'

interface ProductGridProps {
    title?: string
    filters?: ProductFilter
    limit?: number
    showLoadMore?: boolean
    columns?: 2 | 3 | 4
    initialProducts?: Product[]
}

/**
 * Product grid component with filtering and pagination
 * Displays products in a responsive grid layout
 */
export function ProductGrid({
    title,
    filters = {},
    limit = 12,
    showLoadMore = true,
    columns = 4,
    initialProducts
}: ProductGridProps) {
    const { state, actions } = useProducts()
    const { products, loading, errors, hasNextPage } = state

    // Load initial products if no initialProducts provided
    useEffect(() => {
        if (!initialProducts && products.length === 0) {
            actions.fetchProducts(1, limit)
        }
    }, [initialProducts, products.length, limit, actions])

    const handleLoadMore = () => {
        if (!loading.products && hasNextPage) {
            const nextPage = Math.floor(products.length / limit) + 1
            actions.fetchProducts(nextPage, limit)
        }
    }

    const displayProducts = initialProducts || products
    const isLoading = loading.products && displayProducts.length === 0
    const error = errors.products

    // Grid column classes based on columns prop
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {title && (
                    <Typography variant="h3" weight="bold">
                        {title}
                    </Typography>
                )}

                {/* Loading Skeleton */}
                <div className={`grid ${gridCols[columns]} gap-6`}>
                    {[...Array(limit)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-secondary-200 aspect-square rounded-theme-lg mb-4"></div>
                            <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                            <div className="h-4 bg-secondary-200 rounded w-2/3 mb-2"></div>
                            <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <Typography variant="h4" color="error" className="mb-4">
                    {error}
                </Typography>
                <Button onClick={() => actions.fetchProducts(1, limit)}>
                    Try Again
                </Button>
            </div>
        )
    }

    if (displayProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <Typography variant="h4" color="secondary" className="mb-4">
                    No products found
                </Typography>
                <Typography variant="body" color="secondary">
                    Try adjusting your search criteria or browse our categories.
                </Typography>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {title && (
                <div className="flex items-center justify-between">
                    <Typography variant="h3" weight="bold">
                        {title}
                    </Typography>
                    <Typography variant="body" color="secondary">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </Typography>
                </div>
            )}

            {/* Products Grid */}
            <div className={`grid ${gridCols[columns]} gap-6`}>
                {displayProducts.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {showLoadMore && hasNextPage && (
                <div className="text-center pt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        loading={loading.products}
                        onClick={handleLoadMore}
                    >
                        Load More Products
                    </Button>
                </div>
            )}

            {/* End of Results */}
            {!hasNextPage && displayProducts.length > 0 && (
                <div className="text-center pt-8">
                    <Typography variant="body" color="secondary">
                        You've seen all products
                    </Typography>
                </div>
            )}
        </div>
    )
}

interface FeaturedProductsProps {
    limit?: number
}

/**
 * Featured products component - shows highest rated products
 */
export function FeaturedProducts({ limit = 6 }: FeaturedProductsProps) {
    return (
        <ProductGrid
            title="Featured Products"
            filters={{ sortBy: 'rating' }}
            limit={limit}
            showLoadMore={false}
            columns={3}
        />
    )
}

interface RelatedProductsProps {
    currentProductId: string
    categoryId: string
    limit?: number
}

/**
 * Related products component - shows products from same category
 */
export function RelatedProducts({
    currentProductId,
    categoryId,
    limit = 4
}: RelatedProductsProps) {
    const { state, actions } = useProducts()
    const { relatedProducts, loading } = state

    useEffect(() => {
        actions.fetchRelatedProducts(currentProductId, limit)
    }, [currentProductId, categoryId, limit, actions])

    const products = relatedProducts.filter((p: Product) => p.id !== currentProductId).slice(0, limit)

    if (loading) {
        return (
            <div className="space-y-6">
                <Typography variant="h4" weight="bold">
                    Related Products
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-secondary-200 aspect-square rounded-theme-lg mb-4"></div>
                            <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                            <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <ProductGrid
            title="Related Products"
            initialProducts={products}
            showLoadMore={false}
            columns={4}
        />
    )
}