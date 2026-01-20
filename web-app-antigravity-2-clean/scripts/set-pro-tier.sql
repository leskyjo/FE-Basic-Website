-- Update your profile to Pro tier for testing
-- Run this in Supabase SQL Editor

-- First, let's see your current profile
SELECT user_id, preferred_name, email, tier, starter_ai_credits_remaining, onboarding_step
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- Update YOUR profile to Pro tier (replace YOUR_EMAIL with your actual email)
UPDATE profiles
SET tier = 'pro'
WHERE email = 'YOUR_EMAIL_HERE@example.com';

-- Verify the update
SELECT user_id, preferred_name, email, tier, starter_ai_credits_remaining
FROM profiles
WHERE email = 'YOUR_EMAIL_HERE@example.com';

-- Alternative: If you want to update ALL users to Pro for testing
-- UPDATE profiles SET tier = 'pro';
