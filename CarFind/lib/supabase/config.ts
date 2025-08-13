// File Path: CarFind/lib/supabase/config.ts
// Supabase configuration integration
import { isDatabaseConfigured, getDatabaseConfig } from '@/lib/config/database-config';
import { createClient } from './client';
import { createServerSupabaseClient } from './server';
import { ErrorFactory } from '@/lib/types/errors';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
}

export function validateSupabaseConfiguration(): void {
    if (!isDatabaseConfigured()) {
        throw ErrorFactory.service(
            'SupabaseConfig',
            'validate',
            'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
            false
        );
    }
}

export function getSupabaseConfig(): SupabaseConfig {
    validateSupabaseConfiguration();
    const dbConfig = getDatabaseConfig();

    return {
        url: dbConfig.url,
        anonKey: dbConfig.anonKey,
        serviceRoleKey: dbConfig.serviceRoleKey
    };
}

// Initialize and validate configuration on module load
export function initializeSupabase(): void {
    try {
        validateSupabaseConfiguration();
        console.log('Supabase configuration validated successfully');
    } catch (error) {
        console.warn('Supabase configuration validation failed:', error);
        // Don't throw here to allow graceful degradation
    }
}

// Client getter with validation
export function getSupabaseClient() {
    validateSupabaseConfiguration();
    return createClient();
}

// Server client getter with validation
export async function getServerSupabaseClient() {
    validateSupabaseConfiguration();
    return await createServerSupabaseClient();
}
