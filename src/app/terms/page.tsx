import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Terms of Service page
 */
export default function TermsPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Terms of Service
                </Typography>
                <Typography variant="body" color="secondary">
                    Last updated: August 11, 2024
                </Typography>
            </div>

            <Card className="p-6 mb-8">
                <Typography variant="body" className="mb-4">
                    These Terms of Service ("Terms") govern your access to and use of the StoreFront website and services.
                    By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy.
                </Typography>
                <Typography variant="body">
                    If you do not agree to these Terms, you must not access or use our website or services.
                </Typography>
            </Card>

            <div className="space-y-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        1. Use of Our Services
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            You may use our services only if you can form a binding contract with StoreFront and are not
                            prohibited from using our services under applicable law. You must be at least 18 years old to use
                            our services.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            You agree to use our services only for lawful purposes and in accordance with these Terms.
                            You are responsible for all activity that occurs under your account.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        2. Account Registration
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            To access certain features of our services, you may be required to register for an account.
                            You agree to provide accurate, current, and complete information during registration and to
                            update such information to keep it accurate, current, and complete.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            You are responsible for maintaining the confidentiality of your account and password and for
                            restricting access to your computer or device. You agree to accept responsibility for all
                            activities that occur under your account.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        3. Orders and Payments
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            All orders are subject to product availability and StoreFront's acceptance. We reserve the right
                            to refuse or cancel any order for any reason at any time.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Prices for products are subject to change without notice. We may correct any errors in pricing
                            or product descriptions.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            You agree to pay all charges incurred by your account, including applicable taxes. We may
                            charge your credit card or other payment method for verification purposes.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        4. Shipping and Delivery
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            Shipping times and delivery dates are estimates only and cannot be guaranteed. StoreFront is
                            not responsible for delays caused by shipping carriers or customs.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Risk of loss and title for items purchased pass to you upon delivery to the carrier.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        5. Returns and Refunds
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-4">
                        Our return and refund policy is available on our Returns & Exchanges page. By agreeing to these
                        Terms, you also agree to be bound by our return and refund policy.
                    </Typography>
                    <a href="/returns" className="text-primary-600 hover:underline">
                        View Return Policy
                    </a>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        6. Intellectual Property
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            All content on our website, including text, graphics, logos, images, and software, is the
                            property of StoreFront or its licensors and is protected by copyright and other intellectual
                            property laws.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            You may not use any content from our website without our prior written consent.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        7. Limitation of Liability
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            To the fullest extent permitted by law, StoreFront shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            In no event shall StoreFront's total liability to you for all damages exceed the amount paid
                            by you to StoreFront in the six months preceding the event giving rise to the claim.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        8. Indemnification
                    </Typography>
                    <Typography variant="body" color="secondary">
                        You agree to indemnify, defend, and hold harmless StoreFront and its affiliates, officers,
                        directors, employees, and agents from and against any claims, liabilities, damages, losses,
                        and expenses arising out of or in any way connected with your access to or use of our services.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        9. Changes to These Terms
                    </Typography>
                    <Typography variant="body" color="secondary">
                        We may update these Terms from time to time. When we do, we will revise the "Last updated" date
                        at the top of this page. We recommend that you review these Terms periodically to stay informed
                        of any changes.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        10. Contact Information
                    </Typography>
                    <div className="space-y-3">
                        <Typography variant="body" color="secondary">
                            If you have any questions about these Terms, please contact us at:
                        </Typography>
                        <Typography variant="body">
                            StoreFront Legal Department<br />
                            legal@storefront.com<br />
                            1-800-STORE-01
                        </Typography>
                    </div>
                </Card>
            </div>
        </div>
    )
}