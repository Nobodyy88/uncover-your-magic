-- Add restrictive policies to block all write operations on admin_users table
-- This prevents privilege escalation by blocking users from adding themselves as admins

-- Block all INSERT operations (admins must be added manually via SQL/dashboard)
CREATE POLICY "Block admin user inserts" ON public.admin_users
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Block all UPDATE operations  
CREATE POLICY "Block admin user updates" ON public.admin_users
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (false);

-- Block all DELETE operations
CREATE POLICY "Block admin user deletes" ON public.admin_users
  AS RESTRICTIVE
  FOR DELETE
  TO authenticated
  USING (false);

-- Also block anonymous users from any write operations
CREATE POLICY "Block anon admin inserts" ON public.admin_users
  AS RESTRICTIVE
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "Block anon admin updates" ON public.admin_users
  AS RESTRICTIVE
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "Block anon admin deletes" ON public.admin_users
  AS RESTRICTIVE
  FOR DELETE
  TO anon
  USING (false);