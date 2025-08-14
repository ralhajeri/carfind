// File Path: CarFind/lib/config/database-config.ts
// Supabase configuration for Phase 2.2 integration
import { getValidatedEnv } from './env-validation';
import { ErrorFactory } from '@/lib/types/errors';

export interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export class DatabaseConfigManager {
  private static instance: DatabaseConfigManager;
  private config: DatabaseConfig | null = null;
  private env = getValidatedEnv();

  private constructor() {
    this.initializeConfig();
  }

  static getInstance(): DatabaseConfigManager {
    if (!DatabaseConfigManager.instance) {
      DatabaseConfigManager.instance = new DatabaseConfigManager();
    }
    return DatabaseConfigManager.instance;
  }

  private initializeConfig(): void {
    if (
      this.env.NEXT_PUBLIC_SUPABASE_URL &&
      this.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      this.config = {
        url: this.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: this.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRoleKey: this.env.SUPABASE_SERVICE_ROLE_KEY,
      };
    }
  }

  getConfig(): DatabaseConfig {
    if (!this.config) {
      throw ErrorFactory.service(
        'DatabaseConfig',
        'get_config',
        'Database configuration is not available. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured.',
        false,
      );
    }
    return { ...this.config };
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  getClientConfig(): Pick<DatabaseConfig, 'url' | 'anonKey'> {
    const config = this.getConfig();
    return {
      url: config.url,
      anonKey: config.anonKey,
    };
  }

  getServerConfig(): DatabaseConfig {
    const config = this.getConfig();
    if (!config.serviceRoleKey) {
      throw ErrorFactory.service(
        'DatabaseConfig',
        'get_server_config',
        'Service role key is required for server-side database operations. Please configure SUPABASE_SERVICE_ROLE_KEY.',
        false,
      );
    }
    return config;
  }
}

export const databaseConfigManager = DatabaseConfigManager.getInstance();

export function getDatabaseConfig(): DatabaseConfig {
  return databaseConfigManager.getConfig();
}

export function isDatabaseConfigured(): boolean {
  return databaseConfigManager.isConfigured();
}
