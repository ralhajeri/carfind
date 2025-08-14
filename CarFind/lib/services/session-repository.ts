// File Path: CarFind/lib/services/session-repository.ts
// SOLID: Single Responsibility + Interface Segregation
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import {
  ChatSession,
  ChatSessionInsert,
  ChatSessionUpdate,
} from '@/lib/supabase/utils';
import { ErrorFactory } from '@/lib/types/errors';

export interface SessionQueryOptions {
  userId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface SessionWithMessageCount extends ChatSession {
  message_count: number;
  last_message_at: string | null;
}

export class SessionRepository extends BaseRepository<
  ChatSession,
  ChatSessionInsert,
  ChatSessionUpdate
> {
  constructor(client: SupabaseClient) {
    super('chat_sessions', client);
  }

  async findById(id: string): Promise<ChatSession | null> {
    this.validateId(id);

    const { data, error } = await this.client
      .from('chat_sessions')
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

  async create(data: ChatSessionInsert): Promise<ChatSession> {
    // Validate required fields
    if (!data.title || data.title.trim().length === 0) {
      throw ErrorFactory.validation(
        'title',
        data.title,
        'not_empty',
        'Session title is required',
      );
    }

    const { data: session, error } = await this.client
      .from('chat_sessions')
      .insert(data)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    return session!;
  }

  async update(id: string, data: ChatSessionUpdate): Promise<ChatSession> {
    this.validateId(id);

    const { data: session, error } = await this.client
      .from('chat_sessions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    if (!session) {
      throw ErrorFactory.validation(
        'sessionId',
        id,
        'exists',
        'Session not found',
      );
    }

    return session;
  }

  async delete(id: string): Promise<void> {
    this.validateId(id);

    const { error } = await this.client
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'delete');
    }
  }

  async findMany(options: SessionQueryOptions = {}): Promise<ChatSession[]> {
    let query = this.client.from('chat_sessions').select('*');

    // Apply filters
    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options.searchTerm) {
      query = query.ilike('title', `%${options.searchTerm}%`);
    }

    // Apply sorting
    const sortBy = options.sortBy || 'updated_at';
    const sortOrder = options.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 50) - 1,
      );
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return data || [];
  }

  async findByUserId(
    userId: string,
    options: Omit<SessionQueryOptions, 'userId'> = {},
  ): Promise<ChatSession[]> {
    return this.findMany({ ...options, userId });
  }

  async findWithMessageCounts(
    options: SessionQueryOptions = {},
  ): Promise<SessionWithMessageCount[]> {
    let query = this.client.from('session_summary').select('*');

    // Apply filters
    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options.searchTerm) {
      query = query.ilike('title', `%${options.searchTerm}%`);
    }

    // Apply sorting
    const sortBy = options.sortBy || 'updated_at';
    const sortOrder = options.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 50) - 1,
      );
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'findWithMessageCounts');
    }

    return data || [];
  }
}
