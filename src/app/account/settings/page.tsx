import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

/**
 * Account Settings page
 */
export default function AccountSettingsPage() {
    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    Account Settings
                </Typography>

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
                                        defaultChecked
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
                                        defaultChecked
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
                                        defaultChecked
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
                        </Card>
                    </div>

                    {/* Account Actions */}
                    <div>
                        <Card className="p-6 mb-8">
                            <Typography variant="h3" weight="bold" className="mb-4">
                                Account Actions
                            </Typography>
                            <div className="space-y-4">
                                <Button variant="secondary" className="w-full justify-between">
                                    Download Your Data
                                    <span className="ml-2">↓</span>
                                </Button>
                                <Button variant="secondary" className="w-full justify-between">
                                    Export Order History
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
                                    <Button variant="outline" className="mt-2">
                                        Deactivate Account
                                    </Button>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Delete Account
                                    </Typography>
                                    <Typography variant="body" color="secondary" className="mt-1">
                                        Permanently delete your account and all associated data.
                                    </Typography>
                                    <Button variant="danger" className="mt-2">
                                        Delete Account
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