---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Supabase Client Configuration

## Task Meta

- **Task ID:** TASK-06
- **Task Name:** Supabase Client Configuration
- **Phase:** Phase 2.2 - Supabase Database Integration
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Implement SSR-compatible Supabase client setup using modern @supabase/ssr patterns for optimal Next.js App Router compatibility and proper client/server separation.

## 2. Objectives

- Create browser client configuration for client-side database operations
- Implement server client configuration for SSR and API routes
- Establish proper TypeScript integration with database schema types
- Configure secure environment variable handling for Supabase credentials
- Prepare client foundation for database service layer implementation

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 04 (Supabase Package Installation) is completed
- [ ] Task 05 (Database Schema Creation) is completed
- [ ] Supabase project credentials are available
- [ ] Database configuration from Task 03 is implemented
- [ ] Understanding of Next.js App Router SSR patterns

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Database configuration from lib/config/database-config.ts
- Environment variable validation from lib/config/env-validation.ts
- TypeScript database types from lib/types/database.ts
- Next.js App Router SSR patterns

### 4.2 Framework Dependencies

- @supabase/supabase-js package (from Task 04)
- @supabase/ssr package (from Task 04)
- Database configuration types from Task 03
- Next.js 14+ App Router framework

---

## 5. Testing Strategy

- **Unit Tests:** Test client creation and configuration validation
- **Integration Tests:** Verify SSR compatibility and database connectivity
- **Manual Tests:** Test both browser and server clients with actual database operations

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `NFR-005`                  | `Next.js App Router compatibility`  | `lib/supabase/client.ts`                    | `TEST-SSR-001`    |
| `REQ-001`                  | `Database connectivity foundation`  | `lib/supabase/server.ts`                   | `TEST-DB-001`    |
| `NFR-004`                  | `Secure credential management`  | `Client configuration`                   | `TEST-SEC-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Create separate Supabase client configurations for browser and server environments following modern SSR patterns. Implement proper TypeScript integration and secure credential management following Next.js App Router best practices.

### 7.2 Sub-Tasks

- [x] **Sub-Task 1: Browser Client Configuration** ✅ COMPLETED
  - **Description:** Create browser-side Supabase client for client components

    ```typescript
    // File Path: CarFind/lib/supabase/client.ts
    // Modern Supabase browser client with SSR support
    import { createBrowserClient } from '@supabase/ssr';
    import { Database } from '@/lib/types/database';
    import { getDatabaseConfig } from '@/lib/config/database-config';

    let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

    export function createClient() {
      // Return existing client if already created (singleton pattern)
      if (browserClient) {
        return browserClient;
      }

      try {
        const config = getDatabaseConfig();
        
        browserClient = createBrowserClient<Database>(
          config.url,
          config.anonKey
        );

        return browserClient;
      } catch (error) {
        console.error('Failed to create Supabase browser client:', error);
        throw error;
      }
    }

    // Export default client instance
    export const supabase = createClient();

    // Type helper for components
    export type SupabaseClient = ReturnType<typeof createClient>;
    ```

- [x] **Sub-Task 2: Server Client Configuration** ✅ COMPLETED
  - **Description:** Create server-side Supabase client for API routes and SSR

    ```typescript
    // File Path: CarFind/lib/supabase/server.ts
    // Server-side Supabase client for API routes and SSR
    import { createServerClient } from '@supabase/ssr';
    import { cookies } from 'next/headers';
    import { type NextRequest, NextResponse } from 'next/server';
    import { Database } from '@/lib/types/database';
    import { getDatabaseConfig } from '@/lib/config/database-config';

    // Create client for API routes
    export function createServerSupabaseClient() {
      const cookieStore = cookies();
      const config = getDatabaseConfig();

      return createServerClient<Database>(
        config.url,
        config.anonKey,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              try {
                cookieStore.set({ name, value, ...options });
              } catch (error) {
                // Handle cookie setting errors gracefully
                console.warn('Failed to set cookie:', name, error);
              }
            },
            remove(name: string, options: any) {
              try {
                cookieStore.set({ name, value: '', ...options });
              } catch (error) {
                // Handle cookie removal errors gracefully
                console.warn('Failed to remove cookie:', name, error);
              }
            },
          },
        }
      );
    }

    // Create client for middleware
    export function createMiddlewareSupabaseClient(request: NextRequest) {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      const config = getDatabaseConfig();

      const supabase = createServerClient<Database>(
        config.url,
        config.anonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              request.cookies.set({
                name,
                value,
                ...options,
              });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set({
                name,
                value,
                ...options,
              });
            },
            remove(name: string, options: any) {
              request.cookies.set({
                name,
                value: '',
                ...options,
              });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set({
                name,
                value: '',
                ...options,
              });
            },
          },
        }
      );

      return { supabase, response };
    }

    // Create service role client for privileged operations
    export function createServiceRoleClient() {
      const config = getDatabaseConfig();
      
      if (!config.serviceRoleKey) {
        throw new Error('Service role key not available. Check environment variables.');
      }

      return createServerClient<Database>(
        config.url,
        config.serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
    }

    // Type helpers
    export type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient>;
    export type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;
    ```

- [x] **Sub-Task 3: Client Factory and Utilities** ✅ COMPLETED
  - **Description:** Create utility functions for client management and type safety

    ```typescript
    // File Path: CarFind/lib/supabase/utils.ts
    // Supabase client utilities and type helpers
    import { createClient } from './client';
    import { createServerSupabaseClient, createServiceRoleClient } from './server';
    import { Database } from '@/lib/types/database';

    // Type definitions for easier usage
    export type Tables<T extends keyof Database['public']['Tables']> = 
      Database['public']['Tables'][T]['Row'];
    
    export type Inserts<T extends keyof Database['public']['Tables']> = 
      Database['public']['Tables'][T]['Insert'];
    
    export type Updates<T extends keyof Database['public']['Tables']> = 
      Database['public']['Tables'][T]['Update'];

    // Specific table types for convenience
    export type ChatSession = Tables<'chat_sessions'>;
    export type ChatMessage = Tables<'chat_messages'>;
    export type ChatSessionInsert = Inserts<'chat_sessions'>;
    export type ChatMessageInsert = Inserts<'chat_messages'>;
    export type ChatSessionUpdate = Updates<'chat_sessions'>;
    export type ChatMessageUpdate = Updates<'chat_messages'>;

    // Client context type for components
    export interface SupabaseContext {
      client: ReturnType<typeof createClient>;
      isConnected: boolean;
    }

    // Utility function to test database connectivity
    export async function testDatabaseConnection(): Promise<boolean> {
      try {
        const client = createClient();
        const { error } = await client.from('chat_sessions').select('id').limit(1);
        return !error;
      } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
    }

    // Utility function to test server connection
    export async function testServerConnection(): Promise<boolean> {
      try {
        const client = createServerSupabaseClient();
        const { error } = await client.from('chat_sessions').select('id').limit(1);
        return !error;
      } catch (error) {
        console.error('Server database connection test failed:', error);
        return false;
      }
    }

    // Health check function
    export async function checkSupabaseHealth(): Promise<{
      client: boolean;
      server: boolean;
      serviceRole: boolean;
    }> {
      const [clientHealth, serverHealth] = await Promise.allSettled([
        testDatabaseConnection(),
        testServerConnection()
      ]);

      let serviceRoleHealth = false;
      try {
        const serviceClient = createServiceRoleClient();
        const { error } = await serviceClient.from('chat_sessions').select('id').limit(1);
        serviceRoleHealth = !error;
      } catch (error) {
        // Service role might not be configured
        serviceRoleHealth = false;
      }

      return {
        client: clientHealth.status === 'fulfilled' ? clientHealth.value : false,
        server: serverHealth.status === 'fulfilled' ? serverHealth.value : false,
        serviceRole: serviceRoleHealth
      };
    }
    ```

- [x] **Sub-Task 4: Environment Configuration Integration** ✅ COMPLETED
  - **Description:** Integrate Supabase clients with environment configuration

    ```typescript
    // File Path: CarFind/lib/supabase/config.ts
    // Supabase configuration integration
    import { isDatabaseConfigured, getDatabaseConfig } from '@/lib/config/database-config';
    import { createClient } from './client';
    import { createServerSupabaseClient } from './server';
    import { APIError } from '@/lib/types/errors';

    export interface SupabaseConfig {
      url: string;
      anonKey: string;
      serviceRoleKey?: string;
    }

    export function validateSupabaseConfiguration(): void {
      if (!isDatabaseConfigured()) {
        throw new APIError(
          'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          'SUPABASE_NOT_CONFIGURED',
          { 
            phase: 'Phase 2.2',
            required: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
          }
        );
      }
    }

    export function getSupabaseConfig(): SupabaseConfig {
      validateSupabaseConfiguration();
      const dbConfig = getDatabaseConfig();
      
      return {
        url: dbConfig.url,
        anonKey: dbConfig.anonKey,
        serviceRoleKey: dbConfig.serviceRoleKey
      };
    }

    // Initialize and validate configuration on module load
    export function initializeSupabase(): void {
      try {
        validateSupabaseConfiguration();
        console.log('Supabase configuration validated successfully');
      } catch (error) {
        console.warn('Supabase configuration validation failed:', error);
        // Don't throw here to allow graceful degradation
      }
    }

    // Client getter with validation
    export function getSupabaseClient() {
      validateSupabaseConfiguration();
      return createClient();
    }

    // Server client getter with validation
    export function getServerSupabaseClient() {
      validateSupabaseConfiguration();
      return createServerSupabaseClient();
    }
    ```

- [x] **Sub-Task 5: TypeScript Integration and Type Safety** ✅ COMPLETED
  - **Description:** Ensure complete TypeScript integration with database schema

    ```typescript
    // File Path: CarFind/lib/supabase/types.ts
    // Enhanced TypeScript integration for Supabase
    import { Database } from '@/lib/types/database';
    import { createClient } from './client';

    // Re-export database types for convenience
    export type { Database } from '@/lib/types/database';

    // Supabase client type
    export type SupabaseClient = ReturnType<typeof createClient>;

    // Database table types
    export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
    export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
    export type DbResultErr = PostgrestError;

    // Query types
    export interface QueryOptions {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }

    // Response wrapper types
    export interface SupabaseResponse<T> {
      data: T | null;
      error: PostgrestError | null;
      count?: number | null;
    }

    // Error types
    export interface PostgrestError {
      message: string;
      details: string;
      hint: string;
      code: string;
    }

    // Session management types
    export interface SessionData {
      session: ChatSession;
      messageCount: number;
      lastMessageAt: string | null;
    }

    // Message query types
    export interface MessageQuery extends QueryOptions {
      sessionId: string;
      role?: 'user' | 'assistant' | 'system';
      fromDate?: string;
      toDate?: string;
    }

    // Type guards
    export function isPostgrestError(error: any): error is PostgrestError {
      return error && typeof error.message === 'string' && typeof error.code === 'string';
    }

    export function isSupabaseResponse<T>(response: any): response is SupabaseResponse<T> {
      return response && (response.data !== undefined || response.error !== undefined);
    }

    // Utility types for RLS
    export type RLSPolicy = {
      name: string;
      table: string;
      command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
      using?: string;
      check?: string;
    };
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Browser client is created and works correctly in client components
- Server client is configured properly for API routes and SSR
- TypeScript integration provides full type safety for database operations
- Environment configuration is properly integrated and validated
- All clients can successfully connect to the database
- Client separation (browser/server) follows Next.js App Router best practices

### 8.2 Definition of Done Checklist

- [x] All sub-tasks in the implementation plan are complete. ✅ COMPLETED
- [x] Browser client can be imported and used in client components. ✅ COMPLETED
- [x] Server client works correctly in API routes. ✅ COMPLETED
- [x] TypeScript provides complete type safety for database operations. ✅ COMPLETED
- [x] Environment variable validation works correctly. ✅ COMPLETED
- [x] Database connectivity tests pass for all client types. ✅ COMPLETED
- [x] Configuration integration is seamless and secure. ✅ COMPLETED

---

## 9. Risks & Mitigations

- **Risk**: SSR hydration mismatches with client/server separation → **Mitigation**: Follow Supabase SSR documentation exactly, test thoroughly
- **Risk**: Environment variable exposure in client code → **Mitigation**: Use proper public/private variable naming, validate access patterns
- **Risk**: Cookie handling issues in middleware → **Mitigation**: Test cookie operations thoroughly, implement proper error handling
- **Risk**: TypeScript type conflicts with database schema → **Mitigation**: Generate types from actual schema, maintain type synchronization

---

## 10. Self-Assessment Checklist

- [ ] All Supabase clients are properly configured and functional
- [ ] TypeScript integration provides comprehensive type safety
- [ ] Environment configuration is secure and validated
- [ ] SSR patterns follow Next.js App Router best practices
- [ ] Database connectivity is verified for all client types
- [ ] Client separation is properly implemented and tested

---
