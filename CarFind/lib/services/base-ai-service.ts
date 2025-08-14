/**
 * Base AI Service Abstract Class
 *
 * Abstract base class providing common functionality for AI service implementations.
 * Follows SOLID principles with Single Responsibility and Template Method patterns.
 * Provides foundation for OpenAI and future Semantic Kernel services.
 *
 * @fileoverview Abstract base class for AI service implementations
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 * @phase Phase 2.1 - API Abstraction Layer Setup (Sub-Task 1)
 */

import {
  AIService,
  AIServiceConfig,
  ChatRequest,
  ChatResponse,
} from '../types/ai-service';
import { APIError, ErrorFactory } from '../types/errors';

/**
 * Abstract base class for AI service implementations
 * SOLID: Single Responsibility + Template Method Pattern
 *
 * Provides common functionality for:
 * - Configuration validation
 * - Error handling with consistent patterns
 * - Message creation utilities
 * - Service lifecycle management
 */
export abstract class BaseAIService implements AIService {
  protected config: AIServiceConfig;

  /**
   * Initialize the base AI service with configuration validation
   * @param config - AI service configuration with API key, model, and options
   * @throws {APIError} When configuration validation fails
   */
  constructor(config: AIServiceConfig) {
    this.validateConfig(config);
    this.config = config;
  }

  /**
   * Abstract method for generating complete AI responses
   * Must be implemented by concrete service classes
   * @param request - Chat request with messages and configuration
   * @returns Promise resolving to complete chat response
   */
  abstract generateResponse(request: ChatRequest): Promise<ChatResponse>;

  /**
   * Abstract method for generating streaming AI responses
   * Must be implemented by concrete service classes for real-time chat
   * @param request - Chat request with messages and configuration
   * @returns AsyncGenerator yielding partial responses and final result
   */
  abstract generateStreamResponse(
    request: ChatRequest,
  ): AsyncGenerator<string, ChatResponse>;

  /**
   * Validates AI service configuration for required fields and proper format
   * Template method providing consistent validation across all service implementations
   * @param config - Configuration to validate
   * @throws {APIError} When required fields are missing or invalid
   */
  protected validateConfig(config: AIServiceConfig): void {
    if (!config.apiKey) {
      throw ErrorFactory.service(
        'AIService',
        'configuration',
        'API key is required for AI service initialization',
      );
    }

    if (!config.model) {
      throw ErrorFactory.service(
        'AIService',
        'configuration',
        'Model identifier is required for AI service initialization',
      );
    }

    // Validate optional numeric parameters
    if (
      config.maxTokens !== undefined &&
      (config.maxTokens <= 0 || !Number.isInteger(config.maxTokens))
    ) {
      throw ErrorFactory.validation(
        'maxTokens',
        config.maxTokens,
        'positive integer',
        'Max tokens must be a positive integer',
      );
    }

    if (
      config.temperature !== undefined &&
      (config.temperature < 0 || config.temperature > 2)
    ) {
      throw ErrorFactory.validation(
        'temperature',
        config.temperature,
        'range 0.0-2.0',
        'Temperature must be between 0.0 and 2.0',
      );
    }
  }

  /**
   * Standardized error handling with consistent format and actionable information
   * Template method ensuring uniform error responses across service implementations
   * @param error - Original error from service operation
   * @param operation - Name of the operation that failed
   * @returns Standardized APIError with context and debugging information
   */
  protected handleError(error: unknown, operation: string): APIError {
    // If already an APIError interface type, return it directly
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error &&
      'timestamp' in error
    ) {
      return error as APIError;
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return ErrorFactory.service(
        'AIService',
        operation,
        `AI service operation failed: ${operation} - ${error.message}`,
        this.isRetryableError(error),
      );
    }

    // Handle unknown error types
    return ErrorFactory.service(
      'AIService',
      operation,
      `Unknown error during AI service operation: ${operation}`,
      false,
    );
  }

  /**
   * Creates standardized chat message objects with consistent structure
   * Utility method for generating properly formatted chat messages
   * @param role - Message role (user, assistant, system)
   * @param content - Message content text
   * @param metadata - Optional metadata for extensibility
   * @returns Properly formatted ChatMessage object
   */
  protected createChatMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, unknown>,
  ) {
    return {
      id: this.generateMessageId(),
      role,
      content,
      timestamp: new Date(),
      metadata,
    };
  }

  /**
   * Determines if an error is potentially retryable based on error characteristics
   * Helper method for error handling and retry logic
   * @param error - Error to analyze for retry potential
   * @returns Whether the error might succeed on retry
   */
  private isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /rate.?limit/i,
      /temporary/i,
      /server.?error/i,
      /503/,
      /502/,
      /504/,
    ];

    const errorText = `${error.name} ${error.message}`;
    return retryablePatterns.some((pattern) => pattern.test(errorText));
  }

  /**
   * Generates unique message identifiers using crypto API
   * Utility method for creating consistent message IDs
   * @returns Unique identifier string
   */
  private generateMessageId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for environments without crypto.randomUUID
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gets the current service configuration (read-only access)
   * @returns Current AI service configuration
   */
  public getConfig(): Readonly<AIServiceConfig> {
    return { ...this.config };
  }

  /**
   * Gets service metadata for debugging and monitoring
   * @returns Basic service information
   */
  public getServiceInfo(): Record<string, unknown> {
    return {
      model: this.config.model,
      hasApiKey: !!this.config.apiKey,
      baseUrl: this.config.baseUrl || 'default',
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
      createdAt: new Date().toISOString(),
    };
  }
}
