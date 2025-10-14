/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by temporarily stopping requests to failing services
 */

export interface CircuitBreakerConfig {
    failureThreshold: number; // Number of failures before opening circuit
    recoveryTimeout: number; // Time in ms before attempting to close circuit
    monitoringPeriod: number; // Time window in ms for tracking failures
    successThreshold: number; // Number of successes needed to close circuit
}

export enum CircuitState {
    CLOSED = 'CLOSED',     // Normal operation
    OPEN = 'OPEN',         // Circuit is open, failing fast
    HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerStats {
    state: CircuitState;
    failures: number;
    successes: number;
    lastFailureTime: number | null;
    lastSuccessTime: number | null;
    nextAttemptTime: number | null;
}

export class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failures: number = 0;
    private successes: number = 0;
    private lastFailureTime: number | null = null;
    private lastSuccessTime: number | null = null;
    private nextAttemptTime: number | null = null;

    constructor(
        private name: string,
        private config: CircuitBreakerConfig
    ) {
        // Cleanup is manual - call cleanup() when needed
    }
    /**
     * Execute a function with circuit breaker protection
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.state = CircuitState.HALF_OPEN;
                this.log(`Circuit breaker ${this.name} entering HALF_OPEN state`);
            } else {
                throw new Error(`Circuit breaker ${this.name} is OPEN`);
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    /**
     * Handle successful execution
     */
    private onSuccess(): void {
        this.successes++;
        this.lastSuccessTime = Date.now();

        if (this.state === CircuitState.HALF_OPEN) {
            if (this.successes >= this.config.successThreshold) {
                this.reset();
            }
        } else {
            // Reset failure count on success in CLOSED state
            this.failures = 0;
        }
    }

    /**
     * Handle failed execution
     */
    private onFailure(): void {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.state === CircuitState.HALF_OPEN) {
            // Go back to OPEN state on failure in HALF_OPEN
            this.open();
        } else if (this.failures >= this.config.failureThreshold) {
            this.open();
        }
    }

    /**
     * Open the circuit
     */
    private open(): void {
        this.state = CircuitState.OPEN;
        this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
        this.log(`Circuit breaker ${this.name} opened`);
    }

    /**
     * Reset the circuit to CLOSED state
     */
    private reset(): void {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.nextAttemptTime = null;
        this.log(`Circuit breaker ${this.name} reset to CLOSED`);
    }

    /**
     * Check if we should attempt to reset the circuit
     */
    private shouldAttemptReset(): boolean {
        return this.nextAttemptTime !== null && Date.now() >= this.nextAttemptTime;
    }

    /**
     * Clean up old failure records outside the monitoring period
     */
    private cleanup(): void {
        const now = Date.now();
        const monitoringStart = now - this.config.monitoringPeriod;

        // Reset counters if outside monitoring period
        if (this.lastFailureTime && this.lastFailureTime < monitoringStart) {
            this.failures = 0;
        }

        if (this.lastSuccessTime && this.lastSuccessTime < monitoringStart) {
            this.successes = 0;
        }
    }

    /**
     * Get current circuit breaker statistics
     */
    getStats(): CircuitBreakerStats {
        return {
            state: this.state,
            failures: this.failures,
            successes: this.successes,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            nextAttemptTime: this.nextAttemptTime,
        };
    }

    /**
     * Get current state
     */
    getState(): CircuitState {
        return this.state;
    }

    /**
     * Force the circuit to a specific state (for testing/admin purposes)
     */
    forceState(state: CircuitState): void {
        this.state = state;
        this.log(`Circuit breaker ${this.name} forced to ${state}`);
    }

    /**
     * Log circuit breaker events
     */
    private log(message: string): void {
        console.log(`[CIRCUIT_BREAKER:${this.name}] ${message}`);
    }
}

/**
 * Circuit Breaker Registry
 * Manages multiple circuit breakers for different services
 */
export class CircuitBreakerRegistry {
    private static instance: CircuitBreakerRegistry;
    private breakers: Map<string, CircuitBreaker> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    private constructor() {
        // Automatically clean up breakers periodically
        this.cleanupInterval = setInterval(() => {
            for (const breaker of this.breakers.values()) {
                (breaker as any).cleanup();
            }
        }, 60000); // Run cleanup every minute
    }

    static getInstance(): CircuitBreakerRegistry {
        if (!CircuitBreakerRegistry.instance) {
            CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
        }
        return CircuitBreakerRegistry.instance;
    }

    /**
     * Get or create a circuit breaker for a service
     */
    getBreaker(
        name: string,
        config: CircuitBreakerConfig = {
            failureThreshold: 5,
            recoveryTimeout: 60000, // 1 minute
            monitoringPeriod: 300000, // 5 minutes
            successThreshold: 3,
        }
    ): CircuitBreaker {
        if (!this.breakers.has(name)) {
            this.breakers.set(name, new CircuitBreaker(name, config));
        }
        return this.breakers.get(name)!;
    }

    /**
     * Get all circuit breaker statistics
     */
    getAllStats(): Record<string, CircuitBreakerStats> {
        const stats: Record<string, CircuitBreakerStats> = {};
        for (const [name, breaker] of this.breakers) {
            stats[name] = breaker.getStats();
        }
        return stats;
    }

    /**
     * Reset all circuit breakers
     */
    resetAll(): void {
        for (const breaker of this.breakers.values()) {
            breaker.forceState(CircuitState.CLOSED);
        }
    }

    /**
     * Stop the cleanup interval
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

/**
 * Circuit Breaker Middleware for API calls
 */
export class CircuitBreakerMiddleware {
    private registry = CircuitBreakerRegistry.getInstance();
    private isEnabled: boolean;

    constructor() {
        // Make circuit breaker switchable via .env
        this.isEnabled = process.env.NEXT_PUBLIC_CIRCUIT_BREAKER_ENABLED !== 'false';
    }

    /**
     * Execute API call with circuit breaker protection
     */
    async executeWithBreaker<T>(
        serviceName: string,
        apiCall: () => Promise<T>,
        config?: CircuitBreakerConfig
    ): Promise<T> {
        if (!this.isEnabled) {
            // If disabled, execute the call directly
            return apiCall();
        }
        const breaker = this.registry.getBreaker(serviceName, config);
        return breaker.execute(apiCall);
    }

    /**
     * Get circuit breaker stats for monitoring
     */
    getStats(): Record<string, CircuitBreakerStats> {
        return this.registry.getAllStats();
    }
}

// Global circuit breaker middleware instance
export const circuitBreaker = new CircuitBreakerMiddleware();