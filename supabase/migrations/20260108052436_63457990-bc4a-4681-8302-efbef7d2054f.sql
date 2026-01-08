-- Create rate_limits table for tracking request counts by IP
CREATE TABLE public.rate_limits (
  ip text PRIMARY KEY,
  count integer NOT NULL DEFAULT 1,
  last_reset bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::bigint
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write (used by edge function)
-- No policies needed as we use service role key in edge function