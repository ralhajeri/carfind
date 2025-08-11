---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Enhanced API Routes Integration

## Task Meta

- **Task ID:** TASK-09
- **Task Name:** Enhanced API Routes Integration
- **Phase:** Phase 2.3 - Semantic Kernel Preparation
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Integrate database persistence with existing API routes while maintaining 100% backward compatibility with Phase 1 Vercel AI SDK components and preparing for Phase 3 Semantic Kernel integration.

## 2. Objectives

- Enhance existing `/api/chat` route with database persistence
- Maintain complete compatibility with existing Phase 1 Vercel AI SDK integration
- Implement session management API endpoints for chat history
- Integrate service layer and database operations with streaming responses
- Prepare API structure for Semantic Kernel service integration
- Ensure proper error handling and performance optimization

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] All Phase 2.1 and 2.2 tasks are completed successfully
- [ ] Database service layer is functional and tested
- [ ] Service layer integration with AI services is working
- [ ] Phase 1 chat functionality is preserved and operational
- [ ] Understanding of Vercel AI SDK streaming patterns

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Existing `/api/chat/route.ts` from Phase 1 with OpenAI integration
- Vercel AI SDK `streamText` and `useChat` hook integration
- Database service layer from Task 07
- AI service factory from Tasks 02-03
- Supabase client configuration from Task 06

### 4.2 Framework Dependencies

- Vercel AI SDK streaming capabilities
- Database service layer interfaces
- Enhanced AI service factory
- Next.js App Router API patterns
- Supabase TypeScript client

---

## 5. Testing Strategy

- **Unit Tests:** Test each API endpoint independently with mock services
- **Integration Tests:** Verify database persistence works with streaming responses
- **Manual Tests:** Test complete chat flow with session persistence and resumption

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Chat session persistence`  | `app/api/chat/route.ts`                    | `TEST-API-001`    |
| `REQ-002`                  | `Resume conversations`  | `app/api/sessions/route.ts`                   | `TEST-API-002`    |
| `REQ-003`                  | `Maintain Phase 1 compatibility`  | `Enhanced API routes`                   | `TEST-COMPAT-001`    |
| `NFR-001`                  | `Performance <500ms`  | `Database integration optimization`                   | `TEST-PERF-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Enhance existing API routes to integrate database persistence while maintaining streaming compatibility and preparing for future Semantic Kernel integration. Follow SOLID principles and ensure zero breaking changes to Phase 1 functionality.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Enhanced Chat API Route**
  - **Description:** Upgrade existing chat route with database persistence and session management

    ```typescript
    // File Path: CarFind/app/api/chat/route.ts
    // Enhanced with database integration + Phase 1 compatibility
    import { openai } from '@ai-sdk/openai';
    import { streamText } from 'ai';
    import { NextRequest } from 'next/server';
    import { getDatabaseService } from '@/lib/services/database-service';
    import { serviceContainer } from '@/lib/services/service-container';
    import { getAIConfig } from '@/lib/config/ai-config';
    import { createServerSupabaseClient } from '@/lib/supabase/server';
    import { APIError } from '@/lib/types/errors';
    import { ChatMessage } from '@/lib/types/chat';

    export async function POST(req: NextRequest) {
      try {
        const { messages, sessionId, userId } = await req.json();

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Messages are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Initialize services
        const databaseService = getDatabaseService();
        const aiService = serviceContainer.getService('openai', sessionId);

        // Handle session management
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          // Create new session with first user message
          const firstUserMessage = messages.find((m: any) => m.role === 'user');
          const sessionTitle = firstUserMessage 
            ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
            : 'New Conversation';

          const session = await databaseService.createSession({
            title: sessionTitle,
            user_id: userId || null
          });
          currentSessionId = session.id;
        }

        // Save user message to database
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage?.role === 'user') {
          await databaseService.saveMessage({
            session_id: currentSessionId,
            role: 'user',
            content: lastUserMessage.content,
            metadata: { timestamp: new Date().toISOString() }
          });
        }

        // Prepare AI request
        const aiRequest = {
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          sessionId: currentSessionId,
          userId
        };

        // Generate streaming response using existing AI service
        const result = streamText({
          model: openai(getAIConfig('openai').model),
          messages: aiRequest.messages,
          temperature: getAIConfig('openai').temperature,
          maxTokens: getAIConfig('openai').maxTokens,
          onFinish: async (completion) => {
            // Save assistant response to database
            try {
              await databaseService.saveMessage({
                session_id: currentSessionId,
                role: 'assistant',
                content: completion.text,
                metadata: {
                  usage: completion.usage,
                  finishReason: completion.finishReason,
                  timestamp: new Date().toISOString()
                }
              });
            } catch (error) {
              console.error('Failed to save assistant message:', error);
              // Don't fail the request if database save fails
            }
          }
        });

        // Return streaming response with session info
        return result.toAIStreamResponse({
          headers: {
            'X-Session-ID': currentSessionId,
            'Content-Type': 'text/plain; charset=utf-8'
          }
        });

      } catch (error) {
        console.error('Chat API error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Internal server error',
          'INTERNAL_ERROR',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Health check endpoint
    export async function GET() {
      try {
        const databaseService = getDatabaseService();
        const isHealthy = await databaseService.healthCheck();
        
        return new Response(
          JSON.stringify({ 
            status: 'ok',
            database: isHealthy ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
          }),
          { 
            status: isHealthy ? 200 : 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            status: 'error',
            message: 'Health check failed'
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

- [ ] **Sub-Task 2: Session Management API Routes**
  - **Description:** Create API routes for session listing, retrieval, and management

    ```typescript
    // File Path: CarFind/app/api/sessions/route.ts
    // Session management API endpoints
    import { NextRequest } from 'next/server';
    import { getDatabaseService } from '@/lib/services/database-service';
    import { APIError } from '@/lib/types/errors';

    // GET /api/sessions - List user sessions
    export async function GET(req: NextRequest) {
      try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const search = url.searchParams.get('search');

        const databaseService = getDatabaseService();

        if (userId) {
          const sessions = await databaseService.getUserSessions(userId, {
            limit,
            offset,
            searchTerm: search || undefined,
            sortBy: 'updated_at',
            sortOrder: 'desc'
          });

          return new Response(
            JSON.stringify({ 
              sessions,
              pagination: { limit, offset, total: sessions.length }
            }),
            { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        } else {
          return new Response(
            JSON.stringify({ error: 'userId parameter is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Sessions API error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Failed to retrieve sessions',
          'SESSIONS_RETRIEVAL_FAILED',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // POST /api/sessions - Create new session
    export async function POST(req: NextRequest) {
      try {
        const { title, userId } = await req.json();

        if (!title || title.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: 'Session title is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        const databaseService = getDatabaseService();
        const session = await databaseService.createSession({
          title: title.trim(),
          user_id: userId || null
        });

        return new Response(
          JSON.stringify({ session }),
          { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Session creation error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Failed to create session',
          'SESSION_CREATION_FAILED',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

- [ ] **Sub-Task 3: Individual Session API Route**
  - **Description:** Create API route for individual session operations

    ```typescript
    // File Path: CarFind/app/api/sessions/[sessionId]/route.ts
    // Individual session management endpoints
    import { NextRequest } from 'next/server';
    import { getDatabaseService } from '@/lib/services/database-service';
    import { APIError } from '@/lib/types/errors';

    interface RouteParams {
      params: { sessionId: string };
    }

    // GET /api/sessions/[sessionId] - Get session with messages
    export async function GET(req: NextRequest, { params }: RouteParams) {
      try {
        const { sessionId } = params;

        if (!sessionId || sessionId.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: 'Session ID is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        const databaseService = getDatabaseService();
        const sessionData = await databaseService.getCompleteSession(sessionId);

        if (!sessionData) {
          return new Response(
            JSON.stringify({ error: 'Session not found' }),
            { 
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        return new Response(
          JSON.stringify(sessionData),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Session retrieval error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Failed to retrieve session',
          'SESSION_RETRIEVAL_FAILED',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // PUT /api/sessions/[sessionId] - Update session
    export async function PUT(req: NextRequest, { params }: RouteParams) {
      try {
        const { sessionId } = params;
        const { title } = await req.json();

        if (!sessionId || sessionId.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: 'Session ID is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        if (!title || title.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: 'Session title is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        const databaseService = getDatabaseService();
        const updatedSession = await databaseService.updateSession(sessionId, {
          title: title.trim()
        });

        return new Response(
          JSON.stringify({ session: updatedSession }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Session update error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Failed to update session',
          'SESSION_UPDATE_FAILED',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // DELETE /api/sessions/[sessionId] - Delete session
    export async function DELETE(req: NextRequest, { params }: RouteParams) {
      try {
        const { sessionId } = params;

        if (!sessionId || sessionId.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: 'Session ID is required' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        const databaseService = getDatabaseService();
        await databaseService.deleteSession(sessionId);

        return new Response(
          JSON.stringify({ message: 'Session deleted successfully' }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Session deletion error:', error);
        
        const apiError = error instanceof APIError ? error : new APIError(
          'Failed to delete session',
          'SESSION_DELETION_FAILED',
          { originalError: error }
        );

        return new Response(
          JSON.stringify({ 
            error: apiError.message,
            code: apiError.code
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

- [ ] **Sub-Task 4: Health Check API Route**
  - **Description:** Create comprehensive health check endpoint for system monitoring

    ```typescript
    // File Path: CarFind/app/api/health/route.ts
    // System health check endpoint
    import { NextRequest } from 'next/server';
    import { checkConfigHealth } from '@/lib/config/config-health';
    import { checkSupabaseHealth } from '@/lib/supabase/utils';
    import { getDatabaseService } from '@/lib/services/database-service';
    import { serviceContainer } from '@/lib/services/service-container';

    export async function GET(req: NextRequest) {
      try {
        // Check configuration health
        const configHealth = checkConfigHealth();
        
        // Check database health
        const supabaseHealth = await checkSupabaseHealth();
        const databaseService = getDatabaseService();
        const databaseConnectivity = await databaseService.healthCheck();

        // Check AI services health
        const aiServicesHealth = {
          openai: false,
          semanticKernel: false
        };

        try {
          const openaiService = serviceContainer.getService('openai');
          aiServicesHealth.openai = true;
        } catch (error) {
          // OpenAI service not configured or failing
        }

        try {
          const skService = serviceContainer.getService('semantic-kernel');
          aiServicesHealth.semanticKernel = true;
        } catch (error) {
          // SK service not configured or failing (expected in Phase 2)
        }

        // Determine overall health
        const criticalIssues = [
          configHealth.overall === 'error',
          !supabaseHealth.client,
          !databaseConnectivity,
          !aiServicesHealth.openai
        ];

        const overallHealth = criticalIssues.some(issue => issue) ? 'error' : 
                             configHealth.overall === 'warning' ? 'warning' : 'healthy';

        const healthReport = {
          status: overallHealth,
          timestamp: new Date().toISOString(),
          phase: 'Phase 2',
          components: {
            configuration: configHealth,
            database: {
              supabase: supabaseHealth,
              connectivity: databaseConnectivity
            },
            aiServices: aiServicesHealth
          },
          version: process.env.npm_package_version || 'unknown'
        };

        const statusCode = overallHealth === 'error' ? 503 : 
                          overallHealth === 'warning' ? 200 : 200;

        return new Response(
          JSON.stringify(healthReport, null, 2),
          { 
            status: statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Health check error:', error);
        
        return new Response(
          JSON.stringify({ 
            status: 'error',
            message: 'Health check failed',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    ```

- [ ] **Sub-Task 5: Component Integration Updates**
  - **Description:** Update existing components to work with enhanced API routes

    ```typescript
    // File Path: CarFind/app/page.tsx
    // Enhanced page component with session management
    'use client';

    import { useChat } from 'ai/react';
    import { useState, useEffect } from 'react';
    import { ChatMessage } from '@/lib/types/chat';

    export default function ChatPage() {
      const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
      const [sessionHistory, setSessionHistory] = useState<any[]>([]);

      const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: {
          sessionId: currentSessionId,
          userId: null // For anonymous users, will be replaced with auth in future
        },
        onResponse: (response) => {
          // Extract session ID from response headers
          const sessionId = response.headers.get('X-Session-ID');
          if (sessionId && sessionId !== currentSessionId) {
            setCurrentSessionId(sessionId);
          }
        },
        onError: (error) => {
          console.error('Chat error:', error);
        }
      });

      // Load session history on component mount
      useEffect(() => {
        loadSessionHistory();
      }, []);

      const loadSessionHistory = async () => {
        try {
          // For now, we'll skip loading history without user authentication
          // This will be implemented when user auth is added
          console.log('Session history loading will be implemented with user authentication');
        } catch (error) {
          console.error('Failed to load session history:', error);
        }
      };

      const startNewSession = () => {
        setCurrentSessionId(null);
        // The useChat hook will handle creating a new session on next message
      };

      return (
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-auto p-4">
            {/* Session management UI */}
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">CarFind Chat</h1>
              <button 
                onClick={startNewSession}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                New Conversation
              </button>
            </div>

            {/* Chat messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                value={input}
                placeholder="Ask about cars..."
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      );
    }
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Enhanced chat API maintains 100% compatibility with Phase 1 functionality
- Database persistence works correctly with streaming responses
- Session management API endpoints provide complete CRUD operations
- All API routes handle errors gracefully and provide actionable feedback
- Performance requirements are met (database operations <500ms)
- Health check provides comprehensive system status

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] Enhanced chat API preserves all Phase 1 functionality.
- [ ] Database persistence works correctly with streaming responses.
- [ ] Session management API endpoints are fully functional.
- [ ] Error handling is comprehensive across all routes.
- [ ] Performance tests pass for all database operations.

---

## 9. Risks & Mitigations

- **Risk**: Breaking Phase 1 streaming compatibility → **Mitigation**: Extensive testing with existing useChat hook, maintain exact API contracts
- **Risk**: Database operations slowing down streaming responses → **Mitigation**: Implement async database operations, optimize queries
- **Risk**: Session management complexity affecting user experience → **Mitigation**: Keep session management transparent to users, handle errors gracefully
- **Risk**: Memory leaks from enhanced API operations → **Mitigation**: Proper resource cleanup, monitor memory usage patterns

---

## 10. Self-Assessment Checklist

- [ ] All API routes maintain backward compatibility with Phase 1
- [ ] Database integration enhances functionality without performance impact
- [ ] Session management is robust and user-friendly
- [ ] Error handling provides clear, actionable information
- [ ] Code follows SOLID principles and is well-documented
- [ ] System health monitoring is comprehensive and reliable

---
