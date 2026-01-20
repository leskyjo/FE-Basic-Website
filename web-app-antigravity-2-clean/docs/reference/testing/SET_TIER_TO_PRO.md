# Set Your Tier to Pro for Testing

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click "Table Editor" in the left sidebar
3. Select the `profiles` table
4. Find your row (look for your preferred name or email)
5. Click to edit that row
6. Change the `tier` column value from `starter` to `pro`
7. Save the change
8. Refresh your app

## Option 2: Via SQL Editor

1. Go to Supabase → SQL Editor
2. Paste this query (replace with YOUR email):

```sql
-- Update YOUR profile to Pro tier
UPDATE profiles
SET tier = 'pro'
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT user_id, preferred_name, email, tier
FROM profiles
WHERE email = 'your-email@example.com';
```

3. Run the query
4. Refresh your app

## Option 3: Update ALL Users to Pro (for testing)

If you're the only user in your dev environment:

```sql
UPDATE profiles SET tier = 'pro';
```

## After Setting to Pro

Once your tier is set to `pro`, the FE Coach will:
- ✅ Show NO credit counter (unlimited)
- ✅ Allow unlimited messages
- ✅ NOT show upgrade prompts

## Current Tier Logic

The app determines tier from the `profiles.tier` column:
- **starter** = 10 FE Coach messages/week (tracked in `starter_ai_credits_remaining`)
- **trial** = Unlimited during trial period
- **plus** = Unlimited ($15/mo)
- **pro** = Unlimited + extra features ($25/mo)

## Tier Values

Valid tier values in database:
- `starter` (default for new users)
- `trial`
- `plus`
- `pro`
