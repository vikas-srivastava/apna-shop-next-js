import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { LogoutButton } from '@/components/auth/LogoutButton'

/**
 * Account dashboard page
 */
export default function AccountPage() {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "January 15, 2024",
        totalOrders: 12,
        wishlistItems: 5
    }

    const navigation = [
        { name: 'Profile', href: '/account/profile' },
        { name: 'Orders', href: '/account/orders' },
        { name: 'Addresses', href: '/account/addresses' },
        { name: 'Payment Methods', href: '/account/payment-methods' },
        { name: 'Wishlist', href: '/wishlist' },
        { name: 'Settings', href: '/account/settings' },
    ]

    return (
        <ProtectedRoute>
            <div className="container-theme py-8">
                <Typography variant="h1" weight="bold" className="mb-8">
                    My Account
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Typography variant="h3" weight="bold" color="primary">
                                        {user.name.charAt(0)}
                                    </Typography>
                                </div>
                                <Typography variant="h4" weight="bold">
                                    {user.name}
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-4">
                                    {user.email}
                                </Typography>
                                <Typography variant="caption" color="secondary">
                                    Member since {user.joinDate}
                                </Typography>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-secondary-200">
                                <div className="text-center">
                                    <Typography variant="h4" weight="bold" color="primary">
                                        {user.totalOrders}
                                    </Typography>
                                    <Typography variant="caption" color="secondary">
                                        Orders
                                    </Typography>
                                </div>
                                <div className="text-center">
                                    <Typography variant="h4" weight="bold" color="primary">
                                        {user.wishlistItems}
                                    </Typography>
                                    <Typography variant="caption" color="secondary">
                                        Wishlist Items
                                    </Typography>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <Typography variant="h3" weight="bold" className="mb-6">
                                Account Settings
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {navigation.map((item) => (
                                    <Button
                                        key={item.name}
                                        variant="secondary"
                                        className="justify-between"
                                        asChild
                                    >
                                        <Link href={item.href}>
                                            {item.name}
                                            <span className="ml-2">→</span>
                                        </Link>
                                    </Button>
                                ))}
                            </div>

                            {/* Logout Section */}
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <div className="flex justify-center">
                                    <LogoutButton />
                                </div>
                            </div>
                        </Card>

                        {/* Recent Orders Preview */}
                        <Card className="p-6 mt-8">
                            <div className="flex justify-between items-center mb-6">
                                <Typography variant="h3" weight="bold">
                                    Recent Orders
                                </Typography>
                                <Button variant="ghost" asChild>
                                    <Link href="/account/orders">
                                        View All
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((order) => (
                                    <div key={order} className="flex items-center justify-between pb-4 border-b border-secondary-100 last:border-0 last:pb-0">
                                        <div>
                                            <Typography variant="subtitle" weight="semibold">
                                                Order #{1000 + order}
                                            </Typography>
                                            <Typography variant="caption" color="secondary">
                                                {order === 1 ? 'Processing' : order === 2 ? 'Shipped' : 'Delivered'}
                                            </Typography>
                                        </div>
                                        <Typography variant="body" weight="semibold">
                                            ${(120.99 + order * 20).toFixed(2)}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}