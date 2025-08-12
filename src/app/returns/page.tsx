import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Returns & Exchanges page
 */
export default function ReturnsPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Returns & Exchanges
                </Typography>
                <Typography variant="body" color="secondary">
                    Our hassle-free return and exchange policy
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6 mb-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Our Return Policy
                        </Typography>
                        <div className="space-y-4">
                            <Typography variant="body">
                                We want you to be completely satisfied with your purchase. If for any reason you are not satisfied,
                                we offer a 30-day return policy on most items.
                            </Typography>
                            <Typography variant="body">
                                To be eligible for a return, your item must be unused and in the same condition that you received it.
                                It must also be in the original packaging.
                            </Typography>
                            <Typography variant="body">
                                Several types of goods are exempt from being returned. Perishable goods such as food, flowers,
                                newspapers or magazines cannot be returned. We also do not accept products that are intimate or
                                sanitary goods, hazardous materials, or flammable liquids or gases.
                            </Typography>
                        </div>
                    </Card>

                    <Card className="p-6 mb-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Additional Non-Returnable Items
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Gift cards</li>
                            <li>Downloadable software products</li>
                            <li>Some health and personal care items</li>
                            <li>Custom products (such as special orders or personalized items)</li>
                            <li>Personal care items (such as beauty products)</li>
                            <li>Intimate or sanitary goods</li>
                        </ul>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Exchanges
                        </Typography>
                        <div className="space-y-4">
                            <Typography variant="body">
                                We only replace items if they are defective or damaged. If you need to exchange an item for the same
                                product, please contact us first to get authorization.
                            </Typography>
                            <Typography variant="body">
                                To complete your return, we require a receipt or proof of purchase. Please note that sale items
                                are final sale and cannot be exchanged.
                            </Typography>
                            <div className="mt-4">
                                <Button variant="primary" size="lg">
                                    Start a Return
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 mb-8">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Return Process
                        </Typography>
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>Contact customer service to initiate your return</li>
                            <li>Package your item securely with all original packaging</li>
                            <li>Include your order number and reason for return</li>
                            <li>Ship the package to our return center</li>
                            <li>Receive your refund within 5-7 business days</li>
                        </ol>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h4" weight="semibold" className="mb-4">
                            Refunds
                        </Typography>
                        <div className="space-y-3">
                            <Typography variant="body">
                                Once your return is received and inspected, we will send you an email to notify you that we have
                                received your returned item.
                            </Typography>
                            <Typography variant="body">
                                If your return is approved, a refund will be processed to your original method of payment within
                                5-7 business days.
                            </Typography>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}