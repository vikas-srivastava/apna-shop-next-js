import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

/**
 * Store Locator page
 */
export default function StoresPage() {
    const stores = [
        {
            name: "StoreFront Flagship Store",
            address: "123 Commerce Street",
            city: "New York",
            state: "NY",
            zip: "10001",
            phone: "(212) 555-1234",
            hours: "Mon-Sat: 9AM-9PM, Sun: 10AM-6PM",
            services: ["Curbside Pickup", "Personal Shopping", "Styling Services"]
        },
        {
            name: "StoreFront Downtown",
            address: "456 Market Street",
            city: "San Francisco",
            state: "CA",
            zip: "94103",
            phone: "(415) 555-5678",
            hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-5PM",
            services: ["Curbside Pickup", "Personal Shopping"]
        },
        {
            name: "StoreFront Mall Location",
            address: "789 Shopping Center",
            city: "Chicago",
            state: "IL",
            zip: "60601",
            phone: "(312) 555-9012",
            hours: "Mon-Sun: 10AM-9PM",
            services: ["Curbside Pickup"]
        },
        {
            name: "StoreFront Outlet",
            address: "321 Discount Boulevard",
            city: "Austin",
            state: "TX",
            zip: "78701",
            phone: "(512) 555-3456",
            hours: "Mon-Sat: 9AM-10PM, Sun: 10AM-8PM",
            services: ["Curbside Pickup", "Outlet Pricing"]
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Store Locator
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    Find a StoreFront location near you. Visit our stores for exclusive in-person shopping experiences.
                </Typography>
            </div>

            <Card className="p-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Typography variant="subtitle" weight="semibold" className="mb-2">
                            Find Stores Near You
                        </Typography>
                        <Input
                            type="text"
                            placeholder="Enter your city, state, or zip code"
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button variant="primary" className="w-full">
                            Search
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {stores.map((store, index) => (
                    <Card key={index} className="p-6">
                        <Typography variant="h4" weight="bold" className="mb-2">
                            {store.name}
                        </Typography>
                        <div className="mb-4">
                            <Typography variant="body">
                                {store.address}
                            </Typography>
                            <Typography variant="body">
                                {store.city}, {store.state} {store.zip}
                            </Typography>
                            <Typography variant="body" className="mt-1">
                                {store.phone}
                            </Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Hours
                            </Typography>
                            <Typography variant="body" color="secondary">
                                {store.hours}
                            </Typography>
                        </div>
                        <div className="mb-6">
                            <Typography variant="subtitle" weight="semibold" className="mb-1">
                                Services
                            </Typography>
                            <div className="flex flex-wrap gap-2">
                                {store.services.map((service, serviceIndex) => (
                                    <span
                                        key={serviceIndex}
                                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" size="sm">
                                Get Directions
                            </Button>
                            <Button variant="secondary" size="sm">
                                Call Store
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6 mt-12">
                <Typography variant="h3" weight="semibold" className="mb-4">
                    Store Services
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Typography variant="subtitle" weight="semibold" className="mb-2">
                            Curbside Pickup
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Order online and pick up your items at the store without leaving your car.
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="subtitle" weight="semibold" className="mb-2">
                            Personal Shopping
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Work with our expert stylists to find the perfect items for your needs.
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="subtitle" weight="semibold" className="mb-2">
                            Styling Services
                        </Typography>
                        <Typography variant="body" color="secondary">
                            Professional styling consultations to help you create complete looks.
                        </Typography>
                    </div>
                </div>
            </Card>
        </div>
    )
}