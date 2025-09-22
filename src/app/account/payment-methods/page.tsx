'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useState, useEffect } from 'react'

interface PaymentMethod {
    id: string
    type: string
    number: string
    expiry: string
    isDefault: boolean
}

/**
 * Payment Methods page
 */
export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
    })

    // Mock payment methods data
    const mockPaymentMethods: PaymentMethod[] = [
        {
            id: "1",
            type: "Visa",
            number: "**** **** **** 1234",
            expiry: "12/2025",
            isDefault: true
        },
        {
            id: "2",
            type: "Mastercard",
            number: "**** **** **** 5678",
            expiry: "06/2024",
            isDefault: false
        }
    ]

    // Load payment methods on component mount
    useEffect(() => {
        loadPaymentMethods()
    }, [])

    const loadPaymentMethods = () => {
        setLoading(true)
        try {
            // Simulate API call delay
            setTimeout(() => {
                setPaymentMethods(mockPaymentMethods)
                setLoading(false)
            }, 500)
        } catch (err) {
            setError('Failed to load payment methods')
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: '',
            isDefault: false
        })
    }

    const handleAddPaymentMethod = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Validate form data
            if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
                throw new Error('Please fill in all required fields')
            }

            // Format card number (remove spaces and take last 4 digits)
            const cleanCardNumber = formData.cardNumber.replace(/\s/g, '')
            const maskedNumber = `**** **** **** ${cleanCardNumber.slice(-4)}`

            // Determine card type based on first digit
            const cardType = cleanCardNumber.startsWith('4') ? 'Visa' :
                cleanCardNumber.startsWith('5') ? 'Mastercard' : 'Unknown'

            const newPaymentMethod: PaymentMethod = {
                id: `pm-${Date.now()}`,
                type: cardType,
                number: maskedNumber,
                expiry: formData.expiryDate,
                isDefault: formData.isDefault
            }

            // If setting as default, remove default from other payment methods
            if (formData.isDefault) {
                paymentMethods.forEach(method => {
                    if (method.isDefault) {
                        method.isDefault = false
                    }
                })
            }

            const updatedMethods = [...paymentMethods, newPaymentMethod]
            setPaymentMethods(updatedMethods)
            setSuccess('Payment method added successfully!')
            setShowAddForm(false)
            resetForm()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add payment method. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePaymentMethod = async (methodId: string) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const updatedMethods = paymentMethods.filter(method => method.id !== methodId)
            setPaymentMethods(updatedMethods)
            setSuccess('Payment method deleted successfully!')
        } catch (err) {
            setError('Failed to delete payment method. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSetDefault = async (methodId: string) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const updatedMethods = paymentMethods.map(method => ({
                ...method,
                isDefault: method.id === methodId
            }))

            setPaymentMethods(updatedMethods)
            setSuccess('Default payment method updated successfully!')
        } catch (err) {
            setError('Failed to update default payment method. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const formatCardNumber = (value: string) => {
        // Remove all non-digits
        const cleaned = value.replace(/\D/g, '')
        // Add spaces every 4 digits
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
        return formatted
    }

    const formatExpiryDate = (value: string) => {
        // Remove all non-digits
        const cleaned = value.replace(/\D/g, '')
        // Add slash after 2 digits
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
        }
        return cleaned
    }

    if (loading && paymentMethods.length === 0) {
        return (
            <ProtectedRoute>
                <div className="container-theme py-8">
                    <Typography variant="h1" weight="bold" className="mb-8">
                        Payment Methods
                    </Typography>
                    <Card className="p-12 text-center">
                        <Typography variant="body">Loading payment methods...</Typography>
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
                        Payment Methods
                    </Typography>
                    <Button
                        variant="primary"
                        onClick={() => setShowAddForm(true)}
                        disabled={showAddForm}
                    >
                        Add New Payment Method
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

                {paymentMethods.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            No Payment Methods
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-6">
                            You haven't added any payment methods yet.
                        </Typography>
                        <Button
                            variant="primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            Add Your First Payment Method
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paymentMethods.map((method) => (
                            <Card key={method.id} className="p-6">
                                {method.isDefault && (
                                    <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full mb-4">
                                        Default Payment Method
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-8 bg-secondary-200 rounded flex items-center justify-center">
                                        <Typography variant="caption" weight="bold">
                                            {method.type.charAt(0)}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="subtitle" weight="semibold">
                                            {method.type}
                                        </Typography>
                                        <Typography variant="body">
                                            {method.number}
                                        </Typography>
                                        <Typography variant="caption" color="secondary">
                                            Expires {method.expiry}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {!method.isDefault && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSetDefault(method.id)}
                                            disabled={loading}
                                        >
                                            Set as Default
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePaymentMethod(method.id)}
                                        disabled={loading}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {/* Add Payment Method Form */}
                        {showAddForm && (
                            <Card className="p-6 border-2 border-dashed border-primary-300">
                                <Typography variant="h3" weight="bold" className="mb-4">
                                    Add New Payment Method
                                </Typography>
                                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Card Number
                                        </Typography>
                                        <Input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                cardNumber: formatCardNumber(e.target.value)
                                            }))}
                                            maxLength={19}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                Expiration Date
                                            </Typography>
                                            <Input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={formData.expiryDate}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    expiryDate: formatExpiryDate(e.target.value)
                                                }))}
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="caption" weight="semibold" className="mb-1">
                                                CVV
                                            </Typography>
                                            <Input
                                                type="text"
                                                placeholder="123"
                                                value={formData.cvv}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    cvv: e.target.value.replace(/\D/g, '')
                                                }))}
                                                maxLength={4}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="caption" weight="semibold" className="mb-1">
                                            Cardholder Name
                                        </Typography>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.cardholderName}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                cardholderName: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="default-payment"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                isDefault: e.target.checked
                                            }))}
                                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <label htmlFor="default-payment" className="text-sm text-secondary-700">
                                            Set as default payment method
                                        </label>
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? 'Adding...' : 'Add Payment Method'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
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