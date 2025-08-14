/**
 * Semantic Kernel Interface Definitions
 *
 * This file defines comprehensive interfaces for Microsoft Semantic Kernel Process Framework
 * integration, providing type-safe contracts for Phase 3 implementation while maintaining
 * compatibility with existing AI service architecture.
 *
 * @fileoverview Enhanced SK interface definitions for Phase 3 readiness
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 * @phase Phase 2.1 - API Abstraction Layer Setup (Sub-Task 4)
 */

// ===== CORE KERNEL INTERFACES =====

/**
 * Core Semantic Kernel interface representing the kernel instance
 */
export interface SKKernel {
  /** Unique identifier for the kernel instance */
  id: string;

  /** Human-readable name for the kernel */
  name: string;

  /** Description of the kernel's purpose */
  description: string;

  /** Collection of AI services available to the kernel */
  services: SKServiceCollection;

  /** Collection of plugins loaded into the kernel */
  plugins: SKPluginCollection;

  /** Collection of processes available for execution */
  processes: SKProcessCollection;
}

/**
 * Collection of different AI services available to the kernel
 */
export interface SKServiceCollection {
  /** Text generation services (e.g., OpenAI, Azure OpenAI) */
  textGeneration: SKTextGenerationService[];

  /** Embedding services for vector operations */
  embedding: SKEmbeddingService[];

  /** Memory services for persistent storage */
  memory: SKMemoryService[];
}

/**
 * Collection of plugins indexed by plugin name
 */
export interface SKPluginCollection {
  [pluginName: string]: SKPlugin;
}

/**
 * Collection of processes indexed by process name
 */
export interface SKProcessCollection {
  [processName: string]: SKProcess;
}

// ===== PROCESS FRAMEWORK INTERFACES =====

/**
 * Core process interface representing a Semantic Kernel process
 */
export interface SKProcess {
  /** Unique identifier for the process */
  id: string;

  /** Human-readable name for the process */
  name: string;

  /** Description of what the process does */
  description: string;

  /** Array of steps that make up this process */
  steps: SKProcessStep[];

  /** Current state of the process */
  state: SKProcessState;

  /**
   * Executes the process with the given input
   * @param input - The input data for process execution
   * @returns Promise resolving to the process output
   */
  execute(input: SKProcessInput): Promise<SKProcessOutput>;

  /**
   * Gets the current state of the process
   * @returns The current process state
   */
  getState(): SKProcessState;

  /**
   * Resets the process to its initial state
   * @returns Promise that resolves when reset is complete
   */
  reset(): Promise<void>;
}

/**
 * Individual process step interface
 */
export interface SKProcessStep {
  /** Unique identifier for the step */
  id: string;

  /** Human-readable name for the step */
  name: string;

  /** Description of what the step does */
  description: string;

  /** Array of kernel functions this step can execute */
  functions: SKKernelFunction[];

  /** Events that trigger this step */
  triggers: SKProcessEvent[];

  /** Events that this step can emit */
  targets: SKProcessEvent[];

  /**
   * Executes the step with the given context
   * @param context - The execution context for the step
   * @returns Promise resolving to the step result
   */
  execute(context: SKStepContext): Promise<SKStepResult>;
}

/**
 * Kernel function interface for AI-callable functions
 */
export interface SKKernelFunction {
  /** Name of the function */
  name: string;

  /** Name of the plugin this function belongs to */
  pluginName: string;

  /** Description of what the function does */
  description: string;

  /** Array of parameter metadata for the function */
  parameters: SKParameterMetadata[];

  /**
   * Invokes the function with the given arguments
   * @param kernel - The kernel instance
   * @param args - The function arguments
   * @returns Promise resolving to the function result
   */
  invoke(
    kernel: SKKernel,
    args: Record<string, unknown>,
  ): Promise<SKFunctionResult>;
}

/**
 * Plugin interface for grouping related functions
 */
export interface SKPlugin {
  /** Name of the plugin */
  name: string;

  /** Description of the plugin's purpose */
  description: string;

  /** Collection of functions provided by this plugin */
  functions: Record<string, SKKernelFunction>;

  /** Metadata about the plugin */
  metadata: SKPluginMetadata;
}

// ===== DATA TYPES =====

/**
 * Input data structure for process execution
 */
export interface SKProcessInput {
  /** The main data payload for the process */
  data: Record<string, unknown>;

  /** Optional execution context */
  context?: SKExecutionContext;

  /** Optional metadata for the input */
  metadata?: Record<string, unknown>;
}

/**
 * Output data structure from process execution
 */
export interface SKProcessOutput {
  /** The result data from the process */
  result: Record<string, unknown>;

  /** Final state of the process after execution */
  state: SKProcessState;

  /** Optional metadata about the execution */
  metadata?: Record<string, unknown>;

  /** Any errors that occurred during execution */
  errors?: SKProcessError[];
}

/**
 * Context information for step execution
 */
export interface SKStepContext {
  /** ID of the process this step belongs to */
  processId: string;

  /** ID of this step */
  stepId: string;

  /** The kernel instance */
  kernel: SKKernel;

  /** Variables available to the step */
  variables: Record<string, unknown>;

  /** Metadata for the step execution */
  metadata: Record<string, unknown>;
}

/**
 * Result from step execution
 */
export interface SKStepResult {
  /** Whether the step executed successfully */
  success: boolean;

  /** Optional output from the step */
  output?: unknown;

  /** Events generated by the step */
  events?: SKProcessEvent[];

  /** Any errors that occurred during step execution */
  errors?: SKProcessError[];
}

/**
 * Execution context for processes and steps
 */
export interface SKExecutionContext {
  /** Optional user identifier */
  userId?: string;

  /** Optional session identifier */
  sessionId?: string;

  /** Unique request identifier */
  requestId: string;

  /** Timestamp of the execution */
  timestamp: Date;

  /** Additional metadata */
  metadata: Record<string, unknown>;
}

// ===== EVENT SYSTEM =====

/**
 * Event interface for process communication
 */
export interface SKProcessEvent {
  /** Unique identifier for the event */
  id: string;

  /** Name of the event */
  name: string;

  /** Optional data payload */
  data?: Record<string, unknown>;

  /** ID of the step that generated this event */
  sourceStepId?: string;

  /** ID of the step that should handle this event */
  targetStepId?: string;

  /** Timestamp when the event was created */
  timestamp: Date;
}

/**
 * State information for processes
 */
export interface SKProcessState {
  /** Current status of the process */
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused';

  /** ID of the currently executing step */
  currentStep?: string;

  /** Variables maintained by the process */
  variables: Record<string, unknown>;

  /** History of events that occurred during execution */
  history: SKProcessEvent[];

  /** When the process started executing */
  startTime?: Date;

  /** When the process finished executing */
  endTime?: Date;
}

// ===== CONFIGURATION AND METADATA =====

/**
 * Configuration for Semantic Kernel instances
 */
export interface SKKernelConfig {
  /** Type of AI service to use */
  serviceType: 'OpenAI' | 'AzureOpenAI' | 'HuggingFace';

  /** API key for the AI service */
  apiKey: string;

  /** Model identifier */
  model: string;

  /** Optional endpoint URL for custom services */
  endpoint?: string;

  /** Array of plugin names to load */
  plugins: string[];

  /** Optional memory configuration */
  memoryConfiguration?: SKMemoryConfig;

  /** Logging level for the kernel */
  loggingLevel: 'debug' | 'info' | 'warning' | 'error';
}

/**
 * Memory configuration for the kernel
 */
export interface SKMemoryConfig {
  /** Type of memory storage */
  type: 'volatile' | 'persistent';

  /** Connection string for persistent storage */
  connectionString?: string;

  /** Collection name for memory storage */
  collectionName?: string;

  /** Vector size for embeddings */
  vectorSize?: number;
}

/**
 * Parameter metadata for function definitions
 */
export interface SKParameterMetadata {
  /** Name of the parameter */
  name: string;

  /** Description of the parameter */
  description: string;

  /** Type of the parameter */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';

  /** Whether the parameter is required */
  required: boolean;

  /** Optional default value */
  defaultValue?: unknown;
}

/**
 * Metadata about plugins
 */
export interface SKPluginMetadata {
  /** Version of the plugin */
  version: string;

  /** Author of the plugin */
  author: string;

  /** Tags for categorizing the plugin */
  tags: string[];

  /** Dependencies required by the plugin */
  dependencies: string[];
}

/**
 * Result from function execution
 */
export interface SKFunctionResult {
  /** The return value from the function */
  value: unknown;

  /** Optional metadata about the execution */
  metadata?: Record<string, unknown>;

  /** Any error that occurred during execution */
  error?: SKProcessError;
}

// ===== ERROR TYPES =====

/**
 * Error information for process and step failures
 */
export interface SKProcessError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** ID of the step where the error occurred */
  stepId?: string;

  /** Name of the function that caused the error */
  functionName?: string;

  /** Additional error details */
  details?: Record<string, unknown>;

  /** Timestamp when the error occurred */
  timestamp: Date;
}

// ===== SERVICE INTERFACES =====

/**
 * Text generation service interface
 */
export interface SKTextGenerationService {
  /** Name of the service */
  name: string;

  /**
   * Generates text from a prompt
   * @param prompt - The input prompt
   * @param settings - Optional generation settings
   * @returns Promise resolving to generated text
   */
  generateText(
    prompt: string,
    settings?: SKTextGenerationSettings,
  ): Promise<string>;

  /**
   * Generates streaming text from a prompt
   * @param prompt - The input prompt
   * @param settings - Optional generation settings
   * @returns AsyncGenerator yielding text chunks
   */
  generateTextStream(
    prompt: string,
    settings?: SKTextGenerationSettings,
  ): AsyncGenerator<string>;
}

/**
 * Embedding service interface
 */
export interface SKEmbeddingService {
  /** Name of the service */
  name: string;

  /**
   * Generates embedding for a single text
   * @param text - The input text
   * @returns Promise resolving to embedding vector
   */
  generateEmbedding(text: string): Promise<number[]>;

  /**
   * Generates embeddings for multiple texts
   * @param texts - Array of input texts
   * @returns Promise resolving to array of embedding vectors
   */
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

/**
 * Memory service interface
 */
export interface SKMemoryService {
  /** Name of the service */
  name: string;

  /**
   * Stores a value in memory
   * @param key - The storage key
   * @param value - The value to store
   * @param metadata - Optional metadata
   * @returns Promise that resolves when storage is complete
   */
  store(
    key: string,
    value: unknown,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  /**
   * Retrieves a value from memory
   * @param key - The storage key
   * @returns Promise resolving to the stored value
   */
  retrieve(key: string): Promise<unknown>;

  /**
   * Searches memory for relevant content
   * @param query - The search query
   * @param limit - Optional limit on results
   * @returns Promise resolving to search results
   */
  search(query: string, limit?: number): Promise<SKMemorySearchResult[]>;
}

/**
 * Text generation settings
 */
export interface SKTextGenerationSettings {
  /** Maximum number of tokens to generate */
  maxTokens?: number;

  /** Temperature for randomness (0.0 - 2.0) */
  temperature?: number;

  /** Top-p sampling parameter */
  topP?: number;

  /** Presence penalty for repetition */
  presencePenalty?: number;

  /** Frequency penalty for repetition */
  frequencyPenalty?: number;

  /** Stop sequences to end generation */
  stopSequences?: string[];
}

/**
 * Memory search result
 */
export interface SKMemorySearchResult {
  /** The storage key */
  key: string;

  /** The stored value */
  value: unknown;

  /** Relevance score (0.0 - 1.0) */
  score: number;

  /** Optional metadata */
  metadata?: Record<string, unknown>;
}
