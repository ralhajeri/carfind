---
meta-directives:
  - 'Purpose: Refactor API routes to use direct Vercel AI SDK patterns without custom service layer'
  - 'Audience: AI agent (Executor), development team'
  - 'Action: Replace custom service abstractions with native AI SDK integration'
  - 'Principle: Use direct AI SDK patterns. Eliminate unnecessary abstractions.'
  - 'Framework: Native Pattern Implementation'
---

# Task 02: Refactor API Routes to Native Patterns

## Task Meta

- **Task ID:** 02_task_02_refactor-api-routes
- **Phase:** Phase 3.2 - API Route Simplification
- **Estimated Duration:** 6-8 hours
- **Priority:** High (Core functionality)
- **Dependencies:** Task 01 (Service architecture removal)
- **Risk Level:** Medium (Breaking changes to core API)

## 1. Task Overview

### **Objective:**

Replace the current API route implementation that uses custom service layer abstractions with direct Vercel AI SDK patterns. This includes implementing native tool calling, streaming responses, and OpenAI integration following official template standards.

### **Business Value:**

- Simplified API routes that match official Vercel template patterns
- Reduced complexity and improved maintainability
- Better performance through direct SDK usage
- Easier debugging and troubleshooting

### **Success Criteria:**

- API routes use direct AI SDK patterns without custom abstractions
- Chat functionality works identically to previous implementation
- Streaming responses function correctly using `.toUIMessageStreamResponse()` for proper UI integration
- Any car search tools implemented using native AI SDK tool patterns
- Message conversion uses `convertToModelMessages()` for proper format handling

## 2. Current State Analysis

### 2.1 Files to Refactor

**Primary File:**

- `app/(chat)/api/chat/route.ts` - Currently uses custom service layer

**Secondary Files (if they exist):**

- Any other API routes that use removed service abstractions
- Database integration files that need simplification

### 2.2 Expected Current Implementation Issues

After Task 01 completion:

- Import errors for removed service files
- TypeScript compilation failures
- Runtime errors due to missing services

## 3. Implementation Strategy

### 3.0 Important Implementation Note

**CORRECTED (2025-08-14):** This implementation has been updated to use the correct Vercel AI SDK patterns for chatbot applications:

- Uses `.toUIMessageStreamResponse()` instead of `.toDataStreamResponse()` for proper UI integration
- Includes `convertToModelMessages()` for proper message format conversion
- Follows official Vercel AI Chatbot template standards exactly

### 3.1 Native Chat API Implementation

Replace the current service-layer implementation with direct AI SDK usage following **official Vercel AI SDK patterns**:

```typescript
// File Path: CarFind/app/(chat)/api/chat/route.ts
// Native Vercel AI SDK pattern implementation (100% Official Documentation Compliant)
import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages, UIMessage } from 'ai';
import { z } from 'zod';

// Sophisticated car search tool using native AI SDK patterns (maintains current functionality)
const carSearchTool = tool({
  description: 'Search for cars based on user criteria like make, model, price range, and year',
  inputSchema: z.object({
    make: z.string().optional().describe('Car make/brand (e.g., Toyota, Honda, Ford)'),
    model: z.string().optional().describe('Car model (e.g., Camry, Civic, F-150)'),
    maxPrice: z.number().positive().optional().describe('Maximum price in USD'),
    minPrice: z.number().positive().optional().describe('Minimum price in USD'),
    minYear: z.number().min(1990).max(2025).optional().describe('Minimum year'),
    maxYear: z.number().min(1990).max(2025).optional().describe('Maximum year'),
    maxMileage: z.number().positive().optional().describe('Maximum mileage'),
    fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional().describe('Fuel type preference'),
  }),
  execute: async ({ make, model, maxPrice, minPrice, minYear, maxYear, maxMileage, fuelType }) => {
    // Direct database/API integration (remove service layer dependency)
    // Maintain sophisticated search logic but simplify data access
    const cars = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 25000, mileage: 15000, fuelType: 'gasoline' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2024, price: 23000, mileage: 8000, fuelType: 'gasoline' },
      { id: 3, make: 'Tesla', model: 'Model 3', year: 2023, price: 35000, mileage: 12000, fuelType: 'electric' },
    ];

    // Sophisticated filtering logic (preserved from current implementation)
    let filteredCars = cars;
    if (make) filteredCars = filteredCars.filter(car => 
      car.make.toLowerCase().includes(make.toLowerCase())
    );
    if (model) filteredCars = filteredCars.filter(car => 
      car.model.toLowerCase().includes(model.toLowerCase())
    );
    if (maxPrice) filteredCars = filteredCars.filter(car => car.price <= maxPrice);
    if (minPrice) filteredCars = filteredCars.filter(car => car.price >= minPrice);
    if (minYear) filteredCars = filteredCars.filter(car => car.year >= minYear);
    if (maxYear) filteredCars = filteredCars.filter(car => car.year <= maxYear);
    if (maxMileage) filteredCars = filteredCars.filter(car => car.mileage <= maxMileage);
    if (fuelType) filteredCars = filteredCars.filter(car => car.fuelType === fuelType);

    return {
      success: filteredCars.length > 0,
      message: filteredCars.length > 0 
        ? `Found ${filteredCars.length} car(s) matching your criteria.`
        : 'No cars found matching your criteria. Try adjusting your search parameters.',
      totalCount: filteredCars.length,
      cars: filteredCars,
      searchCriteria: { make, model, maxPrice, minPrice, minYear, maxYear, maxMileage, fuelType }
    };
  },
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'), // Can also use provider abstraction: myProvider.languageModel(selectedModel)
      messages: convertToModelMessages(messages), // ✅ Official pattern for message conversion
      tools: {
        searchCars: carSearchTool,
        // Add other tools following same sophisticated pattern
      },
      maxOutputTokens: 1000,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse(); // ✅ CORRECTED: Official chatbot streaming method
  } catch (error) {
    console.error('Chat API error:', error);
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

### 3.2 Database Integration Simplification

If chat persistence is needed, use direct Supabase client:

```typescript
// Simple database integration (if needed)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple message saving (if persistence required)
async function saveMessage(sessionId: string, message: any) {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role: message.role,
      content: message.content,
      created_at: new Date().toISOString()
    });
  
  if (error) console.error('Database save error:', error);
}
```

## 4. Step-by-Step Implementation

### 4.1 Step 1: Backup Current Implementation

```bash
# Create backup before making changes
git add app/(chat)/api/chat/route.ts
git commit -m "Task 02: Backup chat route before refactoring"
```

### 4.2 Step 2: Analyze Current Chat Route

```bash
# Review current implementation to understand what needs to be preserved
cat app/(chat)/api/chat/route.ts
```

### 4.3 Step 3: Implement Native Pattern

Replace the current `app/(chat)/api/chat/route.ts` with the native implementation above.

**Key Changes from Current Implementation:**

- **PRESERVE**: Sophisticated tool schemas and error handling (aligns with official AI SDK examples)
- **PRESERVE**: Provider abstraction if needed (`myProvider.languageModel()` is officially supported)  
- **REMOVE**: Custom service layer dependencies from tool execution
- **MAINTAIN**: `.toUIMessageStreamResponse()` for proper UI integration (already correct in current code)
- **MAINTAIN**: `convertToModelMessages()` for proper message format handling (already correct)

### 4.4 Step 4: Update Environment Variables

Ensure the following environment variables are configured:

```bash
# Required environment variables
OPENAI_API_KEY=your-openai-api-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url (if using database)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (if using database)
```

### 4.5 Step 5: Test Implementation

```bash
# Test the implementation
pnpm run build
pnpm dev
# Manual testing at http://localhost:3000
```

## 5. Database Consideration

### 5.1 Current Database State

The project currently has Supabase integration with chat/message persistence. For native template alignment:

#### **Recommended Approach: Simplified Database Integration (Official AI SDK Pattern)**

- **MAINTAIN**: Direct Supabase client for chat persistence (matches official AI SDK examples)
- **SIMPLIFY**: Use direct client calls instead of complex repository patterns
- **PRESERVE**: Basic message and session storage for UI state consistency
- **ALIGN**: Follow official AI SDK message persistence patterns from documentation

**Implementation Pattern (from Official AI SDK Docs):**

```typescript
// Simple database integration following official patterns
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Official AI SDK persistence pattern
export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      // Save messages using direct client (official pattern)
      saveMessages({ chatId, messages });
    },
  });
}
```

### 5.2 Database Integration Benefits

**Why Maintain Database (per Official Documentation):**

- Official AI SDK examples include message persistence
- UI state consistency requires chat history
- User experience benefits from conversation continuity
- Aligns with production chatbot patterns

## 6. Testing and Validation

### 6.1 Functional Testing

Test the following scenarios:

1. **Basic Chat:** Send message, receive AI response
2. **Streaming:** Verify responses stream correctly
3. **Tool Calling:** Test car search functionality
4. **Error Handling:** Verify graceful error responses

### 6.2 Performance Testing

- Response time should improve due to removed abstraction layers
- Memory usage should decrease
- Startup time should be faster

### 6.3 Compatibility Testing

- Verify UI components work with new API implementation
- Test all existing chat features
- Ensure no regression in functionality

## 7. Rollback Strategy

```bash
# If issues arise, rollback to previous state
git checkout HEAD~1 -- app/(chat)/api/chat/route.ts
```

## 8. Common Issues and Solutions

### 8.1 Import Errors

**Issue:** Imports of removed services cause errors
**Solution:** Replace with direct AI SDK imports

### 8.2 Tool Calling Issues

**Issue:** Custom tool implementations don't work
**Solution:** Use native `tool()` function with proper schema

### 8.3 UI Integration Issues

**Issue:** UI components don't receive messages in expected format
**Solution:** Ensure `.toUIMessageStreamResponse()` is used instead of `.toDataStreamResponse()` for chatbot applications

### 8.4 Message Format Issues

**Issue:** Messages not properly converted for AI model consumption
**Solution:** Use `convertToModelMessages(messages)` to convert UI messages to model format (✅ **ALREADY IMPLEMENTED CORRECTLY**)

### 8.5 Provider Integration Issues  

**Issue:** Direct model usage vs provider abstraction uncertainty
**Solution:** Both patterns are officially supported:

- Direct: `openai('gpt-4o')`
- Provider: `myProvider.languageModel(selectedModel)` (✅ **CURRENT IMPLEMENTATION IS VALID**)

### 8.6 Database Errors

**Issue:** Database operations fail after service removal
**Solution:** Use direct Supabase client with official AI SDK persistence patterns (maintain functionality, simplify implementation)

## 9. Success Criteria

This task is complete when:

- [ ] Chat API uses direct AI SDK patterns with proper imports
- [ ] No custom service layer dependencies remain
- [ ] All chat functionality works identically
- [ ] Messages are properly converted using `convertToModelMessages()`
- [ ] Response uses `.toUIMessageStreamResponse()` for UI compatibility
- [ ] TypeScript compilation succeeds
- [ ] Manual testing passes all scenarios
- [ ] Performance meets or exceeds previous implementation

---

**Task Completion Indicator:**
The API route should be indistinguishable from the official Vercel AI Chatbot template in terms of patterns and complexity, while maintaining all existing user-facing functionality.
