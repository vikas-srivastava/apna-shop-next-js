import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import { getCategories } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'

export default async function CategoriesPage() {
    // Fetch categories data
    const categoriesResponse = await getCategories()
    const categories = categoriesResponse.success ? categoriesResponse.data : []

    return (
        <div className="container-theme py-8">
            <div className="mb-8 text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Shop by Category
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    Browse our wide range of product categories, each carefully curated with the best items for your needs.
                </Typography>
            </div>

            {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            hover
                            padding="none"
                            className="animate-fade-in"
                        >
                            <Link href={`/products?category=${category.slug}`}>
                                <div className="relative aspect-square overflow-hidden rounded-t-theme-lg">
                                    <Image
                                        src={category.image || 'https://via.placeholder.com/400x300'}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                                        {category.name}
                                    </Typography>
                                    <Typography variant="caption" color="secondary">
                                        {category.description}
                                    </Typography>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Typography variant="h4" color="secondary" className="mb-4">
                        No categories found
                    </Typography>
                    <Typography variant="body" color="secondary">
                        Please check back later for updates.
                    </Typography>
                </div>
            )}
        </div>
    )
}