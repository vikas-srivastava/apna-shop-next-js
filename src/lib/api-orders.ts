import { mockOrders } from './mock-data'

export async function getOrders() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
        success: true,
        data: mockOrders
    }
}