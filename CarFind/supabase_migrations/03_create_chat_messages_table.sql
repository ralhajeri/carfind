-- File Path: CarFind/supabase_migrations/03_create_chat_messages_table.sql
-- Sub-Task 3: Create Chat Messages Table
-- Description: Create table for storing individual chat messages with proper relationships

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
    
    RAISE NOTICE 'chat_messages table created successfully';
END $$;
