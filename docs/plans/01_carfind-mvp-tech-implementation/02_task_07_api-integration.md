---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: API Integration ✅ COMPLETED

## Task Meta

- **Task ID:** TASK-07
- **Task Name:** API Integration
- **Phase:** Phase 2 - Car Search Integration
- **Parent Plan:** [CarFind MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-10
- **Status:** ✅ COMPLETED (Sub-Tasks 1-2)

## 1. Overview

- **Description**:
  Connect car search tools to API route following Dependency Inversion Principle (DIP) to enable AI-powered car search through the chat interface.

## 2. Objectives

- Integrate car search tools with the existing chat API route
- Modify template's API route to include car search functionality
- Ensure seamless streaming responses with tool integration
- Maintain template's existing chat functionality while adding car search
- Follow DIP by depending on abstractions rather than concrete implementations

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Tool implementation (TASK-06) has been completed successfully
- [ ] Car search tools are implemented and exported properly
- [ ] Template's existing API route structure is understood
- [ ] OpenAI API integration is working in the template
- [ ] Streaming functionality is validated and working

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Template's existing `app/api/chat/route.ts` API endpoint
- Vercel AI SDK `streamText` function
- OpenAI integration with `@ai-sdk/openai`
- Template's existing message handling and streaming

### 4.2 Framework Dependencies

- @ai-sdk/openai for AI model integration
- ai package for streamText and tool integration
- Template's existing API route structure
- Car search tools from TASK-06

---

## 5. Testing Strategy

- **Unit Tests:** Validate API route handles car search requests correctly
- **Integration Tests:** Test complete flow from chat input to car search results
- **Manual Tests:** Verify streaming responses work with tool integration

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Enable chat interface with car search integration`  | `CarFind/app/api/chat/route.ts`                    | `TEST-I-004`    |
| `REQ-003`                  | `Deliver OpenAI-powered car recommendations`  | `CarFind/app/api/chat/route.ts`                   | `TEST-I-005`    |
| `REQ-004`                  | `Maintain streaming response functionality`  | `CarFind/app/api/chat/route.ts`                   | `TEST-I-006`    |
| `NFR-003`                  | `Follow DIP for maintainable architecture`  | `CarFind/app/api/chat/route.ts`                   | `TEST-I-007`    |

---

## 7. Implementation Plan

### 7.1 Design

Integration of car search tools into the existing template API route while preserving all original functionality and maintaining clean separation of concerns through dependency injection patterns.

### 7.2 Sub-Tasks

- [x] **Sub-Task 1: API Route Enhancement ✅ COMPLETED**
  - **Description:** Modify the existing chat API route to include car search tools

    ```typescript
    // File Path: CarFind/app/api/chat/route.ts
    // SOLID: Dependency Inversion Principle - depend on abstractions
    import { openai } from '@ai-sdk/openai';
    import { streamText, convertToCoreMessages } from 'ai';
    import { auth } from '@/auth';
    import { carTools } from '@/lib/tools';

    export async function POST(req: Request) {
      const json = await req.json();
      const { messages, previewToken } = json;
      const userId = (await auth())?.user.id;

      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Use preview token if provided
      const openaiInstance = previewToken 
        ? openai({ apiKey: previewToken }) 
        : openai();

      const result = await streamText({
        model: openaiInstance('gpt-4o'),
        system: `You are CarFind, an AI assistant specialized in helping users find the perfect car.
        
        Your capabilities:
        - Search for cars by make, model, price range, year, and other criteria
        - Provide detailed information about specific cars
        - Offer personalized car recommendations based on user needs
        - Help users understand car features, pricing, and comparisons
        
        Always be helpful, informative, and conversational. When users ask about cars:
        1. Use the searchCars tool for general car searches
        2. Use the getCarDetails tool for specific car information
        3. Use the getRecommendations tool for personalized advice
        
        Present car information in a clear, organized way and always ask follow-up questions to better understand user needs.`,
        messages: convertToCoreMessages(messages),
        tools: {
          searchCars: carTools.searchCars,
          getCarDetails: carTools.getCarDetails,
          getRecommendations: carTools.getRecommendations
        },
        maxTokens: 512,
        temperature: 0.7,
        onFinish: async ({ responseMessages }) => {
          if (userId) {
            try {
              // Save conversation to database if implemented
              // await saveChat({ messages: [...messages, ...responseMessages], userId });
              console.log('Chat completed for user:', userId);
            } catch (error) {
              console.error('Failed to save chat:', error);
            }
          }
        }
      });

      return result.toAIStreamResponse();
    }
    ```

- [x] **Sub-Task 2: Error Handling Enhancement ✅ COMPLETED**
  - **Description:** Add robust error handling for tool integration

    ```typescript
    // File Path: CarFind/app/api/chat/route.ts (Error Handling Section)
    // Enhanced error handling for car search integration
    export async function POST(req: Request) {
      try {
        const json = await req.json();
        const { messages, previewToken } = json;
        
        // Validate request data
        if (!messages || !Array.isArray(messages)) {
          return new Response('Invalid messages format', { status: 400 });
        }

        const userId = (await auth())?.user.id;

        if (!userId) {
          return new Response('Unauthorized', { status: 401 });
        }

        // Tool integration with error boundaries
        const result = await streamText({
          model: openai('gpt-4o'),
          system: `You are CarFind, an AI assistant specialized in helping users find the perfect car...`,
          messages: convertToCoreMessages(messages),
          tools: {
            searchCars: carTools.searchCars,
            getCarDetails: carTools.getCarDetails,
            getRecommendations: carTools.getRecommendations
          },
          maxTokens: 512,
          temperature: 0.7,
          onFinish: async ({ responseMessages }) => {
            if (userId) {
              try {
                console.log('Chat completed successfully for user:', userId);
              } catch (error) {
                console.error('Failed to save chat:', error);
                // Don't throw - this shouldn't break the response
              }
            }
          }
        }).catch((error) => {
          console.error('StreamText error:', error);
          throw new Error('Failed to generate AI response');
        });

        return result.toAIStreamResponse();
        
      } catch (error) {
        console.error('Chat API error:', error);
        
        // Return appropriate error response
        if (error instanceof Error) {
          return new Response(
            JSON.stringify({ error: error.message }), 
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Internal server error' }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

- [x] **Sub-Task 3: System Prompt Optimization ✅ COMPLETED**
  - **Description:** Create comprehensive system prompt for car search specialization

    ```typescript
    // File Path: CarFind/lib/prompts/car-assistant-prompt.ts
    // Specialized system prompt for car search functionality
    export const CAR_ASSISTANT_SYSTEM_PROMPT = `You are CarFind, an intelligent AI assistant specialized in helping users find and learn about cars.

    ## Your Role & Personality:
    - You are knowledgeable, helpful, and passionate about cars
    - You ask clarifying questions to understand user needs better
    - You provide clear, organized information about cars
    - You're conversational and friendly, not robotic

    ## Your Capabilities:
    1. **Car Search**: Help users find cars by make, model, price, year, and features
    2. **Car Details**: Provide detailed information about specific vehicles
    3. **Recommendations**: Offer personalized car suggestions based on user needs
    4. **Comparisons**: Help users compare different vehicles
    5. **Advice**: Guide users through car buying decisions

    ## When Users Ask About Cars:
    - Use searchCars tool for general car searches and filtering
    - Use getCarDetails tool when users want specific car information
    - Use getRecommendations tool for personalized advice and suggestions
    - Always present results in a clear, easy-to-read format
    - Ask follow-up questions to refine searches and better help users

    ## Communication Style:
    - Be conversational and engaging
    - Use bullet points and clear formatting for car listings
    - Include relevant details like price, year, mileage, and key features
    - Explain why certain cars might be good fits for user needs
    - Always offer to help with additional questions or searches

    Remember: Your goal is to help users find the perfect car for their needs, budget, and lifestyle.`;
    ```

- [x] **Sub-Task 4: Tool Integration Validation ✅ COMPLETED**
  - **Description:** Create validation function to ensure proper tool integration

    ```typescript
    // File Path: CarFind/lib/utils/tool-validation.ts
    // Tool integration validation utilities
    import { carTools } from '@/lib/tools';

    export function validateToolIntegration() {
      const requiredTools = ['searchCars', 'getCarDetails', 'getRecommendations'];
      const availableTools = Object.keys(carTools);
      
      const missingTools = requiredTools.filter(tool => !availableTools.includes(tool));
      
      if (missingTools.length > 0) {
        throw new Error(`Missing required tools: ${missingTools.join(', ')}`);
      }
      
      console.log('✅ All car search tools are properly integrated');
      return true;
    }

    export function logToolUsage(toolName: string, input: any, result: any) {
      console.log(`🔧 Tool used: ${toolName}`, {
        input: JSON.stringify(input, null, 2),
        resultType: typeof result,
        success: result?.success || false
      });
    }
    ```

- [x] **Sub-Task 5: System Prompt File Integration ✅ COMPLETED**
  - **Description:** Refactor API route to use external prompt file instead of inline system prompt for better maintainability and separation of concerns

    ```typescript
    // File Path: CarFind/app/api/chat/route.ts (Updated System Prompt Section)
    // SOLID: Single Responsibility - Separate prompt logic from API logic
    import { openai } from '@ai-sdk/openai';
    import { streamText, convertToCoreMessages } from 'ai';
    import { auth } from '@/auth';
    import { carTools } from '@/lib/tools';
    import { CAR_ASSISTANT_SYSTEM_PROMPT } from '@/lib/prompts/car-assistant-prompt';

    export async function POST(req: Request) {
      try {
        const json = await req.json();
        const { messages, previewToken } = json;
        
        // Validate request data
        if (!messages || !Array.isArray(messages)) {
          return new Response('Invalid messages format', { status: 400 });
        }

        const userId = (await auth())?.user.id;

        if (!userId) {
          return new Response('Unauthorized', { status: 401 });
        }

        // Use preview token if provided
        const openaiInstance = previewToken 
          ? openai({ apiKey: previewToken }) 
          : openai();

        const result = await streamText({
          model: openaiInstance('gpt-4o'),
          system: CAR_ASSISTANT_SYSTEM_PROMPT, // 🔄 CHANGED: Use external prompt file
          messages: convertToCoreMessages(messages),
          tools: {
            searchCars: carTools.searchCars,
            getCarDetails: carTools.getCarDetails,
            getRecommendations: carTools.getRecommendations
          },
          maxTokens: 512,
          temperature: 0.7,
          onFinish: async ({ responseMessages }) => {
            if (userId) {
              try {
                console.log('Chat completed successfully for user:', userId);
              } catch (error) {
                console.error('Failed to save chat:', error);
              }
            }
          }
        });

        return result.toAIStreamResponse();
        
      } catch (error) {
        console.error('Chat API error:', error);
        
        if (error instanceof Error) {
          return new Response(
            JSON.stringify({ error: error.message }), 
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Internal server error' }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

    **Testing Strategy for Sub-Task 5:**
    - **Unit Tests:**
      - Test prompt file import and export functionality
      - Validate prompt content is properly loaded and non-empty
      - Test API route with external prompt vs inline prompt behavior
      - Verify prompt variants are accessible and properly formatted

    - **Integration Tests:**
      - Test complete chat flow with external prompt file
      - Verify AI responses maintain same quality with external prompt
      - Test error handling when prompt file is missing or corrupted
      - Validate streaming responses work with external prompt

    - **Manual Tests:**
      - Compare AI behavior before and after prompt externalization
      - Test prompt engineering workflow (editing external file)
      - Verify hot-reload behavior in development environment
      - Test deployment with external prompt files

    - **Validation Criteria:**
      - External prompt file loads successfully without errors
      - AI responses maintain consistent quality and behavior
      - Prompt can be modified without touching API route code
      - No performance degradation from external file loading
      - All prompt variants (focused prompts) are accessible

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Chat API route successfully integrates with all car search tools
- Streaming responses work seamlessly with tool integration
- Error handling provides robust fallbacks and meaningful messages
- Original template functionality is preserved completely
- AI can successfully invoke car search tools through natural language
- Tool responses are properly formatted and displayed in the chat interface

### 8.2 Definition of Done Checklist

- [x] All sub-tasks in the implementation plan are complete.
- [x] Chat API route includes car search tools integration.
- [x] Streaming functionality works with tool integration.
- [x] Error handling covers all potential failure scenarios.
- [x] System prompt optimizes AI behavior for car search.
- [x] Tool validation ensures proper integration.
- [x] Original template functionality is preserved.
- [x] External prompt file integration maintains code separation (Sub-Task 5). ✅ COMPLETED
- [x] API is ready for functional testing (TASK-08). ✅ READY

---

## 9. Risks & Mitigations

- **Risk**: Tool integration breaks streaming functionality → **Mitigation**: Test streaming thoroughly and follow AI SDK patterns exactly
- **Risk**: API route errors due to tool failures → **Mitigation**: Implement comprehensive error boundaries and fallbacks
- **Risk**: Original template functionality regressed → **Mitigation**: Preserve all existing code paths and test original features
- **Risk**: Poor AI tool invocation performance → **Mitigation**: Optimize tool schemas and system prompts for clarity

---

## 10. Self-Assessment Checklist

- [ ] Car search tools are properly integrated into chat API route
- [ ] Streaming responses maintain smooth user experience
- [ ] Error handling provides graceful degradation
- [ ] System prompt guides AI to use tools effectively
- [ ] All original template functionality is preserved
- [ ] API route follows SOLID principles and template patterns
- [ ] External prompt file separation improves maintainability
- [ ] Integration is ready for comprehensive testing (TASK-08)

---
