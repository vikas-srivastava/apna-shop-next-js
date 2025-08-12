import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Orders page
 */
export default function OrdersPage() {
    // Mock order data
    const orders = [
        {
            id: "1003",
            date: "2024-07-15",
            status: "Delivered",
            total: 189.97,
            items: 3
        },
        {
            id: "1002",
            date: "2024-06-22",
            status: "Shipped",
            total: 89.99,
            items: 1
        },
        {
            id: "1001",
            date: "2024-05-30",
            status: "Delivered",
            total: 245.50,
            items: 2
        },
        {
            id: "1000",
            date: "2024-05-15",
            status: "Delivered",
            total: 120.99,
            items: 1
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'text-success-600 bg-success-100'
            case 'Shipped':
                return 'text-warning-600 bg-warning-100'
            case 'Processing':
                return 'text-primary-600 bg-primary-100'
            default:
                return 'text-secondary-600 bg-secondary-100'
        }
    }

    return (
        <div className="container-theme py-8">
            <Typography variant="h1" weight="bold" className="mb-8">
                My Orders
            </Typography>

            <Card className="p-6">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            No Orders Yet
                        </Typography>
                        <Typography variant="body" color="secondary" className="mb-6">
                            You haven't placed any orders yet.
                        </Typography>
                        <Button variant="primary" asChild>
                            <a href="/products">
                                Start Shopping
                            </a>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-secondary-200 rounded-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-secondary-100">
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <Typography variant="subtitle" weight="semibold">
                                                Order #{order.id}
                                            </Typography>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <Typography variant="caption" color="secondary" className="mt-1">
                                            {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </div>
                                    <div className="text-right">
                                        <Typography variant="subtitle" weight="semibold">
                                            ${order.total.toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" color="secondary">
                                            {order.items} {order.items === 1 ? 'item' : 'items'}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 pt-4">
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        Reorder
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}