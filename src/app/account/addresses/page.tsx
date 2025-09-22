'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useState, useEffect } from 'react'
import { mockStorage } from '@/lib/mock-data'

interface Address {
    id: string
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
    isDefault: boolean
}

/**
 * Addresses page
 */
export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: false
    })

    // Load addresses on component mount
    useEffect(() => {
        loadAddresses()
    }, [])

    const loadAddresses = () => {
        setLoading(true)
        try {
            // Get addresses from mock storage
            const userAddresses = mockStorage.addresses.get('default-user') || []
            setAddresses(userAddresses)
        } catch (err) {
            setError('Failed to load addresses')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            phone: '',
            isDefault: false
        })
    }

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const newAddress: Address = {
                id: `addr-${Date.now()}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address1: formData.address1,
                address2: formData.address2 || undefined,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                phone: formData.phone,
                isDefault: formData.isDefault
            }

            // If setting as default, remove default from other addresses
            if (formData.isDefault) {
                addresses.forEach(addr => {
                    if (addr.isDefault) {
                        addr.isDefault = false
                    }
                })
            }

            const updatedAddresses = [...addresses, newAddress]
            mockStorage.addresses.set('default-user', updatedAddresses)
            setAddresses(updatedAddresses)
            setSuccess('Address added successfully!')
            setShowAddForm(false)
            resetForm()
        } catch (err) {
            setError('Failed to add address. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleEditAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingAddress) return

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // If setting as default, remove default from other addresses
            if (formData.isDefault) {
                addresses.forEach(addr => {
                    if (addr.id !== editingAddress.id && addr.isDefault) {
                        addr.isDefault = false
                    }
                })
            }

            const updatedAddress: Address = {
                ...editingAddress,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address1: formData.address1,
                address2: formData.address2 || undefined,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                phone: formData.phone,
                isDefault: formData.isDefault
            }

            const updatedAddresses = addresses.map(addr =>
                addr.id === editingAddress.id ? updatedAddress : addr
            )

            mockStorage.addresses.set('default-user', updatedAddresses)
            setAddresses(updatedAddresses)
            setSuccess('Address updated successfully!')
            setEditingAddress(null)
            resetForm()
        } catch (err) {
            setError('Failed to update address. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId)
            mockStorage.addresses.set('default-user', updatedAddresses)
            setAddresses(updatedAddresses)
            setSuccess('Address deleted successfully!')
        } catch (err) {
            setError('Failed to delete address. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSetDefault = async (addressId: string) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const updatedAddresses = addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            }))

            mockStorage.addresses.set('default-user', updatedAddresses)
            setAddresses(updatedAddresses)
            setSuccess('Default address updated successfully!')
        } catch (err) {
            setError('Failed to update default address. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (address: Address) => {
        setEditingAddress(address)
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            address1: address.address1,
            address2: address.address2 || '',
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phone: address.phone || '',
            isDefault: address.isDefault
        })
    }

    const cancelEdit = () => {
        setEditingAddress(null)
        resetForm()
    }

    if (loading && addresses.length === 0) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        My Addresses
                    </Typography>
                    <Card className="p-12 text-center">
                        <Typography variant="body">Loading addresses...</Typography>
                    </Card>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <Typography variant="h1" weight="bold">
                        My Addresses
                    </Typography>
                    <Button
                        variant="primary"
                        onClick={() => setShowAddForm(true)}
                        disabled={showAddForm || editingAddress !== null}
                    >
                        Add New Address
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                        <Typography variant="body" className="text-error-700">
                            {error}
                        </Typography>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg">
                        <Typography variant="body" className="text-success-700">
                            {success}
                        </Typography>
                    </div>
                )}

                {addresses.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            No Addresses Yet
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-6">
                            You haven't added any addresses yet.
                        </Typography>
                        <Button
                            variant="primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            Add Your First Address
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <Card key={address.id} className="p-6">
                                {address.isDefault && (
                                    <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full mb-4">
                                        Default Address
                                    </div>
                                )}
                                <div className="mb-4">
                                    <Typography variant="subtitle" weight="semibold">
                                        {address.firstName} {address.lastName}
                                    </Typography>
                                    <Typography variant="body">
                                        {address.address1}
                                    </Typography>
                                    {address.address2 && (
                                        <Typography variant="body">
                                            {address.address2}
                                        </Typography>
                                    )}
                                    <Typography variant="body">
                                        {address.city}, {address.state} {address.zipCode}
                                    </Typography>
                                    <Typography variant="body">
                                        {address.country}
                                    </Typography>
                                    {address.phone && (
                                        <Typography variant="body">
                                            {address.phone}
                                        </Typography>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit(address)}
                                        disabled={showAddForm || editingAddress !== null}
                                    >
                                        Edit
                                    </Button>
                                    {!address.isDefault && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSetDefault(address.id)}
                                            disabled={loading}
                                        >
                                            Set as Default
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        disabled={loading}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {/* Add/Edit Address Form */}
                        {(showAddForm || editingAddress) && (
                            <Card className="p-6 border-2 border-dashed border-primary-300">
                                <Typography variant="h3" weight="bold" className="mb-4">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </Typography>
                                <form onSubmit={editingAddress ? handleEditAddress : handleAddAddress} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                First Name
                                            </Typography>
                                            <Input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                Last Name
                                            </Typography>
                                            <Input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Street Address
                                        </Typography>
                                        <Input
                                            type="text"
                                            value={formData.address1}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address1: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Apartment, Suite, etc. (optional)
                                        </Typography>
                                        <Input
                                            type="text"
                                            value={formData.address2}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address2: e.target.value }))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                City
                                            </Typography>
                                            <Input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                State
                                            </Typography>
                                            <Input
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                ZIP Code
                                            </Typography>
                                            <Input
                                                type="text"
                                                value={formData.zipCode}
                                                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Country
                                        </Typography>
                                        <select
                                            className="input w-full"
                                            value={formData.country}
                                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Phone Number (optional)
                                        </Typography>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="default"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <label htmlFor="default" className="text-sm text-secondary-700">
                                            Set as default address
                                        </label>
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={editingAddress ? cancelEdit : () => setShowAddForm(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}