---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Configuration Management

## Task Meta

- **Task ID:** TASK-03
- **Task Name:** Configuration Management
- **Phase:** Phase 2.1 - API Abstraction Layer Setup
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Eliminate magic strings with centralized configuration management following CoE (Center of Excellence) standards and SOLID principles, creating a robust foundation for multiple AI service configurations.

## 2. Objectives

- Eliminate all magic strings from the codebase following CoE standards
- Create centralized configuration management for AI services
- Implement environment variable validation and type safety
- Establish configuration patterns for both OpenAI and future Semantic Kernel
- Ensure secure credential management and validation

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 01 (TypeScript Interface Contracts) is completed
- [ ] Task 02 (Service Layer Implementation) is completed
- [ ] AI service interfaces and types are available
- [ ] Phase 1 environment variables are functional in `.env.local`
- [ ] Understanding of existing OpenAI API configuration from Phase 1

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Environment variable management from Phase 1 `.env.local`
- OpenAI API key configuration from Phase 1
- Next.js environment variable handling (`process.env`)
- Vercel deployment environment variable management

### 4.2 Framework Dependencies

- Zod for runtime validation and type safety
- TypeScript for compile-time configuration validation
- Next.js environment variable system
- AI service interfaces from Tasks 01 and 02

---

## 5. Testing Strategy

- **Unit Tests:** Validate configuration loading and validation logic
- **Integration Tests:** Verify configuration integration with service layer
- **Manual Tests:** Test environment variable validation and error messages

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `NFR-003`                  | `Zero magic strings policy`  | `lib/config/ai-config.ts`                    | `TEST-U-001`    |
| `NFR-005`                  | `Environment variable security`  | `lib/config/env-validation.ts`                   | `TEST-U-002`    |
| `REQ-005`                  | `AI service configuration support`  | `lib/config/constants.ts`                   | `TEST-I-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Create a centralized configuration system that eliminates magic strings, provides type-safe environment variable handling, and supports multiple AI service configurations. Follow Single Responsibility Principle by separating configuration concerns into focused modules.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Environment Variable Validation**
  - **Description:** Create comprehensive environment variable validation with Zod schemas

    ```typescript
    // File Path: CarFind/lib/config/env-validation.ts
    // CoE: Zero magic strings, comprehensive validation
    import { z } from 'zod';
    import { APIError } from '@/lib/types/errors';

    const envSchema = z.object({
      // OpenAI Configuration
      OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
      
      // Supabase Configuration (for Phase 2.2)
      NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required').optional(),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required').optional(),
      
      // Application Configuration
      AUTH_SECRET: z.string().min(32, 'Auth secret must be at least 32 characters'),
      
      // Environment Configuration
      NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
      
      // Optional Semantic Kernel Configuration (Phase 3 preparation)
      SEMANTIC_KERNEL_API_KEY: z.string().optional(),
      SEMANTIC_KERNEL_ENDPOINT: z.string().url('Invalid Semantic Kernel endpoint').optional(),
      
      // Application Settings
      MAX_TOKENS_DEFAULT: z.string().transform(Number).pipe(z.number().min(1).max(4096)).default('1000'),
      TEMPERATURE_DEFAULT: z.string().transform(Number).pipe(z.number().min(0).max(2)).default('0.7'),
    });

    export type ValidatedEnv = z.infer<typeof envSchema>;

    let cachedEnv: ValidatedEnv | null = null;

    export function getValidatedEnv(): ValidatedEnv {
      if (cachedEnv) {
        return cachedEnv;
      }

      try {
        cachedEnv = envSchema.parse(process.env);
        return cachedEnv;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors
            .map(err => `${err.path.join('.')}: ${err.message}`)
            .join('\n');
          
          throw new APIError(
            `Environment variable validation failed:\n${errorMessage}`,
            'ENV_VALIDATION_FAILED',
            { validationErrors: error.errors }
          );
        }
        
        throw new APIError(
          'Failed to validate environment variables',
          'ENV_VALIDATION_ERROR',
          { originalError: error }
        );
      }
    }

    export function isProduction(): boolean {
      return getValidatedEnv().NODE_ENV === 'production';
    }

    export function isDevelopment(): boolean {
      return getValidatedEnv().NODE_ENV === 'development';
    }
    ```

- [ ] **Sub-Task 2: Constants and Configuration Types**
  - **Description:** Define all constants and configuration types to eliminate magic strings

    ```typescript
    // File Path: CarFind/lib/config/constants.ts
    // CoE: Zero magic strings policy implementation
    export const API_ROUTES = {
      CHAT: '/api/chat',
      SESSIONS: '/api/sessions',
      HEALTH: '/api/health'
    } as const;

    export const AI_MODELS = {
      OPENAI: {
        GPT_4O: 'gpt-4o',
        GPT_4O_MINI: 'gpt-4o-mini',
        GPT_3_5_TURBO: 'gpt-3.5-turbo'
      },
      SEMANTIC_KERNEL: {
        // Phase 3 preparation
        AZURE_OPENAI: 'azure-openai',
        OPENAI: 'openai'
      }
    } as const;

    export const SERVICE_TYPES = {
      OPENAI: 'openai',
      SEMANTIC_KERNEL: 'semantic-kernel'
    } as const;

    export const MESSAGE_ROLES = {
      USER: 'user',
      ASSISTANT: 'assistant',
      SYSTEM: 'system'
    } as const;

    export const ERROR_CODES = {
      MISSING_API_KEY: 'MISSING_API_KEY',
      MISSING_MODEL: 'MISSING_MODEL',
      UNSUPPORTED_SERVICE_TYPE: 'UNSUPPORTED_SERVICE_TYPE',
      SERVICE_CREATION_FAILED: 'SERVICE_CREATION_FAILED',
      SERVICE_ERROR: 'SERVICE_ERROR',
      ENV_VALIDATION_FAILED: 'ENV_VALIDATION_FAILED',
      ENV_VALIDATION_ERROR: 'ENV_VALIDATION_ERROR'
    } as const;

    export const HTTP_STATUS_CODES = {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503
    } as const;

    export const LIMITS = {
      MAX_TOKENS: {
        DEFAULT: 1000,
        MAX: 4096,
        MIN: 1
      },
      TEMPERATURE: {
        DEFAULT: 0.7,
        MAX: 2.0,
        MIN: 0.0
      },
      MAX_MESSAGES_PER_SESSION: 100,
      MAX_SESSION_TITLE_LENGTH: 100
    } as const;

    export const TIMEOUT_VALUES = {
      AI_REQUEST: 30000, // 30 seconds
      DATABASE_QUERY: 5000, // 5 seconds
      STREAM_TIMEOUT: 60000 // 60 seconds
    } as const;
    ```

- [ ] **Sub-Task 3: AI Service Configuration**
  - **Description:** Create comprehensive AI service configuration management

    ```typescript
    // File Path: CarFind/lib/config/ai-config.ts
    // CoE: Zero magic strings, centralized configuration
    import { AIServiceConfig, AIServiceType } from '@/lib/types/ai-service';
    import { getValidatedEnv } from './env-validation';
    import { AI_MODELS, SERVICE_TYPES, LIMITS } from './constants';

    export class AIConfigManager {
      private static instance: AIConfigManager;
      private configs: Map<AIServiceType, AIServiceConfig> = new Map();
      private env = getValidatedEnv();

      private constructor() {
        this.initializeConfigs();
      }

      static getInstance(): AIConfigManager {
        if (!AIConfigManager.instance) {
          AIConfigManager.instance = new AIConfigManager();
        }
        return AIConfigManager.instance;
      }

      private initializeConfigs(): void {
        // OpenAI Configuration
        this.configs.set(SERVICE_TYPES.OPENAI, {
          apiKey: this.env.OPENAI_API_KEY,
          model: AI_MODELS.OPENAI.GPT_4O,
          maxTokens: this.env.MAX_TOKENS_DEFAULT,
          temperature: this.env.TEMPERATURE_DEFAULT,
          baseUrl: 'https://api.openai.com/v1'
        });

        // Semantic Kernel Configuration (Phase 3 preparation)
        if (this.env.SEMANTIC_KERNEL_API_KEY) {
          this.configs.set(SERVICE_TYPES.SEMANTIC_KERNEL, {
            apiKey: this.env.SEMANTIC_KERNEL_API_KEY,
            model: AI_MODELS.SEMANTIC_KERNEL.OPENAI,
            maxTokens: this.env.MAX_TOKENS_DEFAULT,
            temperature: this.env.TEMPERATURE_DEFAULT,
            baseUrl: this.env.SEMANTIC_KERNEL_ENDPOINT
          });
        }
      }

      getConfig(serviceType: AIServiceType): AIServiceConfig {
        const config = this.configs.get(serviceType);
        if (!config) {
          throw new Error(`No configuration found for service type: ${serviceType}`);
        }
        return { ...config }; // Return copy to prevent mutations
      }

      getAllConfigs(): Record<AIServiceType, AIServiceConfig> {
        const result: Partial<Record<AIServiceType, AIServiceConfig>> = {};
        this.configs.forEach((config, type) => {
          result[type] = { ...config };
        });
        return result as Record<AIServiceType, AIServiceConfig>;
      }

      getAvailableServiceTypes(): AIServiceType[] {
        return Array.from(this.configs.keys());
      }

      updateConfig(serviceType: AIServiceType, updates: Partial<AIServiceConfig>): void {
        const currentConfig = this.getConfig(serviceType);
        const updatedConfig: AIServiceConfig = {
          ...currentConfig,
          ...updates
        };

        // Validate updated configuration
        this.validateConfig(updatedConfig);
        this.configs.set(serviceType, updatedConfig);
      }

      private validateConfig(config: AIServiceConfig): void {
        if (!config.apiKey || config.apiKey.trim().length === 0) {
          throw new Error('API key is required and cannot be empty');
        }

        if (!config.model || config.model.trim().length === 0) {
          throw new Error('Model is required and cannot be empty');
        }

        if (config.maxTokens && (config.maxTokens < LIMITS.MAX_TOKENS.MIN || config.maxTokens > LIMITS.MAX_TOKENS.MAX)) {
          throw new Error(`Max tokens must be between ${LIMITS.MAX_TOKENS.MIN} and ${LIMITS.MAX_TOKENS.MAX}`);
        }

        if (config.temperature && (config.temperature < LIMITS.TEMPERATURE.MIN || config.temperature > LIMITS.TEMPERATURE.MAX)) {
          throw new Error(`Temperature must be between ${LIMITS.TEMPERATURE.MIN} and ${LIMITS.TEMPERATURE.MAX}`);
        }
      }
    }

    // Export singleton instance and convenience functions
    export const aiConfigManager = AIConfigManager.getInstance();

    export function getAIConfig(serviceType: AIServiceType): AIServiceConfig {
      return aiConfigManager.getConfig(serviceType);
    }

    export function getAllAIConfigs(): Record<AIServiceType, AIServiceConfig> {
      return aiConfigManager.getAllConfigs();
    }
    ```

- [ ] **Sub-Task 4: Database Configuration**
  - **Description:** Create Supabase configuration management for Phase 2.2 preparation

    ```typescript
    // File Path: CarFind/lib/config/database-config.ts
    // Supabase configuration for Phase 2.2 integration
    import { getValidatedEnv } from './env-validation';
    import { APIError } from '@/lib/types/errors';

    export interface DatabaseConfig {
      url: string;
      anonKey: string;
      serviceRoleKey?: string;
    }

    export class DatabaseConfigManager {
      private static instance: DatabaseConfigManager;
      private config: DatabaseConfig | null = null;
      private env = getValidatedEnv();

      private constructor() {
        this.initializeConfig();
      }

      static getInstance(): DatabaseConfigManager {
        if (!DatabaseConfigManager.instance) {
          DatabaseConfigManager.instance = new DatabaseConfigManager();
        }
        return DatabaseConfigManager.instance;
      }

      private initializeConfig(): void {
        if (this.env.NEXT_PUBLIC_SUPABASE_URL && this.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          this.config = {
            url: this.env.NEXT_PUBLIC_SUPABASE_URL,
            anonKey: this.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            serviceRoleKey: this.env.SUPABASE_SERVICE_ROLE_KEY
          };
        }
      }

      getConfig(): DatabaseConfig {
        if (!this.config) {
          throw new APIError(
            'Database configuration not available. Supabase environment variables not set.',
            'DATABASE_CONFIG_MISSING',
            { 
              required: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
              phase: 'Phase 2.2'
            }
          );
        }
        return { ...this.config };
      }

      isConfigured(): boolean {
        return this.config !== null;
      }

      getClientConfig(): Pick<DatabaseConfig, 'url' | 'anonKey'> {
        const config = this.getConfig();
        return {
          url: config.url,
          anonKey: config.anonKey
        };
      }

      getServerConfig(): DatabaseConfig {
        const config = this.getConfig();
        if (!config.serviceRoleKey) {
          throw new APIError(
            'Service role key required for server-side database operations',
            'MISSING_SERVICE_ROLE_KEY'
          );
        }
        return config;
      }
    }

    export const databaseConfigManager = DatabaseConfigManager.getInstance();

    export function getDatabaseConfig(): DatabaseConfig {
      return databaseConfigManager.getConfig();
    }

    export function isDatabaseConfigured(): boolean {
      return databaseConfigManager.isConfigured();
    }
    ```

- [ ] **Sub-Task 5: Configuration Initialization and Health Check**
  - **Description:** Create configuration initialization and health check utilities

    ```typescript
    // File Path: CarFind/lib/config/config-health.ts
    // Configuration health checks and initialization
    import { aiConfigManager } from './ai-config';
    import { databaseConfigManager } from './database-config';
    import { getValidatedEnv } from './env-validation';
    import { SERVICE_TYPES } from './constants';
    import { APIError } from '@/lib/types/errors';

    export interface ConfigHealthStatus {
      overall: 'healthy' | 'warning' | 'error';
      environment: {
        status: 'healthy' | 'error';
        message?: string;
      };
      aiServices: {
        status: 'healthy' | 'warning' | 'error';
        services: Record<string, { status: 'healthy' | 'error'; message?: string }>;
      };
      database: {
        status: 'healthy' | 'warning' | 'error';
        message?: string;
      };
    }

    export function checkConfigHealth(): ConfigHealthStatus {
      const health: ConfigHealthStatus = {
        overall: 'healthy',
        environment: { status: 'healthy' },
        aiServices: { status: 'healthy', services: {} },
        database: { status: 'healthy' }
      };

      // Check environment variables
      try {
        getValidatedEnv();
      } catch (error) {
        health.environment.status = 'error';
        health.environment.message = error instanceof Error ? error.message : 'Environment validation failed';
        health.overall = 'error';
      }

      // Check AI service configurations
      try {
        const availableServices = aiConfigManager.getAvailableServiceTypes();
        
        for (const serviceType of Object.values(SERVICE_TYPES)) {
          try {
            aiConfigManager.getConfig(serviceType);
            health.aiServices.services[serviceType] = { status: 'healthy' };
          } catch (error) {
            health.aiServices.services[serviceType] = {
              status: 'error',
              message: error instanceof Error ? error.message : 'Configuration error'
            };
            
            if (serviceType === SERVICE_TYPES.OPENAI) {
              // OpenAI is required
              health.aiServices.status = 'error';
              health.overall = 'error';
            } else {
              // Other services are optional for now
              if (health.aiServices.status === 'healthy') {
                health.aiServices.status = 'warning';
              }
              if (health.overall === 'healthy') {
                health.overall = 'warning';
              }
            }
          }
        }
      } catch (error) {
        health.aiServices.status = 'error';
        health.overall = 'error';
      }

      // Check database configuration
      try {
        if (databaseConfigManager.isConfigured()) {
          databaseConfigManager.getConfig();
        } else {
          health.database.status = 'warning';
          health.database.message = 'Database not configured (Phase 2.2)';
          if (health.overall === 'healthy') {
            health.overall = 'warning';
          }
        }
      } catch (error) {
        health.database.status = 'error';
        health.database.message = error instanceof Error ? error.message : 'Database configuration error';
        health.overall = 'error';
      }

      return health;
    }

    export function initializeConfiguration(): void {
      const health = checkConfigHealth();
      
      if (health.overall === 'error') {
        const errors: string[] = [];
        
        if (health.environment.status === 'error') {
          errors.push(`Environment: ${health.environment.message}`);
        }
        
        if (health.aiServices.status === 'error') {
          Object.entries(health.aiServices.services).forEach(([service, status]) => {
            if (status.status === 'error') {
              errors.push(`AI Service ${service}: ${status.message}`);
            }
          });
        }
        
        if (health.database.status === 'error') {
          errors.push(`Database: ${health.database.message}`);
        }
        
        throw new APIError(
          `Configuration initialization failed:\n${errors.join('\n')}`,
          'CONFIG_INIT_FAILED',
          { health }
        );
      }
    }
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Zero magic strings remain in the codebase following CoE standards
- All environment variables are validated with comprehensive error messages
- Configuration management supports both OpenAI and future Semantic Kernel
- Configuration health checks provide clear status and error information
- All configurations are type-safe and properly validated

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] Environment variable validation passes with proper error messages.
- [ ] AI service configurations are centralized and type-safe.
- [ ] Database configuration is prepared for Phase 2.2 integration.
- [ ] Configuration health checks provide comprehensive status information.
- [ ] No magic strings exist anywhere in the codebase.

---

## 9. Risks & Mitigations

- **Risk**: Breaking existing environment variable usage → **Mitigation**: Gradual migration, maintain backward compatibility during transition
- **Risk**: Over-complicated configuration management → **Mitigation**: Follow KISS principle, implement only necessary configuration features
- **Risk**: Security issues with credential management → **Mitigation**: Use Zod validation, never log sensitive values, proper environment variable handling
- **Risk**: Performance impact from validation overhead → **Mitigation**: Cache validated configurations, validate only once at startup

---

## 10. Self-Assessment Checklist

- [ ] All magic strings have been eliminated and replaced with constants
- [ ] Environment variable validation is comprehensive and user-friendly
- [ ] Configuration management follows SOLID principles
- [ ] Security best practices are followed for credential management
- [ ] Configuration system is extensible for future service additions
- [ ] Health checks provide actionable information for troubleshooting

---
