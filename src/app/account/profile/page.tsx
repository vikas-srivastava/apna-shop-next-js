import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

/**
 * Profile page
 */
export default function ProfilePage() {
    return (
        <div className="container-theme py-8">
            <Typography variant="h1" weight="bold" className="mb-8">
                My Profile
            </Typography>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Personal Information
                        </Typography>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        First Name
                                    </Typography>
                                    <Input
                                        type="text"
                                        defaultValue="John"
                                    />
                                </div>
                                <div>
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        Last Name
                                    </Typography>
                                    <Input
                                        type="text"
                                        defaultValue="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Email Address
                                </Typography>
                                <Input
                                    type="email"
                                    defaultValue="john.doe@example.com"
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Phone Number
                                </Typography>
                                <Input
                                    type="tel"
                                    defaultValue="(555) 123-4567"
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Date of Birth
                                </Typography>
                                <Input
                                    type="date"
                                    defaultValue="1990-01-01"
                                />
                            </div>
                            <div className="pt-4">
                                <Button variant="primary">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Password Change */}
                <div>
                    <Card className="p-6">
                        <Typography variant="h3" weight="bold" className="mb-6">
                            Change Password
                        </Typography>
                        <form className="space-y-4">
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Current Password
                                </Typography>
                                <Input
                                    type="password"
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    New Password
                                </Typography>
                                <Input
                                    type="password"
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle" weight="semibold" className="mb-2">
                                    Confirm New Password
                                </Typography>
                                <Input
                                    type="password"
                                />
                            </div>
                            <div className="pt-4">
                                <Button variant="primary">
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}