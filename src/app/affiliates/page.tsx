import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Affiliate Program page
 */
export default function AffiliatesPage() {
    const commissionTiers = [
        {
            name: "Starter",
            sales: "$0 - $1,000",
            commission: "5%",
            benefits: [
                "5% commission on all sales",
                "Monthly performance reports",
                "Standard marketing materials"
            ]
        },
        {
            name: "Professional",
            sales: "$1,001 - $10,000",
            commission: "8%",
            benefits: [
                "8% commission on all sales",
                "Priority support",
                "Exclusive promotional codes",
                "Early access to sales"
            ]
        },
        {
            name: "Partner",
            sales: "$10,001+",
            commission: "12%",
            benefits: [
                "12% commission on all sales",
                "Dedicated account manager",
                "Custom marketing materials",
                "Co-marketing opportunities",
                "VIP event invitations"
            ]
        }
    ]

    const steps = [
        {
            step: "1",
            title: "Sign Up",
            description: "Create your affiliate account in minutes with our simple online application."
        },
        {
            step: "2",
            title: "Get Approved",
            description: "Our team reviews your application and approves qualified affiliates."
        },
        {
            step: "3",
            title: "Promote",
            description: "Use your unique affiliate links to promote our products on your website or social media."
        },
        {
            step: "4",
            title: "Earn",
            description: "Receive commissions for every sale generated through your affiliate links."
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Affiliate Program
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    Earn money by promoting our products. Join our affiliate program and start earning commissions today.
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <Card className="p-6 h-full">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            How It Works
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {steps.map((step, index) => (
                                <div key={index} className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                            <Typography variant="subtitle" weight="bold" color="primary">
                                                {step.step}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="subtitle" weight="semibold" className="mb-1">
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body" color="secondary">
                                            {step.description}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 h-full">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Program Benefits
                        </Typography>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Competitive commission rates up to 12%
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    30-day cookie window for tracking referrals
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Real-time dashboard with performance metrics
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Monthly payouts via PayPal or bank transfer
                                </Typography>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">•</span>
                                <Typography variant="body">
                                    Exclusive promotional materials and banners
                                </Typography>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            <div className="mb-12">
                <Typography variant="h2" weight="bold" className="mb-6 text-center">
                    Commission Tiers
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {commissionTiers.map((tier, index) => (
                        <Card key={index} className="p-6">
                            <div className="text-center mb-6">
                                <Typography variant="h4" weight="bold" className="mb-1">
                                    {tier.name}
                                </Typography>
                                <Typography variant="caption" color="secondary">
                                    {tier.sales}
                                </Typography>
                            </div>
                            <div className="text-center mb-6">
                                <Typography variant="h2" weight="bold" color="primary">
                                    {tier.commission}
                                </Typography>
                                <Typography variant="caption" color="secondary">
                                    Commission Rate
                                </Typography>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {tier.benefits.map((benefit, benefitIndex) => (
                                    <li key={benefitIndex} className="flex items-start">
                                        <span className="text-primary-500 mr-2">•</span>
                                        <Typography variant="caption">
                                            {benefit}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                            <Button variant="primary" className="w-full">
                                Join This Tier
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Frequently Asked Questions
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="subtitle" weight="semibold">
                                How do I get paid?
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Commissions are paid monthly via PayPal or direct bank transfer. Payments are processed
                                on the 15th of each month for the previous month's earnings.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold">
                                Is there a minimum payout?
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Yes, the minimum payout threshold is $50. If your earnings don't reach this amount in a
                                given month, they will be carried over to the next month.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold">
                                Can I promote on social media?
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Absolutely! Social media promotion is encouraged. We provide special tracking links
                                for social media platforms to ensure proper attribution.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="body" className="mb-6">
                        Join our affiliate program today and start earning commissions by promoting our products.
                    </Typography>
                    <Button variant="primary" size="lg" className="w-full mb-4">
                        Apply Now
                    </Button>
                    <Typography variant="caption" color="secondary" className="text-center block">
                        Approval typically takes 1-2 business days
                    </Typography>
                </Card>
            </div>
        </div>
    )
}