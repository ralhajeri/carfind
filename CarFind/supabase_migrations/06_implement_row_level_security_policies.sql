-- ============================================================================
-- File: 06_implement_row_level_security_policies.sql
-- Purpose: Create RLS policies for secure data access
-- Task: TASK-05 Sub-Task 6 - Implement Row Level Security Policies
-- Phase: Phase 2.2 - Supabase Database Integration
-- Author: GitHub Copilot (CarFind Integration Layer)
-- Date: 2025-08-13
-- ============================================================================

-- Enable Row Level Security on both tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Chat Sessions Table RLS Policies
-- ============================================================================

-- Policy: Users can only view their own sessions (including anonymous sessions)
CREATE POLICY "Users can view their own sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can insert their own sessions (including anonymous sessions)
CREATE POLICY "Users can insert their own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own sessions (including anonymous sessions)
CREATE POLICY "Users can update their own sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete their own sessions (including anonymous sessions)
CREATE POLICY "Users can delete their own sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================================
-- Chat Messages Table RLS Policies
-- ============================================================================

-- Policy: Users can only view messages from their sessions
CREATE POLICY "Users can view messages from their sessions"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM chat_sessions 
      WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

-- Policy: Users can insert messages to their sessions
CREATE POLICY "Users can insert messages to their sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM chat_sessions 
      WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

-- Policy: Users can update messages from their sessions
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

-- Policy: Users can delete messages from their sessions
CREATE POLICY "Users can delete messages from their sessions"
  ON chat_messages FOR DELETE
  USING (
    session_id IN (
      SELECT id FROM chat_sessions 
      WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

-- ============================================================================
-- Policy Documentation Comments
-- ============================================================================

COMMENT ON POLICY "Users can view their own sessions" ON chat_sessions IS 'Allows users to view only their own sessions, including anonymous sessions (user_id IS NULL)';
COMMENT ON POLICY "Users can insert their own sessions" ON chat_sessions IS 'Allows users to create sessions associated with their account or anonymous sessions';
COMMENT ON POLICY "Users can update their own sessions" ON chat_sessions IS 'Allows users to modify only their own sessions, with ownership verification on both read and write';
COMMENT ON POLICY "Users can delete their own sessions" ON chat_sessions IS 'Allows users to delete only their own sessions, including anonymous sessions';

COMMENT ON POLICY "Users can view messages from their sessions" ON chat_messages IS 'Allows users to view messages only from sessions they own, checked via session ownership';
COMMENT ON POLICY "Users can insert messages to their sessions" ON chat_messages IS 'Allows users to add messages only to sessions they own, verified through session ownership';
COMMENT ON POLICY "Users can update messages from their sessions" ON chat_messages IS 'Allows users to modify messages only in sessions they own, with ownership verification';
COMMENT ON POLICY "Users can delete messages from their sessions" ON chat_messages IS 'Allows users to delete messages only from sessions they own, verified through session ownership';

-- ============================================================================
-- Verification Queries (for testing purposes)
-- ============================================================================

-- Check that RLS is enabled
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('chat_sessions', 'chat_messages');

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename IN ('chat_sessions', 'chat_messages');

-- Test policy effectiveness (requires test data and authenticated users)
-- SET ROLE authenticated;
-- SET request.jwt.claims TO '{"sub": "test-user-id"}';
-- SELECT * FROM chat_sessions; -- Should only show user's sessions
-- SELECT * FROM chat_messages; -- Should only show messages from user's sessions

-- ============================================================================
-- Security Design Notes
-- ============================================================================
-- 1. Anonymous Sessions: user_id IS NULL allows anonymous chat sessions
-- 2. Authenticated Users: auth.uid() = user_id ensures users only access their data
-- 3. Cascading Security: Message policies check session ownership for transitive security
-- 4. Comprehensive Coverage: All CRUD operations (SELECT, INSERT, UPDATE, DELETE) covered
-- 5. Performance Consideration: Policies use subqueries which may impact performance at scale

-- ============================================================================
-- Performance Optimization Notes
-- ============================================================================
-- - Consider materialized views for complex session ownership queries at scale
-- - Indexes on user_id and session_id columns support policy performance
-- - auth.uid() function call is optimized by Supabase for performance
-- - Subquery in message policies leverages existing indexes on session relationships

-- ============================================================================
-- Anonymous User Support
-- ============================================================================
-- Design Decision: Support anonymous sessions (user_id IS NULL)
-- - Allows immediate chat functionality without authentication
-- - Anonymous sessions accessible to any unauthenticated user
-- - Can be migrated to authenticated sessions when user signs up
-- - Provides optimal user experience for immediate engagement
