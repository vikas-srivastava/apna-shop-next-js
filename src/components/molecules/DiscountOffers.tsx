'use client'

import { useState } from 'react'
import { Typography } from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Card } from '../ui/Card'
import { Tag, Percent, Gift, Zap } from 'lucide-react'

interface DiscountOffer {
    id: string
    title: string
    description: string
    discountType: 'percentage' | 'fixed' | 'free_shipping'
    discountValue: number
    code?: string
    minimumPurchase?: number
    expiryDate?: string
    isActive: boolean
    usageCount?: number
    maxUsage?: number
}

interface DiscountOffersProps {
    offers?: DiscountOffer[]
    showApplySection?: boolean
    compact?: boolean
}

const defaultOffers: DiscountOffer[] = [
    {
        id: '1',
        title: 'Welcome Discount',
        description: 'Get 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        code: 'WELCOME10',
        minimumPurchase: 50,
        expiryDate: '2024-12-31',
        isActive: true,
        usageCount: 0,
        maxUsage: 1000
    },
    {
        id: '2',
        title: 'Free Shipping',
        description: 'Free shipping on orders over $99',
        discountType: 'free_shipping',
        discountValue: 0,
        minimumPurchase: 99,
        isActive: true
    },
    {
        id: '3',
        title: 'Flash Sale',
        description: 'Up to 50% off on electronics',
        discountType: 'percentage',
        discountValue: 50,
        code: 'FLASH50',
        expiryDate: '2024-08-31',
        isActive: true,
        usageCount: 45,
        maxUsage: 500
    },
    {
        id: '4',
        title: 'Loyalty Reward',
        description: '$15 off for returning customers',
        discountType: 'fixed',
        discountValue: 15,
        code: 'LOYALTY15',
        minimumPurchase: 75,
        isActive: true
    }
]

/**
 * Discount and offers component
 * Supports custom discount codes and promotional offers
 */
export function DiscountOffers({
    offers = defaultOffers,
    showApplySection = true,
    compact = false
}: DiscountOffersProps) {
    const [appliedCode, setAppliedCode] = useState('')
    const [appliedOffers, setAppliedOffers] = useState<string[]>([])
    const [isApplying, setIsApplying] = useState(false)

    const handleApplyCode = async () => {
        if (!appliedCode.trim()) return

        setIsApplying(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const offer = offers.find(o => o.code?.toLowerCase() === appliedCode.toLowerCase())
        if (offer && !appliedOffers.includes(offer.id)) {
            setAppliedOffers(prev => [...prev, offer.id])
            setAppliedCode('')
        }

        setIsApplying(false)
    }

    const handleRemoveOffer = (offerId: string) => {
        setAppliedOffers(prev => prev.filter(id => id !== offerId))
    }

    const getDiscountIcon = (type: DiscountOffer['discountType']) => {
        switch (type) {
            case 'percentage':
                return <Percent className="w-4 h-4" />
            case 'fixed':
                return <Tag className="w-4 h-4" />
            case 'free_shipping':
                return <Gift className="w-4 h-4" />
            default:
                return <Zap className="w-4 h-4" />
        }
    }

    const formatDiscountValue = (offer: DiscountOffer) => {
        switch (offer.discountType) {
            case 'percentage':
                return `${offer.discountValue}% off`
            case 'fixed':
                return `$${offer.discountValue} off`
            case 'free_shipping':
                return 'Free shipping'
            default:
                return `${offer.discountValue} off`
        }
    }

    if (compact) {
        return (
            <div className="space-y-2">
                {offers.filter(offer => offer.isActive).slice(0, 2).map((offer) => (
                    <div key={offer.id} className="flex items-center gap-2 text-sm">
                        {getDiscountIcon(offer.discountType)}
                        <Typography variant="caption" weight="semibold" className="text-success-600">
                            {formatDiscountValue(offer)}
                        </Typography>
                        {offer.code && (
                            <Typography variant="caption" className="text-secondary-600">
                                Code: {offer.code}
                            </Typography>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Available Offers */}
            <div className="space-y-4">
                <Typography variant="h4" weight="bold">
                    Available Offers
                </Typography>

                <div className="grid gap-4">
                    {offers.filter(offer => offer.isActive).map((offer) => (
                        <Card key={offer.id} className="p-4 border-2 border-dashed border-success-200 bg-success-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        {getDiscountIcon(offer.discountType)}
                                    </div>
                                    <div className="space-y-1">
                                        <Typography variant="subtitle" weight="semibold">
                                            {offer.title}
                                        </Typography>
                                        <Typography variant="body" color="secondary">
                                            {offer.description}
                                        </Typography>
                                        {offer.minimumPurchase && (
                                            <Typography variant="caption" color="secondary">
                                                Minimum purchase: ${offer.minimumPurchase}
                                            </Typography>
                                        )}
                                        {offer.expiryDate && (
                                            <Typography variant="caption" color="secondary">
                                                Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                                            </Typography>
                                        )}
                                        {offer.maxUsage && offer.usageCount !== undefined && (
                                            <Typography variant="caption" color="secondary">
                                                {offer.maxUsage - offer.usageCount} uses remaining
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Typography variant="subtitle" weight="bold" className="text-success-600">
                                        {formatDiscountValue(offer)}
                                    </Typography>
                                    {offer.code && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => navigator.clipboard.writeText(offer.code!)}
                                        >
                                            Copy Code
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Apply Discount Code */}
            {showApplySection && (
                <Card className="p-6">
                    <Typography variant="h4" weight="bold" className="mb-4">
                        Have a Discount Code?
                    </Typography>

                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Enter discount code"
                            value={appliedCode}
                            onChange={(e) => setAppliedCode(e.target.value.toUpperCase())}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleApplyCode}
                            loading={isApplying}
                            disabled={!appliedCode.trim()}
                        >
                            Apply
                        </Button>
                    </div>

                    {/* Applied Offers */}
                    {appliedOffers.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <Typography variant="subtitle" weight="semibold">
                                Applied Offers:
                            </Typography>
                            {appliedOffers.map((offerId) => {
                                const offer = offers.find(o => o.id === offerId)
                                if (!offer) return null

                                return (
                                    <div key={offerId} className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {getDiscountIcon(offer.discountType)}
                                            <Typography variant="body" weight="semibold">
                                                {offer.title}
                                            </Typography>
                                            <Typography variant="caption" className="text-success-600">
                                                {formatDiscountValue(offer)}
                                            </Typography>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveOffer(offerId)}
                                            className="text-error-600 hover:text-error-700"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

/**
 * Compact discount banner for headers/navigation
 */
export function DiscountBanner() {
    return (
        <div className="bg-gradient-to-r from-success-500 to-success-600 text-white py-2">
            <div className="container-theme">
                <div className="flex items-center justify-center gap-2 text-sm">
                    <Tag className="w-4 h-4" />
                    <span className="font-semibold">FLASH SALE:</span>
                    <span>Up to 50% OFF on Electronics • Code: FLASH50</span>
                    <span className="hidden sm:inline">• Free Shipping over $99</span>
                </div>
            </div>
        </div>
    )
}