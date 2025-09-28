/**
 * Simple in-memory cache utility for API responses
 * Can be easily replaced with Redis or other caching solutions
 */

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number // Time to live in milliseconds
}

class InMemoryCache {
    private cache = new Map<string, CacheEntry<any>>()

    /**
     * Get cached data if it exists and hasn't expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        const now = Date.now()
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key)
            return null
        }

        return entry.data
    }

    /**
     * Set data in cache with TTL
     */
    set<T>(key: string, data: T, ttlMs: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs
        })
    }

    /**
     * Delete a specific cache entry
     */
    delete(key: string): void {
        this.cache.delete(key)
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear()
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size
    }

    /**
     * Clean expired entries
     */
    clean(): void {
        const now = Date.now()
        const keysToDelete: string[] = []

        this.cache.forEach((entry, key) => {
            if (now - entry.timestamp > entry.ttl) {
                keysToDelete.push(key)
            }
        })

        keysToDelete.forEach(key => this.cache.delete(key))
    }
}

// Export singleton instance
export const cache = new InMemoryCache()

// Utility functions for common TTL values
export const CACHE_TTL = {
    PRODUCTS: 5 * 60 * 1000, // 5 minutes
    CATEGORIES: 10 * 60 * 1000, // 10 minutes
    SHORT: 60 * 1000, // 1 minute
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
} as const

// Helper function to generate cache key from request
export function generateCacheKey(url: string, params?: Record<string, any>): string {
    const baseKey = url.replace(/[^a-zA-Z0-9]/g, '_')
    if (!params) return baseKey

    const paramString = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

    return `${baseKey}_${paramString}`.replace(/[^a-zA-Z0-9_]/g, '_')
}