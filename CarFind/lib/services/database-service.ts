// File Path: CarFind/lib/services/database-service.ts
// SOLID: Single Responsibility + Interface Segregation
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SessionRepository, SessionQueryOptions } from './session-repository';
import { MessageRepository, MessageQueryOptions } from './message-repository';
import {
  ChatSession,
  ChatMessage,
  ChatSessionInsert,
  ChatMessageInsert,
} from '@/lib/supabase/utils';

export interface DatabaseService {
  // Session operations
  createSession(
    session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ChatSession>;
  getSession(sessionId: string): Promise<ChatSession | null>;
  updateSession(
    sessionId: string,
    updates: Partial<ChatSessionInsert>,
  ): Promise<ChatSession>;
  deleteSession(sessionId: string): Promise<void>;
  getUserSessions(
    userId: string,
    options?: SessionQueryOptions,
  ): Promise<ChatSession[]>;

  // Message operations
  saveMessage(
    message: Omit<ChatMessageInsert, 'id' | 'created_at'>,
  ): Promise<ChatMessage>;
  getSessionMessages(
    sessionId: string,
    options?: MessageQueryOptions,
  ): Promise<ChatMessage[]>;
  deleteMessage(messageId: string): Promise<void>;

  // Combined operations
  createSessionWithMessage(
    session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>,
    message: Omit<ChatMessageInsert, 'id' | 'session_id' | 'created_at'>,
  ): Promise<{ session: ChatSession; message: ChatMessage }>;
  getCompleteSession(
    sessionId: string,
  ): Promise<{ session: ChatSession; messages: ChatMessage[] } | null>;
}

export class SupabaseDatabaseService implements DatabaseService {
  private sessionRepository: SessionRepository;
  private messageRepository: MessageRepository;
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client = client || createClient();
    this.sessionRepository = new SessionRepository(this.client);
    this.messageRepository = new MessageRepository(this.client);
  }

  async createSession(
    session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ChatSession> {
    return this.sessionRepository.create(session);
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.sessionRepository.findById(sessionId);
  }

  async updateSession(
    sessionId: string,
    updates: Partial<ChatSessionInsert>,
  ): Promise<ChatSession> {
    return this.sessionRepository.update(sessionId, updates);
  }

  async deleteSession(sessionId: string): Promise<void> {
    // Delete messages first due to foreign key constraint
    await this.messageRepository.deleteBySessionId(sessionId);
    await this.sessionRepository.delete(sessionId);
  }

  async getUserSessions(
    userId: string,
    options?: SessionQueryOptions,
  ): Promise<ChatSession[]> {
    return this.sessionRepository.findByUserId(userId, options);
  }

  async saveMessage(
    message: Omit<ChatMessageInsert, 'id' | 'created_at'>,
  ): Promise<ChatMessage> {
    return this.messageRepository.create(message);
  }

  async getSessionMessages(
    sessionId: string,
    options?: MessageQueryOptions,
  ): Promise<ChatMessage[]> {
    return this.messageRepository.findBySessionId(sessionId, options);
  }

  async deleteMessage(messageId: string): Promise<void> {
    return this.messageRepository.delete(messageId);
  }

  async createSessionWithMessage(
    session: Omit<ChatSessionInsert, 'id' | 'created_at' | 'updated_at'>,
    message: Omit<ChatMessageInsert, 'id' | 'session_id' | 'created_at'>,
  ): Promise<{ session: ChatSession; message: ChatMessage }> {
    // Create session first
    const createdSession = await this.createSession(session);

    // Create message with session ID
    const createdMessage = await this.saveMessage({
      ...message,
      session_id: createdSession.id,
    });

    return {
      session: createdSession,
      message: createdMessage,
    };
  }

  async getCompleteSession(
    sessionId: string,
  ): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }

    const messages = await this.getSessionMessages(sessionId, {
      sortBy: 'created_at',
      sortOrder: 'asc',
    });

    return { session, messages };
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('chat_sessions')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

// Factory function for server-side usage
export async function createDatabaseService(
  useServerClient: boolean = false,
): Promise<DatabaseService> {
  const client = useServerClient
    ? await createServerSupabaseClient()
    : createClient();
  return new SupabaseDatabaseService(client);
}

// Singleton instance for client-side usage
let clientDatabaseService: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!clientDatabaseService) {
    clientDatabaseService = new SupabaseDatabaseService();
  }
  return clientDatabaseService;
}
