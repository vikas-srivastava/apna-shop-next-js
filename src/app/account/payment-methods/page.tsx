import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

/**
 * Payment Methods page
 */
export default function PaymentMethodsPage() {
    // Mock payment method data
    const paymentMethods = [
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

    return (
        <div className="container-theme py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <Typography variant="h1" weight="bold">
                    Payment Methods
                </Typography>
                <Button variant="primary">
                    Add New Payment Method
                </Button>
            </div>

            {paymentMethods.length === 0 ? (
                <Card className="p-12 text-center">
                    <Typography variant="h3" weight="bold" className="mb-4">
                        No Payment Methods
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-6">
                        You haven't added any payment methods yet.
                    </Typography>
                    <Button variant="primary">
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
                                    <Button variant="secondary" size="sm">
                                        Set as Default
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                    Remove
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Add Payment Method Form */}
                    <Card className="p-6 border-2 border-dashed border-secondary-300">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Add New Payment Method
                        </Typography>
                        <form className="space-y-4">
                            <div>
                                <Typography variant="caption" weight="semibold" className="mb-1">
                                    Card Number
                                </Typography>
                                <Input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
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
                                    />
                                </div>
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        CVV
                                    </Typography>
                                    <Input
                                        type="text"
                                        placeholder="123"
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
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="default-payment"
                                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="default-payment" className="text-sm text-secondary-700">
                                    Set as default payment method
                                </label>
                            </div>
                            <div className="pt-4">
                                <Button variant="primary">
                                    Add Payment Method
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}