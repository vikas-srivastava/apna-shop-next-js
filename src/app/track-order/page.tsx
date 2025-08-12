import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

/**
 * Track Your Order page
 */
export default function TrackOrderPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Track Your Order
                </Typography>
                <Typography variant="body" color="secondary">
                    Check the status of your order using your order number
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <Typography variant="h3" weight="semibold" className="mb-6">
                            Track Your Order
                        </Typography>
                        <form className="space-y-6">
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Order Number
                                </Typography>
                                <Input
                                    type="text"
                                    placeholder="Enter your order number"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Email Address
                                </Typography>
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Button variant="primary" size="lg" className="w-full">
                                    Track Order
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card className="p-6 mt-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Order Status Information
                        </Typography>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <Typography variant="caption" weight="bold" color="primary">
                                        1
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Order Placed
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Your order has been received and is being processed.
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <Typography variant="caption" weight="bold" color="primary">
                                        2
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Order Confirmed
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Your payment has been confirmed and your order is being prepared for shipment.
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <Typography variant="caption" weight="bold" color="primary">
                                        3
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Shipped
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Your order has been shipped and is on its way to you. Tracking information is available.
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <Typography variant="caption" weight="bold" color="primary">
                                        4
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Out for Delivery
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Your package is out for delivery and will arrive today.
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <Typography variant="caption" weight="bold" color="primary">
                                        5
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold">
                                        Delivered
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        Your order has been successfully delivered.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 mb-8">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Need Help?
                        </Typography>
                        <div className="space-y-4">
                            <Typography variant="body">
                                If you're having trouble tracking your order, please contact our customer service team.
                            </Typography>
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Customer Service
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    support@storefront.com
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    1-800-STORE-01
                                </Typography>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Order History
                        </Typography>
                        <Typography variant="body" className="mb-4">
                            Sign in to your account to view your order history and track all your orders.
                        </Typography>
                        <Button variant="secondary" className="w-full">
                            Sign In to Account
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}