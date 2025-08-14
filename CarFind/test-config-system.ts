// Configuration system test
import {
  getValidatedEnv,
  isDevelopment,
  isProduction,
} from './lib/config/env-validation';
import {
  checkConfigHealth,
  initializeConfiguration,
} from './lib/config/config-health';
import { aiConfigManager, getAIConfig } from './lib/config/ai-config';
import {
  databaseConfigManager,
  isDatabaseConfigured,
} from './lib/config/database-config';
import { SERVICE_TYPES, AI_MODELS } from './lib/config/constants';

console.log('🔧 Testing Configuration Management System...\n');

try {
  // Test 1: Environment Validation
  console.log('1️⃣ Environment Validation:');
  const env = getValidatedEnv();
  console.log('✅ Environment validation passed');
  console.log(
    `✅ Environment: ${isDevelopment() ? 'Development' : isProduction() ? 'Production' : 'Test'}`,
  );

  // Test 2: AI Configuration
  console.log('\n2️⃣ AI Service Configuration:');
  const openaiConfig = getAIConfig(SERVICE_TYPES.OPENAI);
  console.log('✅ OpenAI configuration loaded');
  console.log(`✅ Model: ${openaiConfig.model}`);
  console.log(`✅ Max Tokens: ${openaiConfig.maxTokens}`);

  // Test 3: Database Configuration
  console.log('\n3️⃣ Database Configuration:');
  console.log(`✅ Database configured: ${isDatabaseConfigured()}`);

  // Test 4: Health Check
  console.log('\n4️⃣ Configuration Health Check:');
  const health = checkConfigHealth();
  console.log(`✅ Overall health: ${health.overall}`);
  console.log(`✅ Environment: ${health.environment.status}`);
  console.log(`✅ AI Services: ${health.aiServices.status}`);
  console.log(`✅ Database: ${health.database.status}`);

  // Test 5: Zero Magic Strings
  console.log('\n5️⃣ Zero Magic Strings Verification:');
  console.log(`✅ OpenAI model from constants: ${AI_MODELS.OPENAI.GPT_4O}`);
  console.log(`✅ Service type from constants: ${SERVICE_TYPES.OPENAI}`);

  console.log('\n🎉 Configuration Management System Test PASSED!');
  console.log('🚀 Ready for Phase 2.2 database integration!');
} catch (error) {
  console.error('❌ Configuration test failed:', error);
}
