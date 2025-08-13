-- File Path: CarFind/supabase_migrations/00_complete_database_schema.sql
-- Complete database schema with all components
-- File: 00_complete_database_schema.sql
-- Purpose: Complete schema creation in single file (UPDATED with Sub-Tasks 5-7)
-- Task: TASK-05 Database Schema Creation
-- Phase: Phase 2.2 - Supabase Database Integration
-- Author: GitHub Copilot (CarFind Integration Layer)
-- Date: 2025-08-13 (Updated)
-- ============================================================================

-- Step 1: Enable Required Extensions
-- ============================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create Chat Sessions Table
-- ============================================================================
-- Combines all sub-tasks for database schema creation
-- Execute in Supabase SQL Editor or via psql connection

-- =============================================================================
-- SUB-TASK 1: ENABLE REQUIRED EXTENSIONS
-- =============================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions are enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
    ) THEN
        RAISE EXCEPTION 'uuid-ossp extension failed to install';
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 1 Complete: Extensions successfully enabled';
END $$;

-- =============================================================================
-- SUB-TASK 2: CREATE CHAT SESSIONS TABLE
-- =============================================================================

-- Chat sessions table with proper constraints
CREATE TABLE IF NOT EXISTS chat_sessions (
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

-- Verification
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'chat_sessions'
    ) THEN
        RAISE EXCEPTION 'chat_sessions table creation failed';
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 2 Complete: chat_sessions table created successfully';
END $$;

-- =============================================================================
-- SUB-TASK 3: CREATE CHAT MESSAGES TABLE
-- =============================================================================

-- Chat messages table with foreign key to sessions
CREATE TABLE IF NOT EXISTS chat_messages (
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

-- Verification
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'chat_messages'
    ) THEN
        RAISE EXCEPTION 'chat_messages table creation failed';
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 3 Complete: chat_messages table created successfully';
END $$;

-- =============================================================================
-- SUB-TASK 4: CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Index for user's sessions (most common query)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Index for session creation time (for sorting)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

-- Composite index for user sessions sorted by update time
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions(user_id, updated_at DESC);

-- Index for session messages (most common query)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

-- Index for messages creation time within session
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created ON chat_messages(session_id, created_at);

-- Index for message role filtering
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

-- Performance optimization: Partial indexes for active sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(updated_at DESC) 
WHERE updated_at > NOW() - INTERVAL '30 days';

-- Add comments for index documentation
COMMENT ON INDEX idx_chat_sessions_user_id IS 'Optimizes user session lookups';
COMMENT ON INDEX idx_chat_sessions_created_at IS 'Optimizes session sorting by creation time';
COMMENT ON INDEX idx_chat_sessions_user_updated IS 'Optimizes user session queries sorted by update time';
COMMENT ON INDEX idx_chat_messages_session_id IS 'Optimizes message retrieval by session';
COMMENT ON INDEX idx_chat_messages_session_created IS 'Optimizes chronological message ordering within sessions';
COMMENT ON INDEX idx_chat_messages_role IS 'Optimizes message filtering by role';
COMMENT ON INDEX idx_chat_sessions_active IS 'Optimizes queries for recently active sessions';

-- Final verification
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename IN ('chat_sessions', 'chat_messages')
    AND indexname LIKE 'idx_%';
    
    IF index_count < 7 THEN
        RAISE EXCEPTION 'Expected at least 7 indexes, found %', index_count;
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 4 Complete: Performance indexes created successfully (% indexes)', index_count;
END $$;

-- =============================================================================
-- SCHEMA CREATION COMPLETE
-- =============================================================================

-- =============================================================================
-- SUB-TASK 5: CREATE DATABASE FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add comment for documentation
COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at column when a row is modified';

-- Trigger to automatically update updated_at on chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update session's updated_at when messages are added/modified/deleted
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

-- Add comment for documentation
COMMENT ON FUNCTION update_session_on_message_change() IS 'Updates parent session timestamp when messages are added, updated, or deleted';

-- Triggers for message operations
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

-- Verification
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
    ) THEN
        RAISE EXCEPTION 'update_updated_at_column function creation failed';
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 5 Complete: Database functions and triggers created successfully';
END $$;

-- =============================================================================
-- SUB-TASK 6: IMPLEMENT ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable Row Level Security on both tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat Sessions RLS Policies
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

-- Chat Messages RLS Policies
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

-- Verification
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('chat_sessions', 'chat_messages');
    
    IF policy_count < 8 THEN
        RAISE EXCEPTION 'Expected at least 8 RLS policies, found %', policy_count;
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 6 Complete: Row Level Security policies implemented successfully (% policies)', policy_count;
END $$;

-- =============================================================================
-- SUB-TASK 7: CREATE DATABASE VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View 1: Session Summary
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

-- View 2: Session with Messages
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

-- View 3: Active Sessions Summary
CREATE VIEW active_sessions_summary AS
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
WHERE s.updated_at >= NOW() - INTERVAL '30 days'
GROUP BY s.id, s.user_id, s.title, s.created_at, s.updated_at
ORDER BY s.updated_at DESC;

-- View 4: User Session Statistics
CREATE VIEW user_session_statistics AS
SELECT 
  s.user_id,
  COUNT(DISTINCT s.id) as total_sessions,
  COUNT(m.id) as total_messages,
  AVG(session_messages.message_count) as avg_messages_per_session,
  MIN(s.created_at) as first_session_at,
  MAX(s.updated_at) as last_activity_at
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
LEFT JOIN (
  SELECT session_id, COUNT(*) as message_count
  FROM chat_messages
  GROUP BY session_id
) session_messages ON s.id = session_messages.session_id
WHERE s.user_id IS NOT NULL
GROUP BY s.user_id;

-- Apply RLS to views
ALTER VIEW session_summary ENABLE ROW LEVEL SECURITY;
ALTER VIEW session_with_messages ENABLE ROW LEVEL SECURITY;
ALTER VIEW active_sessions_summary ENABLE ROW LEVEL SECURITY;
ALTER VIEW user_session_statistics ENABLE ROW LEVEL SECURITY;

-- Set view ownership
ALTER VIEW session_summary OWNER TO postgres;
ALTER VIEW session_with_messages OWNER TO postgres;
ALTER VIEW active_sessions_summary OWNER TO postgres;
ALTER VIEW user_session_statistics OWNER TO postgres;

-- Verification
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM pg_views 
    WHERE schemaname = 'public' 
    AND viewname LIKE '%session%';
    
    IF view_count < 4 THEN
        RAISE EXCEPTION 'Expected at least 4 views, found %', view_count;
    END IF;
    
    RAISE NOTICE '✅ Sub-Task 7 Complete: Database views created successfully (% views)', view_count;
END $$;

-- =============================================================================
-- SCHEMA CREATION COMPLETE - ALL 7 SUB-TASKS
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 DATABASE SCHEMA CREATION COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE 'All Sub-Tasks Completed:';
    RAISE NOTICE '  ✅ Sub-Task 1: Enable Required Extensions';
    RAISE NOTICE '  ✅ Sub-Task 2: Create Chat Sessions Table';
    RAISE NOTICE '  ✅ Sub-Task 3: Create Chat Messages Table';
    RAISE NOTICE '  ✅ Sub-Task 4: Create Indexes for Performance';
    RAISE NOTICE '  ✅ Sub-Task 5: Create Database Functions and Triggers';
    RAISE NOTICE '  ✅ Sub-Task 6: Implement Row Level Security Policies';
    RAISE NOTICE '  ✅ Sub-Task 7: Create Database Views for Common Queries';
    RAISE NOTICE '';
    RAISE NOTICE 'Database Components Created:';
    RAISE NOTICE '  📋 Tables: chat_sessions, chat_messages';
    RAISE NOTICE '  🚀 Indexes: 7+ performance indexes';
    RAISE NOTICE '  � Functions: update_updated_at_column, update_session_on_message_change';
    RAISE NOTICE '  ⚡ Triggers: Auto-timestamp updates';
    RAISE NOTICE '  🔐 Security: 8+ RLS policies';
    RAISE NOTICE '  📊 Views: 4 common query patterns';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for Phase 2.2 continuation:';
    RAISE NOTICE '  👉 TASK-06: Supabase Client Configuration';
    RAISE NOTICE '  👉 TASK-07: Database Service Layer';
    RAISE NOTICE '';
END $$;
