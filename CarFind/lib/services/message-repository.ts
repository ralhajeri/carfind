// File Path: CarFind/lib/services/message-repository.ts
// SOLID: Single Responsibility + Interface Segregation
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import {
  ChatMessage,
  ChatMessageInsert,
  ChatMessageUpdate,
} from '@/lib/supabase/utils';
import { ErrorFactory } from '@/lib/types/errors';

export interface MessageQueryOptions {
  sessionId?: string;
  role?: 'user' | 'assistant' | 'system';
  limit?: number;
  offset?: number;
  sortBy?: 'created_at';
  sortOrder?: 'asc' | 'desc';
  fromDate?: string;
  toDate?: string;
}

export class MessageRepository extends BaseRepository<
  ChatMessage,
  ChatMessageInsert,
  ChatMessageUpdate
> {
  constructor(client: SupabaseClient) {
    super('chat_messages', client);
  }

  async findById(id: string): Promise<ChatMessage | null> {
    this.validateId(id);

    const { data, error } = await this.client
      .from('chat_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      this.handleError(error, 'findById');
    }

    return data;
  }

  async create(data: ChatMessageInsert): Promise<ChatMessage> {
    // Validate required fields
    if (!data.session_id) {
      throw ErrorFactory.validation(
        'session_id',
        data.session_id,
        'not_empty',
        'Session ID is required',
      );
    }

    if (!data.content || data.content.trim().length === 0) {
      throw ErrorFactory.validation(
        'content',
        data.content,
        'not_empty',
        'Message content is required',
      );
    }

    if (!['user', 'assistant', 'system'].includes(data.role)) {
      throw ErrorFactory.validation(
        'role',
        data.role,
        'valid_enum',
        'Invalid message role',
      );
    }

    const { data: message, error } = await this.client
      .from('chat_messages')
      .insert(data)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    return message!;
  }

  async update(id: string, data: ChatMessageUpdate): Promise<ChatMessage> {
    this.validateId(id);

    const { data: message, error } = await this.client
      .from('chat_messages')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    if (!message) {
      throw ErrorFactory.validation(
        'messageId',
        id,
        'exists',
        'Message not found',
      );
    }

    return message;
  }

  async delete(id: string): Promise<void> {
    this.validateId(id);

    const { error } = await this.client
      .from('chat_messages')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'delete');
    }
  }

  async findMany(options: MessageQueryOptions = {}): Promise<ChatMessage[]> {
    let query = this.client.from('chat_messages').select('*');

    // Apply filters
    if (options.sessionId) {
      query = query.eq('session_id', options.sessionId);
    }

    if (options.role) {
      query = query.eq('role', options.role);
    }

    if (options.fromDate) {
      query = query.gte('created_at', options.fromDate);
    }

    if (options.toDate) {
      query = query.lte('created_at', options.toDate);
    }

    // Apply sorting
    const sortBy = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 100) - 1,
      );
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return data || [];
  }

  async findBySessionId(
    sessionId: string,
    options: Omit<MessageQueryOptions, 'sessionId'> = {},
  ): Promise<ChatMessage[]> {
    this.validateId(sessionId);
    return this.findMany({ ...options, sessionId });
  }

  async createMany(messages: ChatMessageInsert[]): Promise<ChatMessage[]> {
    if (!messages || messages.length === 0) {
      throw ErrorFactory.validation(
        'messages',
        messages,
        'not_empty',
        'Messages array cannot be empty',
      );
    }

    // Validate all messages
    messages.forEach((message, index) => {
      if (!message.session_id) {
        throw ErrorFactory.validation(
          `messages[${index}].session_id`,
          message.session_id,
          'not_empty',
          `Session ID is required for message at index ${index}`,
        );
      }
      if (!message.content || message.content.trim().length === 0) {
        throw ErrorFactory.validation(
          `messages[${index}].content`,
          message.content,
          'not_empty',
          `Content is required for message at index ${index}`,
        );
      }
    });

    const { data, error } = await this.client
      .from('chat_messages')
      .insert(messages)
      .select();

    if (error) {
      this.handleError(error, 'createMany');
    }

    return data || [];
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    this.validateId(sessionId);

    const { error } = await this.client
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      this.handleError(error, 'deleteBySessionId');
    }
  }

  async getMessageCount(sessionId: string): Promise<number> {
    this.validateId(sessionId);

    const { count, error } = await this.client
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    if (error) {
      this.handleError(error, 'getMessageCount');
    }

    return count || 0;
  }
}
