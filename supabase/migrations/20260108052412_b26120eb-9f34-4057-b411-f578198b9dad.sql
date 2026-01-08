-- Fix RESTRICTIVE SELECT policies on page_contents table
-- The current setup uses RESTRICTIVE policies which use AND logic, blocking public access

-- Drop the existing RESTRICTIVE SELECT policies
DROP POLICY IF EXISTS "Admins can read all pages" ON public.page_contents;
DROP POLICY IF EXISTS "Published pages are publicly readable" ON public.page_contents;

-- Create PERMISSIVE policies that use OR logic
-- Public users can see published pages
CREATE POLICY "Published pages are publicly readable" ON public.page_contents
  AS PERMISSIVE
  FOR SELECT
  USING (is_published = true);

-- Admins can see all pages (including drafts)
CREATE POLICY "Admins can read all pages" ON public.page_contents
  AS PERMISSIVE
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));