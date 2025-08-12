import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Accessibility page
 */
export default function AccessibilityPage() {
    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Accessibility Statement
                </Typography>
                <Typography variant="body" color="secondary">
                    Last updated: August 11, 2024
                </Typography>
            </div>

            <Card className="p-6 mb-8">
                <Typography variant="body" className="mb-4">
                    StoreFront is committed to ensuring digital accessibility for people with disabilities.
                    We are continually improving the user experience for everyone and applying the relevant
                    accessibility standards.
                </Typography>
                <Typography variant="body">
                    This accessibility statement applies to storefront.com and all related services.
                </Typography>
            </Card>

            <div className="space-y-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Our Commitment
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            We strive to make our website accessible to all users, including those with disabilities.
                            Our goal is to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                            standards.
                        </Typography>
                        <Typography variant="body" color="secondary">
                            We are committed to providing an inclusive and accessible experience for all customers,
                            regardless of their abilities or assistive technologies used.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Accessibility Features
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Keyboard Navigation
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Our website can be navigated using keyboard commands. Users can tab through interactive
                                elements and use standard keyboard shortcuts.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Screen Reader Compatibility
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Our website is designed to work with popular screen readers, providing alternative text
                                for images and proper heading structure for content.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Text Alternatives
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We provide alternative text for all meaningful images, graphics, and icons to ensure
                                users with visual impairments can understand the content.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Adjustable Text Size
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Users can adjust text size using browser controls or built-in zoom features to improve
                                readability.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Color Contrast
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We maintain sufficient color contrast between text and background elements to ensure
                                readability for users with visual impairments.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Technical Standards
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            We strive to conform to the following accessibility standards:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Section 508 of the Rehabilitation Act
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Americans with Disabilities Act (ADA) compliance
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="body" color="secondary">
                            These guidelines explain ways to make web content more accessible for people with
                            disabilities and user-friendly for all.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Limitations and Feedback
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            Despite our best efforts to ensure accessibility, there may be some limitations.
                            Below is a description of known limitations and potential solutions:
                        </Typography>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Third-Party Content
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Some content on our website is provided by third parties and may not fully conform
                                to our accessibility standards. We work with these providers to improve accessibility
                                where possible.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Complex Interactions
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Some complex interactive elements may require additional testing with assistive
                                technologies to ensure full accessibility.
                            </Typography>
                        </div>
                        <Typography variant="body" color="secondary">
                            We welcome your feedback on the accessibility of our website. If you encounter
                            accessibility barriers, please let us know.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Accessibility Assistance
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            If you need assistance accessing any content on our website or have questions about
                            our accessibility features, please contact us:
                        </Typography>
                        <div className="space-y-3">
                            <Typography variant="body">
                                StoreFront Accessibility Team<br />
                                accessibility@storefront.com<br />
                                1-800-STORE-01
                            </Typography>
                            <Typography variant="body" color="secondary">
                                We will do our best to respond to your request within 2 business days.
                            </Typography>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Compatibility with Browsers and Assistive Technology
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" color="secondary">
                            Our website is designed to be compatible with the following assistive technologies:
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Typography variant="body">
                                    Screen readers: NVDA, JAWS, VoiceOver
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Operating systems: Windows, macOS, iOS, Android
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body">
                                    Browsers: Chrome, Firefox, Safari, Edge
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="body" color="secondary">
                            We recommend using the latest versions of these technologies for the best experience.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Continuous Improvement
                    </Typography>
                    <Typography variant="body" color="secondary">
                        We are committed to continuous improvement of our website's accessibility.
                        We regularly audit our website and make updates to ensure compliance with
                        accessibility standards.
                    </Typography>
                </Card>
            </div>
        </div>
    )
}