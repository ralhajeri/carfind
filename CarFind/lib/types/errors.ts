/**
 * CarFind Error and Validation Types
 * 
 * Comprehensive error handling and validation interfaces following SOLID principles
 * Supports both current OpenAI and future Semantic Kernel integration
 * 
 * @fileoverview Error and validation type definitions for CarFind Phase 2 Integration Layer
 * @author GitHub Copilot
 * @version 1.0.0
 */

/**
 * Base API Error interface providing core error information
 * SOLID: Single Responsibility Principle - focused on error representation
 */
export interface APIError {
    /** Unique error code for programmatic handling */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Optional additional error details */
    details?: Record<string, unknown>;
    /** Error occurrence timestamp */
    timestamp: Date;
}

/**
 * Validation Error interface extending APIError for input validation failures
 * SOLID: Interface Segregation Principle - specific interface for validation errors
 */
export interface ValidationError extends APIError {
    /** Field name that failed validation */
    field: string;
    /** Value that failed validation */
    value: unknown;
    /** Validation constraint that was violated */
    constraint: string;
}

/**
 * Service Error interface for AI service and external API failures
 * SOLID: Interface Segregation Principle - specific interface for service errors
 */
export interface ServiceError extends APIError {
    /** Service name that generated the error */
    service: string;
    /** Operation that failed */
    operation: string;
    /** Whether this error is retryable */
    retryable: boolean;
}

/**
 * Authentication Error interface for auth-related failures
 * SOLID: Interface Segregation Principle - specific interface for auth errors
 */
export interface AuthenticationError extends APIError {
    /** Authentication provider that failed */
    provider: string;
    /** Type of authentication failure */
    authType: 'api_key' | 'token' | 'session' | 'oauth';
    /** Whether credentials need to be refreshed */
    refreshRequired: boolean;
}

/**
 * Authorization Error interface for permission-related failures
 * SOLID: Interface Segregation Principle - specific interface for authorization errors
 */
export interface AuthorizationError extends APIError {
    /** Resource that access was denied to */
    resource: string;
    /** Required permission that was missing */
    requiredPermission: string;
    /** User or service that was denied access */
    principal: string;
}

/**
 * Network Error interface for connection and timeout failures
 * SOLID: Interface Segregation Principle - specific interface for network errors
 */
export interface NetworkError extends APIError {
    /** Request URL that failed */
    url: string;
    /** HTTP status code if available */
    statusCode?: number;
    /** Network timeout duration in milliseconds */
    timeout?: number;
    /** Whether the request should be retried */
    retryable: boolean;
}

/**
 * Database Error interface for persistence layer failures
 * SOLID: Interface Segregation Principle - specific interface for database errors
 */
export interface DatabaseError extends APIError {
    /** Database operation that failed */
    operation: 'select' | 'insert' | 'update' | 'delete' | 'transaction' | 'migration';
    /** Table or collection involved in the error */
    table?: string;
    /** SQL state code if available */
    sqlState?: string;
    /** Whether the operation is retryable */
    retryable: boolean;
}

/**
 * Enumeration of all possible error types in the system
 * SOLID: Open/Closed Principle - extensible without modification
 */
export type ErrorType =
    | 'validation'
    | 'service'
    | 'authentication'
    | 'authorization'
    | 'network'
    | 'database'
    | 'unknown';

/**
 * Error Response interface for failed API responses
 * SOLID: Single Responsibility Principle - focused on error response structure
 */
export interface ErrorResponse {
    success: false;
    error: APIError;
    type: ErrorType;
    /** Request correlation ID for tracing */
    correlationId?: string;
    /** Stack trace for debugging (development only) */
    stack?: string;
}

/**
 * Success Response interface for successful API responses
 * SOLID: Single Responsibility Principle - focused on success response structure
 */
export interface SuccessResponse<T> {
    success: true;
    data: T;
    /** Optional response metadata */
    metadata?: Record<string, unknown>;
    /** Request correlation ID for tracing */
    correlationId?: string;
}

/**
 * Union type for all possible API responses
 * SOLID: Open/Closed Principle - extensible response handling
 */
export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Validation Result interface for input validation operations
 * SOLID: Single Responsibility Principle - focused on validation results
 */
export interface ValidationResult {
    /** Whether validation passed */
    isValid: boolean;
    /** Array of validation errors if validation failed */
    errors: ValidationError[];
    /** Field-specific error mapping for easy access */
    fieldErrors: Record<string, ValidationError[]>;
}

/**
 * Error Severity levels for error classification and handling
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error Context interface for enhanced error reporting and debugging
 * SOLID: Single Responsibility Principle - focused on error context
 */
export interface ErrorContext {
    /** Request ID for correlation */
    requestId?: string;
    /** User ID if applicable */
    userId?: string;
    /** Session ID if applicable */
    sessionId?: string;
    /** Additional context data */
    metadata?: Record<string, unknown>;
    /** Error severity level */
    severity: ErrorSeverity;
}

/**
 * Enhanced API Error with context information
 * SOLID: Interface Segregation Principle - enhanced error with context
 */
export interface EnhancedAPIError extends APIError {
    /** Error context for debugging and tracking */
    context: ErrorContext;
    /** Error cause chain for nested errors */
    cause?: EnhancedAPIError;
}

/**
 * Error Handler interface for implementing error handling strategies
 * SOLID: Dependency Inversion Principle - abstract error handling
 */
export interface ErrorHandler {
    /** Handle an error and return appropriate response */
    handle(error: Error | EnhancedAPIError): Promise<ErrorResponse>;
    /** Check if this handler can handle the given error */
    canHandle(error: Error | EnhancedAPIError): boolean;
    /** Get error severity for the given error */
    getSeverity(error: Error | EnhancedAPIError): ErrorSeverity;
}

/**
 * Retry Configuration interface for retryable operations
 * SOLID: Single Responsibility Principle - focused on retry logic
 */
export interface RetryConfig {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Initial delay between retries in milliseconds */
    initialDelay: number;
    /** Delay multiplier for exponential backoff */
    backoffMultiplier: number;
    /** Maximum delay between retries in milliseconds */
    maxDelay: number;
    /** Whether to use jitter to prevent thundering herd */
    useJitter: boolean;
}

/**
 * Operation Result interface for operations that may succeed or fail
 * SOLID: Single Responsibility Principle - focused on operation outcomes
 */
export interface OperationResult<T> {
    /** Whether the operation succeeded */
    success: boolean;
    /** Result data if successful */
    data?: T;
    /** Error information if failed */
    error?: EnhancedAPIError;
    /** Operation metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Type guard to check if a response is an error response
 * @param response - The response to check
 * @returns True if the response is an error response
 */
export function isErrorResponse<T>(response: APIResponse<T>): response is ErrorResponse {
    return response.success === false;
}

/**
 * Type guard to check if a response is a success response
 * @param response - The response to check
 * @returns True if the response is a success response
 */
export function isSuccessResponse<T>(response: APIResponse<T>): response is SuccessResponse<T> {
    return response.success === true;
}

/**
 * Type guard to check if an error is a validation error
 * @param error - The error to check
 * @returns True if the error is a validation error
 */
export function isValidationError(error: APIError): error is ValidationError {
    return 'field' in error && 'value' in error && 'constraint' in error;
}

/**
 * Type guard to check if an error is a service error
 * @param error - The error to check
 * @returns True if the error is a service error
 */
export function isServiceError(error: APIError): error is ServiceError {
    return 'service' in error && 'operation' in error && 'retryable' in error;
}

/**
 * Type guard to check if an error is a network error
 * @param error - The error to check
 * @returns True if the error is a network error
 */
export function isNetworkError(error: APIError): error is NetworkError {
    return 'url' in error && 'retryable' in error;
}

/**
 * Type guard to check if an error is a database error
 * @param error - The error to check
 * @returns True if the error is a database error
 */
export function isDatabaseError(error: APIError): error is DatabaseError {
    return 'operation' in error && 'retryable' in error && !('url' in error);
}

/**
 * Error factory functions for creating specific error types
 */
export const ErrorFactory = {
    /**
     * Create a validation error
     */
    validation: (field: string, value: unknown, constraint: string, message: string): ValidationError => ({
        code: 'VALIDATION_ERROR',
        message,
        field,
        value,
        constraint,
        timestamp: new Date(),
    }),

    /**
     * Create a service error
     */
    service: (service: string, operation: string, message: string, retryable: boolean = false): ServiceError => ({
        code: 'SERVICE_ERROR',
        message,
        service,
        operation,
        retryable,
        timestamp: new Date(),
    }),

    /**
     * Create a network error
     */
    network: (url: string, message: string, statusCode?: number, retryable: boolean = true): NetworkError => ({
        code: 'NETWORK_ERROR',
        message,
        url,
        statusCode,
        retryable,
        timestamp: new Date(),
    }),

    /**
     * Create a database error
     */
    database: (
        operation: DatabaseError['operation'],
        message: string,
        table?: string,
        retryable: boolean = false
    ): DatabaseError => ({
        code: 'DATABASE_ERROR',
        message,
        operation,
        table,
        retryable,
        timestamp: new Date(),
    }),

    /**
     * Create an authentication error
     */
    authentication: (
        provider: string,
        authType: AuthenticationError['authType'],
        message: string,
        refreshRequired: boolean = false
    ): AuthenticationError => ({
        code: 'AUTHENTICATION_ERROR',
        message,
        provider,
        authType,
        refreshRequired,
        timestamp: new Date(),
    }),

    /**
     * Create an authorization error
     */
    authorization: (
        resource: string,
        requiredPermission: string,
        principal: string,
        message: string
    ): AuthorizationError => ({
        code: 'AUTHORIZATION_ERROR',
        message,
        resource,
        requiredPermission,
        principal,
        timestamp: new Date(),
    }),
};

/**
 * Default retry configuration for different operation types
 */
export const DEFAULT_RETRY_CONFIGS: Record<string, RetryConfig> = {
    network: {
        maxAttempts: 3,
        initialDelay: 1000,
        backoffMultiplier: 2,
        maxDelay: 10000,
        useJitter: true,
    },
    database: {
        maxAttempts: 2,
        initialDelay: 500,
        backoffMultiplier: 2,
        maxDelay: 5000,
        useJitter: false,
    },
    service: {
        maxAttempts: 3,
        initialDelay: 2000,
        backoffMultiplier: 1.5,
        maxDelay: 15000,
        useJitter: true,
    },
} as const;
