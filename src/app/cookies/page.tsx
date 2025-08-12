import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Cookie Policy page
 */
export default function CookiesPage() {
    const cookies = [
        {
            name: "Essential Cookies",
            purpose: "Necessary for the website to function properly",
            examples: ["Session cookies", "Authentication cookies"],
            duration: "Session or until deleted"
        },
        {
            name: "Performance Cookies",
            purpose: "Help us understand how visitors interact with our website",
            examples: ["Analytics cookies", "Performance monitoring cookies"],
            duration: "Session to several years"
        },
        {
            name: "Functionality Cookies",
            purpose: "Enable enhanced functionality and personalization",
            examples: ["Language preference cookies", "Region selection cookies"],
            duration: "Session to several years"
        },
        {
            name: "Targeting Cookies",
            purpose: "Used to deliver relevant advertising to you",
            examples: ["Advertising cookies", "Retargeting cookies"],
            duration: "Session to several years"
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Cookie Policy
                </Typography>
                <Typography variant="body" color="secondary">
                    Last updated: August 11, 2024
                </Typography>
            </div>

            <Card className="p-6 mb-8">
                <Typography variant="body" className="mb-4">
                    This Cookie Policy explains what cookies are, how we use them, the types of cookies we use,
                    and your rights regarding cookies.
                </Typography>
                <Typography variant="body">
                    By using our website, you consent to the use of cookies in accordance with this policy.
                </Typography>
            </Card>

            <div className="space-y-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        What Are Cookies?
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-4">
                        Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                        They are widely used to make websites work more efficiently and to provide information to the owners
                        of the site.
                    </Typography>
                    <Typography variant="body" color="secondary">
                        Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device for a
                        specified period of time, while session cookies are deleted when you close your browser.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        How We Use Cookies
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            We use cookies to:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    Enable certain functions of our website
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Provide analytics to help us understand how visitors use our website
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Remember your preferences and settings
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Deliver personalized content and advertising
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Improve your browsing experience
                                </Typography>
                            </li>
                        </ul>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Types of Cookies We Use
                    </Typography>
                    <div className="space-y-6">
                        {cookies.map((cookie, index) => (
                            <div key={index} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    {cookie.name}
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-2">
                                    {cookie.purpose}
                                </Typography>
                                <div className="mb-2">
                                    <Typography variant="caption" weight="semibold">
                                        Examples:
                                    </Typography>
                                    <ul className="list-disc pl-6">
                                        {cookie.examples.map((example, exampleIndex) => (
                                            <li key={exampleIndex}>
                                                <Typography variant="caption" color="secondary">
                                                    {example}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Typography variant="caption" color="secondary">
                                    Duration: {cookie.duration}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Third-Party Cookies
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-4">
                        In some special cases, we also use cookies provided by trusted third parties. The following
                        section details which third-party cookies you might encounter through our website.
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="subtitle" weight="semibold">
                                Analytics
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We use Google Analytics to analyze how visitors use our website. These cookies collect
                                information in the aggregate to help us improve our website and user experience.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold">
                                Advertising
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We may use third-party advertising cookies to deliver relevant advertisements to you
                                based on your browsing behavior and interests.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Managing Cookies
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            You can control and/or delete cookies as you wish. You can delete all cookies that are
                            already on your computer, and you can set most browsers to prevent them from being placed.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            If you disable or refuse cookies, please note that some parts of our website may become
                            inaccessible or not function properly.
                        </Typography>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                How to Manage Cookies in Popular Browsers:
                            </Typography>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <Typography variant="body">
                                        <a href="https://support.google.com/chrome/answer/95647" className="text-primary-600 hover:underline">
                                            Chrome
                                        </a>
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body">
                                        <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-primary-600 hover:underline">
                                            Firefox
                                        </a>
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body">
                                        <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary-600 hover:underline">
                                            Safari
                                        </a>
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body">
                                        <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" className="text-primary-600 hover:underline">
                                            Edge
                                        </a>
                                    </Typography>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Changes to This Cookie Policy
                    </Typography>
                    <Typography variant="body" color="secondary">
                        We may update our Cookie Policy from time to time. We will notify you of any changes by
                        posting the new Cookie Policy on this page and updating the "Last updated" date.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Contact Us
                    </Typography>
                    <div className="space-y-3">
                        <Typography variant="body" color="secondary">
                            If you have any questions about this Cookie Policy, please contact us at:
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