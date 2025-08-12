import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Press page
 */
export default function PressPage() {
    const pressReleases = [
        {
            title: "StoreFront Announces Record Q2 Revenue Growth",
            date: "June 15, 2024",
            summary: "E-commerce platform reports 45% year-over-year revenue increase driven by expansion into new markets."
        },
        {
            title: "New Partnership with Leading Logistics Provider",
            date: "May 3, 2024",
            summary: "Strategic alliance will enhance delivery speed and customer experience across all regions."
        },
        {
            title: "StoreFront Launches Sustainable Packaging Initiative",
            date: "April 12, 2024",
            summary: "Company commits to 100% recyclable packaging by end of 2024 as part of environmental responsibility program."
        },
        {
            title: "Mobile App Download Milestone Reached",
            date: "March 8, 2024",
            summary: "StoreFront mobile application surpasses 10 million downloads, becoming top-rated shopping app."
        }
    ]

    const mediaContacts = [
        {
            name: "Sarah Johnson",
            title: "Head of Communications",
            email: "press@storefront.com",
            phone: "1-800-STORE-01 ext. 2234"
        },
        {
            name: "Michael Chen",
            title: "Senior PR Manager",
            email: "michael.chen@storefront.com",
            phone: "1-800-STORE-01 ext. 2235"
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Press & Media
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    Stay up to date with the latest news, announcements, and press releases from StoreFront.
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <Typography variant="h2" weight="bold" className="mb-6">
                        Latest Press Releases
                    </Typography>
                    <div className="space-y-6">
                        {pressReleases.map((release, index) => (
                            <Card key={index} className="p-6">
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    {release.title}
                                </Typography>
                                <Typography variant="caption" color="secondary" className="mb-3">
                                    {release.date}
                                </Typography>
                                <Typography variant="body" className="mb-4">
                                    {release.summary}
                                </Typography>
                                <Button variant="outline">
                                    Read Full Release
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                <div>
                    <Card className="p-6 mb-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Media Resources
                        </Typography>
                        <div className="space-y-4">
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Company Logo
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-2">
                                    High-resolution versions of our logo for press use.
                                </Typography>
                                <Button variant="secondary" size="sm">
                                    Download Logo Kit
                                </Button>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Brand Guidelines
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-2">
                                    Official brand guidelines and usage policies.
                                </Typography>
                                <Button variant="secondary" size="sm">
                                    View Guidelines
                                </Button>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold">
                                    Executive Bios
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-2">
                                    Biographies of our leadership team.
                                </Typography>
                                <Button variant="secondary" size="sm">
                                    Download Bios
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Media Contacts
                        </Typography>
                        <div className="space-y-4">
                            {mediaContacts.map((contact, index) => (
                                <div key={index}>
                                    <Typography variant="subtitle" weight="semibold">
                                        {contact.name}
                                    </Typography>
                                    <Typography variant="body" color="secondary">
                                        {contact.title}
                                    </Typography>
                                    <Typography variant="body" className="mt-1">
                                        {contact.email}
                                    </Typography>
                                    <Typography variant="body">
                                        {contact.phone}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <Card className="p-6">
                <Typography variant="h2" weight="bold" className="mb-4">
                    Company Facts
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <Typography variant="h3" weight="bold" color="primary">
                            5M+
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Active Customers
                        </Typography>
                    </div>
                    <div className="text-center">
                        <Typography variant="h3" weight="bold" color="primary">
                            150+
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Countries Served
                        </Typography>
                    </div>
                    <div className="text-center">
                        <Typography variant="h3" weight="bold" color="primary">
                            2010
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Founded
                        </Typography>
                    </div>
                    <div className="text-center">
                        <Typography variant="h3" weight="bold" color="primary">
                            1.2B
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Annual Revenue
                        </Typography>
                    </div>
                </div>
            </Card>
        </div>
    )
}