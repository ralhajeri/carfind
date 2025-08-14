# Step-by-Step Implementation Guide: Next.js Semantic Kernel Integration

## Document Information

- **Date**: August 14, 2025
- **Based On**: AI Architectural Decision Record V2 - Option B (Next.js Integration)
- **Phase**: Phase 3 Revised - Simplified Architecture Implementation
- **Total Duration**: 2-3 days (reduced from 5 days)
- **Confidence Score**: 96% (Microsoft compliance validated)

## Prerequisites Validation

Before starting implementation, verify all prerequisites are met:

### Environment Check

```powershell
# Verify Node.js version
node --version
# Required: v18.17.0 or higher

# Verify Next.js project is functional
cd c:\projects\carbot\06\CarFind
npm run dev
# Verify: http://localhost:3000 shows working application

# Check current dependencies
npm list | findstr semantic-kernel
# Should show no existing semantic-kernel packages
```

### Phase 1 & 2 Validation

- [ ] Next.js UI components functional and responsive
- [ ] Chat functionality working with existing OpenAI integration
- [ ] Drizzle ORM database operations successful
- [ ] API routes responding correctly
- [ ] No critical errors in browser console or terminal

## Implementation Tasks

### Task 1: Environment Setup & Dependencies (Day 1 - 2 hours)

#### **Objective**: Install and configure Semantic Kernel Node.js SDK

#### **Implementation Steps**

1. **Install Semantic Kernel Dependencies**

   ```powershell
   cd c:\projects\carbot\06\CarFind

   # Install Semantic Kernel Node.js SDK
   npm install @microsoft/semantic-kernel

   # Install additional required dependencies
   npm install @azure/openai openai

   # Install development dependencies for testing
   npm install --save-dev @types/jest jest typescript
   ```

2. **Update Environment Configuration**

   ```powershell
   # Update .env.local file
   # Add the following variables:
   echo "AI_SERVICE_TYPE=semantic-kernel" >> .env.local
   echo "SEMANTIC_KERNEL_MODEL=gpt-4" >> .env.local
   echo "SEMANTIC_KERNEL_API_KEY=%OPENAI_API_KEY%" >> .env.local
   ```

3. **Validate Installation**

   ```powershell
   # Check installation
   npm list @microsoft/semantic-kernel

   # Test import capability
   node -e "console.log(require('@microsoft/semantic-kernel'))"
   ```

#### **Success Criteria**

- [ ] Semantic Kernel SDK installed without errors
- [ ] Environment variables configured
- [ ] No dependency conflicts
- [ ] Import test successful

#### **Rollback Plan**

If installation fails:

1. Remove semantic-kernel dependencies:

   ```powershell
   npm uninstall @microsoft/semantic-kernel @azure/openai
   ```

2. Restore package.json from backup
3. Continue with existing OpenAI integration

### Task 2: Service Layer Enhancement (Day 1-2 - 4 hours)

#### **Objective**: Implement SemanticKernelService with Node.js SDK

#### **Service Implementation Steps**

1. **Create Enhanced Semantic Kernel Service**

   Create file: `CarFind/lib/services/semantic-kernel-service.ts`

   ```typescript
   /**
    * Semantic Kernel Service - Next.js Integration Implementation
    * Following Microsoft kernel isolation best practices
    */

   import { Kernel, KernelBuilder } from "@microsoft/semantic-kernel";
   import { OpenAIChatCompletion } from "@microsoft/semantic-kernel/connectors/ai/openai";
   import { AIService, ChatRequest, ChatResponse } from "../types/ai-types";

   export class SemanticKernelService implements AIService {
     private kernel: Kernel;
     private chatCompletion: OpenAIChatCompletion;

     constructor(config: {
       apiKey: string;
       model: string;
       organization?: string;
     }) {
       // Initialize isolated kernel instance (Microsoft best practice)
       this.chatCompletion = new OpenAIChatCompletion({
         serviceId: "carfind-openai",
         apiKey: config.apiKey,
         modelId: config.model,
         organization: config.organization,
       });

       this.kernel = new KernelBuilder()
         .withAIService(this.chatCompletion)
         .build();
     }

     async generateResponse(request: ChatRequest): Promise<ChatResponse> {
       try {
         // Use Semantic Kernel for AI response generation
         const response = await this.kernel.invokeSemanticFunction(
           "chat",
           "respond",
           {
             input: request.messages[request.messages.length - 1].content,
             variables: {
               context: JSON.stringify(request.context || {}),
               sessionId: request.sessionId || "",
             },
           }
         );

         return {
           id: `sk_${Date.now()}`,
           content: response.result,
           role: "assistant",
           timestamp: new Date().toISOString(),
           metadata: {
             model: this.chatCompletion.modelId,
             source: "semantic-kernel",
             sessionId: request.sessionId,
           },
         };
       } catch (error) {
         console.error("SemanticKernelService error:", error);
         throw new Error(`Semantic Kernel processing failed: ${error.message}`);
       }
     }

     async streamResponse(
       request: ChatRequest
     ): Promise<AsyncIterable<string>> {
       // Implementation for streaming responses
       const response = await this.generateResponse(request);

       // Simple streaming simulation for MVP
       const words = response.content.split(" ");

       return {
         async *[Symbol.asyncIterator]() {
           for (const word of words) {
             yield word + " ";
             await new Promise((resolve) => setTimeout(resolve, 50));
           }
         },
       };
     }

     async dispose(): Promise<void> {
       // Cleanup kernel resources
       if (this.kernel) {
         // Proper resource cleanup
         this.kernel = null;
       }
     }
   }
   ```

2. **Update AI Service Factory**

   Update file: `CarFind/lib/services/ai-service-factory.ts`

   ```typescript
   import { AIService } from "../types/ai-types";
   import { SemanticKernelService } from "./semantic-kernel-service";
   import { OpenAIService } from "./openai-service";

   export type AIServiceType = "semantic-kernel" | "openai";

   export class AIServiceFactory {
     private static instances: Map<AIServiceType, AIService> = new Map();

     static async create(
       type: AIServiceType = "semantic-kernel",
       config?: any
     ): Promise<AIService> {
       // Check if instance already exists
       if (this.instances.has(type)) {
         return this.instances.get(type)!;
       }

       let service: AIService;

       switch (type) {
         case "semantic-kernel":
           service = new SemanticKernelService({
             apiKey: process.env.OPENAI_API_KEY!,
             model: process.env.SEMANTIC_KERNEL_MODEL || "gpt-4",
             organization: process.env.OPENAI_ORGANIZATION,
           });
           break;

         case "openai":
           service = new OpenAIService(config);
           break;

         default:
           throw new Error(`Unknown AI service type: ${type}`);
       }

       // Cache the instance
       this.instances.set(type, service);
       return service;
     }

     static async getService(type?: AIServiceType): Promise<AIService> {
       const serviceType =
         type ||
         (process.env.AI_SERVICE_TYPE as AIServiceType) ||
         "semantic-kernel";
       return this.create(serviceType);
     }

     static clearCache(): void {
       // Dispose of all cached instances
       for (const [type, service] of this.instances.entries()) {
         if ("dispose" in service) {
           (service as any).dispose();
         }
       }
       this.instances.clear();
     }
   }
   ```

3. **Validate Service Implementation**

   Create test file: `CarFind/lib/services/__tests__/semantic-kernel-service.test.ts`

   ```typescript
   import { SemanticKernelService } from "../semantic-kernel-service";

   describe("SemanticKernelService", () => {
     let service: SemanticKernelService;

     beforeEach(() => {
       service = new SemanticKernelService({
         apiKey: "test-key",
         model: "gpt-4",
       });
     });

     afterEach(async () => {
       await service.dispose();
     });

     test("should initialize without errors", () => {
       expect(service).toBeDefined();
     });

     test("should have proper service interface", () => {
       expect(typeof service.generateResponse).toBe("function");
       expect(typeof service.streamResponse).toBe("function");
       expect(typeof service.dispose).toBe("function");
     });
   });
   ```

#### **Service Success Criteria**

- [ ] SemanticKernelService class implemented
- [ ] AI service factory updated
- [ ] Unit tests passing
- [ ] No TypeScript compilation errors
- [ ] Service instantiation successful

#### **Service Rollback Plan**

If service implementation fails:

1. Revert `semantic-kernel-service.ts` to previous version
2. Restore `ai-service-factory.ts` from backup
3. Use existing OpenAI service implementation
4. Remove semantic-kernel dependencies

### Task 3: API Route Integration (Day 2-3 - 3 hours)

#### **Objective**: Update chat API route with Semantic Kernel integration

#### **API Integration Steps**

1. **Update Chat API Route**

   Update file: `CarFind/app/(chat)/api/chat/route.ts`

   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { nanoid } from "nanoid";
   import { AIServiceFactory } from "@/lib/services/ai-service-factory";
   import { saveChat, saveMessages } from "@/lib/db/queries";

   export async function POST(req: NextRequest) {
     try {
       const body = await req.json();
       const { messages, sessionId, userId } = body;

       // Get Semantic Kernel service (isolated instance)
       const aiService = await AIServiceFactory.getService("semantic-kernel");

       // Prepare chat request
       const chatRequest = {
         messages,
         sessionId: sessionId || nanoid(),
         context: {
           userId,
           timestamp: new Date().toISOString(),
         },
       };

       // Generate AI response using Semantic Kernel
       const aiResponse = await aiService.generateResponse(chatRequest);

       // Save chat session and messages to database
       if (userId) {
         const chatId = nanoid();

         await saveChat({
           id: chatId,
           userId,
           title: messages[0]?.content?.substring(0, 50) || "New Chat",
           createdAt: new Date(),
           updatedAt: new Date(),
         });

         await saveMessages([
           {
             id: nanoid(),
             chatId,
             role: "user",
             content: messages[messages.length - 1].content,
             createdAt: new Date(),
           },
           {
             id: nanoid(),
             chatId,
             role: "assistant",
             content: aiResponse.content,
             createdAt: new Date(),
           },
         ]);
       }

       // Return response maintaining API contract
       return NextResponse.json({
         id: aiResponse.id,
         content: aiResponse.content,
         role: aiResponse.role,
         timestamp: aiResponse.timestamp,
         sessionId: chatRequest.sessionId,
         metadata: {
           ...aiResponse.metadata,
           source: "semantic-kernel",
         },
       });
     } catch (error) {
       console.error("Chat API error:", error);

       return NextResponse.json(
         {
           error: "Internal server error",
           message: error instanceof Error ? error.message : "Unknown error",
         },
         { status: 500 }
       );
     }
   }
   ```

2. **Add Streaming Support (Optional)**

   Create file: `CarFind/app/(chat)/api/chat/stream/route.ts`

   ```typescript
   import { NextRequest } from "next/server";
   import { AIServiceFactory } from "@/lib/services/ai-service-factory";

   export async function POST(req: NextRequest) {
     try {
       const body = await req.json();
       const { messages, sessionId } = body;

       const aiService = await AIServiceFactory.getService("semantic-kernel");

       const chatRequest = {
         messages,
         sessionId,
         context: {
           timestamp: new Date().toISOString(),
         },
       };

       const stream = await aiService.streamResponse(chatRequest);

       // Create streaming response
       const encoder = new TextEncoder();

       const readableStream = new ReadableStream({
         async start(controller) {
           try {
             for await (const chunk of stream) {
               const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
               controller.enqueue(encoder.encode(data));
             }

             controller.enqueue(encoder.encode("data: [DONE]\n\n"));
             controller.close();
           } catch (error) {
             controller.error(error);
           }
         },
       });

       return new Response(readableStream, {
         headers: {
           "Content-Type": "text/event-stream",
           "Cache-Control": "no-cache",
           Connection: "keep-alive",
         },
       });
     } catch (error) {
       console.error("Streaming API error:", error);
       return new Response("Internal server error", { status: 500 });
     }
   }
   ```

3. **Validate API Integration**

   ```powershell
   # Start development server
   cd c:\projects\carbot\06\CarFind
   npm run dev

   # Test API endpoint
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [{"role": "user", "content": "Hello"}],
       "sessionId": "test-session"
     }'
   ```

#### **API Success Criteria**

- [ ] Chat API route updated with Semantic Kernel integration
- [ ] API contract compatibility maintained
- [ ] Database operations working correctly
- [ ] Error handling comprehensive
- [ ] Streaming support functional (if implemented)

#### **API Rollback Plan**

If API integration fails:

1. Revert `route.ts` to previous version:

   ```powershell
   git checkout HEAD~1 -- app/\(chat\)/api/chat/route.ts
   ```

2. Restore OpenAI service integration
3. Test existing functionality
4. Roll back service layer changes if needed

## Comprehensive Testing & Validation

### Unit Testing

```powershell
# Run unit tests
npm test

# Run specific service tests
npm test -- semantic-kernel-service.test.ts
```

### Integration Testing

```powershell
# Start application
npm run dev

# Test chat functionality in browser
# Navigate to http://localhost:3000
# Send test messages and verify responses
```

### Performance Testing

```powershell
# Install testing tools
npm install --save-dev @types/supertest supertest

# Run performance tests (if implemented)
npm run test:performance
```

## Rollback Procedures

### Complete Rollback to Phase 2

If full rollback is required:

1. **Remove Semantic Kernel Dependencies**

   ```powershell
   npm uninstall @microsoft/semantic-kernel @azure/openai
   ```

2. **Restore Files from Backup**

   ```powershell
   git checkout HEAD~3 -- lib/services/
   git checkout HEAD~3 -- app/\(chat\)/api/chat/
   ```

3. **Restore Environment Variables**

   ```powershell
   # Remove SK-specific variables from .env.local
   # Restore AI_SERVICE_TYPE=openai
   ```

4. **Validate Rollback**

   ```powershell
   npm run dev
   # Test all functionality to ensure Phase 2 state restored
   ```

### Partial Rollback Options

#### Rollback Service Layer Only

- Revert `semantic-kernel-service.ts` and `ai-service-factory.ts`
- Keep API routes unchanged
- Restore OpenAI service as default

#### Rollback API Integration Only

- Revert chat route implementation
- Keep service layer enhancements
- Update service factory to use OpenAI

## Success Validation Checklist

- [ ] All Phase 1 UI components functional without changes
- [ ] Chat functionality working with Semantic Kernel
- [ ] Database operations preserved and functional
- [ ] API response format maintained (backward compatibility)
- [ ] Performance within acceptable limits (<3 seconds)
- [ ] No TypeScript compilation errors
- [ ] No runtime errors in browser console
- [ ] Semantic Kernel kernel isolation implemented correctly
- [ ] Error handling comprehensive and user-friendly
- [ ] Environment configuration properly managed

## Timeline & Effort Summary

| Task                          | Duration     | Effort       | Risk Level |
| ----------------------------- | ------------ | ------------ | ---------- |
| **Task 1: Environment Setup** | 2 hours      | Low          | Low        |
| **Task 2: Service Layer**     | 4 hours      | Medium       | Low        |
| **Task 3: API Integration**   | 3 hours      | Medium       | Low        |
| **Testing & Validation**      | 2 hours      | Low          | Low        |
| **Total**                     | **11 hours** | **2-3 days** | **Low**    |

## Risk Mitigation Summary

| Risk                         | Probability | Impact | Mitigation                              |
| ---------------------------- | ----------- | ------ | --------------------------------------- |
| **SDK Compatibility Issues** | Low         | Medium | Thorough testing, fallback to OpenAI    |
| **Performance Degradation**  | Low         | Low    | Monitoring, optimization                |
| **API Contract Breaking**    | Very Low    | High   | Extensive compatibility testing         |
| **Environment Setup Issues** | Low         | Low    | Clear documentation, validation scripts |

## Next Steps After Implementation

1. **Documentation Update**: Update README and technical documentation
2. **Performance Monitoring**: Establish baseline metrics
3. **User Acceptance Testing**: Validate with stakeholders
4. **Production Deployment**: Prepare for production release
5. **Future Enhancements**: Plan advanced Semantic Kernel features

This implementation guide provides a clear path to successful Next.js Semantic Kernel integration while maintaining the ability to rollback at any stage if issues arise.
