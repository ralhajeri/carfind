-- File Path: CarFind/supabase_migrations/02_create_chat_sessions_table.sql
-- Sub-Task 2: Create Chat Sessions Table
-- Description: Create primary table for storing chat session metadata

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
    
    RAISE NOTICE 'chat_sessions table created successfully';
END $$;
