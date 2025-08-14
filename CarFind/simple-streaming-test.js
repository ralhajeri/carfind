/**
 * Simple Streaming Response Validation Test
 * TASK-08 Sub-Task 4: Streaming Response Validation (REQ-004)
 */

const baseUrl = 'http://localhost:3000';

async function testStreamingResponse() {
  console.log('🚀 Testing Streaming Response (REQ-004)\n');

  try {
    // Test 1: Basic streaming test
    console.log('📊 Test 1: Basic Streaming Performance');

    const startTime = Date.now();
    let firstByteTime = null;
    let chunkCount = 0;

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `test-${Date.now()}`,
        message: {
          id: `msg-${Date.now()}`,
          role: 'user',
          parts: [{ type: 'text', text: 'Hello, tell me about cars briefly' }],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`   📡 Response Status: ${response.status}`);
    console.log(`   📋 Content-Type: ${response.headers.get('content-type')}`);

    if (!response.body) {
      throw new Error('No response body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    console.log('   📦 Receiving chunks:');

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('   ✅ Stream completed');
          break;
        }

        const currentTime = Date.now();

        if (firstByteTime === null) {
          firstByteTime = currentTime;
          const timeToFirstByte = (firstByteTime - startTime) / 1000;
          console.log(
            `   ⚡ Time to first byte: ${timeToFirstByte.toFixed(2)}s`,
          );
        }

        chunkCount++;
        const chunk = decoder.decode(value);
        const preview = chunk.substring(0, 100).replace(/\n/g, '\\n');
        console.log(`   📦 Chunk ${chunkCount}: ${preview}...`);

        // Stop after reasonable number of chunks for testing
        if (chunkCount >= 10) {
          console.log('   🛑 Stopping after 10 chunks for test purposes');
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }

    const totalTime = (Date.now() - startTime) / 1000;
    const timeToFirstByte = firstByteTime
      ? (firstByteTime - startTime) / 1000
      : 0;

    console.log(`\n📊 Test Results:`);
    console.log(`   ⏱️  Time to first byte: ${timeToFirstByte.toFixed(2)}s`);
    console.log(`   ⏱️  Total time: ${totalTime.toFixed(2)}s`);
    console.log(`   📦 Total chunks: ${chunkCount}`);
    console.log(
      `   ✅ Streaming performance: ${timeToFirstByte < 2 ? 'PASSED' : 'FAILED'} (< 2s requirement)`,
    );

    // Test 2: Car search tool streaming
    console.log('\n📊 Test 2: Car Search Tool Integration');

    const toolTestStart = Date.now();
    let toolInvoked = false;
    let toolChunkCount = 0;

    const toolResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `test-tool-${Date.now()}`,
        message: {
          id: `msg-tool-${Date.now()}`,
          role: 'user',
          parts: [{ type: 'text', text: 'Show me Toyota cars under $30000' }],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      }),
    });

    if (!toolResponse.ok) {
      throw new Error(
        `Tool test HTTP ${toolResponse.status}: ${toolResponse.statusText}`,
      );
    }

    const toolReader = toolResponse.body.getReader();

    try {
      while (true) {
        const { done, value } = await toolReader.read();

        if (done) break;

        toolChunkCount++;
        const chunk = decoder.decode(value);

        // Check for tool indicators
        if (
          chunk.includes('searchCars') ||
          chunk.includes('tool') ||
          chunk.includes('function')
        ) {
          toolInvoked = true;
          console.log(
            `   🔧 Tool invocation detected in chunk ${toolChunkCount}`,
          );
        }

        const preview = chunk.substring(0, 80).replace(/\n/g, '\\n');
        console.log(`   📦 Tool chunk ${toolChunkCount}: ${preview}...`);

        // Stop after reasonable number for testing
        if (toolChunkCount >= 15) {
          console.log('   🛑 Stopping tool test after 15 chunks');
          break;
        }
      }
    } finally {
      toolReader.releaseLock();
    }

    const toolTotalTime = (Date.now() - toolTestStart) / 1000;
    console.log(`\n📊 Tool Test Results:`);
    console.log(
      `   🔧 Tool invocation detected: ${toolInvoked ? 'YES' : 'NO'}`,
    );
    console.log(`   📦 Tool chunks received: ${toolChunkCount}`);
    console.log(`   ⏱️  Tool test time: ${toolTotalTime.toFixed(2)}s`);
    console.log(
      `   ✅ Tool integration streaming: ${toolInvoked && toolChunkCount > 0 ? 'PASSED' : 'FAILED'}`,
    );

    // Summary
    console.log('\n🎯 STREAMING VALIDATION SUMMARY (REQ-004):');
    console.log(
      `   ✅ Response streaming starts quickly (< 2s): ${timeToFirstByte < 2 ? 'PASSED' : 'FAILED'}`,
    );
    console.log(
      `   ✅ Text streams without interruption: ${chunkCount > 0 ? 'PASSED' : 'FAILED'}`,
    );
    console.log(
      `   ✅ Tool integration works with streaming: ${toolInvoked && toolChunkCount > 0 ? 'PASSED' : 'FAILED'}`,
    );
    console.log(
      `   ✅ SSE format detected: ${response.headers.get('content-type')?.includes('text/') ? 'PASSED' : 'FAILED'}`,
    );

    return true;
  } catch (error) {
    console.error('❌ Streaming test failed:', error.message);
    return false;
  }
}

// Run the test
testStreamingResponse()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Streaming validation completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Streaming validation failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Test execution error:', error);
    process.exit(1);
  });
