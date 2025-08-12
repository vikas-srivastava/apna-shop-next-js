import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Do Not Sell My Info page
 */
export default function DoNotSellPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Do Not Sell My Personal Information
                </Typography>
                <Typography variant="body" color="secondary">
                    Last updated: August 11, 2024
                </Typography>
            </div>

            <Card className="p-6 mb-8">
                <Typography variant="body" className="mb-4">
                    StoreFront respects your privacy and provides you with choices regarding the personal information
                    we collect about you. This page explains your right to opt out of the sale of your personal information
                    under applicable privacy laws, including the California Consumer Privacy Act (CCPA).
                </Typography>
                <Typography variant="body">
                    We do not sell your personal information to third parties. However, we may share your information
                    with service providers who assist us in operating our business and providing services to you.
                </Typography>
            </Card>

            <div className="space-y-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Your Rights Under CCPA
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            Under the California Consumer Privacy Act (CCPA), California residents have the right to:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    Know what personal information is being collected about them
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Know whether their personal information is sold or disclosed and to whom
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Say no to the sale of personal information
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Access their personal information
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Request deletion of their personal information
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Not be discriminated against for exercising their privacy rights
                                </Typography>
                            </li>
                        </ul>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Categories of Personal Information We Collect
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            We collect the following categories of personal information:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    Identifiers (name, email address, phone number, account information)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Commercial information (purchase history, billing information)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Internet or other electronic network activity information (browsing history, search history)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Geolocation data (shipping and billing addresses)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Professional or employment-related information (if provided)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Inferences drawn from any of the information identified above
                                </Typography>
                            </li>
                        </ul>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        How We Use Your Personal Information
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            We use your personal information for the following business purposes:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    To provide, maintain, and improve our services
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    To process and fulfill orders
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    To communicate with you about your account and orders
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    To personalize your shopping experience
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    To prevent fraud and enhance security
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    To comply with legal obligations
                                </Typography>
                            </li>
                        </ul>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Your Right to Opt-Out
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            As mentioned above, we do not sell your personal information to third parties.
                            However, if we were to engage in such activities in the future, you would have
                            the right to opt-out.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            If you are a California resident and wish to exercise your right to opt-out of
                            the sale of your personal information, you may submit a request through the
                            methods provided below.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Submitting a Request
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            You can submit a request to opt-out or exercise any of your CCPA rights by:
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Online
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-3">
                                    Visit our Privacy Rights portal to submit your request electronically.
                                </Typography>
                                <Button variant="outline">
                                    Visit Privacy Portal
                                </Button>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    By Phone
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    Call our Privacy Hotline at 1-800-STORE-01 and follow the prompts to
                                    submit your request.
                                </Typography>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                By Mail
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Send a written request to:
                            </Typography>
                            <Typography variant="body" className="mt-2">
                                StoreFront Privacy Department<br />
                                123 Commerce Street<br />
                                New York, NY 10001
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Verification Process
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-4">
                        To protect your privacy and security, we may need to verify your identity before
                        responding to your request. This verification process helps ensure that personal
                        information is disclosed only to the correct person.
                    </Typography>
                    <Typography variant="body" color="secondary">
                        We will respond to your request within 45 days of receiving it. If we require more
                        time, we will inform you of the reason and extension period in writing.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Non-Discrimination
                    </Typography>
                    <Typography variant="body" color="secondary">
                        We will not discriminate against you for exercising any of your CCPA rights.
                        Unless permitted by the CCPA, we will not:
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>
                            <Typography variant="body">
                                Deny you goods or services
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                Charge you different prices or rates for goods or services
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                Provide you a different level or quality of goods or services
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                Suggest that you may receive a different price or rate for goods or services
                                or a different level or quality of goods or services
                            </Typography>
                        </li>
                    </ul>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Questions or Concerns
                    </Typography>
                    <div className="space-y-3">
                        <Typography variant="body" color="secondary">
                            If you have any questions about this notice or your privacy rights, please contact us at:
                        </Typography>
                        <Typography variant="body">
                            StoreFront Privacy Department<br />
                            privacy@storefront.com<br />
                            1-800-STORE-01
                        </Typography>
                    </div>
                </Card>
            </div>
        </div>
    )
}