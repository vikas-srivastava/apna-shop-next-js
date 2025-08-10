'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Check, Plus, Minus } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Typography } from '../atoms/Typography'
import { Card } from '../ui/Card'
import { RelatedProducts } from '../organisms/ProductGrid'
import { Product } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'

interface ProductDetailTemplateProps {
    product: Product
}

export function ProductDetailTemplate({ product }: ProductDetailTemplateProps) {
    // State variables
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '')
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '')
    const [quantity, setQuantity] = useState<number>(1)
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Handlers
    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta
        if (newQuantity >= 1 && newQuantity <= product.stockCount) {
            setQuantity(newQuantity)
        }
    }

    const handleAddToCart = async () => {
        setIsLoading(true)
        try {
            // Add your cart logic here
            // await addToCart({ product, selectedSize, selectedColor, quantity })
            console.log('Adding to cart:', { product: product.id, selectedSize, selectedColor, quantity })
        } catch (error) {
            console.error('Failed to add to cart:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Benefits data
    const benefits = [
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'Free shipping on orders over $50'
        },
        {
            icon: Shield,
            title: 'Secure Payment',
            description: '100% secure payment processing'
        },
        {
            icon: RotateCcw,
            title: 'Easy Returns',
            description: '30-day return policy'
        }
    ]

    return (
        <div className="container-theme py-8 space-y-12">
            {/* ... existing breadcrumb ... */}

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ... existing image gallery ... */}

                {/* Product Info */}
                <div className="space-y-6">
                    {/* ... existing header, rating, price, and description ... */}

                    {/* Options */}
                    <div className="space-y-6">
                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-3">
                                <Typography variant="subtitle" weight="bold">
                                    Size
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? 'primary' : 'outline'}
                                            onClick={() => setSelectedSize(size)}
                                            className="min-w-12"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="space-y-3">
                                <Typography variant="subtitle" weight="bold">
                                    Color
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color
                                                ? 'border-primary-500 ring-2 ring-primary-200'
                                                : 'border-secondary-200 hover:border-secondary-300'
                                                }`}
                                            aria-label={`Select color ${color}`}
                                        >
                                            <span
                                                className="w-7 h-7 rounded-full block"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 py-2">
                            <Typography variant="subtitle" weight="bold">
                                Quantity
                            </Typography>
                            <div className="flex items-center border border-secondary-200 rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="rounded-r-none"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stockCount}
                                    className="rounded-l-none"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <Typography variant="body" color="secondary">
                                {product.stockCount} available
                            </Typography>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isLoading}
                                className="flex-1 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Adding...</span>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <Button
                                variant={isWishlisted ? 'primary' : 'secondary'}
                                size="icon-lg"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                                />
                            </Button>
                            <Button variant="secondary" size="icon-lg" aria-label="Share product">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Benefits */}
                    <Card className="p-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="p-2 bg-primary-50 rounded-full">
                                        <benefit.icon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <Typography variant="subtitle" weight="bold">
                                            {benefit.title}
                                        </Typography>
                                        <Typography variant="body-sm" color="secondary">
                                            {benefit.description}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Related Products */}
            <section className="space-y-6">
                <Typography variant="h3" weight="bold">
                    You May Also Like
                </Typography>
                <RelatedProducts category={product.category.slug} excludeId={product.id} />
            </section>
        </div>
    )
}