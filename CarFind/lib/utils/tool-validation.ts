// File Path: CarFind/lib/utils/tool-validation.ts
// Tool integration validation utilities
import { carTools } from '@/lib/tools';

export function validateToolIntegration() {
  const requiredTools = ['searchCars', 'getCarDetails', 'getRecommendations'];
  const availableTools = Object.keys(carTools);

  const missingTools = requiredTools.filter(
    (tool) => !availableTools.includes(tool),
  );

  if (missingTools.length > 0) {
    throw new Error(`Missing required tools: ${missingTools.join(', ')}`);
  }

  console.log('✅ All car search tools are properly integrated');
  return true;
}

export function logToolUsage(toolName: string, input: any, result: any) {
  console.log(`🔧 Tool used: ${toolName}`, {
    input: JSON.stringify(input, null, 2),
    resultType: typeof result,
    success: result?.success || false,
  });
}

// Enhanced validation with type checking
export function validateToolSchemas() {
  try {
    // Check if tools have required properties
    const tools = [
      carTools.searchCars,
      carTools.getCarDetails,
      carTools.getRecommendations,
    ];

    for (const tool of tools) {
      if (!tool || typeof tool !== 'object') {
        throw new Error(`Invalid tool structure: ${tool}`);
      }

      if (!tool.description || typeof tool.description !== 'string') {
        throw new Error(`Tool missing description: ${JSON.stringify(tool)}`);
      }

      // Check if tool has execute function (AI SDK tool structure)
      if (!tool.execute || typeof tool.execute !== 'function') {
        throw new Error(
          `Tool missing execute function: ${JSON.stringify(tool)}`,
        );
      }
    }

    console.log('✅ All tool schemas are valid');
    return true;
  } catch (error) {
    console.error('❌ Tool schema validation failed:', error);
    throw error;
  }
}

// Integration health check
export function performToolHealthCheck() {
  try {
    validateToolIntegration();
    validateToolSchemas();

    console.log('🎯 Tool integration health check passed');
    return {
      status: 'healthy',
      tools: Object.keys(carTools),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('💥 Tool integration health check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Development utility for debugging tool calls
export function debugToolCall(toolName: string, input: any) {
  console.log(`🐛 DEBUG: Tool call initiated`, {
    tool: toolName,
    input: input,
    timestamp: new Date().toISOString(),
  });
}

// Production-ready error handling for tool failures
export function handleToolError(toolName: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  console.error(`🚨 Tool error in ${toolName}:`, {
    error: errorMessage,
    timestamp: new Date().toISOString(),
  });

  // Return user-friendly error response
  return {
    success: false,
    error: `Sorry, there was an issue with the ${toolName} tool. Please try again.`,
    technicalError: errorMessage,
  };
}
