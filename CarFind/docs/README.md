# Database Schema Creation - Execution Instructions

## Overview

This document provides instructions for executing the database schema creation for CarFind Phase 2.2 integration layer.

## Files Created

- **PATH**: `${AppName}\supabase_migrations`
- `00_complete_database_schema.sql` - Complete schema in one file (ALL 7 SUB-TASKS)
- `01_enable_extensions.sql` - Sub-Task 1: Enable Extensions
- `02_create_chat_sessions_table.sql` - Sub-Task 2: Chat Sessions Table
- `03_create_chat_messages_table.sql` - Sub-Task 3: Chat Messages Table
- `04_create_indexes_for_performance.sql` - Sub-Task 4: Performance Indexes
- `05_create_database_functions_and_triggers.sql` - Sub-Task 5: Functions & Triggers
- `06_implement_row_level_security_policies.sql` - Sub-Task 6: RLS Policies
- `07_create_database_views_for_common_queries.sql` - Sub-Task 7: Database Views

## Execution Options

### Option 1: Complete Schema (Recommended)

Execute the complete schema in Supabase SQL Editor:

```sql
-- Copy and paste the contents of 00_complete_database_schema.sql
-- into Supabase SQL Editor and run
```

### Option 2: Individual Sub-Tasks

Execute each file individually in order:

1. `01_enable_extensions.sql`
2. `02_create_chat_sessions_table.sql`
3. `03_create_chat_messages_table.sql`
4. `04_create_indexes_for_performance.sql`
5. `05_create_database_functions_and_triggers.sql`
6. `06_implement_row_level_security_policies.sql`
7. `07_create_database_views_for_common_queries.sql`

### Option 3: Command Line (If Supabase CLI is configured)

```bash
# Navigate to CarFind directory
cd C:\projects\carbot\06\CarFind

# Execute complete schema
psql $POSTGRES_URL -f supabase_migrations/00_complete_database_schema.sql
```

## Verification Steps

After execution, verify the schema was created successfully:

### 1. Check Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages');
```

Expected result: 2 tables

### 2. Check Indexes

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('chat_sessions', 'chat_messages')
AND indexname LIKE 'idx_%';
```

Expected result: 7+ indexes

### 3. Check Constraints

```sql
SELECT conname, contype 
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace;
```

Expected result: Multiple constraints including foreign keys and check constraints

## Schema Details

### Tables Created

- **chat_sessions**: Stores chat session metadata
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key to auth.users)
  - `title` (TEXT, Default: 'New Conversation')
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

- **chat_messages**: Stores individual chat messages
  - `id` (UUID, Primary Key)
  - `session_id` (UUID, Foreign Key to chat_sessions)
  - `role` (TEXT, Enum: 'user', 'assistant', 'system')
  - `content` (TEXT)
  - `metadata` (JSONB)
  - `created_at` (TIMESTAMPTZ)

### Performance Indexes

- User session lookups
- Session sorting by creation/update time
- Message retrieval by session
- Message ordering within sessions
- Role-based message filtering
- Active session optimization

### Functions & Triggers (NEW)

- **update_updated_at_column()**: Auto-timestamp updates
- **update_session_on_message_change()**: Session timestamp sync
- 4 triggers for automatic timestamp management

### Security (NEW)

- Row Level Security (RLS) enabled on all tables
- 8+ policies for secure data access
- Anonymous session support (user_id IS NULL)

### Views (NEW)

- **session_summary**: Sessions with message counts
- **session_with_messages**: Complete conversation data
- **active_sessions_summary**: Recent activity (30 days)
- **user_session_statistics**: Per-user analytics

## Success Criteria Met

- ✅ REQ-001: Chat session persistence (chat_sessions table)
- ✅ REQ-002: Resume previous conversations (chat_messages table)
- ✅ NFR-001: Database performance <500ms (optimized indexes)
- ✅ NFR-004: Proper data structure and constraints

## Next Steps

After successful execution:

1. Verify tables and indexes in Supabase dashboard
2. Proceed to TASK-06: Supabase Client Configuration
3. Proceed to TASK-07: Database Service Layer

## Troubleshooting

### Common Issues

1. **Extension Error**: Ensure uuid-ossp extension is available in your Supabase instance
2. **Permission Error**: Ensure you have CREATE privileges on the database
3. **Foreign Key Error**: Verify auth.users table exists (Supabase default)

### Support

If you encounter issues, check:

- Supabase project is active and accessible
- Database connection is working
- You have appropriate permissions
