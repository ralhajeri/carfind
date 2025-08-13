/**
 * Service Container for Dependency Injection
 * 
 * Simple dependency injection container for AI service management.
 * Follows SOLID Dependency Inversion Principle.
 * Provides service lifecycle management and configuration.
 * 
 * @fileoverview Dependency injection container for AI services
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 * @phase Phase 2.1 - API Abstraction Layer Setup (Sub-Task 4)
 */

import { AIService, AIServiceType, AIServiceConfig } from '../types/ai-service';
import { AIServiceFactory } from './ai-service-factory';
import { ErrorFactory } from '../types/errors';

/**
 * Service container for dependency injection and service lifecycle management
 * SOLID: Dependency Inversion Principle + Singleton Pattern
 * 
 * Features:
 * - Service configuration management
 * - Service instance caching and reuse
 * - Session-aware service instances
 * - Service lifecycle management
 * - Thread-safe service access
 */
export class ServiceContainer {
    private static instance: ServiceContainer;
    private services = new Map<string, AIService>();
    private configs = new Map<AIServiceType, AIServiceConfig>();
    private defaultServiceType: AIServiceType = 'openai';

    /**
     * Private constructor enforcing singleton pattern
     */
    private constructor() { }

    /**
     * Gets the singleton instance of the service container
     * @returns Singleton service container instance
     */
    static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    /**
     * Registers a service configuration for a specific service type
     * @param type - AI service type
     * @param config - Service configuration
     */
    registerConfig(type: AIServiceType, config: AIServiceConfig): void {
        this.configs.set(type, config);
    }

    /**
     * Sets the default service type for the container
     * @param type - Default AI service type
     */
    setDefaultServiceType(type: AIServiceType): void {
        this.defaultServiceType = type;
    }

    /**
     * Gets the default service type
     * @returns Current default service type
     */
    getDefaultServiceType(): AIServiceType {
        return this.defaultServiceType;
    }

    /**
     * Gets an AI service instance with optional session-specific caching
     * @param type - AI service type (optional, uses default if not specified)
     * @param sessionId - Optional session ID for service instance isolation
     * @returns AI service instance
     * @throws {APIError} When configuration is missing or service creation fails
     */
    getService(type?: AIServiceType, sessionId?: string): AIService {
        const serviceType = type || this.defaultServiceType;
        const key = sessionId ? `${serviceType}-${sessionId}` : serviceType;

        // Return existing instance if available
        if (this.services.has(key)) {
            return this.services.get(key)!;
        }

        // Get configuration for the service type
        const config = this.configs.get(serviceType);
        if (!config) {
            throw ErrorFactory.service(
                'ServiceContainer',
                'getService',
                `No configuration found for service type '${serviceType}'. Available types: ${this.getAvailableServiceTypes().join(', ')}`,
                false
            );
        }

        // Create and cache the service instance
        try {
            const service = AIServiceFactory.create(serviceType, config);
            this.services.set(key, service);
            return service;
        } catch (error) {
            throw ErrorFactory.service(
                'ServiceContainer',
                'getService',
                `Failed to create service instance for type '${serviceType}': ${error instanceof Error ? error.message : 'Unknown error'}`,
                false
            );
        }
    }

    /**
     * Gets a service instance with validation and fallback to default
     * @param type - Preferred AI service type
     * @param sessionId - Optional session ID
     * @returns AI service instance (fallback to default if type not available)
     */
    getServiceWithFallback(type: AIServiceType, sessionId?: string): AIService {
        try {
            return this.getService(type, sessionId);
        } catch (error) {
            // If preferred service is not available, try default
            if (type !== this.defaultServiceType) {
                console.warn(`Service type '${type}' not available, falling back to default '${this.defaultServiceType}'`);
                return this.getService(this.defaultServiceType, sessionId);
            }
            throw error;
        }
    }

    /**
     * Clears all cached service instances
     * Useful for cleanup and testing scenarios
     */
    clearServices(): void {
        this.services.clear();
    }

    /**
     * Clears service instances for a specific session
     * @param sessionId - Session ID to clear services for
     */
    clearSessionServices(sessionId: string): void {
        const keysToDelete = Array.from(this.services.keys()).filter(key =>
            key.includes(`-${sessionId}`)
        );

        keysToDelete.forEach(key => {
            this.services.delete(key);
        });
    }

    /**
     * Gets list of configured service types
     * @returns Array of service types with configurations
     */
    getAvailableServiceTypes(): AIServiceType[] {
        return Array.from(this.configs.keys());
    }

    /**
     * Checks if a service type is configured
     * @param type - Service type to check
     * @returns Whether the service type has a configuration
     */
    isServiceConfigured(type: AIServiceType): boolean {
        return this.configs.has(type);
    }

    /**
     * Gets the configuration for a service type
     * @param type - Service type
     * @returns Service configuration or undefined if not configured
     */
    getServiceConfig(type: AIServiceType): AIServiceConfig | undefined {
        return this.configs.get(type);
    }

    /**
     * Updates the configuration for an existing service type
     * Clears cached instances to force recreation with new config
     * @param type - Service type to update
     * @param config - New service configuration
     */
    updateServiceConfig(type: AIServiceType, config: AIServiceConfig): void {
        this.configs.set(type, config);

        // Clear cached instances for this service type
        const keysToDelete = Array.from(this.services.keys()).filter(key =>
            key.startsWith(type)
        );

        keysToDelete.forEach(key => {
            this.services.delete(key);
        });
    }

    /**
     * Gets container statistics and information
     * @returns Container information including configurations and cached instances
     */
    getContainerInfo(): {
        configuredServices: AIServiceType[];
        cachedInstances: number;
        defaultService: AIServiceType;
        instanceKeys: string[];
    } {
        return {
            configuredServices: this.getAvailableServiceTypes(),
            cachedInstances: this.services.size,
            defaultService: this.defaultServiceType,
            instanceKeys: Array.from(this.services.keys())
        };
    }

    /**
     * Validates that the container is properly configured
     * @returns Validation result with any configuration issues
     */
    validateConfiguration(): {
        isValid: boolean;
        issues: string[];
        warnings: string[];
    } {
        const issues: string[] = [];
        const warnings: string[] = [];

        // Check if default service is configured
        if (!this.isServiceConfigured(this.defaultServiceType)) {
            issues.push(`Default service type '${this.defaultServiceType}' is not configured`);
        }

        // Check if at least one service is configured
        if (this.configs.size === 0) {
            issues.push('No AI services are configured');
        }

        // Check if factory supports all configured services
        this.getAvailableServiceTypes().forEach(type => {
            if (!AIServiceFactory.isServiceSupported(type)) {
                warnings.push(`Service type '${type}' is configured but not supported by factory`);
            }
        });

        return {
            isValid: issues.length === 0,
            issues,
            warnings
        };
    }

    /**
     * Performs health check on all configured services
     * Attempts to create instances to verify configurations
     * @returns Health check results for each service type
     */
    async performHealthCheck(): Promise<Record<AIServiceType, { healthy: boolean; error?: string }>> {
        const results: Record<string, { healthy: boolean; error?: string }> = {};

        for (const [type, config] of this.configs.entries()) {
            try {
                // Attempt to create a service instance (without caching)
                const service = AIServiceFactory.create(type, config);

                // Basic health check - verify service has required methods
                if (typeof service.generateResponse === 'function' &&
                    typeof service.generateStreamResponse === 'function') {
                    results[type] = { healthy: true };
                } else {
                    results[type] = {
                        healthy: false,
                        error: 'Service missing required methods'
                    };
                }
            } catch (error) {
                results[type] = {
                    healthy: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        }

        return results as Record<AIServiceType, { healthy: boolean; error?: string }>;
    }
}

/**
 * Export singleton instance for convenient access
 */
export const serviceContainer = ServiceContainer.getInstance();
