-- Remove the unused rate_limits table
-- Rate limiting is handled in-memory in the edge function, making this table obsolete
-- Removing it eliminates the RLS warning and cleans up the database schema

DROP TABLE IF EXISTS public.rate_limits;