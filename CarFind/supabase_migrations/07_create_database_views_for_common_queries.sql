-- ============================================================================
-- File: 07_create_database_views_for_common_queries.sql
-- Purpose: Create views to simplify common query patterns
-- Task: TASK-05 Sub-Task 7 - Create Database Views for Common Queries
-- Phase: Phase 2.2 - Supabase Database Integration
-- Author: GitHub Copilot (CarFind Integration Layer)
-- Date: 2025-08-13
-- ============================================================================

-- ============================================================================
-- View 1: Session Summary
-- Purpose: Sessions with message counts and latest message timestamp
-- Use Case: Dashboard, session list, recent activity overview
-- ============================================================================

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

-- Add view documentation
COMMENT ON VIEW session_summary IS 'Provides session overview with message counts and last activity timestamps for dashboard and listing purposes';

-- ============================================================================
-- View 2: Session with Messages
-- Purpose: Complete session data with all messages for conversation display
-- Use Case: Loading full conversation, message history, export functionality
-- ============================================================================

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

-- Add view documentation
COMMENT ON VIEW session_with_messages IS 'Provides complete session and message data for conversation display, ordered by session activity and message chronology';

-- ============================================================================
-- View 3: Active Sessions Summary
-- Purpose: Sessions with recent activity for performance optimization
-- Use Case: Recent sessions, active conversation tracking, quick access
-- ============================================================================

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

-- Add view documentation
COMMENT ON VIEW active_sessions_summary IS 'Sessions active within last 30 days with message counts, optimized for recent activity queries';

-- ============================================================================
-- View 4: User Session Statistics
-- Purpose: Per-user session and message statistics
-- Use Case: User analytics, usage metrics, account dashboard
-- ============================================================================

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
WHERE s.user_id IS NOT NULL  -- Exclude anonymous sessions
GROUP BY s.user_id;

-- Add view documentation
COMMENT ON VIEW user_session_statistics IS 'Per-user aggregated statistics for sessions and messages, excluding anonymous sessions';

-- ============================================================================
-- Row Level Security for Views
-- ============================================================================

-- Apply RLS to views to inherit security from base tables
ALTER VIEW session_summary ENABLE ROW LEVEL SECURITY;
ALTER VIEW session_with_messages ENABLE ROW LEVEL SECURITY;
ALTER VIEW active_sessions_summary ENABLE ROW LEVEL SECURITY;
ALTER VIEW user_session_statistics ENABLE ROW LEVEL SECURITY;

-- Set view ownership to postgres for proper permissions
ALTER VIEW session_summary OWNER TO postgres;
ALTER VIEW session_with_messages OWNER TO postgres;
ALTER VIEW active_sessions_summary OWNER TO postgres;
ALTER VIEW user_session_statistics OWNER TO postgres;

-- ============================================================================
-- Verification Queries (for testing purposes)
-- ============================================================================

-- Test view creation
-- SELECT viewname FROM pg_views WHERE viewname LIKE '%session%';

-- Test view functionality (requires test data)
-- SELECT * FROM session_summary LIMIT 5;
-- SELECT * FROM session_with_messages WHERE session_id = 'test-session-id';
-- SELECT * FROM active_sessions_summary LIMIT 10;
-- SELECT * FROM user_session_statistics WHERE user_id = 'test-user-id';

-- Test view performance
-- EXPLAIN ANALYZE SELECT * FROM session_summary;
-- EXPLAIN ANALYZE SELECT * FROM active_sessions_summary;

-- ============================================================================
-- Performance Notes
-- ============================================================================
-- 1. Views leverage existing indexes on foreign keys and timestamps
-- 2. session_summary and active_sessions_summary use GROUP BY for aggregation
-- 3. session_with_messages provides denormalized data for efficient conversation loading
-- 4. user_session_statistics includes subquery for accurate message counting
-- 5. ORDER BY clauses optimize for common access patterns

-- ============================================================================
-- Usage Patterns
-- ============================================================================
-- session_summary: Dashboard listing, session browser, quick overview
-- session_with_messages: Full conversation display, message history
-- active_sessions_summary: Recent activity, quick access, performance optimization
-- user_session_statistics: Analytics dashboard, user insights, usage tracking

-- ============================================================================
-- Future Enhancement Opportunities
-- ============================================================================
-- 1. Materialized views for heavy aggregation queries
-- 2. Partial indexes on views for specific user segments
-- 3. Additional views for specific business requirements
-- 4. Time-based partitioning for large-scale deployments
-- 5. Custom aggregation functions for advanced analytics
