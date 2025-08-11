import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Users, Target, Zap, Heart } from 'lucide-react'

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'Customer Focus',
            description: 'We put our customers at the heart of everything we do, ensuring exceptional service and quality products.'
        },
        {
            icon: Target,
            title: 'Quality',
            description: 'We are committed to providing only the highest quality products that meet our rigorous standards.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We continuously innovate to bring you the latest and greatest products in the market.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We believe in building a strong community of customers and partners who share our values.'
        }
    ]

    return (
        <div className="container-theme py-8 space-y-16">
            {/* Hero Section */}
            <section className="text-center py-12">
                <Typography variant="h1" weight="bold" className="mb-6">
                    About StoreFront
                </Typography>
                <Typography variant="body" className="text-xl max-w-3xl mx-auto mb-8">
                    We're on a mission to revolutionize the way you shop online. Since our founding,
                    we've been dedicated to providing exceptional products and outstanding customer service.
                </Typography>
            </section>

            {/* Our Story */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <Typography variant="h2" weight="bold" className="mb-6">
                        Our Story
                    </Typography>
                    <div className="space-y-4">
                        <Typography variant="body" className="mb-4">
                            Founded in 2020, StoreFront began with a simple idea: to make high-quality products
                            accessible to everyone, everywhere. What started as a small online shop has grown
                            into a comprehensive e-commerce platform serving customers worldwide.
                        </Typography>
                        <Typography variant="body" className="mb-4">
                            Our team of passionate professionals works tirelessly to curate the best products,
                            negotiate the best prices, and provide an unparalleled shopping experience.
                            We believe that shopping should be easy, enjoyable, and rewarding.
                        </Typography>
                        <Typography variant="body">
                            Today, we're proud to serve thousands of customers and partner with hundreds of
                            brands who share our commitment to quality and customer satisfaction.
                        </Typography>
                    </div>
                </div>
                <div className="bg-secondary-100 rounded-theme-lg h-96 flex items-center justify-center">
                    <div className="text-center p-8">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Our Team
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Passionate professionals dedicated to your satisfaction
                        </Typography>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section>
                <div className="text-center mb-12">
                    <Typography variant="h2" weight="bold" className="mb-4">
                        Our Values
                    </Typography>
                    <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                        These core principles guide everything we do, from product selection to customer service.
                    </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <Card key={index} className="text-center p-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <Typography variant="h4" weight="bold" className="mb-3">
                                    {value.title}
                                </Typography>
                                <Typography variant="body" color="secondary">
                                    {value.description}
                                </Typography>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* Our Mission */}
            <section className="bg-primary-50 rounded-theme-lg p-8 md:p-12">
                <div className="max-w-4xl mx-auto text-center">
                    <Typography variant="h2" weight="bold" className="mb-6">
                        Our Mission
                    </Typography>
                    <Typography variant="h4" className="mb-6">
                        "To make quality products accessible to everyone while providing an exceptional
                        shopping experience that delights our customers."
                    </Typography>
                    <Typography variant="body" className="text-lg">
                        We're committed to sustainability, ethical business practices, and giving back
                        to the communities we serve. Every purchase you make helps us continue this mission.
                    </Typography>
                </div>
            </section>
        </div>
    )
}