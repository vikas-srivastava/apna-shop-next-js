import { NextRequest, NextResponse } from 'next/server'
import { mockStorage } from '@/lib/mock-data'
import { Address } from '@/lib/types'

// Helper function to simulate API delay
function mockDelay(minMs = 200, maxMs = 600): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
}

// Helper function to get user ID (simplified for mock)
function getUserId(): string {
    return 'default-user'
}

// GET /api/addresses - Get user addresses
export async function GET() {
    try {
        await mockDelay()

        const userId = getUserId()
        const userAddresses = mockStorage.addresses.get(userId) || []

        return NextResponse.json({
            success: true,
            data: userAddresses,
            message: 'Addresses retrieved successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve addresses',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// POST /api/addresses - Add new address
export async function POST(request: NextRequest) {
    try {
        await mockDelay()

        const body = await request.json()
        const {
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            zipCode,
            country,
            phone,
            isDefault = false
        } = body

        if (!firstName || !lastName || !address1 || !city || !state || !zipCode || !country) {
            return NextResponse.json({
                success: false,
                message: 'Required address fields are missing',
                error: 'Validation error'
            }, { status: 422 })
        }

        const userId = getUserId()
        const userAddresses = mockStorage.addresses.get(userId) || []

        // If this is the default address, unset other defaults
        if (isDefault) {
            userAddresses.forEach(addr => addr.isDefault = false)
        }

        // Create new address
        const newAddress: Address = {
            id: `addr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            zipCode,
            country,
            phone,
            isDefault
        }

        userAddresses.push(newAddress)
        mockStorage.addresses.set(userId, userAddresses)

        return NextResponse.json({
            success: true,
            data: newAddress,
            message: 'Address added successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to add address',
            error: 'Internal server error'
        }, { status: 500 })
    }
}