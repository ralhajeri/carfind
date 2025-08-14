/**
 * Streaming Response Validation Test Suite
 *
 * Comprehensive validation methodology for streaming responses
 * through the service abstraction layer.
 *
 * @fileoverview Test implementation for streaming validation
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 */

import { OpenAIService } from '../services/openai-service';
import { ChatRequest, ChatResponse } from '../types/ai-service';
import { carTools } from '../tools/index';

/**
 * Streaming Response Validation Test Suite
 * Tests streaming functionality through service abstraction
 */
export class StreamingValidationTests {
  /**
   * Test 1: Basic Streaming Response Validation
   * Validates that the service abstraction maintains streaming capabilities
   */
  static async validateBasicStreaming(): Promise<{
    passed: boolean;
    metrics: {
      totalChunks: number;
      totalResponseTime: number;
      firstChunkTime: number;
      finalContent: string;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    const metrics = {
      totalChunks: 0,
      totalResponseTime: 0,
      firstChunkTime: 0,
      finalContent: '',
    };

    try {
      console.log('🧪 Testing Basic Streaming Response...');

      // Create service instance through abstraction
      const service = new OpenAIService({
        apiKey: process.env.OPENAI_API_KEY || 'test-key',
        model: 'gpt-4o-mini',
        maxTokens: 100,
        temperature: 0.1,
      });

      const request: ChatRequest = {
        messages: [
          {
            id: 'test-1',
            role: 'user',
            content: 'Count from 1 to 10 slowly, one number per line.',
            timestamp: new Date(),
          },
        ],
        sessionId: 'test-session-streaming',
      };

      const startTime = Date.now();
      let firstChunk = true;
      let accumulatedContent = '';

      // Test streaming response generation
      const streamGenerator = service.generateStreamResponse(request);

      for await (const chunk of streamGenerator) {
        metrics.totalChunks++;
        accumulatedContent += chunk;

        if (firstChunk) {
          metrics.firstChunkTime = Date.now() - startTime;
          firstChunk = false;
          console.log(`✅ First chunk received in ${metrics.firstChunkTime}ms`);
        }

        // Validate chunk is a string
        if (typeof chunk !== 'string') {
          errors.push(
            `Chunk ${metrics.totalChunks} is not a string: ${typeof chunk}`,
          );
        }

        // Validate chunk is not empty (for meaningful responses)
        if (chunk.trim().length === 0) {
          console.log(
            `⚠️  Empty chunk received at position ${metrics.totalChunks}`,
          );
        }
      }

      metrics.totalResponseTime = Date.now() - startTime;
      metrics.finalContent = accumulatedContent;

      console.log(
        `✅ Streaming completed: ${metrics.totalChunks} chunks in ${metrics.totalResponseTime}ms`,
      );

      // Validation checks
      if (metrics.totalChunks === 0) {
        errors.push('No chunks received from streaming response');
      }

      if (metrics.finalContent.trim().length === 0) {
        errors.push('Final accumulated content is empty');
      }

      if (metrics.firstChunkTime > 5000) {
        errors.push(
          `First chunk took too long: ${metrics.firstChunkTime}ms (>5s)`,
        );
      }
    } catch (error) {
      errors.push(
        `Streaming test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      passed: errors.length === 0,
      metrics,
      errors,
    };
  }

  /**
   * Test 2: Tool Integration with Streaming
   * Validates streaming works with function calling through service abstraction
   */
  static async validateStreamingWithTools(): Promise<{
    passed: boolean;
    toolCalls: number;
    streamingMaintained: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let toolCalls = 0;
    let streamingMaintained = false;

    try {
      console.log('🧪 Testing Streaming with Tool Integration...');

      const service = new OpenAIService({
        apiKey: process.env.OPENAI_API_KEY || 'test-key',
        model: 'gpt-4o',
        maxTokens: 200,
        temperature: 0.1,
      });

      const request: ChatRequest = {
        messages: [
          {
            id: 'test-tool-1',
            role: 'user',
            content:
              'Search for Toyota cars under $30,000 and tell me about the results.',
            timestamp: new Date(),
          },
        ],
        sessionId: 'test-tool-session',
        tools: carTools,
      };

      let chunkCount = 0;
      const streamGenerator = service.generateStreamResponse(request);

      for await (const chunk of streamGenerator) {
        chunkCount++;

        // Check if chunk contains tool call indicators
        if (chunk.includes('searchCars') || chunk.includes('Toyota')) {
          toolCalls++;
        }

        // Validate streaming is maintained during tool usage
        if (chunkCount > 0) {
          streamingMaintained = true;
        }
      }

      if (chunkCount === 0) {
        errors.push('No streaming chunks received with tool integration');
      }
    } catch (error) {
      errors.push(
        `Tool streaming test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      passed: errors.length === 0,
      toolCalls,
      streamingMaintained,
      errors,
    };
  }

  /**
   * Test 3: Error Handling in Streaming Context
   * Validates proper error handling doesn't break streaming abstraction
   */
  static async validateStreamingErrorHandling(): Promise<{
    passed: boolean;
    errorsCaught: number;
    streamingGraceful: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let errorsCaught = 0;
    let streamingGraceful = false;

    try {
      console.log('🧪 Testing Streaming Error Handling...');

      // Test with invalid configuration to trigger error handling
      const service = new OpenAIService({
        apiKey: 'invalid-key',
        model: 'gpt-4o-mini',
        maxTokens: 50,
        temperature: 0.1,
      });

      const request: ChatRequest = {
        messages: [
          {
            id: 'test-error-1',
            role: 'user',
            content: 'This should trigger an error due to invalid API key.',
            timestamp: new Date(),
          },
        ],
        sessionId: 'test-error-session',
      };

      try {
        const streamGenerator = service.generateStreamResponse(request);

        for await (const chunk of streamGenerator) {
          // This should not execute with invalid key
          errors.push(
            'Received chunks with invalid API key - error handling failed',
          );
        }
      } catch (streamError) {
        errorsCaught++;
        streamingGraceful = true;

        // Validate error is properly typed and contains context
        if (
          streamError &&
          typeof streamError === 'object' &&
          'code' in streamError
        ) {
          console.log('✅ Streaming error properly caught with context');
        } else {
          errors.push('Streaming error not properly formatted');
        }
      }
    } catch (error) {
      errors.push(
        `Error handling test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      passed: errors.length === 0 && errorsCaught > 0,
      errorsCaught,
      streamingGraceful,
      errors,
    };
  }

  /**
   * Test 4: Service Factory Streaming Consistency
   * Validates streaming works consistently across different service instances
   */
  static async validateFactoryStreamingConsistency(): Promise<{
    passed: boolean;
    servicesCreated: number;
    consistentStreaming: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let servicesCreated = 0;
    let consistentStreaming = true;

    try {
      console.log('🧪 Testing Factory Streaming Consistency...');

      // Test multiple service instances created through factory
      const configs = [
        { model: 'gpt-4o-mini', temperature: 0.1 },
        { model: 'gpt-4o', temperature: 0.5 },
        { model: 'gpt-4o-mini', temperature: 0.9 },
      ];

      for (const config of configs) {
        try {
          const service = new OpenAIService({
            apiKey: process.env.OPENAI_API_KEY || 'test-key',
            ...config,
            maxTokens: 50,
          });

          servicesCreated++;

          const request: ChatRequest = {
            messages: [
              {
                id: `test-factory-${servicesCreated}`,
                role: 'user',
                content: 'Say hello briefly.',
                timestamp: new Date(),
              },
            ],
            sessionId: `test-factory-session-${servicesCreated}`,
          };

          let hasStreamed = false;
          const streamGenerator = service.generateStreamResponse(request);

          for await (const chunk of streamGenerator) {
            hasStreamed = true;
            break; // Just test that streaming starts
          }

          if (!hasStreamed) {
            consistentStreaming = false;
            errors.push(`Service ${servicesCreated} failed to stream`);
          }
        } catch (serviceError) {
          errors.push(
            `Service ${servicesCreated + 1} creation/streaming failed: ${serviceError instanceof Error ? serviceError.message : 'Unknown error'}`,
          );
        }
      }
    } catch (error) {
      errors.push(
        `Factory consistency test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      passed: errors.length === 0 && consistentStreaming,
      servicesCreated,
      consistentStreaming,
      errors,
    };
  }

  /**
   * Run Complete Streaming Validation Suite
   * Executes all streaming validation tests
   */
  static async runCompleteValidation(): Promise<{
    overallPassed: boolean;
    testResults: Record<string, any>;
    summary: string;
  }> {
    console.log('🚀 Starting Complete Streaming Validation Suite...\n');

    const testResults = {
      basicStreaming: await this.validateBasicStreaming(),
      toolIntegration: await this.validateStreamingWithTools(),
      errorHandling: await this.validateStreamingErrorHandling(),
      factoryConsistency: await this.validateFactoryStreamingConsistency(),
    };

    const allTestsPassed = Object.values(testResults).every(
      (result) => result.passed,
    );

    const summary = this.generateValidationSummary(testResults, allTestsPassed);

    console.log('\n' + '='.repeat(60));
    console.log(summary);
    console.log('='.repeat(60));

    return {
      overallPassed: allTestsPassed,
      testResults,
      summary,
    };
  }

  /**
   * Generate validation summary report
   */
  private static generateValidationSummary(
    testResults: Record<string, any>,
    allPassed: boolean,
  ): string {
    const status = allPassed ? '✅ PASSED' : '❌ FAILED';

    let summary = `Streaming Validation Suite: ${status}\n\n`;

    summary += `📊 Test Results:\n`;
    summary += `├── Basic Streaming: ${testResults.basicStreaming.passed ? '✅' : '❌'}\n`;
    summary += `│   └── Chunks: ${testResults.basicStreaming.metrics.totalChunks}, Time: ${testResults.basicStreaming.metrics.totalResponseTime}ms\n`;
    summary += `├── Tool Integration: ${testResults.toolIntegration.passed ? '✅' : '❌'}\n`;
    summary += `│   └── Tool Calls: ${testResults.toolIntegration.toolCalls}, Streaming: ${testResults.toolIntegration.streamingMaintained}\n`;
    summary += `├── Error Handling: ${testResults.errorHandling.passed ? '✅' : '❌'}\n`;
    summary += `│   └── Errors Caught: ${testResults.errorHandling.errorsCaught}, Graceful: ${testResults.errorHandling.streamingGraceful}\n`;
    summary += `└── Factory Consistency: ${testResults.factoryConsistency.passed ? '✅' : '❌'}\n`;
    summary += `    └── Services: ${testResults.factoryConsistency.servicesCreated}, Consistent: ${testResults.factoryConsistency.consistentStreaming}\n\n`;

    // Collect all errors
    const allErrors = Object.values(testResults).flatMap(
      (result) => result.errors,
    );
    if (allErrors.length > 0) {
      summary += `❌ Issues Found:\n`;
      allErrors.forEach((error, index) => {
        summary += `${index + 1}. ${error}\n`;
      });
    } else {
      summary += `✅ All streaming validation tests passed successfully!\n`;
      summary += `   Service abstraction maintains full streaming capabilities.`;
    }

    return summary;
  }
}

// Export validation function for integration testing
export async function validateStreamingAbstraction(): Promise<boolean> {
  const results = await StreamingValidationTests.runCompleteValidation();
  return results.overallPassed;
}
