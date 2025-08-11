---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Next.js Service Integration

## Task Meta

- **Task ID:** 02_task_10
- **Task Name:** Next.js Service Integration
- **Phase:** Phase 3.3
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Update SemanticKernelService implementation in Next.js to connect to FastAPI backend while maintaining existing interface compatibility, implement connection health monitoring, add fallback mechanisms, and ensure seamless user experience during transition.

## 2. Objectives

- Update SemanticKernelService implementation to connect to FastAPI backend endpoints
- Maintain existing interface compatibility to avoid breaking frontend components
- Implement connection health monitoring with automatic fallback mechanisms
- Add configuration management for backend URL and service settings
- Ensure seamless user experience during service transition with proper error handling

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 09 (FastAPI Route Implementation) completed successfully
- [ ] FastAPI backend operational with chat endpoints functional
- [ ] Phase 2 service interfaces understood and documented for compatibility
- [ ] Next.js project structure ready for service layer updates
- [ ] Existing service abstraction patterns available for reference

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 2: `CarFind/lib/services/semantic-kernel-service.ts` - Service implementation to update
- Phase 2: `CarFind/lib/services/ai-service-factory.ts` - Service factory requiring integration
- Phase 2: `CarFind/lib/config/ai-config.ts` - Configuration management for service URLs
- Backend: `carfind-backend/app/api/routes/chat.py` - Target FastAPI endpoints
- Phase 2: `CarFind/lib/types/ai-types.ts` - Type definitions requiring backend compatibility

### 4.2 Framework Dependencies

- Next.js API routes for proxy functionality and middleware
- Fetch API for HTTP client implementation with streaming support
- TypeScript for type safety and interface compatibility
- Configuration management for backend service URLs and settings
- Error handling and retry mechanisms for network resilience

---

## 5. Testing Strategy

- **Unit Tests:** Validate service integration and API communication
- **Integration Tests:** Verify end-to-end functionality with FastAPI backend
- **Manual Tests:** Confirm user experience and error handling scenarios

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-002`                  | Backend service integration | `CarFind/lib/services/semantic-kernel-service.ts` | `TEST-U-001` |
| `REQ-001`                  | Interface compatibility maintenance | Service interface and type definitions | `TEST-I-002` |
| `NFR-002`                  | Connection reliability and monitoring | Health check and fallback mechanisms | `TEST-R-003` |
| `NFR-005`                  | Error handling and user experience | Error handling and retry logic | `TEST-UX-004` |

---

## 7. Implementation Plan

### 7.1 Design

Update Next.js service layer to integrate with FastAPI backend while maintaining existing interface compatibility through service abstraction pattern with health monitoring and fallback mechanisms.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Backend Configuration Management**
  - **Description:** Add configuration for FastAPI backend service URLs

    ```typescript
    // File Path: CarFind/lib/config/backend-config.ts
    // Backend service configuration for FastAPI integration

    /**
     * Backend Service Configuration for CarFind Phase 3 Integration
     */

    export interface BackendConfig {
      baseUrl: string;
      apiPrefix: string;
      timeout: number;
      retryAttempts: number;
      retryDelay: number;
      healthCheckInterval: number;
      enableFallback: boolean;
    }

    export interface BackendEndpoints {
      chat: string;
      search: string;
      session: string;
      health: string;
    }

    export const BACKEND_CONFIG: BackendConfig = {
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
      apiPrefix: '/api',
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
      healthCheckInterval: 60000, // 1 minute
      enableFallback: process.env.NODE_ENV === 'production',
    };

    export const BACKEND_ENDPOINTS: BackendEndpoints = {
      chat: '/chat',
      search: '/chat/search',
      session: '/chat/session',
      health: '/health',
    };

    export class BackendConfigManager {
      private static instance: BackendConfigManager;
      private config: BackendConfig;
      private endpoints: BackendEndpoints;

      private constructor() {
        this.config = { ...BACKEND_CONFIG };
        this.endpoints = { ...BACKEND_ENDPOINTS };
      }

      public static getInstance(): BackendConfigManager {
        if (!BackendConfigManager.instance) {
          BackendConfigManager.instance = new BackendConfigManager();
        }
        return BackendConfigManager.instance;
      }

      public getConfig(): BackendConfig {
        return { ...this.config };
      }

      public getEndpoints(): BackendEndpoints {
        return { ...this.endpoints };
      }

      public getFullUrl(endpoint: keyof BackendEndpoints): string {
        return `${this.config.baseUrl}${this.config.apiPrefix}${this.endpoints[endpoint]}`;
      }

      public updateConfig(updates: Partial<BackendConfig>): void {
        this.config = { ...this.config, ...updates };
      }

      public isHealthy(): boolean {
        // Add health check logic
        return true; // Placeholder
      }
    }
    ```

- [ ] **Sub-Task 2: HTTP Client Implementation**
  - **Description:** Create robust HTTP client for FastAPI communication

    ```typescript
    // File Path: CarFind/lib/services/http-client.ts
    // HTTP client for FastAPI backend communication

    /**
     * HTTP Client for CarFind FastAPI Backend Integration
     */

    import { BackendConfigManager, BackendConfig } from '@/lib/config/backend-config';

    export interface HttpClientOptions {
      timeout?: number;
      retryAttempts?: number;
      retryDelay?: number;
      headers?: Record<string, string>;
    }

    export interface HttpResponse<T = any> {
      data: T;
      status: number;
      statusText: string;
      headers: Headers;
    }

    export class HttpClientError extends Error {
      constructor(
        message: string,
        public status?: number,
        public response?: any
      ) {
        super(message);
        this.name = 'HttpClientError';
      }
    }

    export class HttpClient {
      private config: BackendConfig;
      private configManager: BackendConfigManager;

      constructor() {
        this.configManager = BackendConfigManager.getInstance();
        this.config = this.configManager.getConfig();
      }

      public async get<T>(
        url: string,
        options: HttpClientOptions = {}
      ): Promise<HttpResponse<T>> {
        return this.request<T>('GET', url, undefined, options);
      }

      public async post<T>(
        url: string,
        data?: any,
        options: HttpClientOptions = {}
      ): Promise<HttpResponse<T>> {
        return this.request<T>('POST', url, data, options);
      }

      public async delete<T>(
        url: string,
        options: HttpClientOptions = {}
      ): Promise<HttpResponse<T>> {
        return this.request<T>('DELETE', url, undefined, options);
      }

      public async stream(
        url: string,
        data?: any,
        options: HttpClientOptions = {}
      ): Promise<ReadableStream> {
        const fullUrl = this.buildUrl(url);
        const requestInit = this.buildRequestInit('POST', data, options);

        const response = await fetch(fullUrl, requestInit);

        if (!response.ok) {
          throw new HttpClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            await response.text()
          );
        }

        if (!response.body) {
          throw new HttpClientError('No response body for streaming');
        }

        return response.body;
      }

      private async request<T>(
        method: string,
        url: string,
        data?: any,
        options: HttpClientOptions = {}
      ): Promise<HttpResponse<T>> {
        const maxRetries = options.retryAttempts ?? this.config.retryAttempts;
        const retryDelay = options.retryDelay ?? this.config.retryDelay;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const fullUrl = this.buildUrl(url);
            const requestInit = this.buildRequestInit(method, data, options);

            const response = await fetch(fullUrl, requestInit);
            const responseData = await this.parseResponse<T>(response);

            return {
              data: responseData,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            };
          } catch (error) {
            if (attempt === maxRetries) {
              throw error;
            }

            // Wait before retrying
            await this.delay(retryDelay * Math.pow(2, attempt));
          }
        }

        throw new HttpClientError('Max retry attempts exceeded');
      }

      private buildUrl(url: string): string {
        if (url.startsWith('http')) {
          return url;
        }
        return `${this.config.baseUrl}${this.config.apiPrefix}${url}`;
      }

      private buildRequestInit(
        method: string,
        data?: any,
        options: HttpClientOptions = {}
      ): RequestInit {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        return {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: AbortSignal.timeout(options.timeout ?? this.config.timeout),
        };
      }

      private async parseResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
          const errorText = await response.text();
          throw new HttpClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorText
          );
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return response.json();
        }

        return response.text() as unknown as T;
      }

      private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    }
    ```

- [ ] **Sub-Task 3: Updated Semantic Kernel Service**
  - **Description:** Update service implementation to use FastAPI backend

    ```typescript
    // File Path: CarFind/lib/services/semantic-kernel-service.ts
    // Updated Semantic Kernel service with FastAPI backend integration

    /**
     * Semantic Kernel Service - Phase 3 FastAPI Backend Integration
     */

    import {
      AIService,
      ChatMessage,
      ChatOptions,
      ChatResponse,
      StreamingChatResponse,
    } from '@/lib/types/ai-types';
    import { HttpClient, HttpClientError } from './http-client';
    import { BackendConfigManager } from '@/lib/config/backend-config';

    export interface SemanticKernelConfig {
      enableHealthChecking: boolean;
      fallbackToMock: boolean;
      healthCheckInterval: number;
    }

    export interface BackendHealthStatus {
      healthy: boolean;
      lastCheck: Date;
      error?: string;
    }

    export class SemanticKernelService implements AIService {
      private httpClient: HttpClient;
      private configManager: BackendConfigManager;
      private config: SemanticKernelConfig;
      private healthStatus: BackendHealthStatus;
      private healthCheckTimer?: NodeJS.Timeout;

      constructor(config: Partial<SemanticKernelConfig> = {}) {
        this.httpClient = new HttpClient();
        this.configManager = BackendConfigManager.getInstance();
        this.config = {
          enableHealthChecking: true,
          fallbackToMock: process.env.NODE_ENV === 'development',
          healthCheckInterval: 60000, // 1 minute
          ...config,
        };

        this.healthStatus = {
          healthy: true,
          lastCheck: new Date(),
        };

        if (this.config.enableHealthChecking) {
          this.startHealthChecking();
        }
      }

      public async chat(
        messages: ChatMessage[],
        options: ChatOptions = {}
      ): Promise<ChatResponse> {
        try {
          // Check backend health
          if (!this.healthStatus.healthy && !this.config.fallbackToMock) {
            throw new Error('Backend service is unavailable');
          }

          // Prepare request payload
          const requestPayload = {
            messages: messages.map(msg => ({
              id: msg.id || this.generateId(),
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt || new Date().toISOString(),
            })),
            sessionId: options.sessionId,
            userId: options.userId,
            stream: false, // Non-streaming for this method
            metadata: options.metadata || {},
          };

          // Make API call
          const response = await this.httpClient.post<ChatResponse>(
            this.configManager.getEndpoints().chat,
            requestPayload
          );

          return {
            id: response.data.id,
            role: response.data.role,
            content: response.data.content,
            createdAt: response.data.createdAt,
            metadata: response.data.metadata,
          };

        } catch (error) {
          console.error('SemanticKernelService.chat error:', error);

          if (this.config.fallbackToMock) {
            return this.mockChatResponse(messages, options);
          }

          throw new Error(`Chat request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      public async *streamChat(
        messages: ChatMessage[],
        options: ChatOptions = {}
      ): AsyncGenerator<StreamingChatResponse, void, unknown> {
        try {
          // Check backend health
          if (!this.healthStatus.healthy && !this.config.fallbackToMock) {
            throw new Error('Backend service is unavailable');
          }

          // Prepare request payload
          const requestPayload = {
            messages: messages.map(msg => ({
              id: msg.id || this.generateId(),
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt || new Date().toISOString(),
            })),
            sessionId: options.sessionId,
            userId: options.userId,
            stream: true,
            metadata: options.metadata || {},
          };

          // Get streaming response
          const stream = await this.httpClient.stream(
            this.configManager.getEndpoints().chat,
            requestPayload
          );

          const reader = stream.getReader();
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') return;

                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) {
                      throw new Error(parsed.error.message);
                    }

                    yield {
                      id: parsed.id,
                      delta: parsed.choices?.[0]?.delta || {},
                      choices: parsed.choices || [],
                      created: parsed.created,
                      model: parsed.model,
                      object: parsed.object,
                    };
                  } catch (parseError) {
                    console.warn('Failed to parse streaming chunk:', parseError);
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }

        } catch (error) {
          console.error('SemanticKernelService.streamChat error:', error);

          if (this.config.fallbackToMock) {
            yield* this.mockStreamingResponse(messages, options);
            return;
          }

          throw new Error(`Streaming chat request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      public async searchCars(criteria: Record<string, any>, options: ChatOptions = {}): Promise<any> {
        try {
          if (!this.healthStatus.healthy && !this.config.fallbackToMock) {
            throw new Error('Backend service is unavailable');
          }

          const requestPayload = {
            criteria,
            sessionId: options.sessionId,
          };

          const response = await this.httpClient.post(
            this.configManager.getEndpoints().search,
            requestPayload
          );

          return response.data;

        } catch (error) {
          console.error('SemanticKernelService.searchCars error:', error);

          if (this.config.fallbackToMock) {
            return this.mockSearchResponse(criteria);
          }

          throw new Error(`Car search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      public async getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
        try {
          const response = await this.httpClient.get(
            `${this.configManager.getEndpoints().session}/${sessionId}`
          );

          if (response.data.success) {
            return response.data.messages || [];
          }

          return [];
        } catch (error) {
          console.error('Failed to get session history:', error);
          return [];
        }
      }

      public async clearSession(sessionId: string): Promise<boolean> {
        try {
          const response = await this.httpClient.delete(
            `${this.configManager.getEndpoints().session}/${sessionId}`
          );

          return response.data.success || false;
        } catch (error) {
          console.error('Failed to clear session:', error);
          return false;
        }
      }

      public async checkHealth(): Promise<BackendHealthStatus> {
        try {
          const response = await this.httpClient.get(
            this.configManager.getEndpoints().health,
            { timeout: 5000 }
          );

          this.healthStatus = {
            healthy: response.status === 200,
            lastCheck: new Date(),
          };

          return this.healthStatus;
        } catch (error) {
          this.healthStatus = {
            healthy: false,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };

          return this.healthStatus;
        }
      }

      private startHealthChecking(): void {
        this.healthCheckTimer = setInterval(async () => {
          await this.checkHealth();
        }, this.config.healthCheckInterval);
      }

      private stopHealthChecking(): void {
        if (this.healthCheckTimer) {
          clearInterval(this.healthCheckTimer);
          this.healthCheckTimer = undefined;
        }
      }

      private generateId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      private mockChatResponse(messages: ChatMessage[], options: ChatOptions): ChatResponse {
        const userMessage = messages[messages.length - 1];
        return {
          id: this.generateId(),
          role: 'assistant',
          content: `Mock response to: "${userMessage.content}" (Backend unavailable)`,
          createdAt: new Date().toISOString(),
          metadata: { source: 'mock', sessionId: options.sessionId },
        };
      }

      private async *mockStreamingResponse(
        messages: ChatMessage[],
        options: ChatOptions
      ): AsyncGenerator<StreamingChatResponse, void, unknown> {
        const userMessage = messages[messages.length - 1];
        const words = `Mock streaming response to: "${userMessage.content}" (Backend unavailable)`.split(' ');
        const responseId = this.generateId();

        for (let i = 0; i < words.length; i++) {
          yield {
            id: responseId,
            delta: { content: words[i] + (i < words.length - 1 ? ' ' : '') },
            choices: [{
              index: 0,
              delta: { content: words[i] + (i < words.length - 1 ? ' ' : '') },
              finish_reason: i === words.length - 1 ? 'stop' : null,
            }],
            created: Math.floor(Date.now() / 1000),
            model: 'mock-model',
            object: 'chat.completion.chunk',
          };

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      private mockSearchResponse(criteria: Record<string, any>): any {
        return {
          success: true,
          data: {
            cars: [
              {
                id: 'mock-1',
                make: 'Toyota',
                model: 'Camry',
                year: 2023,
                price: 25000,
                note: 'Mock data - backend unavailable',
              },
            ],
            total: 1,
            criteria,
          },
        };
      }

      public destroy(): void {
        this.stopHealthChecking();
      }
    }
    ```

- [ ] **Sub-Task 4: Service Factory Integration**
  - **Description:** Update AI service factory to use new SemanticKernelService

    ```typescript
    // File Path: CarFind/lib/services/ai-service-factory.ts
    // Updated service factory with FastAPI backend integration

    /**
     * AI Service Factory - Phase 3 Backend Integration
     */

    import { AIService } from '@/lib/types/ai-types';
    import { SemanticKernelService } from './semantic-kernel-service';

    export type ServiceType = 'semantic-kernel' | 'openai' | 'mock';

    export interface ServiceFactoryConfig {
      defaultService: ServiceType;
      enableFallback: boolean;
      backendUrl?: string;
    }

    export class AIServiceFactory {
      private static instance: AIServiceFactory;
      private services: Map<ServiceType, AIService> = new Map();
      private config: ServiceFactoryConfig;

      private constructor(config: Partial<ServiceFactoryConfig> = {}) {
        this.config = {
          defaultService: 'semantic-kernel',
          enableFallback: true,
          ...config,
        };
      }

      public static getInstance(config?: Partial<ServiceFactoryConfig>): AIServiceFactory {
        if (!AIServiceFactory.instance) {
          AIServiceFactory.instance = new AIServiceFactory(config);
        }
        return AIServiceFactory.instance;
      }

      public async getService(type?: ServiceType): Promise<AIService> {
        const serviceType = type || this.config.defaultService;

        if (this.services.has(serviceType)) {
          return this.services.get(serviceType)!;
        }

        const service = await this.createService(serviceType);
        this.services.set(serviceType, service);
        return service;
      }

      public async getDefaultService(): Promise<AIService> {
        return this.getService(this.config.defaultService);
      }

      private async createService(type: ServiceType): Promise<AIService> {
        switch (type) {
          case 'semantic-kernel':
            return new SemanticKernelService({
              enableHealthChecking: true,
              fallbackToMock: this.config.enableFallback,
              healthCheckInterval: 60000,
            });

          case 'openai':
            // Lazy import to avoid loading if not needed
            const { OpenAIService } = await import('./openai-service');
            return new OpenAIService();

          case 'mock':
            const { MockAIService } = await import('./mock-ai-service');
            return new MockAIService();

          default:
            throw new Error(`Unknown service type: ${type}`);
        }
      }

      public async switchService(type: ServiceType): Promise<AIService> {
        // Clean up existing service if needed
        const existingService = this.services.get(type);
        if (existingService && 'destroy' in existingService) {
          (existingService as any).destroy();
        }

        this.services.delete(type);
        return this.getService(type);
      }

      public getServiceHealth(type: ServiceType): Promise<any> {
        const service = this.services.get(type);
        if (service && 'checkHealth' in service) {
          return (service as any).checkHealth();
        }
        return Promise.resolve({ healthy: false, error: 'Service not found or health check not available' });
      }

      public clearCache(): void {
        // Clean up all services
        for (const [type, service] of this.services.entries()) {
          if ('destroy' in service) {
            (service as any).destroy();
          }
        }
        this.services.clear();
      }
    }

    // Convenience function for getting the default service
    export async function getAIService(): Promise<AIService> {
      const factory = AIServiceFactory.getInstance();
      return factory.getDefaultService();
    }

    // Hook for React components
    export function useAIService(type?: ServiceType) {
      const [service, setService] = useState<AIService | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const initService = async () => {
          try {
            setLoading(true);
            setError(null);
            const factory = AIServiceFactory.getInstance();
            const aiService = await factory.getService(type);
            setService(aiService);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initialize AI service');
          } finally {
            setLoading(false);
          }
        };

        initService();
      }, [type]);

      return { service, loading, error };
    }
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- SemanticKernelService successfully connecting to FastAPI backend endpoints
- Existing interface compatibility maintained preventing frontend component breakage
- Connection health monitoring operational with automatic fallback mechanisms working
- Configuration management effective for backend URL and service settings
- Seamless user experience during service transition with comprehensive error handling
- All existing frontend components working without modification

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Backend configuration management implemented with environment variables
- [ ] HTTP client created with retry logic and error handling
- [ ] SemanticKernelService updated to use FastAPI backend
- [ ] Service factory integration updated for new service implementation
- [ ] Health monitoring and fallback mechanisms operational
- [ ] Streaming functionality working with FastAPI backend
- [ ] Session management integrated with backend endpoints
- [ ] All existing frontend interfaces remain compatible
- [ ] Code follows TypeScript best practices with comprehensive type safety

---

## 9. Risks & Mitigations

- **Risk**: Service compatibility breaking existing frontend components → **Mitigation**: Maintain exact interface compatibility with comprehensive testing
- **Risk**: Network connectivity issues affecting user experience → **Mitigation**: Robust retry logic and fallback mechanisms
- **Risk**: Streaming implementation complexity with backend → **Mitigation**: Comprehensive stream handling with error recovery
- **Risk**: Configuration management complexity → **Mitigation**: Clear configuration hierarchy with environment variable support
- **Risk**: Health monitoring performance impact → **Mitigation**: Efficient background checking with configurable intervals

---

## 10. Self-Assessment Checklist

- [ ] Service integration provides seamless backend connectivity
- [ ] Interface compatibility ensures zero frontend modifications required
- [ ] Health monitoring provides reliable service availability detection
- [ ] Error handling provides graceful degradation for network issues
- [ ] Configuration management enables flexible deployment scenarios

---
