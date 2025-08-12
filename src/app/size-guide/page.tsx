import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'

/**
 * Size Guide page
 */
export default function SizeGuidePage() {
    const clothingSizes = [
        { size: "XS", chest: "32-34\"", waist: "26-28\"", hips: "34-36\"" },
        { size: "S", chest: "35-37\"", waist: "29-31\"", hips: "37-39\"" },
        { size: "M", chest: "38-40\"", waist: "32-34\"", hips: "40-42\"" },
        { size: "L", chest: "41-43\"", waist: "35-37\"", hips: "43-45\"" },
        { size: "XL", chest: "44-46\"", waist: "38-40\"", hips: "46-48\"" },
        { size: "XXL", chest: "47-49\"", waist: "41-43\"", hips: "49-51\"" }
    ]

    const shoeSizes = [
        { us: "7", uk: "6", eu: "40", inches: "9.25\"", cm: "23.5" },
        { us: "8", uk: "7", eu: "41", inches: "9.5\"", cm: "24.1" },
        { us: "9", uk: "8", eu: "42", inches: "9.75\"", cm: "24.8" },
        { us: "10", uk: "9", eu: "43", inches: "10\"", cm: "25.4" },
        { us: "11", uk: "10", eu: "44", inches: "10.25\"", cm: "26.0" },
        { us: "12", uk: "11", eu: "45", inches: "10.5\"", cm: "26.7" }
    ]

    return (
        <div className="container-theme py-8">
            <div className="mb-8">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Size Guide
                </Typography>
                <Typography variant="body" color="secondary">
                    Find your perfect fit with our size guide
                </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-6">
                        Clothing Sizes
                    </Typography>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-secondary-200">
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            Size
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            Chest
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            Waist
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            Hips
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {clothingSizes.map((size, index) => (
                                    <tr key={index} className="border-b border-secondary-100 last:border-0">
                                        <td className="py-3">
                                            <Typography variant="body" weight="semibold">
                                                {size.size}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.chest}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.waist}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.hips}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 p-4 bg-secondary-50 rounded-theme-md">
                        <Typography variant="caption" color="secondary">
                            <strong>How to measure:</strong> Use a flexible tape measure to take your measurements.
                            For chest, measure around the fullest part of your chest. For waist, measure around your natural waistline.
                            For hips, measure around the fullest part of your hips.
                        </Typography>
                    </div>
                </Card>

                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-6">
                        Shoe Sizes
                    </Typography>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-secondary-200">
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            US
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            UK
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            EU
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            Inches
                                        </Typography>
                                    </th>
                                    <th className="text-left py-3">
                                        <Typography variant="subtitle" weight="semibold">
                                            CM
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shoeSizes.map((size, index) => (
                                    <tr key={index} className="border-b border-secondary-100 last:border-0">
                                        <td className="py-3">
                                            <Typography variant="body" weight="semibold">
                                                {size.us}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.uk}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.eu}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.inches}
                                            </Typography>
                                        </td>
                                        <td className="py-3">
                                            <Typography variant="body">
                                                {size.cm}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 p-4 bg-secondary-50 rounded-theme-md">
                        <Typography variant="caption" color="secondary">
                            <strong>How to measure:</strong> Stand on a flat surface with your heel against a wall.
                            Place a ruler or tape measure on the floor against the wall and measure from the wall to
                            the longest toe on your foot.
                        </Typography>
                    </div>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="p-6">
                    <Typography variant="h3" weight="semibold" className="mb-4">
                        Fit Tips
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                Know Your Measurements
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Take accurate measurements before purchasing. Use a flexible tape measure for best results.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                Check Product Descriptions
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Each product page includes specific sizing information. Look for fit notes and customer reviews.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle" weight="semibold" className="mb-2">
                                Consider the Fit
                            </Typography>
                            <Typography variant="body" color="secondary">
                                Some items run larger or smaller than standard sizes. Check the fit guide on each product page.
                            </Typography>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}