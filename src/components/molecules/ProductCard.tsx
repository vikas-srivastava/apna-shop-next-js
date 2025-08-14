'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../atoms/Button'
import { Typography } from '../atoms/Typography'
import { Product } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
    showQuickAdd?: boolean
    showWishlist?: boolean
}

/**
 * Product card component for displaying product information
 * Includes quick add to cart and wishlist functionality
 */
export function ProductCard({
    product,
    showQuickAdd = true,
    showWishlist = true
}: ProductCardProps) {
    const { addItem } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation
        setIsLoading(true)

        try {
            const result = await addItem(product)
            if (!result.success) {
                console.error('Failed to add item to cart:', result.error)
            }
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
        } finally {
            setIsLoading(false)
        }
    }

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsWishlisted(!isWishlisted)
    }

    const discountPercentage = (product.originalPrice && typeof product.originalPrice === 'number' && product.originalPrice > 0)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    return (
        <Card
            className="group relative overflow-hidden"
            hover
            padding="none"
        >
            <Link href={`/products/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-secondary-50">
                    <Image
                        src={(product.images && product.images[0]) || '/globe.svg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-error-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Out of Stock Badge */}
                    {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-secondary-900 text-white px-2 py-1 rounded text-xs font-semibold">
                            Out of Stock
                        </div>
                    )}

                    {/* Wishlist Button */}
                    {showWishlist && (
                        <button
                            onClick={handleWishlistToggle}
                            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${isWishlisted
                                ? 'bg-error-500 text-white'
                                : 'bg-white text-secondary-600 hover:bg-error-500 hover:text-white'
                                } ${!product.inStock ? 'top-12' : ''}`}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    )}

                    {/* Quick Add Button - Always visible with improved positioning */}
                    {showQuickAdd && product.inStock && (
                        <div className="absolute bottom-2 left-2 right-2 transition-all duration-300">
                            <Button
                                size="sm"
                                fullWidth
                                loading={isLoading}
                                onClick={handleQuickAdd}
                                className="bg-white text-secondary-900 hover:bg-primary-500 hover:text-white shadow-lg transform transition-transform duration-200 active:scale-95"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Quick Add
                            </Button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Category */}
                    <Typography
                        variant="caption"
                        color="secondary"
                        className="mb-1 uppercase tracking-wide"
                    >
                        {(product.category && product.category.name) || 'Uncategorized'}
                    </Typography>

                    {/* Product Name */}
                    <Typography
                        variant="subtitle"
                        className="mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
                    >
                        {product.name}
                    </Typography>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                        ? 'text-warning-400 fill-current'
                                        : 'text-secondary-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <Typography variant="caption" color="secondary">
                            ({product.reviewCount})
                        </Typography>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <Typography variant="subtitle" weight="semibold" color="primary">
                            ${(typeof product.price === 'number' ? product.price : 0).toFixed(2)}
                        </Typography>
                        {product.originalPrice && (
                            <Typography
                                variant="caption"
                                color="secondary"
                                className="line-through"
                            >
                                ${(typeof product.originalPrice === 'number' ? product.originalPrice : 0).toFixed(2)}
                            </Typography>
                        )}
                    </div>

                    {/* Colors Preview */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                            <Typography variant="caption" color="secondary" className="mr-1">
                                Colors:
                            </Typography>
                            {product.colors.slice(0, 3).map((color, index) => (
                                <div
                                    key={color}
                                    className="w-4 h-4 rounded-full border border-secondary-300"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                />
                            ))}
                            {product.colors.length > 3 && (
                                <Typography variant="caption" color="secondary">
                                    +{product.colors.length - 3}
                                </Typography>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </Card>
    )
}