// File Path: CarFind/lib/supabase/utils.ts
// Supabase client utilities and type helpers
import { createClient } from './client';
import { createServerSupabaseClient, createServiceRoleClient } from './server';
import { Database } from '@/lib/types/database';

// Re-export database types for convenience
export type { Database } from '@/lib/types/database';

// Supabase client type
export type SupabaseClient = ReturnType<typeof createClient>;

// Database table types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
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
    return error && typeof error.message === 'string' && typeof error.code === 'string';
}

export function isSupabaseResponse<T>(response: any): response is SupabaseResponse<T> {
    return response && (response.data !== undefined || response.error !== undefined);
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

// Utility function to test database connectivity
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        const client = createClient();
        const { error } = await client.from('chat_sessions').select('id').limit(1);
        return !error;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}

// Utility function to test server connection
export async function testServerConnection(): Promise<boolean> {
    try {
        const client = await createServerSupabaseClient();
        const { error } = await client.from('chat_sessions').select('id').limit(1);
        return !error;
    } catch (error) {
        console.error('Server database connection test failed:', error);
        return false;
    }
}

// Health check function
export async function checkSupabaseHealth(): Promise<{
    client: boolean;
    server: boolean;
    serviceRole: boolean;
}> {
    const [clientHealth, serverHealth] = await Promise.allSettled([
        testDatabaseConnection(),
        testServerConnection()
    ]);

    let serviceRoleHealth = false;
    try {
        const serviceClient = createServiceRoleClient();
        const { error } = await serviceClient.from('chat_sessions').select('id').limit(1);
        serviceRoleHealth = !error;
    } catch (error) {
        // Service role might not be configured
        serviceRoleHealth = false;
    }

    return {
        client: clientHealth.status === 'fulfilled' ? clientHealth.value : false,
        server: serverHealth.status === 'fulfilled' ? serverHealth.value : false,
        serviceRole: serviceRoleHealth
    };
}
