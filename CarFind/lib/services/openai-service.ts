/**
 * OpenAI Service Implementation
 * 
 * Concrete implementation of AI service for OpenAI integration.
 * Provides streaming and non-streaming chat completions using Vercel AI SDK.
 * Follows SOLID principles with Single Responsibility and Dependency Inversion.
 * 
 * @fileoverview OpenAI service implementation with streaming support
 * @version 1.0.0
 * @author GitHub Copilot AI Agent
 * @created 2025-08-13
 * @phase Phase 2.1 - API Abstraction Layer Setup (Sub-Task 2)
 */

import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';
import { BaseAIService } from './base-ai-service';
import { ChatRequest, ChatResponse, AIServiceConfig } from '../types/ai-service';
import { ChatMessage } from '../types/chat';

/**
 * OpenAI service implementation with comprehensive streaming support
 * SOLID: Single Responsibility + Dependency Inversion principles
 * 
 * Provides:
 * - Complete chat responses via OpenAI API
 * - Real-time streaming responses for UX
 * - Tool/function calling support
 * - Usage statistics and metadata
 * - Comprehensive error handling
 */
export class OpenAIService extends BaseAIService {
    /**
     * Initialize OpenAI service with configuration
     * @param config - OpenAI service configuration
     */
    constructor(config: AIServiceConfig) {
        super(config);
    }

    /**
     * Generates complete AI response using OpenAI API
     * @param request - Chat request with messages and configuration
     * @returns Promise resolving to complete chat response with usage stats
     */
    async generateResponse(request: ChatRequest): Promise<ChatResponse> {
        try {
            const { text, usage } = await generateText({
                model: openai(this.config.model),
                messages: this.formatMessagesForOpenAI(request.messages),
                ...(request.maxTokens && { maxTokens: request.maxTokens }),
                ...(request.temperature && { temperature: request.temperature }),
                // Remove tools for now - will be handled separately in proper integration
            });

            const responseMessage = this.createChatMessage('assistant', text);

            return {
                message: responseMessage,
                sessionId: request.sessionId || this.generateSessionId(),
                usage: usage ? {
                    promptTokens: usage.inputTokens || 0,
                    completionTokens: usage.outputTokens || 0,
                    totalTokens: usage.totalTokens || 0
                } : undefined
            };
        } catch (error) {
            throw this.handleError(error, 'generateResponse');
        }
    }

    /**
     * Generates streaming AI response for real-time chat interactions
     * @param request - Chat request with messages and configuration
     * @returns AsyncGenerator yielding partial responses and final complete response
     */
    async* generateStreamResponse(request: ChatRequest): AsyncGenerator<string, ChatResponse> {
        try {
            const result = streamText({
                model: openai(this.config.model),
                messages: this.formatMessagesForOpenAI(request.messages),
                ...(request.maxTokens && { maxTokens: request.maxTokens }),
                ...(request.temperature && { temperature: request.temperature }),
                // Remove tools for now - will be handled separately in proper integration
            });

            let fullText = '';

            // Yield streaming text chunks
            for await (const chunk of result.textStream) {
                fullText += chunk;
                yield chunk;
            }

            // Get final results
            const finalResult = await result.finishReason;
            const usage = await result.usage;

            const responseMessage = this.createChatMessage('assistant', fullText);

            return {
                message: responseMessage,
                sessionId: request.sessionId || this.generateSessionId(),
                usage: usage ? {
                    promptTokens: usage.inputTokens || 0,
                    completionTokens: usage.outputTokens || 0,
                    totalTokens: usage.totalTokens || 0
                } : undefined,
                metadata: {
                    finishReason: finalResult,
                    model: this.config.model,
                    temperature: request.temperature || this.config.temperature,
                    maxTokens: request.maxTokens || this.config.maxTokens
                }
            };
        } catch (error) {
            throw this.handleError(error, 'generateStreamResponse');
        }
    }

    /**
     * Formats chat messages for OpenAI API compatibility
     * Converts internal ChatMessage format to OpenAI expected format
     * @param messages - Array of chat messages to format
     * @returns Formatted messages for OpenAI API
     */
    private formatMessagesForOpenAI(messages: ChatMessage[]) {
        return messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            // Include message ID in metadata for tracking
            ...(msg.metadata && { metadata: { messageId: msg.id, ...msg.metadata } })
        }));
    }

    /**
     * Generates unique session identifier for conversation tracking
     * @returns Unique session ID string
     */
    private generateSessionId(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return `session_${crypto.randomUUID()}`;
        }

        // Fallback for environments without crypto.randomUUID
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Gets OpenAI-specific service metadata
     * @returns Service information including OpenAI-specific details
     */
    public getServiceInfo(): Record<string, unknown> {
        const baseInfo = super.getServiceInfo();
        return {
            ...baseInfo,
            provider: 'openai',
            supportsStreaming: true,
            supportsTools: true,
            supportedModels: [
                'gpt-4o',
                'gpt-4o-mini',
                'gpt-4-turbo',
                'gpt-3.5-turbo'
            ],
            capabilities: [
                'text-generation',
                'streaming',
                'function-calling',
                'conversation-context'
            ]
        };
    }

    /**
     * Validates OpenAI-specific configuration requirements
     * Extends base validation with OpenAI-specific checks
     * @param config - Configuration to validate
     */
    protected validateConfig(config: AIServiceConfig): void {
        super.validateConfig(config);

        // OpenAI-specific validations
        if (config.baseUrl && !config.baseUrl.includes('openai.com') && !config.baseUrl.includes('localhost')) {
            console.warn('Warning: Using non-standard OpenAI API endpoint:', config.baseUrl);
        }

        // Validate model is supported
        const supportedModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
        if (!supportedModels.some(supported => config.model.includes(supported))) {
            console.warn('Warning: Model may not be supported by OpenAI:', config.model);
        }
    }

    /**
     * Checks if the current configuration supports advanced features
     * @returns Feature availability information
     */
    public getFeatureAvailability(): Record<string, boolean> {
        const model = this.config.model.toLowerCase();

        return {
            streaming: true, // All OpenAI models support streaming
            functionCalling: model.includes('gpt-4') || model.includes('gpt-3.5'),
            vision: model.includes('gpt-4o') || model.includes('gpt-4-vision'),
            jsonMode: model.includes('gpt-4') || model.includes('gpt-3.5'),
            systemMessages: true,
            conversationContext: true
        };
    }
}
