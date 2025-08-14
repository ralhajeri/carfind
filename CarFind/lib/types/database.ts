/**
 * Database Type Definitions
 *
 * This file defines database schema types for Supabase integration following modern SSR patterns.
 * These interfaces provide type safety for all database operations and prepare the foundation
 * for Supabase integration in Phase 2.2.
 *
 * @fileoverview Database schema types for Supabase integration with chat sessions and messages
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 */

// ===== CORE DATABASE SCHEMA INTERFACE =====

/**
 * Main database interface representing the complete Supabase schema
 * Follows Supabase TypeScript generation patterns for type safety
 */
export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        /** Row type for SELECT operations */
        Row: {
          /** Unique identifier for the chat session */
          id: string;

          /** Optional user identifier who owns this session */
          user_id: string | null;

          /** Human-readable title for the session */
          title: string;

          /** Timestamp when the session was created (ISO string) */
          created_at: string;

          /** Timestamp when the session was last updated (ISO string) */
          updated_at: string;
        };

        /** Insert type for INSERT operations */
        Insert: {
          /** Optional - will be auto-generated if not provided */
          id?: string;

          /** Optional user identifier */
          user_id?: string | null;

          /** Required session title */
          title: string;

          /** Optional - will be auto-generated if not provided */
          created_at?: string;

          /** Optional - will be auto-generated if not provided */
          updated_at?: string;
        };

        /** Update type for UPDATE operations */
        Update: {
          /** Optional session ID for updates */
          id?: string;

          /** Optional user ID for updates */
          user_id?: string | null;

          /** Optional title for updates */
          title?: string;

          /** Optional created timestamp for updates */
          created_at?: string;

          /** Optional updated timestamp for updates */
          updated_at?: string;
        };
      };

      chat_messages: {
        /** Row type for SELECT operations */
        Row: {
          /** Unique identifier for the message */
          id: string;

          /** Foreign key reference to chat_sessions.id */
          session_id: string;

          /** Role of the message sender (user, assistant, system) */
          role: string;

          /** Content of the message */
          content: string;

          /** Optional metadata stored as JSON */
          metadata: Record<string, unknown> | null;

          /** Timestamp when the message was created (ISO string) */
          created_at: string;
        };

        /** Insert type for INSERT operations */
        Insert: {
          /** Optional - will be auto-generated if not provided */
          id?: string;

          /** Required session ID foreign key */
          session_id: string;

          /** Required message role */
          role: string;

          /** Required message content */
          content: string;

          /** Optional metadata */
          metadata?: Record<string, unknown> | null;

          /** Optional - will be auto-generated if not provided */
          created_at?: string;
        };

        /** Update type for UPDATE operations */
        Update: {
          /** Optional message ID for updates */
          id?: string;

          /** Optional session ID for updates */
          session_id?: string;

          /** Optional role for updates */
          role?: string;

          /** Optional content for updates */
          content?: string;

          /** Optional metadata for updates */
          metadata?: Record<string, unknown> | null;

          /** Optional created timestamp for updates */
          created_at?: string;
        };
      };
    };
  };
}

// ===== CONVENIENCE TYPE ALIASES =====

/**
 * Type aliases for easier access to table types
 * These provide more convenient access to the nested database types
 */

/** Chat session row type for SELECT operations */
export type ChatSessionRow =
  Database['public']['Tables']['chat_sessions']['Row'];

/** Chat session insert type for INSERT operations */
export type ChatSessionInsert =
  Database['public']['Tables']['chat_sessions']['Insert'];

/** Chat session update type for UPDATE operations */
export type ChatSessionUpdate =
  Database['public']['Tables']['chat_sessions']['Update'];

/** Chat message row type for SELECT operations */
export type ChatMessageRow =
  Database['public']['Tables']['chat_messages']['Row'];

/** Chat message insert type for INSERT operations */
export type ChatMessageInsert =
  Database['public']['Tables']['chat_messages']['Insert'];

/** Chat message update type for UPDATE operations */
export type ChatMessageUpdate =
  Database['public']['Tables']['chat_messages']['Update'];

// ===== EXTENDED TYPES FOR BUSINESS LOGIC =====

/**
 * Extended chat session type that combines database row with computed fields
 * Used for application logic that needs additional metadata
 */
export interface ChatSessionWithMetadata extends ChatSessionRow {
  /** Number of messages in this session */
  message_count?: number;

  /** Timestamp of the last message in this session */
  last_message_at?: string | null;

  /** Preview of the most recent message content */
  last_message_preview?: string | null;
}

/**
 * Extended chat message type with additional computed fields
 * Used for rich message display and management
 */
export interface ChatMessageWithMetadata extends ChatMessageRow {
  /** Computed token count for this message */
  token_count?: number;

  /** Whether this message has been edited */
  is_edited?: boolean;

  /** Original content before editing (if applicable) */
  original_content?: string;
}

// ===== QUERY RESULT TYPES =====

/**
 * Result type for queries that join sessions with their messages
 * Used for efficient data fetching in chat interfaces
 */
export interface SessionWithMessages {
  /** The chat session data */
  session: ChatSessionRow;

  /** Array of messages in this session */
  messages: ChatMessageRow[];
}

/**
 * Paginated result type for session queries
 * Supports efficient pagination in chat history
 */
export interface PaginatedSessions {
  /** Array of sessions in this page */
  sessions: ChatSessionWithMetadata[];

  /** Total count of sessions available */
  total_count: number;

  /** Whether there are more sessions available */
  has_more: boolean;

  /** Cursor for the next page (if has_more is true) */
  next_cursor?: string;
}

/**
 * Paginated result type for message queries
 * Supports efficient pagination in long conversations
 */
export interface PaginatedMessages {
  /** Array of messages in this page */
  messages: ChatMessageWithMetadata[];

  /** Total count of messages in the session */
  total_count: number;

  /** Whether there are more messages available */
  has_more: boolean;

  /** Cursor for the next page (if has_more is true) */
  next_cursor?: string;
}

// ===== VALIDATION CONSTRAINTS =====

/**
 * Constants defining database constraints for validation
 * These should match the constraints defined in the database schema
 */
export const DATABASE_CONSTRAINTS = {
  /** Maximum length for session titles */
  SESSION_TITLE_MAX_LENGTH: 200,

  /** Maximum length for message content */
  MESSAGE_CONTENT_MAX_LENGTH: 50000,

  /** Valid message roles */
  VALID_MESSAGE_ROLES: ['user', 'assistant', 'system'] as const,

  /** Maximum metadata size in bytes */
  METADATA_MAX_SIZE: 10000,
} as const;

/**
 * Type for valid message roles based on constraints
 */
export type ValidMessageRole =
  (typeof DATABASE_CONSTRAINTS.VALID_MESSAGE_ROLES)[number];

// ===== ERROR TYPES =====

/**
 * Database-specific error types for comprehensive error handling
 */
export interface DatabaseError {
  /** Error code from the database */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Additional error details */
  details?: Record<string, unknown>;

  /** Database operation that failed */
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

  /** Table that was being accessed */
  table: string;
}

/**
 * Constraint violation error for database validation failures
 */
export interface ConstraintViolationError extends DatabaseError {
  /** Name of the constraint that was violated */
  constraint_name: string;

  /** Field that caused the violation */
  field: string;

  /** Value that violated the constraint */
  value: unknown;
}

/**
 * Foreign key violation error for referential integrity failures
 */
export interface ForeignKeyViolationError extends DatabaseError {
  /** Foreign key constraint that was violated */
  foreign_key: string;

  /** Referenced table */
  referenced_table: string;

  /** Referenced column */
  referenced_column: string;
}
