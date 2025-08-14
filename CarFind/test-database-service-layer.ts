// File Path: CarFind/test-database-service-layer.ts
// Comprehensive test for database service layer implementation
import {
  runDatabaseTestSuite,
  validateDatabaseService,
  performanceTest,
} from './lib/services/database-test-utils';
import { validateSupabaseConfiguration } from './lib/supabase';
import { isDatabaseConfigured } from './lib/config/database-config';

console.log('🧪 Testing Database Service Layer Implementation...\n');

async function testDatabaseServiceLayer() {
  try {
    // Test 1: Configuration Validation
    console.log('1️⃣ Configuration Validation:');
    const isConfigured = isDatabaseConfigured();
    console.log(`   ✅ Database configured: ${isConfigured}`);

    if (isConfigured) {
      validateSupabaseConfiguration();
      console.log('   ✅ Supabase configuration validation passed\n');

      // Test 2: Database Service Integration
      console.log('2️⃣ Database Service Integration:');
      const integrationValid = await validateDatabaseService();
      console.log(
        `   ${integrationValid ? '✅' : '❌'} Database service integration: ${integrationValid ? 'PASSED' : 'FAILED'}\n`,
      );

      if (integrationValid) {
        // Test 3: Comprehensive Test Suite
        console.log('3️⃣ Comprehensive Database Test Suite:');
        const testResults = await runDatabaseTestSuite();

        if (testResults.overall.success) {
          console.log('4️⃣ Performance Benchmarks:');
          const perfResults = await performanceTest(5);

          console.log('\n📊 Final Results Summary:');
          console.log(
            `   ✅ All tests passed: ${testResults.overall.passedTests}/${testResults.overall.totalTests}`,
          );
          console.log(
            `   ✅ Total duration: ${testResults.overall.totalDuration}ms`,
          );
          console.log(
            `   ✅ Average session create: ${perfResults.avgSessionCreate.toFixed(2)}ms`,
          );
          console.log(
            `   ✅ Average message create: ${perfResults.avgMessageCreate.toFixed(2)}ms`,
          );
          console.log('\n🎉 Database Service Layer Implementation: SUCCESS!');
          console.log('🚀 Ready for Phase 2.2 integration!');
        } else {
          console.log('\n⚠️ Some tests failed. Check implementation.');
        }
      }
    } else {
      console.log(
        '⚠️ Database not configured - this is expected if environment variables are not set',
      );
      console.log('📝 To test with a real database, configure:');
      console.log('   - NEXT_PUBLIC_SUPABASE_URL');
      console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY (optional)');
    }

    console.log('\n🎯 Database Service Layer Test COMPLETED!');
  } catch (error) {
    console.error('❌ Database service layer test failed:', error);
    throw error;
  }
}

// Run the test
testDatabaseServiceLayer();
