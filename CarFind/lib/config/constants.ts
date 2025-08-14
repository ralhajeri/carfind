// File Path: CarFind/lib/config/constants.ts
// CoE: Zero magic strings policy implementation
export const API_ROUTES = {
  CHAT: '/api/chat',
  SESSIONS: '/api/sessions',
  HEALTH: '/api/health',
} as const;

export const AI_MODELS = {
  OPENAI: {
    GPT_4O: 'gpt-4o',
    GPT_4O_MINI: 'gpt-4o-mini',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
  },
  SEMANTIC_KERNEL: {
    // Phase 3 preparation
    AZURE_OPENAI: 'azure-openai',
    OPENAI: 'openai',
  },
} as const;

export const SERVICE_TYPES = {
  OPENAI: 'openai',
  SEMANTIC_KERNEL: 'semantic-kernel',
} as const;

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export const ERROR_CODES = {
  MISSING_API_KEY: 'MISSING_API_KEY',
  MISSING_MODEL: 'MISSING_MODEL',
  UNSUPPORTED_SERVICE_TYPE: 'UNSUPPORTED_SERVICE_TYPE',
  SERVICE_CREATION_FAILED: 'SERVICE_CREATION_FAILED',
  SERVICE_ERROR: 'SERVICE_ERROR',
  ENV_VALIDATION_FAILED: 'ENV_VALIDATION_FAILED',
  ENV_VALIDATION_ERROR: 'ENV_VALIDATION_ERROR',
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const LIMITS = {
  MAX_TOKENS: {
    DEFAULT: 1000,
    MAX: 4096,
    MIN: 1,
  },
  TEMPERATURE: {
    DEFAULT: 0.7,
    MAX: 2.0,
    MIN: 0.0,
  },
  MAX_MESSAGES_PER_SESSION: 100,
  MAX_SESSION_TITLE_LENGTH: 100,
} as const;

export const TIMEOUT_VALUES = {
  AI_REQUEST: 30000, // 30 seconds
  DATABASE_QUERY: 5000, // 5 seconds
  STREAM_TIMEOUT: 60000, // 60 seconds
} as const;
