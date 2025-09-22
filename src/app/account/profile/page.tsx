'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useState, useEffect } from 'react'

/**
 * Profile page
 */
export default function ProfilePage() {
    const { user, updateProfile, updatePassword } = useSupabaseAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: ''
    })

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Load user data into form
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: '', // Phone would come from customer API
                dateOfBirth: '' // Date of birth would come from customer API
            })
        }
    }, [user])

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Update profile using SupabaseAuth context
            await updateProfile({
                full_name: `${formData.firstName} ${formData.lastName}`.trim()
            })

            setSuccess('Profile updated successfully!')
        } catch (err) {
            setError('Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match')
            setLoading(false)
            return
        }

        try {
            // Update password using SupabaseAuth context
            await updatePassword(passwordData.newPassword)
            setSuccess('Password updated successfully!')
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setError('Failed to update password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    My Profile
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Personal Information
                            </Typography>

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

                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Typography variant="subtitle" weight="semibold" className="mb-2">
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
                                        <Typography variant="subtitle" weight="semibold" className="mb-2">
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
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Email Address
                                    </Typography>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Phone Number
                                    </Typography>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Date of Birth
                                    </Typography>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Password Change */}
                    <div>
                        <Card className="p-6">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Change Password
                            </Typography>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Current Password
                                    </Typography>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        New Password
                                    </Typography>
                                    <Input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Confirm New Password
                                    </Typography>
                                    <Input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}