'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Typography } from '@/components/atoms/Typography'
import { useCheckout } from '@/contexts/CheckoutContext'
import { Address } from '@/lib/types'
import axios from 'axios'

interface ShippingFormData {
    firstName: string
    lastName: string
    address1: string
    address2: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
}

export function ShippingStep() {
    const { data, updateData, nextStep } = useCheckout()
    const [formData, setFormData] = useState<ShippingFormData>({
        firstName: data.shippingAddress?.firstName || '',
        lastName: data.shippingAddress?.lastName || '',
        address1: data.shippingAddress?.address1 || '',
        address2: data.shippingAddress?.address2 || '',
        city: data.shippingAddress?.city || '',
        state: data.shippingAddress?.state || '',
        zipCode: data.shippingAddress?.zipCode || '',
        country: data.shippingAddress?.country || 'United States',
        phone: data.shippingAddress?.phone || ''
    })

    const [useDifferentBilling, setUseDifferentBilling] = useState(false)
    const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
        firstName: data.billingAddress?.firstName || '',
        lastName: data.billingAddress?.lastName || '',
        address1: data.billingAddress?.address1 || '',
        address2: data.billingAddress?.address2 || '',
        city: data.billingAddress?.city || '',
        state: data.billingAddress?.state || '',
        zipCode: data.billingAddress?.zipCode || '',
        country: data.billingAddress?.country || 'United States',
        phone: data.billingAddress?.phone || ''
    })

    // Address selection state
    const [existingAddresses, setExistingAddresses] = useState<Address[]>([])
    const [addressMode, setAddressMode] = useState<'select' | 'add'>('select')
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [loadingAddresses, setLoadingAddresses] = useState(true)

    // Fetch existing addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('/api/addresses')
                if (response.data.success) {
                    setExistingAddresses(response.data.data)
                }
            } catch (error) {
                console.error('Failed to fetch addresses:', error)
            } finally {
                setLoadingAddresses(false)
            }
        }

        fetchAddresses()
    }, [])

    const handleInputChange = (field: keyof ShippingFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleBillingInputChange = (field: keyof ShippingFormData, value: string) => {
        setBillingFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddressSelect = (address: Address) => {
        setSelectedAddressId(address.id)
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            address1: address.address1,
            address2: address.address2 || '',
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phone: address.phone || ''
        })
    }

    const handleModeChange = (mode: 'select' | 'add') => {
        setAddressMode(mode)
        if (mode === 'add') {
            setSelectedAddressId(null)
            setFormData({
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'United States',
                phone: ''
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const shippingAddress: Address = {
            id: 'shipping-' + Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address1,
            address2: formData.address2 || undefined,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone || undefined,
            isDefault: false
        }

        const billingAddress: Address = useDifferentBilling
            ? {
                id: 'billing-' + Date.now(),
                firstName: billingFormData.firstName,
                lastName: billingFormData.lastName,
                address1: billingFormData.address1,
                address2: billingFormData.address2 || undefined,
                city: billingFormData.city,
                state: billingFormData.state,
                zipCode: billingFormData.zipCode,
                country: billingFormData.country,
                phone: billingFormData.phone || undefined,
                isDefault: false
            }
            : shippingAddress

        updateData({
            shippingAddress,
            billingAddress
        })

        nextStep()
    }

    const isFormValid = formData.firstName && formData.lastName && formData.address1 &&
        formData.city && formData.state && formData.zipCode && formData.country

    return (
        <Card className="p-6">
            <Typography variant="h3" weight="bold" className="mb-6">
                Shipping Information
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Contact Information
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                        />
                    </div>
                    <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                    />
                </div>

                {/* Address Selection */}
                <div className="space-y-4">
                    <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                        Shipping Address
                    </Typography>

                    {loadingAddresses ? (
                        <div className="text-center py-4">
                            <Typography variant="body" color="secondary">
                                Loading addresses...
                            </Typography>
                        </div>
                    ) : existingAddresses.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={addressMode === 'select' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleModeChange('select')}
                                >
                                    Select Existing Address
                                </Button>
                                <Button
                                    type="button"
                                    variant={addressMode === 'add' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleModeChange('add')}
                                >
                                    Add New Address
                                </Button>
                            </div>

                            {addressMode === 'select' && (
                                <div className="space-y-2">
                                    {existingAddresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-secondary-200 hover:border-primary-300'
                                                }`}
                                            onClick={() => handleAddressSelect(address)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Typography variant="body" weight="semibold">
                                                        {address.firstName} {address.lastName}
                                                    </Typography>
                                                    <Typography variant="body" color="secondary" className="mt-1">
                                                        {address.address1}
                                                        {address.address2 && `, ${address.address2}`}
                                                    </Typography>
                                                    <Typography variant="body" color="secondary">
                                                        {address.city}, {address.state} {address.zipCode}
                                                    </Typography>
                                                    <Typography variant="body" color="secondary">
                                                        {address.country}
                                                    </Typography>
                                                    {address.phone && (
                                                        <Typography variant="body" color="secondary">
                                                            Phone: {address.phone}
                                                        </Typography>
                                                    )}
                                                </div>
                                                {address.isDefault && (
                                                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Shipping Address Form */}
                {(addressMode === 'add' || existingAddresses.length === 0) && (
                    <div className="space-y-4">
                        {!existingAddresses.length && (
                            <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                                Shipping Address
                            </Typography>
                        )}
                        <Input
                            label="Street Address"
                            value={formData.address1}
                            onChange={(e) => handleInputChange('address1', e.target.value)}
                            required
                        />
                        <Input
                            label="Apartment, suite, etc. (optional)"
                            value={formData.address2}
                            onChange={(e) => handleInputChange('address2', e.target.value)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="City"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                required
                            />
                            <Input
                                label="State"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                required
                            />
                            <Input
                                label="ZIP Code"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            label="Country"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Billing Address Toggle */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="different-billing"
                        checked={useDifferentBilling}
                        onChange={(e) => setUseDifferentBilling(e.target.checked)}
                        className="rounded border-secondary-300"
                    />
                    <label htmlFor="different-billing" className="text-sm text-secondary-600">
                        Use different billing address
                    </label>
                </div>

                {/* Billing Address */}
                {useDifferentBilling && (
                    <div className="space-y-4">
                        <Typography variant="subtitle" weight="semibold" className="text-secondary-600">
                            Billing Address
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={billingFormData.firstName}
                                onChange={(e) => handleBillingInputChange('firstName', e.target.value)}
                                required
                            />
                            <Input
                                label="Last Name"
                                value={billingFormData.lastName}
                                onChange={(e) => handleBillingInputChange('lastName', e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            label="Phone"
                            type="tel"
                            value={billingFormData.phone}
                            onChange={(e) => handleBillingInputChange('phone', e.target.value)}
                            required
                        />
                        <Input
                            label="Street Address"
                            value={billingFormData.address1}
                            onChange={(e) => handleBillingInputChange('address1', e.target.value)}
                            required
                        />
                        <Input
                            label="Apartment, suite, etc. (optional)"
                            value={billingFormData.address2}
                            onChange={(e) => handleBillingInputChange('address2', e.target.value)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="City"
                                value={billingFormData.city}
                                onChange={(e) => handleBillingInputChange('city', e.target.value)}
                                required
                            />
                            <Input
                                label="State"
                                value={billingFormData.state}
                                onChange={(e) => handleBillingInputChange('state', e.target.value)}
                                required
                            />
                            <Input
                                label="ZIP Code"
                                value={billingFormData.zipCode}
                                onChange={(e) => handleBillingInputChange('zipCode', e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            label="Country"
                            value={billingFormData.country}
                            onChange={(e) => handleBillingInputChange('country', e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={!isFormValid}
                    >
                        Continue to Payment
                    </Button>
                </div>
            </form>
        </Card>
    )
}