// File Path: CarFind/lib/supabase/types.ts
// Enhanced TypeScript integration for Supabase
import { Database } from '@/lib/types/database';
import { createClient } from './client';

// Re-export database types for convenience
export type { Database } from '@/lib/types/database';

// Supabase client type
export type SupabaseClient = ReturnType<typeof createClient>;

// Database table types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

// Query types
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response wrapper types
export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count?: number | null;
}

// Error types
export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// Session management types
export interface SessionData {
  session: ChatSession;
  messageCount: number;
  lastMessageAt: string | null;
}

// Message query types
export interface MessageQuery extends QueryOptions {
  sessionId: string;
  role?: 'user' | 'assistant' | 'system';
  fromDate?: string;
  toDate?: string;
}

// Type guards
export function isPostgrestError(error: any): error is PostgrestError {
  return (
    error && typeof error.message === 'string' && typeof error.code === 'string'
  );
}

export function isSupabaseResponse<T>(
  response: any,
): response is SupabaseResponse<T> {
  return (
    response && (response.data !== undefined || response.error !== undefined)
  );
}

// Utility types for RLS
export type RLSPolicy = {
  name: string;
  table: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  using?: string;
  check?: string;
};

// Type definitions for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Specific table types for convenience
export type ChatSession = Tables<'chat_sessions'>;
export type ChatMessage = Tables<'chat_messages'>;
export type ChatSessionInsert = Inserts<'chat_sessions'>;
export type ChatMessageInsert = Inserts<'chat_messages'>;
export type ChatSessionUpdate = Updates<'chat_sessions'>;
export type ChatMessageUpdate = Updates<'chat_messages'>;

// Client context type for components
export interface SupabaseContext {
  client: ReturnType<typeof createClient>;
  isConnected: boolean;
}

// Advanced query result types
export type PaginatedResult<T> = {
  data: T[];
  count: number | null;
  hasMore: boolean;
  nextPage?: number;
};

// Batch operation types
export type BatchInsertResult<T> = {
  success: T[];
  errors: Array<{ item: T; error: string }>;
};

// Real-time subscription types
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export type RealtimeCallback<T> = (payload: {
  eventType: RealtimeEvent;
  new: T | null;
  old: T | null;
  errors: string[] | null;
}) => void;

// Connection status types
export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface ConnectionHealth {
  status: ConnectionStatus;
  lastPing?: Date;
  latency?: number;
  errorMessage?: string;
}
