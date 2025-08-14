// File Path: CarFind/lib/services/database-test-utils.ts
// Database testing utilities and validation helpers
import {
  DatabaseService,
  createDatabaseService,
  getDatabaseService,
} from './database-service';
import { checkSupabaseHealth } from '@/lib/supabase/utils';
import { ErrorFactory } from '@/lib/types/errors';
import type { ChatSession, ChatMessage } from '@/lib/supabase/utils';

export interface DatabaseTestResult {
  success: boolean;
  message: string;
  duration: number;
  details?: any;
}

export interface DatabaseTestSuite {
  connection: DatabaseTestResult;
  sessionOperations: DatabaseTestResult;
  messageOperations: DatabaseTestResult;
  cleanup: DatabaseTestResult;
  overall: {
    success: boolean;
    totalDuration: number;
    passedTests: number;
    totalTests: number;
  };
}

/**
 * Test database connectivity and health
 */
export async function testDatabaseConnection(): Promise<DatabaseTestResult> {
  const startTime = Date.now();

  try {
    const health = await checkSupabaseHealth();
    const isConnected = health.client || health.server;

    return {
      success: isConnected,
      message: isConnected
        ? 'Database connection successful'
        : 'Database connection failed',
      duration: Date.now() - startTime,
      details: health,
    };
  } catch (error) {
    return {
      success: false,
      message: `Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      details: error,
    };
  }
}

/**
 * Test session CRUD operations
 */
export async function testSessionOperations(
  service?: DatabaseService,
): Promise<DatabaseTestResult> {
  const startTime = Date.now();
  const dbService = service || getDatabaseService();
  const testSessionId = `test-session-${Date.now()}`;

  try {
    // Test creating a session
    const sessionData = {
      user_id: 'test-user',
      title: 'Test Session',
    };

    const createdSession = await dbService.createSession(sessionData);

    if (!createdSession || !createdSession.id) {
      throw new Error('Session creation failed');
    }

    const testSessionId = createdSession.id;
    // Test getting the session
    const retrievedSession = await dbService.getSession(testSessionId);

    if (!retrievedSession || retrievedSession.id !== testSessionId) {
      throw new Error('Session retrieval failed');
    }

    // Test updating the session
    const updatedSession = await dbService.updateSession(testSessionId, {
      title: 'Updated Test Session',
    });

    if (!updatedSession || updatedSession.title !== 'Updated Test Session') {
      throw new Error('Session update failed');
    }

    // Test getting user sessions
    const userSessions = await dbService.getUserSessions('test-user');

    if (
      !Array.isArray(userSessions) ||
      !userSessions.some((s) => s.id === testSessionId)
    ) {
      throw new Error('User sessions retrieval failed');
    }

    return {
      success: true,
      message: 'Session operations completed successfully',
      duration: Date.now() - startTime,
      details: { sessionId: testSessionId },
    };
  } catch (error) {
    return {
      success: false,
      message: `Session operations failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      details: { sessionId: testSessionId, error },
    };
  }
}

/**
 * Test message CRUD operations
 */
export async function testMessageOperations(
  sessionId: string,
  service?: DatabaseService,
): Promise<DatabaseTestResult> {
  const startTime = Date.now();
  const dbService = service || getDatabaseService();
  const testMessageId = `test-message-${Date.now()}`;

  try {
    // Test creating a message
    const messageData = {
      session_id: sessionId,
      role: 'user' as const,
      content: 'Test message content',
    };

    const createdMessage = await dbService.saveMessage(messageData);

    if (!createdMessage || !createdMessage.id) {
      throw new Error('Message creation failed');
    }

    const testMessageId = createdMessage.id;

    // Test getting session messages
    const sessionMessages = await dbService.getSessionMessages(sessionId);

    if (
      !Array.isArray(sessionMessages) ||
      !sessionMessages.some((m) => m.id === testMessageId)
    ) {
      throw new Error('Session messages retrieval failed');
    }

    return {
      success: true,
      message: 'Message operations completed successfully',
      duration: Date.now() - startTime,
      details: {
        messageId: testMessageId,
        messageCount: sessionMessages.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Message operations failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      details: { messageId: testMessageId, error },
    };
  }
}

/**
 * Clean up test data
 */
export async function cleanupTestData(
  sessionId: string,
  service?: DatabaseService,
): Promise<DatabaseTestResult> {
  const startTime = Date.now();
  const dbService = service || getDatabaseService();

  try {
    // Delete the test session (this should cascade to messages)
    await dbService.deleteSession(sessionId);

    // Verify session is deleted
    const deletedSession = await dbService.getSession(sessionId);

    if (deletedSession !== null) {
      throw new Error('Session deletion failed');
    }

    return {
      success: true,
      message: 'Test data cleanup completed successfully',
      duration: Date.now() - startTime,
      details: { sessionId },
    };
  } catch (error) {
    return {
      success: false,
      message: `Test data cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: Date.now() - startTime,
      details: { sessionId, error },
    };
  }
}

/**
 * Run complete database service test suite
 */
export async function runDatabaseTestSuite(
  service?: DatabaseService,
): Promise<DatabaseTestSuite> {
  const dbService = service || getDatabaseService();
  const testSessionId = `test-session-${Date.now()}`;

  console.log('🧪 Running Database Service Test Suite...\n');

  // Test 1: Connection
  console.log('1️⃣ Testing database connection...');
  const connectionTest = await testDatabaseConnection();
  console.log(
    `   ${connectionTest.success ? '✅' : '❌'} ${connectionTest.message} (${connectionTest.duration}ms)\n`,
  );

  // Test 2: Session Operations
  console.log('2️⃣ Testing session operations...');
  const sessionTest = await testSessionOperations(dbService);
  console.log(
    `   ${sessionTest.success ? '✅' : '❌'} ${sessionTest.message} (${sessionTest.duration}ms)\n`,
  );

  let messageTest: DatabaseTestResult;
  let cleanupTest: DatabaseTestResult;

  if (sessionTest.success && sessionTest.details?.sessionId) {
    // Test 3: Message Operations
    console.log('3️⃣ Testing message operations...');
    messageTest = await testMessageOperations(
      sessionTest.details.sessionId,
      dbService,
    );
    console.log(
      `   ${messageTest.success ? '✅' : '❌'} ${messageTest.message} (${messageTest.duration}ms)\n`,
    );

    // Test 4: Cleanup
    console.log('4️⃣ Testing cleanup operations...');
    cleanupTest = await cleanupTestData(
      sessionTest.details.sessionId,
      dbService,
    );
    console.log(
      `   ${cleanupTest.success ? '✅' : '❌'} ${cleanupTest.message} (${cleanupTest.duration}ms)\n`,
    );
  } else {
    messageTest = {
      success: false,
      message: 'Skipped due to session test failure',
      duration: 0,
    };

    cleanupTest = {
      success: false,
      message: 'Skipped due to session test failure',
      duration: 0,
    };

    console.log('3️⃣ ⏭️ Skipping message operations (session test failed)\n');
    console.log('4️⃣ ⏭️ Skipping cleanup operations (session test failed)\n');
  }

  // Calculate overall results
  const tests = [connectionTest, sessionTest, messageTest, cleanupTest];
  const passedTests = tests.filter((t) => t.success).length;
  const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);
  const overallSuccess = passedTests === tests.length;

  console.log(
    `📊 Test Results: ${passedTests}/${tests.length} passed (${totalDuration}ms total)`,
  );
  console.log(
    `${overallSuccess ? '🎉' : '⚠️'} Database Service Test Suite ${overallSuccess ? 'PASSED' : 'FAILED'}\n`,
  );

  return {
    connection: connectionTest,
    sessionOperations: sessionTest,
    messageOperations: messageTest,
    cleanup: cleanupTest,
    overall: {
      success: overallSuccess,
      totalDuration,
      passedTests,
      totalTests: tests.length,
    },
  };
}

/**
 * Validate database service integration
 */
export async function validateDatabaseService(): Promise<boolean> {
  try {
    // Test client-side service
    const clientService = getDatabaseService();

    // Test server-side service
    const serverService = await createDatabaseService(true);

    // Basic validation
    if (!clientService || !serverService) {
      throw new Error('Failed to create database service instances');
    }

    // Test connection
    const connectionTest = await testDatabaseConnection();

    if (!connectionTest.success) {
      console.warn(
        'Database connection validation failed:',
        connectionTest.message,
      );
      return false;
    }

    console.log('✅ Database service validation passed');
    return true;
  } catch (error) {
    console.error('❌ Database service validation failed:', error);
    return false;
  }
}

/**
 * Performance test for database operations
 */
export async function performanceTest(iterations: number = 10): Promise<{
  avgSessionCreate: number;
  avgSessionRead: number;
  avgMessageCreate: number;
  avgMessageRead: number;
}> {
  const service = getDatabaseService();
  const sessionTimes: number[] = [];
  const sessionReadTimes: number[] = [];
  const messageTimes: number[] = [];
  const messageReadTimes: number[] = [];

  console.log(`🏃 Running performance test with ${iterations} iterations...\n`);

  for (let i = 0; i < iterations; i++) {
    try {
      // Session create
      const sessionStart = Date.now();
      const session = await service.createSession({
        user_id: 'perf-test-user',
        title: `Performance Test ${i}`,
      });
      sessionTimes.push(Date.now() - sessionStart);

      const sessionId = session.id;

      // Session read
      const sessionReadStart = Date.now();
      await service.getSession(sessionId);
      sessionReadTimes.push(Date.now() - sessionReadStart);

      // Message create
      const messageStart = Date.now();
      await service.saveMessage({
        session_id: sessionId,
        role: 'user',
        content: `Performance test message ${i}`,
      });
      messageTimes.push(Date.now() - messageStart);

      // Message read
      const messageReadStart = Date.now();
      await service.getSessionMessages(sessionId);
      messageReadTimes.push(Date.now() - messageReadStart);

      // Cleanup
      await service.deleteSession(sessionId);
    } catch (error) {
      console.error(`Performance test iteration ${i} failed:`, error);
    }
  }

  const avg = (arr: number[]) =>
    arr.reduce((sum, n) => sum + n, 0) / arr.length;

  const results = {
    avgSessionCreate: avg(sessionTimes),
    avgSessionRead: avg(sessionReadTimes),
    avgMessageCreate: avg(messageTimes),
    avgMessageRead: avg(messageReadTimes),
  };

  console.log('📈 Performance Results:');
  console.log(
    `   Session Create: ${results.avgSessionCreate.toFixed(2)}ms avg`,
  );
  console.log(`   Session Read: ${results.avgSessionRead.toFixed(2)}ms avg`);
  console.log(
    `   Message Create: ${results.avgMessageCreate.toFixed(2)}ms avg`,
  );
  console.log(`   Message Read: ${results.avgMessageRead.toFixed(2)}ms avg\n`);

  return results;
}

export default {
  testDatabaseConnection,
  testSessionOperations,
  testMessageOperations,
  cleanupTestData,
  runDatabaseTestSuite,
  validateDatabaseService,
  performanceTest,
};
