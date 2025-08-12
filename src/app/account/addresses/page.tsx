import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

/**
 * Addresses page
 */
export default function AddressesPage() {
    // Mock address data
    const addresses = [
        {
            id: "1",
            name: "John Doe",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
            isDefault: true
        },
        {
            id: "2",
            name: "John Doe",
            street: "456 Park Avenue",
            city: "New York",
            state: "NY",
            zip: "10022",
            country: "United States",
            isDefault: false
        }
    ]

    return (
        <div className="container-theme py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <Typography variant="h1" weight="bold">
                    My Addresses
                </Typography>
                <Button variant="primary">
                    Add New Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card className="p-12 text-center">
                    <Typography variant="h3" weight="bold" className="mb-4">
                        No Addresses Yet
                    </Typography>
                    <Typography variant="body" color="secondary" className="mb-6">
                        You haven't added any addresses yet.
                    </Typography>
                    <Button variant="primary">
                        Add Your First Address
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <Card key={address.id} className="p-6">
                            {address.isDefault && (
                                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full mb-4">
                                    Default Address
                                </div>
                            )}
                            <div className="mb-4">
                                <Typography variant="subtitle" weight="semibold">
                                    {address.name}
                                </Typography>
                                <Typography variant="body">
                                    {address.street}
                                </Typography>
                                <Typography variant="body">
                                    {address.city}, {address.state} {address.zip}
                                </Typography>
                                <Typography variant="body">
                                    {address.country}
                                </Typography>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                                {!address.isDefault && (
                                    <Button variant="secondary" size="sm">
                                        Set as Default
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                    Remove
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Add Address Form */}
                    <Card className="p-6 border-2 border-dashed border-secondary-300">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Add New Address
                        </Typography>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        First Name
                                    </Typography>
                                    <Input
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        Last Name
                                    </Typography>
                                    <Input
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography variant="caption" weight="semibold" className="mb-1">
                                    Street Address
                                </Typography>
                                <Input
                                    type="text"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        City
                                    </Typography>
                                    <Input
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        State
                                    </Typography>
                                    <Input
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <Typography variant="caption" weight="semibold" className="mb-1">
                                        ZIP Code
                                    </Typography>
                                    <Input
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography variant="caption" weight="semibold" className="mb-1">
                                    Country
                                </Typography>
                                <select className="input w-full">
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>United Kingdom</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="default"
                                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="default" className="text-sm text-secondary-700">
                                    Set as default address
                                </label>
                            </div>
                            <div className="pt-4">
                                <Button variant="primary">
                                    Add Address
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}