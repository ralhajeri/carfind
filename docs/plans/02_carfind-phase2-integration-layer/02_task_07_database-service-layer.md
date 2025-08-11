---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Database Service Layer

## Task Meta

- **Task ID:** TASK-07
- **Task Name:** Database Service Layer
- **Phase:** Phase 2.2 - Supabase Database Integration
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Implement repository pattern with SOLID principles for database operations, creating a comprehensive service layer that abstracts database interactions and provides type-safe CRUD operations.

## 2. Objectives

- Implement repository pattern following Single Responsibility Principle
- Create comprehensive CRUD operations for chat sessions and messages
- Establish proper error handling and transaction management
- Implement query optimization and caching strategies
- Provide type-safe database operations with full TypeScript support
- Create foundation for database service integration with AI services

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 05 (Database Schema Creation) is completed
- [ ] Task 06 (Supabase Client Configuration) is completed
- [ ] Database interfaces from Task 01 are available
- [ ] Supabase clients are functional and tested
- [ ] Understanding of repository pattern and SOLID principles

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Supabase client configurations from lib/supabase/
- Database type definitions from lib/types/database.ts
- Error handling types from lib/types/errors.ts
- Service interfaces from Task 02

### 4.2 Framework Dependencies

- Supabase TypeScript client
- Database schema and types
- Repository pattern interfaces
- SOLID principle implementations

---

## 5. Testing Strategy

- **Unit Tests:** Test each repository method with mock data
- **Integration Tests:** Verify database operations with actual Supabase instance
- **Manual Tests:** Test error handling and transaction rollback scenarios

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Chat session persistence`  | `lib/services/database-service.ts`                    | `TEST-DB-001`    |
| `REQ-002`                  | `Resume conversations`  | `lib/services/session-repository.ts`                   | `TEST-DB-002`    |
| `NFR-001`                  | `Performance <500ms`  | `Query optimization and caching`                   | `TEST-PERF-001`    |
| `NFR-003`                  | `SOLID principles`  | `Repository pattern implementation`                   | `TEST-ARCH-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Implement a service layer using repository pattern that abstracts database operations while maintaining SOLID principles. Create separate repositories for different entities and a unified service interface for higher-level operations.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Base Repository Abstract Class**
  - **Description:** Create abstract base repository with common functionality

    ```typescript
    // File Path: CarFind/lib/services/base-repository.ts
    // SOLID: Single Responsibility + Template Method Pattern
    import { SupabaseClient } from '@/lib/supabase/client';
    import { PostgrestError } from '@supabase/supabase-js';
    import { APIError } from '@/lib/types/errors';

    export abstract class BaseRepository<T, TInsert, TUpdate> {
      protected readonly tableName: string;
      protected readonly client: SupabaseClient;

      constructor(tableName: string, client: SupabaseClient) {
        this.tableName = tableName;
        this.client = client;
      }

      protected handleError(error: PostgrestError | null, operation: string): never {
        if (error) {
          throw new APIError(
            `Database operation failed: ${operation}`,
            'DATABASE_ERROR',
            {
              table: this.tableName,
              operation,
              postgrestError: error
            }
          );
        }
        throw new APIError(
          `Unknown database error during: ${operation}`,
          'DATABASE_UNKNOWN_ERROR',
          { table: this.tableName, operation }
        );
      }

      protected validateId(id: string): void {
        if (!id || id.trim().length === 0) {
          throw new APIError(
            'ID is required and cannot be empty',
            'INVALID_ID',
            { table: this.tableName }
          );
        }
      }

      // Abstract methods to be implemented by concrete repositories
      abstract findById(id: string): Promise<T | null>;
      abstract create(data: TInsert): Promise<T>;
      abstract update(id: string, data: TUpdate): Promise<T>;
      abstract delete(id: string): Promise<void>;
      abstract findMany(options?: QueryOptions): Promise<T[]>;

      // Common query options interface
      interface QueryOptions {
        limit?: number;
        offset?: number;
        orderBy?: string;
        orderDirection?: 'asc' | 'desc';
      }
    }
    ```

- [ ] **Sub-Task 2: Session Repository Implementation**
  - **Description:** Implement repository for chat session operations

    ```typescript
    // File Path: CarFind/lib/services/session-repository.ts
    // SOLID: Single Responsibility for session data operations
    import { BaseRepository } from './base-repository';
    import { ChatSession, ChatSessionInsert, ChatSessionUpdate } from '@/lib/supabase/utils';
    import { SupabaseClient } from '@/lib/supabase/client';
    import { APIError } from '@/lib/types/errors';

    export interface SessionQueryOptions {
      userId?: string;
      limit?: number;
      offset?: number;
      sortBy?: 'created_at' | 'updated_at' | 'title';
      sortOrder?: 'asc' | 'desc';
      searchTerm?: string;
    }

    export interface SessionWithMessageCount extends ChatSession {
      message_count: number;
      last_message_at: string | null;
    }

    export class SessionRepository extends BaseRepository<ChatSession, ChatSessionInsert, ChatSessionUpdate> {
      constructor(client: SupabaseClient) {
        super('chat_sessions', client);
      }

      async findById(id: string): Promise<ChatSession | null> {
        this.validateId(id);

        const { data, error } = await this.client
          .from('chat_sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Not found
          }
          this.handleError(error, 'findById');
        }

        return data;
      }

      async create(data: ChatSessionInsert): Promise<ChatSession> {
        // Validate required fields
        if (!data.title || data.title.trim().length === 0) {
          throw new APIError(
            'Session title is required',
            'VALIDATION_ERROR',
            { field: 'title', value: data.title }
          );
        }

        const { data: session, error } = await this.client
          .from('chat_sessions')
          .insert(data)
          .select()
          .single();

        if (error) {
          this.handleError(error, 'create');
        }

        return session!;
      }

      async update(id: string, data: ChatSessionUpdate): Promise<ChatSession> {
        this.validateId(id);

        const { data: session, error } = await this.client
          .from('chat_sessions')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          this.handleError(error, 'update');
        }

        if (!session) {
          throw new APIError(
            'Session not found',
            'SESSION_NOT_FOUND',
            { sessionId: id }
          );
        }

        return session;
      }

      async delete(id: string): Promise<void> {
        this.validateId(id);

        const { error } = await this.client
          .from('chat_sessions')
          .delete()
          .eq('id', id);

        if (error) {
          this.handleError(error, 'delete');
        }
      }

      async findMany(options: SessionQueryOptions = {}): Promise<ChatSession[]> {
        let query = this.client.from('chat_sessions').select('*');

        // Apply filters
        if (options.userId) {
          query = query.eq('user_id', options.userId);
        }

        if (options.searchTerm) {
          query = query.ilike('title', `%${options.searchTerm}%`);
        }

        // Apply sorting
        const sortBy = options.sortBy || 'updated_at';
        const sortOrder = options.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.offset) {
          query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
        }

        const { data, error } = await query;

        if (error) {
          this.handleError(error, 'findMany');
        }

        return data || [];
      }

      async findByUserId(userId: string, options: Omit<SessionQueryOptions, 'userId'> = {}): Promise<ChatSession[]> {
        return this.findMany({ ...options, userId });
      }

      async findWithMessageCounts(options: SessionQueryOptions = {}): Promise<SessionWithMessageCount[]> {
        let query = this.client
          .from('session_summary')
          .select('*');

        // Apply filters
        if (options.userId) {
          query = query.eq('user_id', options.userId);
        }

        if (options.searchTerm) {
          query = query.ilike('title', `%${options.searchTerm}%`);
        }

        // Apply sorting
        const sortBy = options.sortBy || 'updated_at';
        const sortOrder = options.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.offset) {
          query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
        }

        const { data, error } = await query;

        if (error) {
          this.handleError(error, 'findWithMessageCounts');
        }

        return data || [];
      }

      async updateTitle(id: string, title: string): Promise<ChatSession> {
        if (!title || title.trim().length === 0) {
          throw new APIError(
            'Title cannot be empty',
            'VALIDATION_ERROR',
            { field: 'title', value: title }
          );
        }

        return this.update(id, { title: title.trim() });
      }
    }
    ```

- [ ] **Sub-Task 3: Message Repository Implementation**
  - **Description:** Implement repository for chat message operations

    ```typescript
    // File Path: CarFind/lib/services/message-repository.ts
    // SOLID: Single Responsibility for message data operations
    import { BaseRepository } from './base-repository';
    import { ChatMessage, ChatMessageInsert, ChatMessageUpdate } from '@/lib/supabase/utils';
    import { SupabaseClient } from '@/lib/supabase/client';
    import { APIError } from '@/lib/types/errors';

    export interface MessageQueryOptions {
      sessionId?: string;
      role?: 'user' | 'assistant' | 'system';
      limit?: number;
      offset?: number;
      sortBy?: 'created_at';
      sortOrder?: 'asc' | 'desc';
      fromDate?: string;
      toDate?: string;
    }

    export class MessageRepository extends BaseRepository<ChatMessage, ChatMessageInsert, ChatMessageUpdate> {
      constructor(client: SupabaseClient) {
        super('chat_messages', client);
      }

      async findById(id: string): Promise<ChatMessage | null> {
        this.validateId(id);

        const { data, error } = await this.client
          .from('chat_messages')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Not found
          }
          this.handleError(error, 'findById');
        }

        return data;
      }

      async create(data: ChatMessageInsert): Promise<ChatMessage> {
        // Validate required fields
        if (!data.session_id) {
          throw new APIError(
            'Session ID is required',
            'VALIDATION_ERROR',
            { field: 'session_id', value: data.session_id }
          );
        }

        if (!data.content || data.content.trim().length === 0) {
          throw new APIError(
            'Message content is required',
            'VALIDATION_ERROR',
            { field: 'content', value: data.content }
          );
        }

        if (!['user', 'assistant', 'system'].includes(data.role)) {
          throw new APIError(
            'Invalid message role',
            'VALIDATION_ERROR',
            { field: 'role', value: data.role, allowed: ['user', 'assistant', 'system'] }
          );
        }

        const { data: message, error } = await this.client
          .from('chat_messages')
          .insert(data)
          .select()
          .single();

        if (error) {
          this.handleError(error, 'create');
        }

        return message!;
      }

      async update(id: string, data: ChatMessageUpdate): Promise<ChatMessage> {
        this.validateId(id);

        const { data: message, error } = await this.client
          .from('chat_messages')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          this.handleError(error, 'update');
        }

        if (!message) {
          throw new APIError(
            'Message not found',
            'MESSAGE_NOT_FOUND',
            { messageId: id }
          );
        }

        return message;
      }

      async delete(id: string): Promise<void> {
        this.validateId(id);

        const { error } = await this.client
          .from('chat_messages')
          .delete()
          .eq('id', id);

        if (error) {
          this.handleError(error, 'delete');
        }
      }

      async findMany(options: MessageQueryOptions = {}): Promise<ChatMessage[]> {
        let query = this.client.from('chat_messages').select('*');

        // Apply filters
        if (options.sessionId) {
          query = query.eq('session_id', options.sessionId);
        }

        if (options.role) {
          query = query.eq('role', options.role);
        }

        if (options.fromDate) {
          query = query.gte('created_at', options.fromDate);
        }

        if (options.toDate) {
          query = query.lte('created_at', options.toDate);
        }

        // Apply sorting
        const sortBy = options.sortBy || 'created_at';
        const sortOrder = options.sortOrder || 'asc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.offset) {
          query = query.range(options.offset, (options.offset + (options.limit || 100)) - 1);
        }

        const { data, error } = await query;

        if (error) {
          this.handleError(error, 'findMany');
        }

        return data || [];
      }

      async findBySessionId(sessionId: string, options: Omit<MessageQueryOptions, 'sessionId'> = {}): Promise<ChatMessage[]> {
        this.validateId(sessionId);
        return this.findMany({ ...options, sessionId });
      }

      async createMany(messages: ChatMessageInsert[]): Promise<ChatMessage[]> {
        if (!messages || messages.length === 0) {
          throw new APIError(
            'Messages array cannot be empty',
            'VALIDATION_ERROR',
            { field: 'messages', value: messages }
          );
        }

        // Validate all messages
        messages.forEach((message, index) => {
          if (!message.session_id) {
            throw new APIError(
              `Session ID is required for message at index ${index}`,
              'VALIDATION_ERROR',
              { field: `messages[${index}].session_id`, value: message.session_id }
            );
          }
          if (!message.content || message.content.trim().length === 0) {
            throw new APIError(
              `Content is required for message at index ${index}`,
              'VALIDATION_ERROR',
              { field: `messages[${index}].content`, value: message.content }
            );
          }
        });

        const { data, error } = await this.client
          .from('chat_messages')
          .insert(messages)
          .select();

        if (error) {
          this.handleError(error, 'createMany');
        }

        return data || [];
      }

      async deleteBySessionId(sessionId: string): Promise<void> {
        this.validateId(sessionId);

        const { error } = await this.client
          .from('chat_messages')
          .delete()
          .eq('session_id', sessionId);

        if (error) {
          this.handleError(error, 'deleteBySessionId');
        }
      }

      async getMessageCount(sessionId: string): Promise<number> {
        this.validateId(sessionId);

        const { count, error } = await this.client
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessionId);

        if (error) {
          this.handleError(error, 'getMessageCount');
        }

        return count || 0;
      }
    }
    ```

- [ ] **Sub-Task 4: Database Service Implementation**
  - **Description:** Create unified database service interface combining repositories

    ```typescript
    // File Path: CarFind/lib/services/database-service.ts
    // SOLID: Single Responsibility + Interface Segregation
    import { SupabaseClient, createClient } from '@/lib/supabase/client';
    import { createServerSupabaseClient } from '@/lib/supabase/server';
    import { SessionRepository, SessionQueryOptions } from './session-repository';
    import { MessageRepository, MessageQueryOptions } from './message-repository';
    import { ChatSession, ChatMessage, ChatSessionInsert, ChatMessageInsert } from '@/lib/supabase/utils';
    import { APIError } from '@/lib/types/errors';

    export interface DatabaseService {
      // Session operations
      createSession(session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ChatSession>;
      getSession(sessionId: string): Promise<ChatSession | null>;
      updateSession(sessionId: string, updates: Partial<ChatSessionInsert>): Promise<ChatSession>;
      deleteSession(sessionId: string): Promise<void>;
      getUserSessions(userId: string, options?: SessionQueryOptions): Promise<ChatSession[]>;
      
      // Message operations
      saveMessage(message: Omit<ChatMessageInsert, 'id' | 'created_at'>): Promise<ChatMessage>;
      getSessionMessages(sessionId: string, options?: MessageQueryOptions): Promise<ChatMessage[]>;
      deleteMessage(messageId: string): Promise<void>;
      
      // Combined operations
      createSessionWithMessage(session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>, message: Omit<ChatMessageInsert, 'id' | 'session_id' | 'created_at'>): Promise<{ session: ChatSession; message: ChatMessage }>;
      getCompleteSession(sessionId: string): Promise<{ session: ChatSession; messages: ChatMessage[] } | null>;
    }

    export class SupabaseDatabaseService implements DatabaseService {
      private sessionRepository: SessionRepository;
      private messageRepository: MessageRepository;
      private client: SupabaseClient;

      constructor(client?: SupabaseClient) {
        this.client = client || createClient();
        this.sessionRepository = new SessionRepository(this.client);
        this.messageRepository = new MessageRepository(this.client);
      }

      async createSession(session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ChatSession> {
        return this.sessionRepository.create(session);
      }

      async getSession(sessionId: string): Promise<ChatSession | null> {
        return this.sessionRepository.findById(sessionId);
      }

      async updateSession(sessionId: string, updates: Partial<ChatSessionInsert>): Promise<ChatSession> {
        return this.sessionRepository.update(sessionId, updates);
      }

      async deleteSession(sessionId: string): Promise<void> {
        // Delete messages first due to foreign key constraint
        await this.messageRepository.deleteBySessionId(sessionId);
        await this.sessionRepository.delete(sessionId);
      }

      async getUserSessions(userId: string, options?: SessionQueryOptions): Promise<ChatSession[]> {
        return this.sessionRepository.findByUserId(userId, options);
      }

      async saveMessage(message: Omit<ChatMessageInsert, 'id' | 'created_at'>): Promise<ChatMessage> {
        return this.messageRepository.create(message);
      }

      async getSessionMessages(sessionId: string, options?: MessageQueryOptions): Promise<ChatMessage[]> {
        return this.messageRepository.findBySessionId(sessionId, options);
      }

      async deleteMessage(messageId: string): Promise<void> {
        return this.messageRepository.delete(messageId);
      }

      async createSessionWithMessage(
        session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>,
        message: Omit<ChatMessageInsert, 'id' | 'session_id' | 'created_at'>
      ): Promise<{ session: ChatSession; message: ChatMessage }> {
        // Create session first
        const createdSession = await this.createSession(session);
        
        // Create message with session ID
        const createdMessage = await this.saveMessage({
          ...message,
          session_id: createdSession.id
        });

        return {
          session: createdSession,
          message: createdMessage
        };
      }

      async getCompleteSession(sessionId: string): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
        const session = await this.getSession(sessionId);
        if (!session) {
          return null;
        }

        const messages = await this.getSessionMessages(sessionId, {
          sortBy: 'created_at',
          sortOrder: 'asc'
        });

        return { session, messages };
      }

      // Health check method
      async healthCheck(): Promise<boolean> {
        try {
          const { data, error } = await this.client
            .from('chat_sessions')
            .select('id')
            .limit(1);
          
          return !error;
        } catch (error) {
          return false;
        }
      }
    }

    // Factory function for server-side usage
    export function createDatabaseService(useServerClient: boolean = false): DatabaseService {
      const client = useServerClient ? createServerSupabaseClient() : createClient();
      return new SupabaseDatabaseService(client);
    }

    // Singleton instance for client-side usage
    let clientDatabaseService: DatabaseService | null = null;

    export function getDatabaseService(): DatabaseService {
      if (!clientDatabaseService) {
        clientDatabaseService = new SupabaseDatabaseService();
      }
      return clientDatabaseService;
    }
    ```

- [ ] **Sub-Task 5: Service Integration and Testing**
  - **Description:** Create integration utilities and testing helpers

    ```typescript
    // File Path: CarFind/lib/services/database-testing.ts
    // Testing utilities for database service
    import { DatabaseService, SupabaseDatabaseService } from './database-service';
    import { createClient } from '@/lib/supabase/client';
    import { ChatSessionInsert, ChatMessageInsert } from '@/lib/supabase/utils';

    export class DatabaseServiceTester {
      private service: DatabaseService;

      constructor(service?: DatabaseService) {
        this.service = service || new SupabaseDatabaseService();
      }

      async testBasicOperations(): Promise<boolean> {
        try {
          // Test session creation
          const testSession: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'> = {
            title: 'Test Session',
            user_id: null
          };

          const session = await this.service.createSession(testSession);
          
          // Test message creation
          const testMessage: Omit<ChatMessageInsert, 'id' | 'created_at'> = {
            session_id: session.id,
            role: 'user',
            content: 'Test message'
          };

          const message = await this.service.saveMessage(testMessage);

          // Test retrieval
          const retrievedSession = await this.service.getSession(session.id);
          const retrievedMessages = await this.service.getSessionMessages(session.id);

          // Cleanup
          await this.service.deleteSession(session.id);

          return !!(retrievedSession && retrievedMessages.length > 0);
        } catch (error) {
          console.error('Database service test failed:', error);
          return false;
        }
      }

      async testPerformance(): Promise<{ averageResponseTime: number; success: boolean }> {
        const iterations = 10;
        const times: number[] = [];

        try {
          for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            
            const session = await this.service.createSession({
              title: `Performance Test ${i}`,
              user_id: null
            });

            await this.service.getSession(session.id);
            await this.service.deleteSession(session.id);

            const end = performance.now();
            times.push(end - start);
          }

          const averageResponseTime = times.reduce((a, b) => a + b, 0) / times.length;
          
          return {
            averageResponseTime,
            success: averageResponseTime < 500 // NFR-001 requirement
          };
        } catch (error) {
          console.error('Performance test failed:', error);
          return { averageResponseTime: -1, success: false };
        }
      }
    }

    export async function runDatabaseServiceTests(): Promise<{
      basic: boolean;
      performance: { averageResponseTime: number; success: boolean };
      health: boolean;
    }> {
      const tester = new DatabaseServiceTester();
      const service = new SupabaseDatabaseService();

      const [basicTest, performanceTest, healthCheck] = await Promise.all([
        tester.testBasicOperations(),
        tester.testPerformance(),
        service.healthCheck()
      ]);

      return {
        basic: basicTest,
        performance: performanceTest,
        health: healthCheck
      };
    }
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Repository pattern is implemented following SOLID principles
- All CRUD operations work correctly for sessions and messages
- Database operations complete within 500ms (NFR-001)
- Error handling is comprehensive and provides actionable feedback
- TypeScript provides full type safety for all database operations
- Service layer abstracts database complexity effectively

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] All repository classes implement the base repository correctly.
- [ ] Database service provides unified interface for all operations.
- [ ] Error handling covers all database operation scenarios.
- [ ] Performance tests pass the 500ms requirement.
- [ ] TypeScript compilation succeeds with strict mode.

---

## 9. Risks & Mitigations

- **Risk**: Database operations exceeding performance requirements → **Mitigation**: Implement query optimization, proper indexing, connection pooling
- **Risk**: Complex transaction management → **Mitigation**: Keep transactions simple, implement proper rollback strategies
- **Risk**: Repository pattern over-engineering → **Mitigation**: Follow YAGNI principle, implement only necessary abstractions
- **Risk**: Type safety issues with dynamic queries → **Mitigation**: Use strong typing throughout, validate inputs comprehensively

---

## 10. Self-Assessment Checklist

- [ ] Repository pattern follows SOLID principles correctly
- [ ] Database operations are performant and reliable
- [ ] Error handling provides clear, actionable information
- [ ] Service layer effectively abstracts database complexity
- [ ] TypeScript integration provides comprehensive type safety
- [ ] Testing utilities validate service functionality thoroughly

---
