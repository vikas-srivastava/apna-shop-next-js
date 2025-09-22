'use client'

import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useState } from 'react'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'

interface UserSettings {
    newsletter: boolean
    promotions: boolean
    productUpdates: boolean
    profilePublic: boolean
    searchVisibility: boolean
}

/**
 * Account Settings page
 */
export default function AccountSettingsPage() {
    const { user, signOut } = useSupabaseAuth()
    const [settings, setSettings] = useState<UserSettings>({
        newsletter: true,
        promotions: true,
        productUpdates: false,
        profilePublic: false,
        searchVisibility: true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSettingChange = (setting: keyof UserSettings, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }))
    }

    const handleSaveSettings = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // TODO: Implement settings save API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSuccess('Settings saved successfully!')
        } catch (err) {
            setError('Failed to save settings. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadData = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // TODO: Implement data download API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 2000))
            setSuccess('Data download initiated. You will receive an email when ready.')
        } catch (err) {
            setError('Failed to initiate data download. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleExportOrders = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // TODO: Implement order export API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess('Order history export initiated. You will receive an email when ready.')
        } catch (err) {
            setError('Failed to export order history. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeactivateAccount = async () => {
        if (!confirm('Are you sure you want to deactivate your account? You can reactivate it at any time by signing in again.')) {
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // TODO: Implement account deactivation API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSuccess('Account deactivated successfully. You can reactivate it by signing in again.')
        } catch (err) {
            setError('Failed to deactivate account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.')) {
            return
        }

        if (!confirm('This is your final warning. All your data will be permanently deleted. Are you absolutely sure?')) {
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // TODO: Implement account deletion API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000))
            await signOut()
            setSuccess('Account deleted successfully.')
        } catch (err) {
            setError('Failed to delete account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    Account Settings
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Communication Preferences */}
                    <div className="lg:col-span-2">
                        <Card className="p-6 mb-8">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Communication Preferences
                            </Typography>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="newsletter"
                                        checked={settings.newsletter}
                                        onChange={(e) => handleSettingChange('newsletter', e.target.checked)}
                                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="newsletter" className="font-medium text-secondary-900">
                                            Newsletter
                                        </label>
                                        <p className="text-sm text-secondary-600">
                                            Receive our weekly newsletter with product updates and promotions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="promotions"
                                        checked={settings.promotions}
                                        onChange={(e) => handleSettingChange('promotions', e.target.checked)}
                                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="promotions" className="font-medium text-secondary-900">
                                            Promotional Emails
                                        </label>
                                        <p className="text-sm text-secondary-600">
                                            Be the first to know about sales, discounts, and special offers.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="product-updates"
                                        checked={settings.productUpdates}
                                        onChange={(e) => handleSettingChange('productUpdates', e.target.checked)}
                                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="product-updates" className="font-medium text-secondary-900">
                                            Product Updates
                                        </label>
                                        <p className="text-sm text-secondary-600">
                                            Get notified about new products and features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <Button
                                    variant="primary"
                                    onClick={handleSaveSettings}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Preferences'}
                                </Button>
                            </div>
                        </Card>

                        {/* Privacy Settings */}
                        <Card className="p-6">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Privacy Settings
                            </Typography>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="profile-public"
                                        checked={settings.profilePublic}
                                        onChange={(e) => handleSettingChange('profilePublic', e.target.checked)}
                                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="profile-public" className="font-medium text-secondary-900">
                                            Public Profile
                                        </label>
                                        <p className="text-sm text-secondary-600">
                                            Allow other users to see your profile information.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="search-visibility"
                                        checked={settings.searchVisibility}
                                        onChange={(e) => handleSettingChange('searchVisibility', e.target.checked)}
                                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="search-visibility" className="font-medium text-secondary-900">
                                            Search Visibility
                                        </label>
                                        <p className="text-sm text-secondary-600">
                                            Allow your account to appear in search results.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <Button
                                    variant="primary"
                                    onClick={handleSaveSettings}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Privacy Settings'}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Account Actions */}
                    <div>
                        <Card className="p-6 mb-8">
                            <Typography variant="h3" weight="bold" className="mb-4">
                                Account Actions
                            </Typography>
                            <div className="space-y-4">
                                <Button
                                    variant="secondary"
                                    className="w-full justify-between"
                                    onClick={handleDownloadData}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Download Your Data'}
                                    <span className="ml-2">↓</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full justify-between"
                                    onClick={handleExportOrders}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Export Order History'}
                                    <span className="ml-2">↓</span>
                                </Button>
                            </div>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="p-6 border border-error-200">
                            <Typography variant="h3" weight="bold" className="mb-4">
                                Danger Zone
                            </Typography>
                            <div className="space-y-4">
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Deactivate Account
                                    </Typography>
                                    <Typography variant="body" color="secondary" className="mt-1">
                                        Temporarily disable your account. You can reactivate it at any time.
                                    </Typography>
                                    <Button
                                        variant="outline"
                                        className="mt-2"
                                        onClick={handleDeactivateAccount}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Deactivate Account'}
                                    </Button>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Delete Account
                                    </Typography>
                                    <Typography variant="body" color="secondary" className="mt-1">
                                        Permanently delete your account and all associated data.
                                    </Typography>
                                    <Button
                                        variant="danger"
                                        className="mt-2"
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Delete Account'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}