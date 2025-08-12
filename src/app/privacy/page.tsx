import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Privacy Policy page
 */
export default function PrivacyPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Privacy Policy
                </Typography>
                <Typography variant="body" color="secondary">
                    Last updated: August 11, 2024
                </Typography>
            </div>

            <Card className="p-6 mb-8">
                <Typography variant="body" className="mb-4">
                    StoreFront ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your information when you visit our website
                    storefront.com and use our services.
                </Typography>
                <Typography variant="body">
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                    please do not access the site or use our services.
                </Typography>
            </Card>

            <div className="space-y-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Information We Collect
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Personal Information
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We may collect personally identifiable information, such as your name, email address, phone number,
                                billing and shipping addresses, payment information, and other information you provide when you
                                register for an account, place an order, or contact us.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Usage Information
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We automatically collect certain information about your device and how you interact with our website,
                                including your IP address, browser type, operating system, referring URLs, pages viewed, and the dates
                                and times of your visits.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Cookies and Tracking Technologies
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We use cookies and similar tracking technologies to track activity on our website and store certain
                                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        How We Use Your Information
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <Typography variant="body">
                                To provide, operate, and maintain our website and services
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                To process and fulfill your orders and transactions
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                To send you updates, promotional materials, and other information
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                To respond to your comments, questions, and provide customer service
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                To monitor and analyze usage and trends to improve our website and services
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body">
                                To detect, prevent, and address technical issues and security breaches
                            </Typography>
                        </li>
                    </ul>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Information Sharing and Disclosure
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body">
                            We may share information we have collected about you in certain situations:
                        </Typography>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Service Providers
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We may share your information with third-party service providers who perform services on our behalf,
                                such as payment processing, data analysis, email delivery, hosting services, customer service,
                                and marketing assistance.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Legal Requirements
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We may disclose your information if required to do so by law or in response to valid requests
                                by public authorities (e.g., a court or government agency).
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Business Transfers
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We may share or transfer your information in connection with, or during negotiations of,
                                any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Data Security
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        We use administrative, technical, and physical security measures to help protect your personal information.
                        While we have taken reasonable steps to secure the personal information you provide to us, please be aware
                        that despite our efforts, no security measures are perfect or impenetrable.
                    </Typography>
                    <Typography variant="body">
                        We cannot guarantee the security of your personal information, and you provide it at your own risk.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Your Rights
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body">
                            Depending on your location, you may have the following rights regarding your personal information:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    The right to access, update, or delete the information we have about you
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    The right to portability of your personal information
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    The right to withdraw consent for processing your personal information
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    The right to object to the processing of your personal information
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="body">
                            To exercise any of these rights, please contact us using the information provided below.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Contact Us
                    </Typography>
                    <div className="space-y-3">
                        <Typography variant="body">
                            If you have questions or comments about this Privacy Policy, please contact us at:
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