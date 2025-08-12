import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Shipping Information page
 */
export default function ShippingPage() {
    const shippingOptions = [
        {
            name: "Standard Shipping",
            price: "Free",
            description: "3-5 business days",
            details: "Delivered to your doorstep within 3-5 business days. Available for all orders."
        },
        {
            name: "Express Shipping",
            price: "$9.99",
            description: "1-2 business days",
            details: "Faster delivery option for when you need your items quickly. Available for most locations."
        },
        {
            name: "Overnight Shipping",
            price: "$19.99",
            description: "Next business day",
            details: "Guaranteed next-day delivery for orders placed before 2 PM. Available in select areas."
        }
    ]

    const internationalShipping = [
        {
            name: "Canada & Mexico",
            price: "$14.99",
            description: "5-10 business days",
            details: "Standard international shipping to Canada and Mexico with tracking."
        },
        {
            name: "Europe",
            price: "$24.99",
            description: "7-14 business days",
            details: "International shipping to European countries with tracking and insurance."
        },
        {
            name: "Rest of World",
            price: "$29.99",
            description: "10-20 business days",
            details: "Shipping to all other international destinations with tracking."
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Shipping Information
                </Typography>
                <Typography variant="body" color="secondary">
                    Learn about our shipping options, delivery times, and policies
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6 mb-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Domestic Shipping
                        </Typography>
                        <div className="space-y-6">
                            {shippingOptions.map((option, index) => (
                                <div key={index} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Typography variant="subtitle" weight="semibold">
                                                {option.name}
                                            </Typography>
                                            <Typography variant="caption" color="secondary">
                                                {option.description}
                                            </Typography>
                                        </div>
                                        <Typography variant="subtitle" weight="semibold" color="primary">
                                            {option.price}
                                        </Typography>
                                    </div>
                                    <Typography variant="body" className="mt-2">
                                        {option.details}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            International Shipping
                        </Typography>
                        <div className="space-y-6">
                            {internationalShipping.map((option, index) => (
                                <div key={index} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Typography variant="subtitle" weight="semibold">
                                                {option.name}
                                            </Typography>
                                            <Typography variant="caption" color="secondary">
                                                {option.description}
                                            </Typography>
                                        </div>
                                        <Typography variant="subtitle" weight="semibold" color="primary">
                                            {option.price}
                                        </Typography>
                                    </div>
                                    <Typography variant="body" className="mt-2">
                                        {option.details}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 mb-8">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Shipping Policies
                        </Typography>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Free standard shipping on orders over $99
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Orders are processed within 1-2 business days
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Tracking information provided via email
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Weekend and holiday orders ship the next business day
                                </Typography>
                            </li>
                        </ul>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Need Help?
                        </Typography>
                        <div className="space-y-3">
                            <Typography variant="body">
                                If you have questions about your shipment, please contact our customer service team.
                            </Typography>
                            <div className="pt-2">
                                <a href="/contact" className="text-primary-600 hover:underline">
                                    Contact Customer Service
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}