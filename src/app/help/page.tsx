import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Help Center page
 */
export default function HelpCenterPage() {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by visiting the 'Track Your Order' page and entering your order number and email address."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy on most items. Items must be in new, unused condition with all original packaging."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery."
        },
        {
            question: "Can I change or cancel my order?",
            answer: "Orders can be changed or canceled within 1 hour of placement. After that, please contact customer service for assistance."
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Help Center
                </Typography>
                <Typography variant="body" color="secondary">
                    Find answers to frequently asked questions and get help with your orders.
                </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Contact Support
                    </Typography>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Email Support
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    support@storefront.com
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Phone Support
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    1-800-STORE-01
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Live Chat
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    Available 24/7
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Quick Links
                    </Typography>
                    <Card className="p-6">
                        <ul className="space-y-3">
                            <li>
                                <a href="/returns" className="text-primary-600 hover:underline">
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a href="/shipping" className="text-primary-600 hover:underline">
                                    Shipping Information
                                </a>
                            </li>
                            <li>
                                <a href="/size-guide" className="text-primary-600 hover:underline">
                                    Size Guide
                                </a>
                            </li>
                            <li>
                                <a href="/track-order" className="text-primary-600 hover:underline">
                                    Track Your Order
                                </a>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            <div className="mt-12">
                <Typography variant="h2" weight="bold" className="mb-6">
                    Frequently Asked Questions
                </Typography>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="p-6">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                {faq.question}
                            </Typography>
                            <Typography variant="body" color="secondary">
                                {faq.answer}
                            </Typography>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}