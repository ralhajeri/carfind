---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Update Provider Configuration

## Task Meta

- **Task ID:** TASK-05
- **Task Name:** Update Provider Configuration
- **Phase:** Phase 3 - Provider Configuration
- **Parent Plan:** [OpenAI Provider Migration Implementation](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Complete migration of provider configuration from xAI to OpenAI in the CarFind project, implementing strategic model mapping while preserving all template functionality.

## 2. Objectives

- Replace xAI provider imports with OpenAI provider in lib/ai/providers.ts
- Implement strategic model mapping from xAI to OpenAI equivalents
- Preserve all template capabilities including streaming, tools, and reasoning
- Maintain provider abstraction architecture for future extensibility
- Ensure seamless transition with zero functionality loss

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [x] Task-04 (Remove xAI Provider) is completed successfully
- [x] OpenAI provider package is installed and xAI package is removed
- [x] Backup configuration files exist for rollback capability
- [x] Provider configuration file (lib/ai/providers.ts) is accessible
- [x] Strategic model mapping plan is defined and ready for implementation

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- CarFind/lib/ai/providers.ts - Current xAI provider configuration to be updated
- CarFind/lib/ai/models.test.ts - Test models configuration (unchanged)
- CarFind/app/api/chat/route.ts - Chat API endpoint using provider abstraction
- Vercel AI SDK customProvider and wrapLanguageModel functions

### 4.2 Framework Dependencies

- @ai-sdk/openai package (newly installed)
- Vercel AI SDK provider abstraction layer
- extractReasoningMiddleware for O1 model integration
- TypeScript for type safety and compilation

---

## 5. Testing Strategy

- **Unit Tests:** Verify provider configuration loads without import errors
- **Integration Tests:** Test complete provider functionality with all model types
- **Manual Tests:** Validate chat interface works with new OpenAI provider

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Migrate chat functionality to OpenAI provider`  | `lib/ai/providers.ts`                    | `TEST-M-001`    |
| `REQ-002`                  | `Preserve reasoning model functionality`  | `OpenAI O1 model configuration`                   | `TEST-M-002`    |
| `REQ-003`                  | `Maintain image generation capabilities`  | `DALL-E integration`                   | `TEST-M-003`    |
| `REQ-004`                  | `Preserve tool integration features`  | `Provider abstraction layer`                   | `TEST-M-004`    |

---

## 7. Implementation Plan

### 7.1 Design

Complete provider configuration migration using strategic model mapping to maintain feature parity while leveraging OpenAI's superior model capabilities and stability.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Provider Import Migration**
  - **Description:** Replace xAI imports with OpenAI imports in provider configuration

    ```typescript
    // File Path: CarFind/lib/ai/providers.ts
    // Replace xAI imports with OpenAI imports
    
    // Remove xAI import (if still present):
    // import { xai } from '@ai-sdk/xai';
    
    // Add OpenAI import:
    import { openai } from '@ai-sdk/openai';
    
    // Keep existing Vercel AI SDK imports:
    import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
    import { artifactModel, chatModel, reasoningModel, titleModel } from './models.test';
    import { isTestEnvironment } from '../constants';
    ```

- [ ] **Sub-Task 2: Primary Chat Model Configuration**
  - **Description:** Replace xAI chat models with OpenAI GPT-4o for primary chat functionality

    ```typescript
    // File Path: CarFind/lib/ai/providers.ts
    // Update primary chat model configuration
    export const myProvider = isTestEnvironment
      ? customProvider({
          languageModels: {
            'chat-model': chatModel,
            'chat-model-reasoning': reasoningModel,
            'title-model': titleModel,
            'artifact-model': artifactModel,
          },
        })
      : customProvider({
          languageModels: {
            // Replace: xai('grok-2-vision-1212')
            // With: OpenAI GPT-4o for vision capabilities and high performance
            'chat-model': openai('gpt-4o'),
            
            // Keep other models for now (will be updated in next sub-tasks)
            'chat-model-reasoning': reasoningModel, // Temporary
            'title-model': titleModel, // Temporary
            'artifact-model': artifactModel, // Temporary
          },
        });
    ```

- [ ] **Sub-Task 3: Reasoning Model Configuration**
  - **Description:** Implement OpenAI O1 model for reasoning capabilities with middleware

    ```typescript
    // File Path: CarFind/lib/ai/providers.ts
    // Update reasoning model configuration
    'chat-model-reasoning': wrapLanguageModel({
      // Replace: xai('grok-3-mini-beta')
      // With: OpenAI O1-mini for optimized reasoning at lower cost
      model: openai('o1-mini'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    ```

- [ ] **Sub-Task 4: Title and Artifact Model Configuration**
  - **Description:** Configure cost-optimized models for title generation and artifact creation

    ```typescript
    // File Path: CarFind/lib/ai/providers.ts
    // Update title and artifact model configuration
    
    // Replace: xai('grok-2-1212') for title
    // With: OpenAI GPT-4o-mini for cost-effective simple tasks
    'title-model': openai('gpt-4o-mini'),
    
    // Replace: xai('grok-2-1212') for artifacts
    // With: OpenAI GPT-4o for full capability complex generation
    'artifact-model': openai('gpt-4o'),
    ```

- [ ] **Sub-Task 5: Image Model Configuration**
  - **Description:** Add OpenAI DALL-E integration for image generation capabilities

    ```typescript
    // File Path: CarFind/lib/ai/providers.ts
    // Add complete provider configuration with image models
    export const myProvider = isTestEnvironment
      ? customProvider({
          languageModels: {
            'chat-model': chatModel,
            'chat-model-reasoning': reasoningModel,
            'title-model': titleModel,
            'artifact-model': artifactModel,
          },
        })
      : customProvider({
          languageModels: {
            'chat-model': openai('gpt-4o'),
            'chat-model-reasoning': wrapLanguageModel({
              model: openai('o1-mini'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
            }),
            'title-model': openai('gpt-4o-mini'),
            'artifact-model': openai('gpt-4o'),
          },
          imageModels: {
            // Replace: xai('grok-2-image')
            // With: OpenAI DALL-E 3 for advanced image generation
            'small-model': openai.imageModel('dall-e-3'),
          },
        });
    ```

- [ ] **Sub-Task 6: Configuration Validation**
  - **Description:** Verify provider configuration syntax and TypeScript compilation

    ```bash
    # File Path: PowerShell Terminal (c:\projects\carbot\06\CarFind)
    # Validate TypeScript compilation
    npx tsc --noEmit
    
    # If compilation successful:
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Provider configuration validated successfully"
    } else {
        Write-Host "TypeScript compilation errors detected"
        exit 1
    }
    
    # Create configuration migration report
    echo "Provider Configuration Migration Report" > provider_migration_report.txt
    echo "Date: $(Get-Date)" >> provider_migration_report.txt
    echo "Migration: xAI to OpenAI provider complete" >> provider_migration_report.txt
    echo "Models mapped:" >> provider_migration_report.txt
    echo "- Chat: grok-2-vision-1212 → gpt-4o" >> provider_migration_report.txt
    echo "- Reasoning: grok-3-mini-beta → o1-mini" >> provider_migration_report.txt
    echo "- Title: grok-2-1212 → gpt-4o-mini" >> provider_migration_report.txt
    echo "- Artifacts: grok-2-1212 → gpt-4o" >> provider_migration_report.txt
    echo "- Images: grok-2-image → dall-e-3" >> provider_migration_report.txt
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- All xAI provider references replaced with OpenAI provider imports
- Strategic model mapping implemented preserving all functionality
- Provider configuration compiles without TypeScript errors
- All template capabilities (chat, reasoning, tools, images) are preserved
- Configuration follows Vercel AI SDK best practices

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] OpenAI provider imports replace xAI imports completely
- [ ] All model mappings implemented according to strategic plan
- [ ] TypeScript compilation passes without errors
- [ ] Provider configuration syntax is valid and functional
- [ ] Image model configuration added for DALL-E integration
- [ ] Test environment configuration preserved unchanged
- [ ] Configuration migration documented and reported

---

## 9. Risks & Mitigations

- **Risk**: TypeScript compilation errors due to import changes → **Mitigation**: Incremental validation during each sub-task
- **Risk**: Model name mismatches causing runtime errors → **Mitigation**: Verify model names against OpenAI documentation
- **Risk**: Middleware configuration errors with O1 models → **Mitigation**: Follow exact Vercel AI SDK patterns for reasoning middleware
- **Risk**: Image model configuration syntax errors → **Mitigation**: Test image model configuration separately before integration

---

## 10. Self-Assessment Checklist

- [ ] Provider configuration completely migrated from xAI to OpenAI
- [ ] All model mappings implemented according to strategic plan
- [ ] TypeScript compilation successful with no errors
- [ ] Configuration follows framework best practices
- [ ] Migration is documented and ready for testing phase

---
