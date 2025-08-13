-- File Path: CarFind/supabase_migrations/00_complete_database_schema.sql
-- Complete Database Schema Creation for CarFind Phase 2.2
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
    RAISE NOTICE '';
    RAISE NOTICE 'Tables Created:';
    RAISE NOTICE '  📋 chat_sessions - Session metadata and user associations';
    RAISE NOTICE '  💬 chat_messages - Individual messages within sessions';
    RAISE NOTICE '';
    RAISE NOTICE 'Performance Features:';
    RAISE NOTICE '  🚀 7+ database indexes for optimal query performance';
    RAISE NOTICE '  🔐 Foreign key constraints for data integrity';
    RAISE NOTICE '  ✅ Data validation constraints';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for Phase 2.2 continuation:';
    RAISE NOTICE '  👉 TASK-06: Supabase Client Configuration';
    RAISE NOTICE '  👉 TASK-07: Database Service Layer';
    RAISE NOTICE '';
END $$;
