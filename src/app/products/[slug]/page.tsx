import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getProduct } from '@/lib/api'

// Lazy load the product detail template for better code splitting
const ProductDetailTemplate = dynamic(() => import('@/components/templates/ProductDetailTemplate').then(mod => ({ default: mod.ProductDetailTemplate })), {
    loading: () => <div className="container-theme py-8"><div className="text-center">Loading product...</div></div>
})

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params
    const response = await getProduct(slug)

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
        keywords: (product.tags && product.tags.length > 0) ? product.tags.join(', ') : 'product',
        openGraph: {
            title: product.name,
            description: product.description,
            images: (product.images && product.images.length > 0)
                ? product.images.map(image => ({
                    url: image,
                    width: 600,
                    height: 600,
                    alt: product.name,
                }))
                : [{
                    url: 'https://via.placeholder.com/600x600/cccccc/969696?text=Product+Image',
                    width: 600,
                    height: 600,
                    alt: product.name,
                }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: (product.images && product.images.length > 0)
                ? product.images[0]
                : 'https://via.placeholder.com/600x600/cccccc/969696?text=Product+Image',
        },
    }
}

/**
 * Product detail page component
 */
export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const response = await getProduct(slug)

    if (!response.success || !response.data) {
        notFound()
    }

    return <ProductDetailTemplate product={response.data} />
}