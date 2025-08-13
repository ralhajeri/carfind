-- File Path: CarFind/supabase_migrations/04_create_indexes_for_performance.sql
-- Sub-Task 4: Create Indexes for Performance
-- Description: Add database indexes for optimal query performance

-- Indexes for optimal query performance

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

-- Verification
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
    
    RAISE NOTICE 'Performance indexes created successfully: % indexes', index_count;
END $$;
