// File Path: CarFind/lib/config/config-health.ts
// Configuration health checks and initialization
import { aiConfigManager } from './ai-config';
import { databaseConfigManager } from './database-config';
import { getValidatedEnv } from './env-validation';
import { SERVICE_TYPES } from './constants';
import { ErrorFactory } from '@/lib/types/errors';

export interface ConfigHealthStatus {
  overall: 'healthy' | 'warning' | 'error';
  environment: {
    status: 'healthy' | 'error';
    message?: string;
  };
  aiServices: {
    status: 'healthy' | 'warning' | 'error';
    services: Record<string, { status: 'healthy' | 'error'; message?: string }>;
  };
  database: {
    status: 'healthy' | 'warning' | 'error';
    message?: string;
  };
}

export function checkConfigHealth(): ConfigHealthStatus {
  const health: ConfigHealthStatus = {
    overall: 'healthy',
    environment: { status: 'healthy' },
    aiServices: { status: 'healthy', services: {} },
    database: { status: 'healthy' }
  };

  // Check environment variables
  try {
    getValidatedEnv();
  } catch (error) {
    health.environment.status = 'error';
    health.environment.message = error instanceof Error ? error.message : 'Environment validation failed';
    health.overall = 'error';
  }

  // Check AI service configurations
  try {
    const availableServices = aiConfigManager.getAvailableServiceTypes();
    
    for (const serviceType of Object.values(SERVICE_TYPES)) {
      try {
        if (availableServices.includes(serviceType)) {
          aiConfigManager.getConfig(serviceType);
          health.aiServices.services[serviceType] = { status: 'healthy' };
        } else {
          health.aiServices.services[serviceType] = { 
            status: 'error', 
            message: `Service ${serviceType} is not configured` 
          };
          health.aiServices.status = 'warning';
          if (health.overall === 'healthy') {
            health.overall = 'warning';
          }
        }
      } catch (error) {
        health.aiServices.services[serviceType] = { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Configuration error' 
        };
        health.aiServices.status = 'error';
        health.overall = 'error';
      }
    }
  } catch (error) {
    health.aiServices.status = 'error';
    health.overall = 'error';
  }

  // Check database configuration
  try {
    if (databaseConfigManager.isConfigured()) {
      databaseConfigManager.getConfig();
    } else {
      health.database.status = 'warning';
      health.database.message = 'Database configuration is not available (optional for Phase 2.1)';
      if (health.overall === 'healthy') {
        health.overall = 'warning';
      }
    }
  } catch (error) {
    health.database.status = 'error';
    health.database.message = error instanceof Error ? error.message : 'Database configuration error';
    health.overall = 'error';
  }

  return health;
}

export function initializeConfiguration(): void {
  const health = checkConfigHealth();
  
  if (health.overall === 'error') {
    const errors: string[] = [];
    
    if (health.environment.status === 'error') {
      errors.push(`Environment: ${health.environment.message}`);
    }
    
    if (health.aiServices.status === 'error') {
      Object.entries(health.aiServices.services).forEach(([service, config]) => {
        if (config.status === 'error') {
          errors.push(`AI Service ${service}: ${config.message}`);
        }
      });
    }
    
    if (health.database.status === 'error') {
      errors.push(`Database: ${health.database.message}`);
    }
    
    throw ErrorFactory.service(
      'ConfigurationManager',
      'initialize',
      `Configuration initialization failed: ${errors.join(', ')}`,
      false
    );
  }
}
