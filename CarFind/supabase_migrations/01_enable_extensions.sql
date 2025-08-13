-- File Path: CarFind/supabase_migrations/01_enable_extensions.sql
-- Sub-Task 1: Enable Required Extensions
-- Description: Enable necessary PostgreSQL extensions for UUID generation

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security) if not already enabled
-- This is typically enabled by default in Supabase but ensuring it's available
-- Note: RLS is enabled per table, not globally

-- Verify extensions are enabled
DO $$
BEGIN
    -- Check if uuid-ossp extension is available
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
    ) THEN
        RAISE EXCEPTION 'uuid-ossp extension failed to install';
    END IF;
    
    RAISE NOTICE 'Extensions successfully enabled: uuid-ossp';
END $$;
