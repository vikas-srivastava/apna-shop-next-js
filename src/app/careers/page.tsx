import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'

/**
 * Careers page
 */
export default function CareersPage() {
    const benefits = [
        {
            title: "Competitive Salary",
            description: "We offer competitive compensation packages based on experience and performance."
        },
        {
            title: "Health & Wellness",
            description: "Comprehensive health, dental, and vision insurance for you and your family."
        },
        {
            title: "Work-Life Balance",
            description: "Flexible work arrangements and generous PTO policies."
        },
        {
            title: "Professional Development",
            description: "Ongoing training, conferences, and educational opportunities."
        },
        {
            title: "Team Building",
            description: "Regular team events, outings, and company-sponsored activities."
        },
        {
            title: "401(k) Matching",
            description: "We match your 401(k) contributions to help you plan for the future."
        }
    ]

    const positions = [
        {
            title: "Frontend Developer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time"
        },
        {
            title: "Product Manager",
            department: "Product",
            location: "New York, NY",
            type: "Full-time"
        },
        {
            title: "UX Designer",
            department: "Design",
            location: "San Francisco, CA",
            type: "Full-time"
        },
        {
            title: "Marketing Specialist",
            department: "Marketing",
            location: "Chicago, IL",
            type: "Full-time"
        },
        {
            title: "Customer Support Representative",
            department: "Support",
            location: "Remote",
            type: "Part-time"
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Join Our Team
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    We're looking for passionate, talented individuals to help us build the future of e-commerce.
                    Join us in creating exceptional shopping experiences for our customers.
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Our Culture
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        At StoreFront, we believe in fostering an environment where innovation thrives and every team member
                        can grow both personally and professionally. We value collaboration, creativity, and a commitment
                        to excellence.
                    </Typography>
                    <Typography variant="body">
                        We're a diverse team of problem solvers, creators, and thinkers who are passionate about
                        transforming the way people shop online. Join us in making a difference in the world of e-commerce.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Why Work With Us?
                    </Typography>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <Typography variant="body">
                                Fast-paced environment with opportunities for growth
                            </Typography>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <Typography variant="body">
                                Cutting-edge technology stack and modern development practices
                            </Typography>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <Typography variant="body">
                                Collaborative team culture with regular feedback and recognition
                            </Typography>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <Typography variant="body">
                                Opportunity to work on products that impact millions of customers
                            </Typography>
                        </li>
                    </ul>
                </Card>
            </div>

            <div className="mb-12">
                <Typography variant="h2" weight="bold" className="mb-6 text-center">
                    Employee Benefits
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <Card key={index} className="p-6">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                {benefit.title}
                            </Typography>
                            <Typography variant="body" color="secondary">
                                {benefit.description}
                            </Typography>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <Typography variant="h2" weight="bold" className="mb-6 text-center">
                    Open Positions
                </Typography>
                <Card className="p-6">
                    <div className="space-y-6">
                        {positions.map((position, index) => (
                            <div key={index} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <Typography variant="subtitle" weight="semibold">
                                            {position.title}
                                        </Typography>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                                                {position.department}
                                            </span>
                                            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                                                {position.location}
                                            </span>
                                            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <Button variant="primary">
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="mt-12 text-center">
                <Typography variant="body" className="mb-6">
                    Don't see a position that matches your skills? We're always looking for talented individuals.
                </Typography>
                <Button variant="secondary" size="lg">
                    Send Us Your Resume
                </Button>
            </div>
        </div>
    )
}