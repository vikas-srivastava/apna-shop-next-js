import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetailTemplate } from '@/components/templates/ProductDetailTemplate'
import { getProduct } from '@/lib/api'

interface ProductPageProps {
    params: {
        slug: string
    }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const response = await getProduct(params.slug)

    if (!response.success || !response.data) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        }
    }

    const product = response.data

    return {
        title: `${product.name} | StoreFront`,
        description: product.description,
        keywords: product.tags.join(', '),
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images.map(image => ({
                url: image,
                width: 600,
                height: 600,
                alt: product.name,
            })),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: product.images[0],
        },
    }
}

/**
 * Product detail page component
 */
export default async function ProductPage({ params }: ProductPageProps) {
    const response = await getProduct(params.slug)

    if (!response.success || !response.data) {
        notFound()
    }

    return <ProductDetailTemplate product={response.data} />
}