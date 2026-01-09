-- The rate_limits table is only accessed server-side via service_role key in Edge Functions
-- No client-side access is needed, so RLS should be disabled for this internal system table
-- This allows the contact-webhook Edge Function to properly read/update rate limit records

ALTER TABLE public.rate_limits DISABLE ROW LEVEL SECURITY;