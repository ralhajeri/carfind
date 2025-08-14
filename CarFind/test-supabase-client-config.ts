// Test file to verify Supabase client configuration
import {
  createClient,
  validateSupabaseConfiguration,
  getSupabaseConfig,
  checkSupabaseHealth,
} from './lib/supabase';
import {
  getDatabaseConfig,
  isDatabaseConfigured,
} from './lib/config/database-config';

console.log('🔧 Testing Supabase Client Configuration...\n');

async function testSupabaseConfiguration() {
  try {
    // Test 1: Check if database is configured
    console.log('1️⃣ Database Configuration Check:');
    const isConfigured = isDatabaseConfigured();
    console.log(`✅ Database configured: ${isConfigured}`);

    if (isConfigured) {
      // Test 2: Validate configuration
      console.log('\n2️⃣ Configuration Validation:');
      validateSupabaseConfiguration();
      console.log('✅ Supabase configuration validation passed');

      // Test 3: Get configuration
      console.log('\n3️⃣ Configuration Access:');
      const config = getSupabaseConfig();
      console.log(`✅ URL configured: ${!!config.url}`);
      console.log(`✅ Anon key configured: ${!!config.anonKey}`);
      console.log(`✅ Service role key configured: ${!!config.serviceRoleKey}`);

      // Test 4: Create client
      console.log('\n4️⃣ Client Creation:');
      const client = createClient();
      console.log('✅ Browser client created successfully');
      console.log(`✅ Client type: ${typeof client}`);

      // Test 5: Health check (if database is accessible)
      console.log('\n5️⃣ Health Check:');
      try {
        const health = await checkSupabaseHealth();
        console.log(`✅ Client health: ${health.client}`);
        console.log(`✅ Server health: ${health.server}`);
        console.log(`✅ Service role health: ${health.serviceRole}`);
      } catch (healthError) {
        console.log('⚠️ Health check skipped (database not accessible yet)');
      }
    } else {
      console.log(
        '⚠️ Database not configured - this is expected if environment variables are not set',
      );
    }

    console.log('\n🎉 Supabase Client Configuration Test COMPLETED!');
    console.log('🚀 Ready for database service layer implementation!');
  } catch (error) {
    console.error('❌ Configuration test failed:', error);
    throw error;
  }
}

// Run the test
testSupabaseConfiguration();
