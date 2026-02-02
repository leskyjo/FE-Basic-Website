-- Fix RLS policy for profiles table to allow updates to new columns
-- The issue: After adding new columns, RLS needs to be refreshed

-- Drop and recreate the RLS policy to pick up new columns
DROP POLICY IF EXISTS "profiles_self_access" ON public.profiles;

CREATE POLICY "profiles_self_access" ON public.profiles
  FOR ALL
  TO public, authenticated, anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant explicit UPDATE permission on profiles table
GRANT UPDATE ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO anon;
