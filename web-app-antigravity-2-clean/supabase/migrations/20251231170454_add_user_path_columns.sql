-- Add path tracking columns to profiles table
-- This supports the new Professional vs Entrepreneur path choice

-- Add user_path column (current active path)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_path text CHECK (user_path IN ('professional', 'entrepreneur'));

-- Add primary_path column (first chosen path, for Plus tier BMB/BMC access)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_path text CHECK (primary_path IN ('professional', 'entrepreneur'));

-- Add path_switch_count (for Starter tier enforcement: max 1 switch)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS path_switch_count integer NOT NULL DEFAULT 0;

-- Create table to track path switches (audit log)
CREATE TABLE IF NOT EXISTS public.user_path_switches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_path text CHECK (from_path IN ('professional', 'entrepreneur')),
  to_path text NOT NULL CHECK (to_path IN ('professional', 'entrepreneur')),
  tier_at_time text NOT NULL,
  switched_at timestamptz DEFAULT now()
);

-- Enable RLS on path switches table
ALTER TABLE public.user_path_switches ENABLE ROW LEVEL SECURITY;

-- Users can only view their own path switches
DROP POLICY IF EXISTS "user_path_switches_self_access" ON public.user_path_switches;
CREATE POLICY "user_path_switches_self_access" ON public.user_path_switches
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster path switch queries
CREATE INDEX IF NOT EXISTS idx_user_path_switches_user_id 
ON public.user_path_switches(user_id);

-- Add index for counting monthly switches (rate limiting)
CREATE INDEX IF NOT EXISTS idx_user_path_switches_user_date 
ON public.user_path_switches(user_id, switched_at);
