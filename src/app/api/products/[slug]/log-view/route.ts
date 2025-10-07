import { NextRequest, NextResponse } from 'next/server'
import { logProductView } from '@/lib/third-party-api'

/**
 * POST /api/products/[slug]/log-view - Log product view
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const response = await logProductView(params.slug)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error || 'Failed to log product view' },
                { status: 500 }
            )
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}