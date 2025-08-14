// File Path: CarFind/lib/supabase/client.ts
// Modern Supabase browser client with SSR support
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types/database';
import { getDatabaseConfig } from '@/lib/config/database-config';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function createClient() {
  // Return existing client if already created (singleton pattern)
  if (browserClient) {
    return browserClient;
  }

  try {
    const config = getDatabaseConfig();

    browserClient = createBrowserClient<Database>(config.url, config.anonKey);

    return browserClient;
  } catch (error) {
    console.error('Failed to create Supabase browser client:', error);
    throw error;
  }
}

// Export default client instance
export const supabase = createClient();

// Type helper for components
export type SupabaseClient = ReturnType<typeof createClient>;
