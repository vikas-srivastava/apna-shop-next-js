'use client'

import { useState, useEffect } from 'react'
import { Typography } from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { ProductCard } from '../molecules/ProductCard'
import { Product, ProductFilter } from '@/lib/types'
import { getProducts } from '@/lib/api'

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
    const [products, setProducts] = useState<Product[]>(initialProducts || [])
    const [loading, setLoading] = useState(!initialProducts)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load initial products
    useEffect(() => {
        if (!initialProducts) {
            loadProducts(1, true)
        }
    }, [filters]) // Reload when filters change

    const loadProducts = async (pageNum: number, reset = false) => {
        try {
            if (reset) {
                setLoading(true)
                setError(null)
            } else {
                setLoadingMore(true)
            }

            console.log('Loading products with filters:', filters, 'page:', pageNum, 'limit:', limit);
            const response = await getProducts(filters, pageNum, limit)
            console.log('Products API response:', response);

            if (response.success && response.data) {
                const newProducts = response.data.data

                if (reset) {
                    setProducts(newProducts)
                } else {
                    setProducts(prev => [...prev, ...newProducts])
                }

                setHasMore(response.data.pagination.page < response.data.pagination.totalPages)
                setPage(pageNum)
            } else {
                console.error('Failed to load products:', response.error);
                setError(response.error || 'Failed to load products')
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError('An error occurred while loading products')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            loadProducts(page + 1, false)
        }
    }

    // Grid column classes based on columns prop
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    if (loading) {
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
                <Button onClick={() => loadProducts(1, true)}>
                    Try Again
                </Button>
            </div>
        )
    }

    if (products.length === 0) {
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
                {products.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {showLoadMore && hasMore && (
                <div className="text-center pt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        loading={loadingMore}
                        onClick={handleLoadMore}
                    >
                        Load More Products
                    </Button>
                </div>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
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
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRelatedProducts() {
            try {
                console.log('Loading related products for category:', categoryId);
                const response = await getProducts(
                    { category: categoryId },
                    1,
                    limit + 1 // Get one extra to filter out current product
                )
                console.log('Related products API response:', response);

                if (response.success && response.data) {
                    // Filter out current product
                    const filtered = response.data.data
                        .filter(p => p.id !== currentProductId)
                        .slice(0, limit)
                    setProducts(filtered)
                }
            } catch (error) {
                console.error('Error loading related products:', error);
            } finally {
                setLoading(false)
            }
        }

        loadRelatedProducts()
    }, [currentProductId, categoryId, limit])

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