---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Service Layer Implementation

## Task Meta

- **Task ID:** TASK-02
- **Task Name:** Service Layer Implementation
- **Phase:** Phase 2.1 - API Abstraction Layer Setup
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** ✅ COMPLETED

## 1. Overview

- **Description**:
  Create abstraction layer with dependency injection following SOLID principles, specifically Single Responsibility and Dependency Inversion principles, to enable flexible AI service management.

## 2. Objectives

- Implement OpenAI service with dependency injection pattern
- Create service abstraction layer following SOLID principles
- Enable seamless AI service switching through interface implementation
- Maintain compatibility with existing Phase 1 Vercel AI SDK integration
- Prepare foundation for Semantic Kernel service integration in Phase 3

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 01 (TypeScript Interface Contracts) is completed
- [ ] AI service interfaces are available in `lib/types/ai-service.ts`
- [ ] Chat data models are defined in `lib/types/chat.ts`
- [ ] Phase 1 OpenAI API integration is functional
- [ ] Project structure supports new service layer directory

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- OpenAI API integration from Phase 1 `app/api/chat/route.ts`
- Vercel AI SDK `streamText` function for streaming responses
- Environment variable management from Phase 1 `.env.local`
- Existing tool integration pattern from Phase 1

### 4.2 Framework Dependencies

- @ai-sdk/openai package from Phase 1
- Vercel AI SDK streaming capabilities
- TypeScript interfaces from Task 01
- Zod for runtime validation

---

## 5. Testing Strategy

- **Unit Tests:** Test each service class independently with mock dependencies
- **Integration Tests:** Verify service integration with existing API routes
- **Manual Tests:** Validate streaming responses and error handling work correctly

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-005`                  | `AI service switching support`  | `lib/services/openai-service.ts`                    | `TEST-U-001`    |
| `NFR-003`                  | `SOLID principles compliance`  | `lib/services/base-ai-service.ts`                   | `TEST-U-002`    |
| `NFR-002`                  | `Multiple AI service scalability`  | `lib/services/ai-service-factory.ts`                   | `TEST-I-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Implement a service layer that abstracts AI provider interactions using dependency injection and factory patterns. Follow Single Responsibility Principle by creating focused service classes and Dependency Inversion Principle by depending on abstractions rather than concrete implementations.

### 7.2 Sub-Tasks

- [x] **Sub-Task 1: Base AI Service Abstract Class** ✅ COMPLETED
  - **Description:** Create abstract base class for common AI service functionality

    ```typescript
    // File Path: CarFind/lib/services/base-ai-service.ts
    // SOLID: Single Responsibility + Template Method Pattern
    import { AIService, AIServiceConfig, ChatRequest, ChatResponse } from '@/lib/types/ai-service';
    import { APIError } from '@/lib/types/errors';

    export abstract class BaseAIService implements AIService {
      protected config: AIServiceConfig;

      constructor(config: AIServiceConfig) {
        this.validateConfig(config);
        this.config = config;
      }

      abstract generateResponse(request: ChatRequest): Promise<ChatResponse>;
      abstract generateStreamResponse(request: ChatRequest): AsyncGenerator<string, ChatResponse>;

      protected validateConfig(config: AIServiceConfig): void {
        if (!config.apiKey) {
          throw new APIError('API key is required', 'MISSING_API_KEY');
        }
        if (!config.model) {
          throw new APIError('Model is required', 'MISSING_MODEL');
        }
      }

      protected handleError(error: unknown, operation: string): APIError {
        if (error instanceof APIError) {
          return error;
        }
        
        return new APIError(
          `Service operation failed: ${operation}`,
          'SERVICE_ERROR',
          { originalError: error }
        );
      }

      protected createChatMessage(role: 'user' | 'assistant' | 'system', content: string, metadata?: Record<string, unknown>) {
        return {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date(),
          metadata
        };
      }
    }
    ```

- [x] **Sub-Task 2: OpenAI Service Implementation** ✅ COMPLETED
  - **Description:** Implement OpenAI-specific service with streaming support

    ```typescript
    // File Path: CarFind/lib/services/openai-service.ts
    // SOLID: Single Responsibility + Dependency Inversion
    import { openai } from '@ai-sdk/openai';
    import { streamText, generateText } from 'ai';
    import { BaseAIService } from './base-ai-service';
    import { ChatRequest, ChatResponse, AIServiceConfig } from '@/lib/types/ai-service';
    import { ChatMessage } from '@/lib/types/chat';

    export class OpenAIService extends BaseAIService {
      constructor(config: AIServiceConfig) {
        super(config);
      }

      async generateResponse(request: ChatRequest): Promise<ChatResponse> {
        try {
          const { text, usage } = await generateText({
            model: openai(this.config.model),
            messages: this.formatMessagesForOpenAI(request.messages),
            maxTokens: request.maxTokens || this.config.maxTokens,
            temperature: request.temperature || this.config.temperature,
            tools: request.tools
          });

          const responseMessage = this.createChatMessage('assistant', text);

          return {
            message: responseMessage,
            sessionId: request.sessionId || crypto.randomUUID(),
            usage: usage ? {
              promptTokens: usage.promptTokens,
              completionTokens: usage.completionTokens,
              totalTokens: usage.totalTokens
            } : undefined
          };
        } catch (error) {
          throw this.handleError(error, 'generateResponse');
        }
      }

      async* generateStreamResponse(request: ChatRequest): AsyncGenerator<string, ChatResponse> {
        try {
          const result = streamText({
            model: openai(this.config.model),
            messages: this.formatMessagesForOpenAI(request.messages),
            maxTokens: request.maxTokens || this.config.maxTokens,
            temperature: request.temperature || this.config.temperature,
            tools: request.tools
          });

          let fullText = '';
          
          for await (const chunk of result.textStream) {
            fullText += chunk;
            yield chunk;
          }

          const finalResult = await result.finishReason;
          const usage = await result.usage;
          
          const responseMessage = this.createChatMessage('assistant', fullText);

          return {
            message: responseMessage,
            sessionId: request.sessionId || crypto.randomUUID(),
            usage: usage ? {
              promptTokens: usage.promptTokens,
              completionTokens: usage.completionTokens,
              totalTokens: usage.totalTokens
            } : undefined,
            metadata: { finishReason: finalResult }
          };
        } catch (error) {
          throw this.handleError(error, 'generateStreamResponse');
        }
      }

      private formatMessagesForOpenAI(messages: ChatMessage[]) {
        return messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      }
    }
    ```

- [x] **Sub-Task 3: AI Service Factory** ✅ COMPLETED
  - **Description:** Implement factory pattern for service instantiation following Open/Closed Principle

    ```typescript
    // File Path: CarFind/lib/services/ai-service-factory.ts
    // SOLID: Open/Closed Principle + Factory Pattern
    import { AIService, AIServiceType, AIServiceConfig } from '@/lib/types/ai-service';
    import { OpenAIService } from './openai-service';
    import { APIError } from '@/lib/types/errors';

    export class AIServiceFactory {
      private static serviceRegistry = new Map<AIServiceType, typeof BaseAIService>();

      static {
        // Register available services
        this.registerService('openai', OpenAIService);
      }

      static registerService(type: AIServiceType, serviceClass: typeof BaseAIService): void {
        this.serviceRegistry.set(type, serviceClass);
      }

      static create(type: AIServiceType, config: AIServiceConfig): AIService {
        const ServiceClass = this.serviceRegistry.get(type);
        
        if (!ServiceClass) {
          throw new APIError(
            `AI service type '${type}' is not supported`,
            'UNSUPPORTED_SERVICE_TYPE',
            { supportedTypes: Array.from(this.serviceRegistry.keys()) }
          );
        }

        try {
          return new ServiceClass(config) as AIService;
        } catch (error) {
          throw new APIError(
            `Failed to create AI service of type '${type}'`,
            'SERVICE_CREATION_FAILED',
            { originalError: error }
          );
        }
      }

      static getAvailableServices(): AIServiceType[] {
        return Array.from(this.serviceRegistry.keys());
      }

      static isServiceSupported(type: AIServiceType): boolean {
        return this.serviceRegistry.has(type);
      }
    }
    ```

- [x] **Sub-Task 4: Service Container for Dependency Injection** ✅ COMPLETED
  - **Description:** Create simple dependency injection container for service management

    ```typescript
    // File Path: CarFind/lib/services/service-container.ts
    // SOLID: Dependency Inversion Principle
    import { AIService, AIServiceType, AIServiceConfig } from '@/lib/types/ai-service';
    import { AIServiceFactory } from './ai-service-factory';
    import { APIError } from '@/lib/types/errors';

    export class ServiceContainer {
      private static instance: ServiceContainer;
      private services = new Map<string, AIService>();
      private configs = new Map<AIServiceType, AIServiceConfig>();

      private constructor() {}

      static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
          ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
      }

      registerConfig(type: AIServiceType, config: AIServiceConfig): void {
        this.configs.set(type, config);
      }

      getService(type: AIServiceType, sessionId?: string): AIService {
        const key = sessionId ? `${type}-${sessionId}` : type;
        
        if (!this.services.has(key)) {
          const config = this.configs.get(type);
          if (!config) {
            throw new APIError(
              `No configuration found for service type '${type}'`,
              'MISSING_SERVICE_CONFIG'
            );
          }

          const service = AIServiceFactory.create(type, config);
          this.services.set(key, service);
        }

        return this.services.get(key)!;
      }

      clearServices(): void {
        this.services.clear();
      }

      getAvailableServiceTypes(): AIServiceType[] {
        return Array.from(this.configs.keys());
      }
    }

    // Export singleton instance
    export const serviceContainer = ServiceContainer.getInstance();
    ```

- [x] **Sub-Task 5: Semantic Kernel Service Placeholder** ✅ COMPLETED
  - **Description:** Create service stub for Phase 3 integration following same interface

    ```typescript
    // File Path: CarFind/lib/services/semantic-kernel-service.ts
    // Phase 3 preparation with proper interface implementation
    import { BaseAIService } from './base-ai-service';
    import { ChatRequest, ChatResponse, AIServiceConfig } from '@/lib/types/ai-service';
    import { APIError } from '@/lib/types/errors';

    export class SemanticKernelService extends BaseAIService {
      constructor(config: AIServiceConfig) {
        super(config);
      }

      async generateResponse(request: ChatRequest): Promise<ChatResponse> {
        throw new APIError(
          'Semantic Kernel service implementation pending Phase 3',
          'SERVICE_NOT_IMPLEMENTED',
          { 
            phase: 'Phase 3',
            service: 'SemanticKernelService',
            request: { sessionId: request.sessionId, messageCount: request.messages.length }
          }
        );
      }

      async* generateStreamResponse(request: ChatRequest): AsyncGenerator<string, ChatResponse> {
        throw new APIError(
          'Semantic Kernel streaming service implementation pending Phase 3',
          'SERVICE_NOT_IMPLEMENTED',
          { 
            phase: 'Phase 3',
            service: 'SemanticKernelService',
            feature: 'streaming'
          }
        );
        
        // TypeScript requires a yield for generator function
        yield '';
        return {} as ChatResponse;
      }
    }

    // Register with factory for future use
    // This will be uncommented in Phase 3
    // AIServiceFactory.registerService('semantic-kernel', SemanticKernelService);
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- All service classes follow SOLID principles with proper dependency injection
- OpenAI service maintains full compatibility with Phase 1 functionality
- Service factory successfully manages OpenAI service instantiation
- Streaming responses work correctly through service abstraction
- Service container provides proper dependency management

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] OpenAI service passes all integration tests with existing API routes.
- [ ] Service factory creates services without errors.
- [ ] Dependency injection container manages service lifecycle correctly.
- [ ] Error handling is comprehensive and provides actionable feedback.
- [ ] Semantic Kernel service placeholder is ready for Phase 3 implementation.

---

## 9. Risks & Mitigations

- **Risk**: Breaking existing OpenAI integration from Phase 1 → **Mitigation**: Maintain API compatibility, thorough integration testing
- **Risk**: Over-engineering service abstraction → **Mitigation**: Follow YAGNI principle, implement only necessary abstractions
- **Risk**: Performance degradation from service layer → **Mitigation**: Keep service layer lightweight, profile critical paths
- **Risk**: Complex dependency injection leading to debugging issues → **Mitigation**: Simple container design, clear error messages

---

## 10. Self-Assessment Checklist

- [ ] All service classes implement SOLID principles correctly
- [ ] OpenAI service maintains backward compatibility with Phase 1
- [ ] Factory pattern enables easy service type switching
- [ ] Dependency injection container is simple and debuggable
- [ ] Error handling provides clear, actionable information
- [ ] Service layer is prepared for Semantic Kernel integration in Phase 3

---
