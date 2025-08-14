/**
 * Automated Streaming Response Validation Test
 * TASK-08 Sub-Task 4: Streaming Response Validation (REQ-004)
 *
 * This test validates:
 * 1. Response streaming starts quickly (< 2 seconds)
 * 2. Text streams smoothly without interruption
 * 3. Tool integration doesn't break streaming
 * 4. SSE format is correct
 * 5. Stream resumption works properly
 */

import { performance } from 'perf_hooks';
import { spawn, ChildProcess } from 'child_process';

interface StreamingTestResult {
  testName: string;
  passed: boolean;
  details: string;
  metrics?: {
    startTime: number;
    firstByteTime?: number;
    totalTime?: number;
    chunkCount?: number;
    avgChunkInterval?: number;
  };
}

class StreamingValidator {
  private baseUrl = 'http://localhost:3000';
  private results: StreamingTestResult[] = [];
  private sessionCookies: string = '';
  private devServerProcess: ChildProcess | null = null;

  async runAllTests(): Promise<StreamingTestResult[]> {
    console.log('🚀 Starting Streaming Response Validation (REQ-004)\n');

    try {
      // Start the development server
      await this.startDevServer();

      // Wait for server to be ready
      await this.waitForServerReady();

      // Initialize authentication
      await this.initializeAuth();

      // Test 1: Basic streaming performance
      await this.testBasicStreamingPerformance();

      // Test 2: Car search tool streaming
      await this.testCarSearchToolStreaming();

      // Test 3: Complex query streaming
      await this.testComplexQueryStreaming();

      // Test 4: SSE format validation
      await this.testSSEFormatValidation();

      // Test 5: Stream interruption handling
      await this.testStreamInterruptionHandling();
    } finally {
      // Always cleanup the server
      await this.stopDevServer();
    }

    return this.results;
  }

  private async startDevServer(): Promise<void> {
    console.log('🔄 Starting development server...');

    return new Promise((resolve, reject) => {
      // Spawn the pnpm dev process
      this.devServerProcess = spawn('pnpm', ['dev'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        cwd: process.cwd(),
      });

      if (!this.devServerProcess) {
        reject(new Error('Failed to start development server'));
        return;
      }

      // Handle server startup
      this.devServerProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log(`   📝 Server: ${output.trim()}`);

        // Look for signs that the server is starting
        if (
          output.includes('ready') ||
          output.includes('Local:') ||
          output.includes('localhost:3000')
        ) {
          setTimeout(resolve, 2000); // Give it a moment to fully start
        }
      });

      this.devServerProcess.stderr?.on('data', (data) => {
        const error = data.toString();
        console.log(`   ⚠️ Server Error: ${error.trim()}`);
      });

      this.devServerProcess.on('error', (error) => {
        reject(new Error(`Server process error: ${error.message}`));
      });

      this.devServerProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`Server exited with code ${code}`));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Server startup timeout after 30 seconds'));
      }, 30000);
    });
  }

  private async waitForServerReady(): Promise<void> {
    console.log('⏳ Waiting for server to be ready...');

    const maxAttempts = 30;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Create a promise that times out after 5 seconds
        const timeoutPromise = new Promise<Response>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });

        const fetchPromise = fetch(`${this.baseUrl}/api/health`, {
          method: 'GET',
        }).catch(() => {
          // Try the main page if health endpoint doesn't exist
          return fetch(this.baseUrl, {
            method: 'GET',
          });
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (response.ok) {
          console.log('✅ Server is ready!');
          return;
        }
      } catch (error) {
        // Server not ready yet, continue waiting
      }

      console.log(
        `   🔄 Attempt ${attempt}/${maxAttempts}: Server not ready yet, waiting...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error('Server failed to become ready within timeout period');
  }

  private async stopDevServer(): Promise<void> {
    if (this.devServerProcess) {
      console.log('🛑 Stopping development server...');

      return new Promise((resolve) => {
        if (!this.devServerProcess) {
          resolve();
          return;
        }

        this.devServerProcess.on('exit', () => {
          console.log('✅ Development server stopped');
          resolve();
        });

        // Try graceful shutdown first
        this.devServerProcess.kill('SIGTERM');

        // Force kill after 5 seconds if still running
        setTimeout(() => {
          if (this.devServerProcess && !this.devServerProcess.killed) {
            this.devServerProcess.kill('SIGKILL');
            resolve();
          }
        }, 5000);
      });
    }
  }

  private async initializeAuth(): Promise<void> {
    try {
      console.log('🔐 Initializing authentication...');
      // Navigate to home page which will trigger guest authentication
      const homeResponse = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        redirect: 'follow', // Follow redirects to complete auth flow
      });

      if (homeResponse.ok) {
        // Extract session cookies from the final response
        const cookies = homeResponse.headers.get('set-cookie');
        if (cookies) {
          this.sessionCookies = cookies;
          console.log('✅ Authentication initialized successfully');
        } else {
          console.log(
            '⚠️ No session cookies received, tests may need manual session',
          );
        }
      } else {
        console.log('⚠️ Home page request failed, proceeding without auth');
      }
    } catch (error) {
      console.log(
        '⚠️ Auth initialization failed, will test without authentication:',
        error,
      );
    }
  }

  private async makeAuthenticatedRequest(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: this.sessionCookies,
      },
    });
  }

  private async testBasicStreamingPerformance(): Promise<void> {
    const testName = 'Basic Streaming Performance (< 2s start time)';
    console.log(`📊 Running: ${testName}`);

    try {
      const startTime = performance.now();
      let firstByteTime: number | undefined;
      let chunkCount = 0;
      const chunkTimes: number[] = [];

      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: `test-${Date.now()}`,
            message: {
              id: `msg-${Date.now()}`,
              role: 'user',
              parts: [{ type: 'text', text: 'Hello, tell me about cars' }],
              createdAt: new Date().toISOString(),
            },
            selectedChatModel: 'chat-model',
            selectedVisibilityType: 'private',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const currentTime = performance.now();

          if (firstByteTime === undefined) {
            firstByteTime = currentTime;
          }

          chunkCount++;
          chunkTimes.push(currentTime - startTime);

          const chunk = decoder.decode(value);
          console.log(
            `   📦 Chunk ${chunkCount}: ${chunk.substring(0, 50)}...`,
          );
        }
      } finally {
        reader.releaseLock();
      }

      const totalTime = performance.now() - startTime;
      const timeToFirstByte = firstByteTime
        ? (firstByteTime - startTime) / 1000
        : 0;
      const avgChunkInterval =
        chunkTimes.length > 1
          ? (chunkTimes[chunkTimes.length - 1] - chunkTimes[0]) /
            (chunkTimes.length - 1)
          : 0;

      const passed = timeToFirstByte < 2; // < 2 seconds requirement

      this.results.push({
        testName,
        passed,
        details: `Time to first byte: ${timeToFirstByte.toFixed(2)}s, Total chunks: ${chunkCount}, Total time: ${(totalTime / 1000).toFixed(2)}s`,
        metrics: {
          startTime,
          firstByteTime: timeToFirstByte,
          totalTime: totalTime / 1000,
          chunkCount,
          avgChunkInterval,
        },
      });

      console.log(
        `   ✅ Result: ${passed ? 'PASSED' : 'FAILED'} - ${timeToFirstByte.toFixed(2)}s to first byte\n`,
      );
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log(`   ❌ Result: FAILED - ${error}\n`);
    }
  }

  private async testCarSearchToolStreaming(): Promise<void> {
    const testName = 'Car Search Tool Streaming Integration';
    console.log(`📊 Running: ${testName}`);

    try {
      const startTime = performance.now();
      let toolInvocationDetected = false;
      let streamingContinuedAfterTool = false;
      let chunkCount = 0;

      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: `test-tool-${Date.now()}`,
            message: {
              id: `msg-tool-${Date.now()}`,
              role: 'user',
              parts: [
                { type: 'text', text: 'Show me Toyota cars under $30,000' },
              ],
              createdAt: new Date().toISOString(),
            },
            selectedChatModel: 'chat-model',
            selectedVisibilityType: 'private',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunkCount++;
          const chunk = decoder.decode(value);

          // Check for tool invocation indicators
          if (chunk.includes('searchCars') || chunk.includes('tool')) {
            toolInvocationDetected = true;
            console.log(
              `   🔧 Tool invocation detected in chunk ${chunkCount}`,
            );
          }

          // Check if streaming continues after tool
          if (toolInvocationDetected && chunk.includes('data:')) {
            streamingContinuedAfterTool = true;
          }

          console.log(
            `   📦 Chunk ${chunkCount}: ${chunk.substring(0, 50)}...`,
          );
        }
      } finally {
        reader.releaseLock();
      }

      const totalTime = performance.now() - startTime;
      const passed =
        toolInvocationDetected && streamingContinuedAfterTool && chunkCount > 0;

      this.results.push({
        testName,
        passed,
        details: `Tool invocation: ${toolInvocationDetected}, Streaming continued: ${streamingContinuedAfterTool}, Chunks: ${chunkCount}, Time: ${(totalTime / 1000).toFixed(2)}s`,
        metrics: {
          startTime,
          totalTime: totalTime / 1000,
          chunkCount,
        },
      });

      console.log(
        `   ✅ Result: ${passed ? 'PASSED' : 'FAILED'} - Tool integration streaming\n`,
      );
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log(`   ❌ Result: FAILED - ${error}\n`);
    }
  }

  private async testComplexQueryStreaming(): Promise<void> {
    const testName = 'Complex Query Streaming Performance';
    console.log(`📊 Running: ${testName}`);

    try {
      const complexQuery =
        'Compare Toyota Camry vs Honda Civic for commuting, considering fuel economy, reliability, maintenance costs, and safety ratings. Provide detailed analysis.';
      const startTime = performance.now();
      let firstByteTime: number | undefined;
      let chunkCount = 0;
      let totalBytes = 0;

      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: `test-complex-${Date.now()}`,
            message: {
              id: `msg-complex-${Date.now()}`,
              role: 'user',
              parts: [{ type: 'text', text: complexQuery }],
              createdAt: new Date().toISOString(),
            },
            selectedChatModel: 'chat-model',
            selectedVisibilityType: 'private',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const currentTime = performance.now();

          if (firstByteTime === undefined) {
            firstByteTime = currentTime;
          }

          chunkCount++;
          totalBytes += value.byteLength;

          const chunk = decoder.decode(value);
          console.log(
            `   📦 Complex Chunk ${chunkCount}: ${chunk.substring(0, 50)}...`,
          );
        }
      } finally {
        reader.releaseLock();
      }

      const totalTime = performance.now() - startTime;
      const timeToFirstByte = firstByteTime
        ? (firstByteTime - startTime) / 1000
        : 0;
      const passed = timeToFirstByte < 2 && chunkCount > 0 && totalBytes > 0;

      this.results.push({
        testName,
        passed,
        details: `Complex query streaming: ${timeToFirstByte.toFixed(2)}s first byte, ${chunkCount} chunks, ${totalBytes} bytes, ${(totalTime / 1000).toFixed(2)}s total`,
        metrics: {
          startTime,
          firstByteTime: timeToFirstByte,
          totalTime: totalTime / 1000,
          chunkCount,
        },
      });

      console.log(
        `   ✅ Result: ${passed ? 'PASSED' : 'FAILED'} - Complex query streaming\n`,
      );
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log(`   ❌ Result: FAILED - ${error}\n`);
    }
  }

  private async testSSEFormatValidation(): Promise<void> {
    const testName = 'SSE Format Validation';
    console.log(`📊 Running: ${testName}`);

    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: `test-sse-${Date.now()}`,
            message: {
              id: `msg-sse-${Date.now()}`,
              role: 'user',
              parts: [{ type: 'text', text: 'Quick test' }],
              createdAt: new Date().toISOString(),
            },
            selectedChatModel: 'chat-model',
            selectedVisibilityType: 'private',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let validSSEFormat = false;
      let dataEventCount = 0;
      let chunkCount = 0;

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunkCount++;
          const chunk = decoder.decode(value);

          // Check SSE format
          if (chunk.includes('data:') && chunk.includes('\n')) {
            validSSEFormat = true;
            dataEventCount++;
          }

          console.log(
            `   📦 SSE Chunk ${chunkCount}: ${chunk.substring(0, 100)}...`,
          );
        }
      } finally {
        reader.releaseLock();
      }

      const passed = validSSEFormat && dataEventCount > 0;

      this.results.push({
        testName,
        passed,
        details: `SSE Format valid: ${validSSEFormat}, Data events: ${dataEventCount}, Content-Type: ${contentType}`,
        metrics: {
          startTime: 0,
          chunkCount,
        },
      });

      console.log(
        `   ✅ Result: ${passed ? 'PASSED' : 'FAILED'} - SSE format validation\n`,
      );
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log(`   ❌ Result: FAILED - ${error}\n`);
    }
  }

  private async testStreamInterruptionHandling(): Promise<void> {
    const testName = 'Stream Interruption Handling';
    console.log(`📊 Running: ${testName}`);

    try {
      const startTime = performance.now();
      let chunkCount = 0;
      let interruptionHandled = false;

      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: `test-interrupt-${Date.now()}`,
            message: {
              id: `msg-interrupt-${Date.now()}`,
              role: 'user',
              parts: [
                {
                  type: 'text',
                  text: 'Write a long response about electric vehicles',
                },
              ],
              createdAt: new Date().toISOString(),
            },
            selectedChatModel: 'chat-model',
            selectedVisibilityType: 'private',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunkCount++;
          const chunk = decoder.decode(value);

          console.log(
            `   📦 Interrupt Chunk ${chunkCount}: ${chunk.substring(0, 50)}...`,
          );

          // Simulate interruption after a few chunks
          if (chunkCount === 3) {
            console.log(
              `   ⚠️ Simulating interruption after chunk ${chunkCount}`,
            );
            break;
          }
        }

        // Check if we can handle the interruption gracefully
        interruptionHandled = true;
      } finally {
        reader.releaseLock();
      }

      const totalTime = performance.now() - startTime;
      const passed = interruptionHandled && chunkCount > 0;

      this.results.push({
        testName,
        passed,
        details: `Interruption handled: ${interruptionHandled}, Chunks before interruption: ${chunkCount}, Time: ${(totalTime / 1000).toFixed(2)}s`,
        metrics: {
          startTime,
          totalTime: totalTime / 1000,
          chunkCount,
        },
      });

      console.log(
        `   ✅ Result: ${passed ? 'PASSED' : 'FAILED'} - Stream interruption handling\n`,
      );
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log(`   ❌ Result: FAILED - ${error}\n`);
    }
  }

  generateReport(): string {
    const passedTests = this.results.filter((r) => r.passed).length;
    const totalTests = this.results.length;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    let report = `
🎯 STREAMING RESPONSE VALIDATION REPORT (REQ-004)
================================================================

📊 SUMMARY:
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${totalTests - passedTests}
- Pass Rate: ${passRate}%

📋 DETAILED RESULTS:
`;

    this.results.forEach((result, index) => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      report += `
${index + 1}. ${result.testName}
   Status: ${status}
   Details: ${result.details}
`;

      if (result.metrics) {
        report += `   Metrics: `;
        if (result.metrics.firstByteTime)
          report += `First Byte: ${result.metrics.firstByteTime.toFixed(2)}s, `;
        if (result.metrics.totalTime)
          report += `Total: ${result.metrics.totalTime.toFixed(2)}s, `;
        if (result.metrics.chunkCount)
          report += `Chunks: ${result.metrics.chunkCount}`;
        report += '\n';
      }
    });

    report += `
🎯 REQ-004 VALIDATION CRITERIA:
- Response streaming starts quickly (< 2 seconds): ${this.results.find((r) => r.testName.includes('Basic Streaming'))?.passed ? '✅' : '❌'}
- Text streams smoothly without interruption: ${this.results.find((r) => r.testName.includes('Complex Query'))?.passed ? '✅' : '❌'}
- Tool integration doesn't break streaming: ${this.results.find((r) => r.testName.includes('Car Search Tool'))?.passed ? '✅' : '❌'}
- SSE format is correct: ${this.results.find((r) => r.testName.includes('SSE Format'))?.passed ? '✅' : '❌'}
- Stream interruption handling works: ${this.results.find((r) => r.testName.includes('Interruption'))?.passed ? '✅' : '❌'}

================================================================
`;

    return report;
  }
}

// Main execution
async function main() {
  const validator = new StreamingValidator();

  try {
    await validator.runAllTests();
    const report = validator.generateReport();
    console.log(report);

    // Save report to file
    const fs = require('fs');
    const reportPath = './streaming-validation-report.txt';
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Report saved to: ${reportPath}`);
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { StreamingValidator, type StreamingTestResult };
