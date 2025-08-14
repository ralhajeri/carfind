/**
 * AI Service Interface Definitions
 *
 * This file defines type-safe contracts for AI service abstraction following SOLID principles,
 * specifically the Interface Segregation Principle. These interfaces create a robust foundation
 * for the integration layer supporting both OpenAI (current) and Semantic Kernel (future) integration.
 *
 * @fileoverview Core AI service abstraction interfaces with streaming support
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 */

// ===== CORE AI SERVICE INTERFACES =====

/**
 * Core AI service abstraction interface with streaming support
 * SOLID: Interface Segregation Principle - focused, single-purpose interface
 */
export interface AIService {
  /**
   * Generates a complete AI response for the given chat request
   * @param request - The chat request containing messages and configuration
   * @returns Promise resolving to the complete chat response
   */
  generateResponse(request: ChatRequest): Promise<ChatResponse>;

  /**
   * Generates a streaming AI response for real-time chat interactions
   * @param request - The chat request containing messages and configuration
   * @returns AsyncGenerator yielding partial responses and final complete response
   */
  generateStreamResponse(
    request: ChatRequest,
  ): AsyncGenerator<string, ChatResponse>;
}

/**
 * Configuration interface for AI service initialization
 * Supports multiple AI providers with flexible configuration options
 */
export interface AIServiceConfig {
  /** API key for authenticating with the AI service */
  apiKey: string;

  /** Model identifier (e.g., 'gpt-4o', 'grok-2-1212') */
  model: string;

  /** Maximum number of tokens in the response (optional) */
  maxTokens?: number;

  /** Temperature for response randomness (0.0 - 2.0, optional) */
  temperature?: number;

  /** Base URL for the AI service API (optional, for custom endpoints) */
  baseUrl?: string;
}

/**
 * Supported AI service types for future extensibility
 * Currently supports OpenAI with Semantic Kernel preparation
 */
export type AIServiceType = 'openai' | 'semantic-kernel';

/**
 * Metadata interface describing AI service capabilities and version information
 */
export interface AIServiceMetadata {
  /** Type of the AI service */
  type: AIServiceType;

  /** Version string of the service implementation */
  version: string;

  /** Array of supported capabilities (e.g., ['streaming', 'tools', 'multimodal']) */
  capabilities: string[];
}

// ===== CHAT DATA MODEL INTERFACES =====

/**
 * Individual chat message interface with comprehensive metadata support
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;

  /** Role of the message sender */
  role: 'user' | 'assistant' | 'system';

  /** Content of the message */
  content: string;

  /** Timestamp when the message was created */
  timestamp: Date;

  /** Optional metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/**
 * Chat request interface containing all necessary information for AI processing
 */
export interface ChatRequest {
  /** Array of messages representing the conversation history */
  messages: ChatMessage[];

  /** Optional session identifier for conversation persistence */
  sessionId?: string;

  /** Optional user identifier for user-specific processing */
  userId?: string;

  /** Optional override for maximum tokens in response */
  maxTokens?: number;

  /** Optional override for response temperature */
  temperature?: number;

  /** Optional tools/functions available for the AI to use */
  tools?: Record<string, unknown>;
}

/**
 * Chat response interface with usage statistics and metadata
 */
export interface ChatResponse {
  /** The generated message from the AI service */
  message: ChatMessage;

  /** Session identifier associated with this response */
  sessionId: string;

  /** Optional token usage statistics */
  usage?: {
    /** Number of tokens in the input prompt */
    promptTokens: number;

    /** Number of tokens in the completion response */
    completionTokens: number;

    /** Total tokens used (prompt + completion) */
    totalTokens: number;
  };

  /** Optional response metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/**
 * Chat session interface for conversation persistence
 */
export interface ChatSession {
  /** Unique identifier for the session */
  id: string;

  /** Optional user identifier who owns this session */
  userId?: string;

  /** Human-readable title for the session */
  title: string;

  /** All messages in this session */
  messages: ChatMessage[];

  /** Timestamp when the session was created */
  createdAt: Date;

  /** Timestamp when the session was last updated */
  updatedAt: Date;

  /** Optional session metadata for extensibility */
  metadata?: Record<string, unknown>;
}

// ===== ERROR HANDLING INTERFACES =====

/**
 * Base API error interface for consistent error handling
 */
export interface APIError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Optional additional error details */
  details?: Record<string, unknown>;

  /** Timestamp when the error occurred */
  timestamp: Date;
}

/**
 * Service-specific error interface extending base API error
 */
export interface ServiceError extends APIError {
  /** Service identifier that generated the error */
  service: string;

  /** Operation that failed */
  operation: string;

  /** Whether this error can be retried */
  retryable: boolean;
}

/**
 * Error categorization for different types of failures
 */
export type ErrorType =
  | 'validation'
  | 'service'
  | 'authentication'
  | 'authorization'
  | 'network'
  | 'unknown';

/**
 * Error response wrapper for failed operations
 */
export interface ErrorResponse {
  /** Always false for error responses */
  success: false;

  /** The error information */
  error: APIError;

  /** Type categorization of the error */
  type: ErrorType;
}

/**
 * Success response wrapper for successful operations
 */
export interface SuccessResponse<T> {
  /** Always true for success responses */
  success: true;

  /** The response data */
  data: T;

  /** Optional response metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Union type for all API responses (success or error)
 */
export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;
