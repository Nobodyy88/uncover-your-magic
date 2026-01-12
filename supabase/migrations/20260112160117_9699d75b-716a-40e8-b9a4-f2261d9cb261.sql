-- Enable RLS on rate_limits table to prevent public access via PostgREST API
-- Service role key (used by Edge Function) automatically bypasses RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies are added, which means:
-- - anon/authenticated users: NO access (RLS enabled, no policies)
-- - service_role: Full access (bypasses RLS)
-- This protects the table from public API queries while Edge Function still works