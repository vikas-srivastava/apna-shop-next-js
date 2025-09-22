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

// PUT /api/addresses/[id] - Update address
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await mockDelay()

        const { id } = params
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

        const userId = getUserId()
        const userAddresses = mockStorage.addresses.get(userId) || []

        const addressIndex = userAddresses.findIndex((addr: Address) => addr.id === id)

        if (addressIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'Address not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            userAddresses.forEach(addr => addr.isDefault = false)
        }

        // Update address
        userAddresses[addressIndex] = {
            ...userAddresses[addressIndex],
            firstName: firstName || userAddresses[addressIndex].firstName,
            lastName: lastName || userAddresses[addressIndex].lastName,
            address1: address1 || userAddresses[addressIndex].address1,
            address2: address2 !== undefined ? address2 : userAddresses[addressIndex].address2,
            city: city || userAddresses[addressIndex].city,
            state: state || userAddresses[addressIndex].state,
            zipCode: zipCode || userAddresses[addressIndex].zipCode,
            country: country || userAddresses[addressIndex].country,
            phone: phone !== undefined ? phone : userAddresses[addressIndex].phone,
            isDefault
        }

        mockStorage.addresses.set(userId, userAddresses)

        return NextResponse.json({
            success: true,
            data: userAddresses[addressIndex],
            message: 'Address updated successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update address',
            error: 'Internal server error'
        }, { status: 500 })
    }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await mockDelay()

        const { id } = params

        const userId = getUserId()
        const userAddresses = mockStorage.addresses.get(userId) || []

        const addressIndex = userAddresses.findIndex((addr: Address) => addr.id === id)

        if (addressIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'Address not found',
                error: 'Not found'
            }, { status: 404 })
        }

        // Don't allow deleting the default address if there are multiple addresses
        const addressToDelete = userAddresses[addressIndex]
        if (addressToDelete.isDefault && userAddresses.length > 1) {
            return NextResponse.json({
                success: false,
                message: 'Cannot delete default address. Please set another address as default first.',
                error: 'Validation error'
            }, { status: 422 })
        }

        // Remove address
        userAddresses.splice(addressIndex, 1)

        // If we deleted the default and there are still addresses, make the first one default
        if (addressToDelete.isDefault && userAddresses.length > 0) {
            userAddresses[0].isDefault = true
        }

        mockStorage.addresses.set(userId, userAddresses)

        return NextResponse.json({
            success: true,
            message: 'Address deleted successfully'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to delete address',
            error: 'Internal server error'
        }, { status: 500 })
    }
}