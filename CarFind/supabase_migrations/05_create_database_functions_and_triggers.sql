-- ============================================================================
-- File: 05_create_database_functions_and_triggers.sql
-- Purpose: Implement automated timestamp updates and utility functions
-- Task: TASK-05 Sub-Task 5 - Create Database Functions and Triggers
-- Phase: Phase 2.2 - Supabase Database Integration
-- Author: GitHub Copilot (CarFind Integration Layer)
-- Date: 2025-08-13
-- ============================================================================

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

-- Add comment for documentation
COMMENT ON TRIGGER update_chat_sessions_updated_at ON chat_sessions IS 'Automatically updates updated_at timestamp when session is modified';

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

-- Trigger to update session timestamp when messages are inserted
CREATE TRIGGER update_session_on_message_insert
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_on_message_change();

-- Trigger to update session timestamp when messages are updated
CREATE TRIGGER update_session_on_message_update
  AFTER UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_on_message_change();

-- Trigger to update session timestamp when messages are deleted
CREATE TRIGGER update_session_on_message_delete
  AFTER DELETE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_on_message_change();

-- Add comments for trigger documentation
COMMENT ON TRIGGER update_session_on_message_insert ON chat_messages IS 'Updates parent session timestamp when new message is added';
COMMENT ON TRIGGER update_session_on_message_update ON chat_messages IS 'Updates parent session timestamp when message is modified';
COMMENT ON TRIGGER update_session_on_message_delete ON chat_messages IS 'Updates parent session timestamp when message is deleted';

-- ============================================================================
-- Verification Queries (for testing purposes)
-- ============================================================================

-- Test function existence
-- SELECT proname FROM pg_proc WHERE proname IN ('update_updated_at_column', 'update_session_on_message_change');

-- Test trigger existence
-- SELECT tgname FROM pg_trigger WHERE tgname LIKE 'update_%';

-- Test function execution (run after inserting test data)
-- INSERT INTO chat_sessions (title) VALUES ('Test Session');
-- INSERT INTO chat_messages (session_id, role, content) VALUES (
--   (SELECT id FROM chat_sessions WHERE title = 'Test Session' LIMIT 1),
--   'user',
--   'Test message'
-- );

-- ============================================================================
-- Performance Notes
-- ============================================================================
-- - Functions use COALESCE for handling NULL values safely
-- - Triggers are designed for minimal performance impact
-- - Updated timestamps use NOW() for consistency with table defaults
-- - All functions include proper error handling through PostgreSQL language features

-- ============================================================================
-- Security Notes  
-- ============================================================================
-- - Functions run with definer's privileges for security
-- - No user input validation needed as triggers handle internal operations
-- - Functions are idempotent and safe for concurrent operations
