// File Path: CarFind/lib/services/base-repository.ts
// SOLID: Single Responsibility + Template Method Pattern
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';
import { ErrorFactory } from '@/lib/types/errors';

export abstract class BaseRepository<T, TInsert, TUpdate> {
    protected readonly tableName: string;
    protected readonly client: SupabaseClient;

    constructor(tableName: string, client: SupabaseClient) {
        this.tableName = tableName;
        this.client = client;
    }

    protected handleError(error: PostgrestError | null, operation: string): never {
        if (error) {
            throw ErrorFactory.database(
                operation as 'select' | 'insert' | 'update' | 'delete' | 'transaction' | 'migration',
                `Database operation failed: ${operation}`,
                this.tableName,
                false
            );
        }
        throw ErrorFactory.database(
            operation as 'select' | 'insert' | 'update' | 'delete' | 'transaction' | 'migration',
            `Unknown database error during: ${operation}`,
            this.tableName,
            false
        );
    }

    protected validateId(id: string): void {
        if (!id || id.trim().length === 0) {
            throw ErrorFactory.validation(
                'id',
                id,
                'not_empty',
                'ID is required and cannot be empty'
            );
        }
    }

    // Abstract methods to be implemented by concrete repositories
    abstract findById(id: string): Promise<T | null>;
    abstract create(data: TInsert): Promise<T>;
    abstract update(id: string, data: TUpdate): Promise<T>;
    abstract delete(id: string): Promise<void>;
}
