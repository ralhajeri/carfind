---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Database Schema Creation

## Task Meta

- **Task ID:** TASK-05
- **Task Name:** Database Schema Creation
- **Phase:** Phase 2.2 - Supabase Database Integration
- **Parent Plan:** [CarFind Phase 2 Integration Layer Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Design and create optimized database schema with proper indexing and Row Level Security (RLS) policies for chat session persistence and message storage.

## 2. Objectives

- Create chat_sessions table with proper structure and constraints
- Create chat_messages table with foreign key relationships
- Implement Row Level Security (RLS) policies for data protection
- Add proper database indexing for optimal query performance
- Create database functions and triggers for automated timestamps
- Establish foundation for user session management

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 04 (Supabase Package Installation) is completed
- [ ] Supabase project is created and accessible
- [ ] Database credentials are available in environment variables
- [ ] Supabase dashboard access is confirmed
- [ ] Understanding of chat data structure from Phase 1

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Supabase SQL Editor for schema creation
- Supabase dashboard for table management
- TypeScript database types from Task 01
- Chat message structure from Phase 1 implementation

### 4.2 Framework Dependencies

- Supabase database service
- PostgreSQL (underlying Supabase database)
- Database type definitions from lib/types/database.ts
- Supabase authentication system (for RLS policies)

---

## 5. Testing Strategy

- **Unit Tests:** Validate individual table constraints and triggers
- **Integration Tests:** Test RLS policies and data access patterns
- **Manual Tests:** Verify schema through Supabase dashboard and SQL queries

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Chat session persistence`  | `chat_sessions table`                    | `TEST-DB-001`    |
| `REQ-002`                  | `Resume previous conversations`  | `chat_messages table`                   | `TEST-DB-002`    |
| `NFR-001`                  | `Database performance <500ms`  | `Database indexes`                   | `TEST-PERF-001`    |
| `NFR-004`                  | `RLS security policies`  | `RLS policies on tables`                   | `TEST-SEC-001`    |

---

## 7. Implementation Plan

### 7.1 Design

Create a normalized database schema that efficiently stores chat sessions and messages with proper relationships, indexing, and security. Follow PostgreSQL best practices for performance and data integrity.

### 7.2 Sub-Tasks

- [x] **Sub-Task 1: Enable Required Extensions** ✅ COMPLETED
  - **Description:** Enable necessary PostgreSQL extensions for UUID generation

    ```sql
    -- File Path: Supabase SQL Editor
    -- Enable UUID extension for primary keys
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Enable RLS (Row Level Security) if not already enabled
    -- This is typically enabled by default in Supabase
    ```

- [x] **Sub-Task 2: Create Chat Sessions Table** ✅ COMPLETED
  - **Description:** Create primary table for storing chat session metadata

    ```sql
    -- File Path: Supabase SQL Editor
    -- Chat sessions table with proper constraints
    CREATE TABLE chat_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'New Conversation',
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      
      -- Constraints
      CONSTRAINT chat_sessions_title_length CHECK (char_length(title) <= 100),
      CONSTRAINT chat_sessions_title_not_empty CHECK (trim(title) <> '')
    );

    -- Add comments for documentation
    COMMENT ON TABLE chat_sessions IS 'Stores chat session metadata and user associations';
    COMMENT ON COLUMN chat_sessions.id IS 'Unique identifier for the chat session';
    COMMENT ON COLUMN chat_sessions.user_id IS 'References auth.users, null for anonymous sessions';
    COMMENT ON COLUMN chat_sessions.title IS 'Human-readable title for the conversation';
    COMMENT ON COLUMN chat_sessions.created_at IS 'Timestamp when session was created';
    COMMENT ON COLUMN chat_sessions.updated_at IS 'Timestamp when session was last modified';
    ```

- [x] **Sub-Task 3: Create Chat Messages Table** ✅ COMPLETED
  - **Description:** Create table for storing individual chat messages with proper relationships

    ```sql
    -- File Path: Supabase SQL Editor
    -- Chat messages table with foreign key to sessions
    CREATE TABLE chat_messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      
      -- Constraints
      CONSTRAINT chat_messages_role_valid CHECK (role IN ('user', 'assistant', 'system')),
      CONSTRAINT chat_messages_content_not_empty CHECK (trim(content) <> ''),
      CONSTRAINT chat_messages_content_length CHECK (char_length(content) <= 50000)
    );

    -- Add comments for documentation
    COMMENT ON TABLE chat_messages IS 'Stores individual messages within chat sessions';
    COMMENT ON COLUMN chat_messages.id IS 'Unique identifier for the message';
    COMMENT ON COLUMN chat_messages.session_id IS 'References the parent chat session';
    COMMENT ON COLUMN chat_messages.role IS 'Message sender: user, assistant, or system';
    COMMENT ON COLUMN chat_messages.content IS 'The actual message content';
    COMMENT ON COLUMN chat_messages.metadata IS 'Additional message metadata (tokens, etc.)';
    COMMENT ON COLUMN chat_messages.created_at IS 'Timestamp when message was created';
    ```

- [x] **Sub-Task 4: Create Indexes for Performance** ✅ COMPLETED
  - **Description:** Add database indexes for optimal query performance

    ```sql
    -- File Path: Supabase SQL Editor
    -- Indexes for optimal query performance
    
    -- Index for user's sessions (most common query)
    CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
    
    -- Index for session creation time (for sorting)
    CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
    
    -- Composite index for user sessions sorted by update time
    CREATE INDEX idx_chat_sessions_user_updated ON chat_sessions(user_id, updated_at DESC);
    
    -- Index for session messages (most common query)
    CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
    
    -- Index for messages creation time within session
    CREATE INDEX idx_chat_messages_session_created ON chat_messages(session_id, created_at);
    
    -- Index for message role filtering
    CREATE INDEX idx_chat_messages_role ON chat_messages(role);
    ```

- [ ] **Sub-Task 5: Create Database Functions and Triggers**
  - **Description:** Implement automated timestamp updates and utility functions

    ```sql
    -- File Path: Supabase SQL Editor
    -- Function to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger to automatically update updated_at on chat_sessions
    CREATE TRIGGER update_chat_sessions_updated_at
      BEFORE UPDATE ON chat_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    -- Function to update session's updated_at when messages are added
    CREATE OR REPLACE FUNCTION update_session_on_message_change()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update the parent session's updated_at timestamp
      UPDATE chat_sessions 
      SET updated_at = NOW() 
      WHERE id = COALESCE(NEW.session_id, OLD.session_id);
      
      RETURN COALESCE(NEW, OLD);
    END;
    $$ language 'plpgsql';

    -- Trigger to update session timestamp when messages are modified
    CREATE TRIGGER update_session_on_message_insert
      AFTER INSERT ON chat_messages
      FOR EACH ROW
      EXECUTE FUNCTION update_session_on_message_change();

    CREATE TRIGGER update_session_on_message_update
      AFTER UPDATE ON chat_messages
      FOR EACH ROW
      EXECUTE FUNCTION update_session_on_message_change();

    CREATE TRIGGER update_session_on_message_delete
      AFTER DELETE ON chat_messages
      FOR EACH ROW
      EXECUTE FUNCTION update_session_on_message_change();
    ```

- [ ] **Sub-Task 6: Implement Row Level Security Policies**
  - **Description:** Create RLS policies for secure data access

    ```sql
    -- File Path: Supabase SQL Editor
    -- Enable Row Level Security
    ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can only access their own sessions
    CREATE POLICY "Users can view their own sessions"
      ON chat_sessions FOR SELECT
      USING (auth.uid() = user_id OR user_id IS NULL);

    CREATE POLICY "Users can insert their own sessions"
      ON chat_sessions FOR INSERT
      WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

    CREATE POLICY "Users can update their own sessions"
      ON chat_sessions FOR UPDATE
      USING (auth.uid() = user_id OR user_id IS NULL)
      WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

    CREATE POLICY "Users can delete their own sessions"
      ON chat_sessions FOR DELETE
      USING (auth.uid() = user_id OR user_id IS NULL);

    -- Policy: Users can only access messages from their sessions
    CREATE POLICY "Users can view messages from their sessions"
      ON chat_messages FOR SELECT
      USING (
        session_id IN (
          SELECT id FROM chat_sessions 
          WHERE auth.uid() = user_id OR user_id IS NULL
        )
      );

    CREATE POLICY "Users can insert messages to their sessions"
      ON chat_messages FOR INSERT
      WITH CHECK (
        session_id IN (
          SELECT id FROM chat_sessions 
          WHERE auth.uid() = user_id OR user_id IS NULL
        )
      );

    CREATE POLICY "Users can update messages from their sessions"
      ON chat_messages FOR UPDATE
      USING (
        session_id IN (
          SELECT id FROM chat_sessions 
          WHERE auth.uid() = user_id OR user_id IS NULL
        )
      )
      WITH CHECK (
        session_id IN (
          SELECT id FROM chat_sessions 
          WHERE auth.uid() = user_id OR user_id IS NULL
        )
      );

    CREATE POLICY "Users can delete messages from their sessions"
      ON chat_messages FOR DELETE
      USING (
        session_id IN (
          SELECT id FROM chat_sessions 
          WHERE auth.uid() = user_id OR user_id IS NULL
        )
      );
    ```

- [ ] **Sub-Task 7: Create Database Views for Common Queries**
  - **Description:** Create views to simplify common query patterns

    ```sql
    -- File Path: Supabase SQL Editor
    -- View for sessions with message counts and latest message
    CREATE VIEW session_summary AS
    SELECT 
      s.id,
      s.user_id,
      s.title,
      s.created_at,
      s.updated_at,
      COUNT(m.id) as message_count,
      MAX(m.created_at) as last_message_at
    FROM chat_sessions s
    LEFT JOIN chat_messages m ON s.id = m.session_id
    GROUP BY s.id, s.user_id, s.title, s.created_at, s.updated_at;

    -- View for complete session data with messages
    CREATE VIEW session_with_messages AS
    SELECT 
      s.id as session_id,
      s.user_id,
      s.title,
      s.created_at as session_created_at,
      s.updated_at as session_updated_at,
      m.id as message_id,
      m.role,
      m.content,
      m.metadata,
      m.created_at as message_created_at
    FROM chat_sessions s
    LEFT JOIN chat_messages m ON s.id = m.session_id
    ORDER BY s.updated_at DESC, m.created_at ASC;

    -- Add RLS to views
    ALTER VIEW session_summary OWNER TO postgres;
    ALTER VIEW session_with_messages OWNER TO postgres;
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- All tables are created with proper structure and constraints
- Database indexes are implemented for optimal performance
- RLS policies secure data access appropriately
- Triggers and functions work correctly for timestamp management
- Database views simplify common query patterns
- Schema supports all requirements for chat session persistence

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] Tables are created and visible in Supabase dashboard.
- [ ] All indexes are created and show in database statistics.
- [ ] RLS policies are active and tested with sample data.
- [ ] Triggers work correctly for timestamp updates.
- [ ] Database views return expected results.
- [ ] Schema documentation is complete with comments.

---

## 9. Risks & Mitigations

- **Risk**: RLS policies too restrictive or permissive → **Mitigation**: Test with sample data, follow Supabase RLS best practices
- **Risk**: Database performance issues with indexes → **Mitigation**: Monitor query performance, adjust indexes based on usage patterns
- **Risk**: Trigger complexity causing performance problems → **Mitigation**: Keep triggers simple, monitor database performance
- **Risk**: Schema changes breaking future migrations → **Mitigation**: Use Supabase migration system, document all schema changes

---

## 10. Self-Assessment Checklist

- [ ] Database schema follows PostgreSQL best practices
- [ ] All tables have appropriate constraints and data validation
- [ ] RLS policies provide proper security without being overly restrictive
- [ ] Indexes are optimized for expected query patterns
- [ ] Triggers and functions work correctly and efficiently
- [ ] Schema is documented and maintainable for future development

---
