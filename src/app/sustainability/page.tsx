import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Sustainability page
 */
export default function SustainabilityPage() {
    const initiatives = [
        {
            title: "Carbon Neutral Shipping",
            description: "All shipments are carbon neutral through our partnership with verified environmental organizations.",
            progress: 100
        },
        {
            title: "Sustainable Packaging",
            description: "100% of our packaging is recyclable or biodegradable, with 85% made from recycled materials.",
            progress: 85
        },
        {
            title: "Renewable Energy",
            description: "Our facilities are powered by 100% renewable energy sources including solar and wind power.",
            progress: 100
        },
        {
            title: "Waste Reduction",
            description: "We've reduced packaging waste by 60% through optimized design and material selection.",
            progress: 60
        }
    ]

    const goals = [
        {
            year: "2024",
            title: "Plastic-Free Packaging",
            description: "Eliminate all single-use plastics from our packaging by the end of 2024."
        },
        {
            year: "2025",
            title: "Zero Waste Facilities",
            description: "Achieve zero waste to landfill status for all our distribution centers."
        },
        {
            year: "2026",
            title: "Carbon Negative",
            description: "Become a carbon negative company through carbon capture and storage initiatives."
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Sustainability
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    We're committed to creating a more sustainable future through responsible business practices
                    and environmental stewardship.
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Our Commitment
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        At StoreFront, we believe that businesses have a responsibility to protect our planet for future generations.
                        That's why we've made sustainability a core part of our mission and operations.
                    </Typography>
                    <Typography variant="body">
                        From the products we source to the packaging we use, every decision we make considers its environmental
                        impact. We're constantly innovating to find better, more sustainable solutions that don't compromise
                        on quality or customer experience.
                    </Typography>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Environmental Impact
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <Typography variant="body" weight="semibold">
                                    Carbon Footprint Reduction
                                </Typography>
                                <Typography variant="body" color="primary">
                                    45%
                                </Typography>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <Typography variant="body" weight="semibold">
                                    Renewable Energy Usage
                                </Typography>
                                <Typography variant="body" color="primary">
                                    100%
                                </Typography>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <Typography variant="body" weight="semibold">
                                    Sustainable Packaging
                                </Typography>
                                <Typography variant="body" color="primary">
                                    85%
                                </Typography>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-12">
                <Typography variant="h2" weight="bold" className="mb-6 text-center">
                    Current Initiatives
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {initiatives.map((initiative, index) => (
                        <Card key={index} className="p-6">
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                {initiative.title}
                            </Typography>
                            <Typography variant="body" color="secondary" className="mb-4">
                                {initiative.description}
                            </Typography>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Typography variant="caption" color="secondary">
                                        Progress
                                    </Typography>
                                    <Typography variant="caption" color="primary">
                                        {initiative.progress}%
                                    </Typography>
                                </div>
                                <div className="w-full bg-secondary-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${initiative.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <Typography variant="h2" weight="bold" className="mb-6 text-center">
                    Future Goals
                </Typography>
                <Card className="p-6">
                    <div className="space-y-6">
                        {goals.map((goal, index) => (
                            <div key={index} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="md:w-24 mb-2 md:mb-0">
                                        <Typography variant="subtitle" weight="bold" color="primary">
                                            {goal.year}
                                        </Typography>
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="subtitle" weight="semibold" className="mb-1">
                                            {goal.title}
                                        </Typography>
                                        <Typography variant="body" color="secondary">
                                            {goal.description}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="text-center">
                <Typography variant="body" className="mb-6 max-w-2xl mx-auto">
                    Sustainability is an ongoing journey, and we're committed to continuous improvement.
                    We regularly publish detailed sustainability reports to track our progress and hold ourselves accountable.
                </Typography>
                <a href="#" className="inline-block text-primary-600 hover:underline font-medium">
                    Download Our 2024 Sustainability Report
                </a>
            </div>
        </div>
    )
}