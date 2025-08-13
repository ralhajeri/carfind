// File Path: CarFind/lib/supabase/server.ts
// Server-side Supabase client for API routes and SSR
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/types/database';
import { getDatabaseConfig } from '@/lib/config/database-config';

// Create client for API routes
export async function createServerSupabaseClient() {
    const cookieStore = await cookies();
    const config = getDatabaseConfig();

    return createServerClient<Database>(
        config.url,
        config.anonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle cookie setting errors gracefully
                        console.warn('Failed to set cookie:', name, error);
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Handle cookie removal errors gracefully
                        console.warn('Failed to remove cookie:', name, error);
                    }
                },
            },
        }
    );
}

// Create client for middleware
export function createMiddlewareSupabaseClient(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const config = getDatabaseConfig();

    const supabase = createServerClient<Database>(
        config.url,
        config.anonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: any) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    return { supabase, response };
}

// Create service role client for privileged operations
export function createServiceRoleClient() {
    const config = getDatabaseConfig();

    if (!config.serviceRoleKey) {
        throw new Error('Service role key not available. Check environment variables.');
    }

    return createServerClient<Database>(
        config.url,
        config.serviceRoleKey,
        {
            cookies: {
                get() { return undefined; },
                set() { },
                remove() { },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

// Type helpers
export type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
export type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;
