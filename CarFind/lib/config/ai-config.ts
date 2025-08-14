// File Path: CarFind/lib/config/ai-config.ts
// CoE: Zero magic strings, centralized configuration
import { AIServiceConfig, AIServiceType } from '@/lib/types/ai-service';
import { getValidatedEnv } from './env-validation';
import { AI_MODELS, SERVICE_TYPES, LIMITS } from './constants';

export class AIConfigManager {
  private static instance: AIConfigManager;
  private configs: Map<AIServiceType, AIServiceConfig> = new Map();
  private env = getValidatedEnv();

  private constructor() {
    this.initializeConfigs();
  }

  static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager();
    }
    return AIConfigManager.instance;
  }

  private initializeConfigs(): void {
    // OpenAI Configuration
    this.configs.set(SERVICE_TYPES.OPENAI, {
      apiKey: this.env.OPENAI_API_KEY,
      model: AI_MODELS.OPENAI.GPT_4O,
      maxTokens: this.env.MAX_TOKENS_DEFAULT,
      temperature: this.env.TEMPERATURE_DEFAULT,
      baseUrl: 'https://api.openai.com/v1',
    });

    // Semantic Kernel Configuration (Phase 3 preparation)
    if (this.env.SEMANTIC_KERNEL_API_KEY) {
      this.configs.set(SERVICE_TYPES.SEMANTIC_KERNEL, {
        apiKey: this.env.SEMANTIC_KERNEL_API_KEY,
        model: AI_MODELS.SEMANTIC_KERNEL.OPENAI,
        maxTokens: this.env.MAX_TOKENS_DEFAULT,
        temperature: this.env.TEMPERATURE_DEFAULT,
        baseUrl:
          this.env.SEMANTIC_KERNEL_ENDPOINT || 'https://api.openai.com/v1',
      });
    }
  }

  getConfig(serviceType: AIServiceType): AIServiceConfig {
    const config = this.configs.get(serviceType);
    if (!config) {
      throw new Error(
        `No configuration found for service type: ${serviceType}`,
      );
    }
    return { ...config }; // Return copy to prevent mutations
  }

  getAllConfigs(): Record<AIServiceType, AIServiceConfig> {
    const result: Partial<Record<AIServiceType, AIServiceConfig>> = {};
    this.configs.forEach((config, type) => {
      result[type] = { ...config };
    });
    return result as Record<AIServiceType, AIServiceConfig>;
  }

  getAvailableServiceTypes(): AIServiceType[] {
    return Array.from(this.configs.keys());
  }

  updateConfig(
    serviceType: AIServiceType,
    updates: Partial<AIServiceConfig>,
  ): void {
    const currentConfig = this.getConfig(serviceType);
    const updatedConfig: AIServiceConfig = {
      ...currentConfig,
      ...updates,
    };

    // Validate updated configuration
    this.validateConfig(updatedConfig);
    this.configs.set(serviceType, updatedConfig);
  }

  private validateConfig(config: AIServiceConfig): void {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error('API key is required and cannot be empty');
    }

    if (!config.model || config.model.trim().length === 0) {
      throw new Error('Model is required and cannot be empty');
    }

    if (
      config.maxTokens &&
      (config.maxTokens < LIMITS.MAX_TOKENS.MIN ||
        config.maxTokens > LIMITS.MAX_TOKENS.MAX)
    ) {
      throw new Error(
        `Max tokens must be between ${LIMITS.MAX_TOKENS.MIN} and ${LIMITS.MAX_TOKENS.MAX}`,
      );
    }

    if (
      config.temperature &&
      (config.temperature < LIMITS.TEMPERATURE.MIN ||
        config.temperature > LIMITS.TEMPERATURE.MAX)
    ) {
      throw new Error(
        `Temperature must be between ${LIMITS.TEMPERATURE.MIN} and ${LIMITS.TEMPERATURE.MAX}`,
      );
    }
  }
}

// Export singleton instance and convenience functions
export const aiConfigManager = AIConfigManager.getInstance();

export function getAIConfig(serviceType: AIServiceType): AIServiceConfig {
  return aiConfigManager.getConfig(serviceType);
}

export function getAllAIConfigs(): Record<AIServiceType, AIServiceConfig> {
  return aiConfigManager.getAllConfigs();
}
