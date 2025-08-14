/**
 * AI Service Factory Implementation
 *
 * Factory pattern implementation for creating AI service instances.
 * Follows SOLID Open/Closed Principle for extensibility.
 * Supports service registration and dynamic instantiation.
 *
 * @fileoverview AI service factory with extensible service registry
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 * @phase Phase 2.1 - API Abstraction Layer Setup (Sub-Task 3)
 */

import { AIService, AIServiceType, AIServiceConfig } from '../types/ai-service';
import { OpenAIService } from './openai-service';
import { SemanticKernelService } from './semantic-kernel-service';
import { ErrorFactory } from '../types/errors';

/**
 * Service constructor interface for factory registration
 */
interface AIServiceConstructor {
  new (config: AIServiceConfig): AIService;
}

/**
 * AI Service Factory for dynamic service creation
 * SOLID: Open/Closed Principle + Factory Pattern
 *
 * Features:
 * - Service registration system for extensibility
 * - Type-safe service creation
 * - Service capability validation
 * - Comprehensive error handling
 * - Support for multiple AI providers
 */
export class AIServiceFactory {
  private static serviceRegistry = new Map<
    AIServiceType,
    AIServiceConstructor
  >();

  static {
    // Register available services during class initialization
    this.registerService('openai', OpenAIService);
    // Note: SemanticKernelService registration is commented for Phase 3
    // this.registerService('semantic-kernel', SemanticKernelService);
  }

  /**
   * Registers a new AI service type with the factory
   * Enables runtime extension of supported service types
   * @param type - Service type identifier
   * @param serviceClass - Service class constructor
   */
  static registerService(
    type: AIServiceType,
    serviceClass: AIServiceConstructor,
  ): void {
    this.serviceRegistry.set(type, serviceClass);
  }

  /**
   * Creates an AI service instance of the specified type
   * Factory method providing type-safe service instantiation
   * @param type - Type of AI service to create
   * @param config - Configuration for the service
   * @returns Instantiated AI service
   * @throws {APIError} When service type is not supported or creation fails
   */
  static create(type: AIServiceType, config: AIServiceConfig): AIService {
    const ServiceClass = this.serviceRegistry.get(type);

    if (!ServiceClass) {
      throw ErrorFactory.service(
        'AIServiceFactory',
        'create',
        `AI service type '${type}' is not supported. Available types: ${this.getAvailableServices().join(', ')}`,
        false,
      );
    }

    try {
      return new ServiceClass(config);
    } catch (error) {
      // Re-throw service creation errors with additional context
      if (error && typeof error === 'object' && 'code' in error) {
        throw error; // Already an APIError, preserve it
      }

      throw ErrorFactory.service(
        'AIServiceFactory',
        'create',
        `Failed to create AI service of type '${type}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        false,
      );
    }
  }

  /**
   * Gets list of all registered service types
   * @returns Array of supported service type identifiers
   */
  static getAvailableServices(): AIServiceType[] {
    return Array.from(this.serviceRegistry.keys());
  }

  /**
   * Checks if a service type is supported by the factory
   * @param type - Service type to check
   * @returns Whether the service type is registered
   */
  static isServiceSupported(type: AIServiceType): boolean {
    return this.serviceRegistry.has(type);
  }

  /**
   * Gets the constructor class for a registered service type
   * Useful for introspection and advanced service management
   * @param type - Service type to get constructor for
   * @returns Service constructor class or undefined if not registered
   */
  static getServiceClass(
    type: AIServiceType,
  ): AIServiceConstructor | undefined {
    return this.serviceRegistry.get(type);
  }

  /**
   * Validates that a service configuration is compatible with a service type
   * Performs basic validation before attempting service creation
   * @param type - Service type to validate against
   * @param config - Configuration to validate
   * @returns Validation result with any issues found
   */
  static validateConfig(
    type: AIServiceType,
    config: AIServiceConfig,
  ): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check if service type is supported
    if (!this.isServiceSupported(type)) {
      issues.push(`Service type '${type}' is not supported`);
    }

    // Basic configuration validation
    if (!config.apiKey) {
      issues.push('API key is required');
    }

    if (!config.model) {
      issues.push('Model identifier is required');
    }

    // Type-specific validations
    if (type === 'openai') {
      this.validateOpenAIConfig(config, issues);
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Validates OpenAI-specific configuration requirements
   * @param config - Configuration to validate
   * @param issues - Array to collect validation issues
   */
  private static validateOpenAIConfig(
    config: AIServiceConfig,
    issues: string[],
  ): void {
    // OpenAI model validation
    const supportedModels = [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'o1-mini',
      'o1-preview',
    ];
    const isModelSupported = supportedModels.some((supported) =>
      config.model.includes(supported),
    );

    if (!isModelSupported) {
      issues.push(
        `Model '${config.model}' may not be supported by OpenAI. Supported models: ${supportedModels.join(', ')}`,
      );
    }

    // Parameter range validations
    if (
      config.temperature !== undefined &&
      (config.temperature < 0 || config.temperature > 2)
    ) {
      issues.push('Temperature must be between 0.0 and 2.0 for OpenAI models');
    }

    if (
      config.maxTokens !== undefined &&
      (config.maxTokens <= 0 || config.maxTokens > 128000)
    ) {
      issues.push('Max tokens must be between 1 and 128,000 for OpenAI models');
    }
  }

  /**
   * Creates a service instance with validation
   * Combines validation and creation for safer service instantiation
   * @param type - Service type to create
   * @param config - Service configuration
   * @returns Created service instance
   * @throws {APIError} When validation fails or creation fails
   */
  static createWithValidation(
    type: AIServiceType,
    config: AIServiceConfig,
  ): AIService {
    const validation = this.validateConfig(type, config);

    if (!validation.isValid) {
      throw ErrorFactory.validation(
        'config',
        config,
        'service configuration requirements',
        `Configuration validation failed: ${validation.issues.join(', ')}`,
      );
    }

    return this.create(type, config);
  }

  /**
   * Gets factory statistics and information
   * Useful for debugging and monitoring
   * @returns Factory information including registered services and capabilities
   */
  static getFactoryInfo(): {
    registeredServices: AIServiceType[];
    serviceCount: number;
    supportedCapabilities: Record<AIServiceType, string[]>;
  } {
    const registeredServices = this.getAvailableServices();
    const supportedCapabilities: Record<AIServiceType, string[]> = {} as Record<
      AIServiceType,
      string[]
    >;

    // Get capabilities for each registered service
    registeredServices.forEach((type) => {
      if (type === 'openai') {
        supportedCapabilities[type] = [
          'text-generation',
          'streaming',
          'function-calling',
          'conversation-context',
          'vision',
          'json-mode',
        ];
      } else if (type === 'semantic-kernel') {
        supportedCapabilities[type] = [
          'text-generation',
          'streaming',
          'process-orchestration',
          'plugin-system',
          'memory-management',
          'function-calling',
        ];
      }
    });

    return {
      registeredServices,
      serviceCount: registeredServices.length,
      supportedCapabilities,
    };
  }
}
