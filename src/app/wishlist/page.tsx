'use client'

import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, X, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

/**
 * Wishlist page
 */
export default function WishlistPage() {
    const { items: wishlistItems, removeItem } = useWishlist()
    const { addItem } = useCart()

    const removeFromWishlist = async (id: string) => {
        await removeItem(id)
    }

    const moveToCart = async (item: any) => {
        await addItem(item.product, 1)
        await removeFromWishlist(item.id)
    }

    if (wishlistItems.length === 0) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                        <Typography variant="h2" weight="bold" className="mb-4">
                            Your Wishlist is Empty
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-8">
                            Save items that you like to your wishlist for later.
                        </Typography>
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/products">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    My Wishlist
                </Typography>

                <Card className="p-6">
                    <div className="space-y-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-secondary-200 last:border-0 last:pb-0">
                                {/* Product Image */}
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary-100">
                                    <Image
                                        src={item.product.images[0] || '/globe.svg'}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <Link href={`/products/${item.product.slug}`} className="hover:underline">
                                        <Typography variant="subtitle" weight="semibold">
                                            {item.product.name}
                                        </Typography>
                                    </Link>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(item.product.rating)
                                                        ? 'text-warning-400 fill-current'
                                                        : 'text-secondary-300'
                                                        }`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <Typography variant="caption" color="secondary">
                                            {item.product.rating} ({item.product.reviewCount})
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Typography variant="body" weight="semibold" color="primary">
                                            ${item.product.price.toFixed(2)}
                                        </Typography>
                                        {item.product.originalPrice && (
                                            <Typography variant="caption" color="secondary" className="line-through">
                                                ${item.product.originalPrice.toFixed(2)}
                                            </Typography>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => moveToCart(item)}
                                        className="flex items-center gap-1"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </ProtectedRoute>
    )
}