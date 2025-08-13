// File Path: CarFind/lib/types/chat.ts
// Chat data models with full type safety
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export interface ChatRequest {
    messages: ChatMessage[];
    sessionId?: string;
    userId?: string;
    maxTokens?: number;
    temperature?: number;
    tools?: Record<string, unknown>;
}

export interface ChatResponse {
    message: ChatMessage;
    sessionId: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    metadata?: Record<string, unknown>;
}

export interface ChatSession {
    id: string;
    userId?: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
}
