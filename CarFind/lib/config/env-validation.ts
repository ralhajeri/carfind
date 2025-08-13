// File Path: CarFind/lib/config/env-validation.ts
// CoE: Zero magic strings, comprehensive validation
import { z } from 'zod';
import { ErrorFactory, type APIError } from '@/lib/types/errors';

const envSchema = z.object({
  // OpenAI Configuration
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  
  // Supabase Configuration (for Phase 2.2)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required').optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required').optional(),
  
  // Application Configuration
  AUTH_SECRET: z.string().min(32, 'Auth secret must be at least 32 characters'),
  
  // Environment Configuration
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Optional Semantic Kernel Configuration (Phase 3 preparation)
  SEMANTIC_KERNEL_API_KEY: z.string().optional(),
  SEMANTIC_KERNEL_ENDPOINT: z.string().url('Invalid Semantic Kernel endpoint').optional(),
  
  // Application Settings
  MAX_TOKENS_DEFAULT: z.string().transform(Number).pipe(z.number().min(1).max(4096)).default('1000'),
  TEMPERATURE_DEFAULT: z.string().transform(Number).pipe(z.number().min(0).max(2)).default('0.7'),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

let cachedEnv: ValidatedEnv | null = null;

export function getValidatedEnv(): ValidatedEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      throw ErrorFactory.validation(
        'environment_variables',
        process.env,
        'zod_schema',
        `Environment variable validation failed: ${errorMessage}`
      );
    }
    
    throw ErrorFactory.service(
      'EnvironmentConfig',
      'validate_environment',
      'Failed to validate environment variables',
      false
    );
  }
}

export function isProduction(): boolean {
  return getValidatedEnv().NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return getValidatedEnv().NODE_ENV === 'development';
}
