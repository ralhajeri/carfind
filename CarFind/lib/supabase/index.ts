// File Path: CarFind/lib/supabase/index.ts
// Main Supabase client exports
export { createClient, supabase } from './client';
export {
    createServerSupabaseClient,
    createMiddlewareSupabaseClient,
    createServiceRoleClient
} from './server';
export {
    validateSupabaseConfiguration,
    getSupabaseConfig,
    initializeSupabase,
    getSupabaseClient,
    getServerSupabaseClient
} from './config';
export {
    testDatabaseConnection,
    testServerConnection,
    checkSupabaseHealth,
    isPostgrestError,
    isSupabaseResponse
} from './utils';
export type {
    Database,
    SupabaseClient,
    SupabaseResponse,
    PostgrestError,
    SessionData,
    MessageQuery,
    QueryOptions,
    RLSPolicy,
    Tables,
    Inserts,
    Updates,
    ChatSession,
    ChatMessage,
    ChatSessionInsert,
    ChatMessageInsert,
    ChatSessionUpdate,
    ChatMessageUpdate,
    SupabaseContext,
    PaginatedResult,
    BatchInsertResult,
    RealtimeEvent,
    RealtimeCallback,
    ConnectionStatus,
    ConnectionHealth
} from './types';
export type { SupabaseConfig } from './config';
