# FINAL TIER & PATH STRATEGY

**Updated:** 2025-12-31  
**Purpose:** Finalized tier rules, path switching policy, and Pro team features  
**Status:** Ready for implementation

---

## 🎯 FINAL TIER RULES

### Starter (Free)

**Path Access:**
- ✅ Choose ONE path during onboarding (Professional OR Entrepreneur)
- ✅ Can switch paths **ONE TIME ONLY** (maximum)
- ❌ Cannot access both paths simultaneously

**Switch Rules:**
- Must complete verification prompt: "Are you sure? This is your only path switch on the Starter plan."
- Must complete mini-onboarding for new path (collect necessary data)
- After 1 switch, path is LOCKED (upgrade to Plus required for any further changes)

**Upgrade Path:**
- "Want to switch paths again or access both? Upgrade to Plus for unlimited path switching."

---

### Plus ($15/month)

**Path Access:**
- ✅ **FULL access to BOTH paths** (Professional AND Entrepreneur)
- ✅ Unlimited path switching
- ✅ All path-specific features unlocked

**Feature Limits (from tier blueprints):**
- Resume Builder: 5/month
- Application Assistant: 15/month
- Interview Prep: 3/month
- Life Plan Regenerations: 4/month
- BMB (Build My Business): Full access
- BMC (Build My Career): Full access

**Switch Rules:**
- Switch anytime, unlimited
- Must complete mini-onboarding for new path (if first time visiting)
- No verification prompt needed (unlimited switches)

**Upgrade Path:**
- "Unlock Team Accounts + Advanced Features. Upgrade to Pro for business/team features."

---

### Pro ($25/month)

**Path Access:**
- ✅ **FULL access to BOTH paths** (same as Plus)
- ✅ Unlimited path switching
- ✅ All path-specific features unlocked

**Feature Limits (from tier blueprints):**
- Resume Builder: 10/month
- Application Assistant: 30/month
- Interview Prep: 6/month
- Life Plan Regenerations: 8/month
- BMB: Full access + advanced analytics
- BMC: Full access + advanced analytics

**🆕 PRO-EXCLUSIVE: Team Accounts**
- Business Owner features (see below)
- Employee invitation system
- Team management dashboard
- Advanced Power Profile (20-30 deep questions)
- Weekly AI check-ins
- Priority support

---

## 🏢 PRO TEAM ACCOUNTS (B2B Feature)

### The Concept

**Who it's for:**
- **Entrepreneur path users** who own businesses and have employees
- **Professional path users** who manage teams and want to provide development tools

**What it does:**
- Pro subscriber becomes "Team Owner"
- Can invite team members/employees to join
- Team members get **Professional path access** included in owner's Pro subscription
- Team members are sub-accounts (not full independent accounts)

---

### Implementation Model: "Pro + Seats"

**Pro Base Plan ($25/month):**
- Team Owner gets full Pro access (both paths, all features)
- Includes **3 team member seats** at no additional cost

**Additional Seats:**
- $5/month per additional team member
- Or bundled: 10 seats = $75/month total ($25 base + $50 for 7 additional seats)

**Example Pricing:**
```
Pro (Solo):           $25/month — Owner only, both paths, all features
Pro (Team of 3):      $25/month — Owner + 3 employees included
Pro (Team of 10):     $60/month — Owner + 10 employees ($25 + $35 for 7 additional)
Pro (Team of 25):     $135/month — Owner + 25 employees ($25 + $110 for 22 additional)
```

**Why this pricing works:**
- Competitive with corporate training platforms ($50-100/employee/month typical)
- Creates network effects (one sale = multiple active users)
- Recurring revenue scales with business growth
- Team owner pays, gets tax deduction (business expense)

---

### Team Member Experience

**Team Member Account Type:**
- Email invitation from Team Owner
- Creates account (or links existing Starter account)
- Automatically assigned to **Professional path**
- Gets access to Professional features based on Team Owner's plan (Pro tier features)

**Team Member Restrictions:**
- ✅ Full Professional path access (BMC, Jobs, Courses, Plan, etc.)
- ❌ Cannot access Entrepreneur path (unless they upgrade to their own Plus/Pro)
- ❌ Cannot switch to Entrepreneur path
- ❌ Cannot invite their own team members (not a Team Owner)
- ❌ Account deactivates if Team Owner cancels Pro or removes them

**Team Member Benefits:**
- Resume Builder (10/month - Pro limits)
- Application Assistant (30/month - Pro limits)
- Interview Prep (6/month - Pro limits)
- BMC (Build My Career) - Full access
- Life Plan - Professional focus
- Courses - Professional catalog

---

### Team Owner Dashboard

**Pro Tier adds "Team" tab to navigation:**

**Team Management Features:**
1. **Invite Members**
   - Enter email addresses
   - Send invitations
   - Track pending/accepted invites

2. **View Team Roster**
   - List of all team members
   - Status (active, pending, inactive)
   - Last active date
   - Usage stats (optional)

3. **Assign Licenses**
   - Allocate seat to team member
   - Remove access (deactivate seat)
   - Reallocate seats

4. **Team Analytics** (Optional Pro Feature)
   - How many team members actively using tools
   - Most popular features
   - Team progress metrics
   - Aggregate reporting (no individual PII)

5. **Billing Management**
   - See current seat count
   - Add/remove seats
   - View invoice
   - Upgrade to higher team tier

---

### Database Schema

```sql
-- Add team owner flag to profiles
ALTER TABLE profiles ADD COLUMN is_team_owner boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN team_owner_id uuid REFERENCES auth.users(id);

-- Team subscriptions (tracks seat count)
CREATE TABLE team_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('pro')), -- Only Pro has teams
  base_seats_included integer DEFAULT 3,
  additional_seats_purchased integer DEFAULT 0,
  total_seats integer GENERATED ALWAYS AS (base_seats_included + additional_seats_purchased) STORED,
  seats_used integer DEFAULT 0,
  stripe_subscription_id text,
  status text CHECK (status IN ('active', 'past_due', 'canceled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members (invited users)
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'inactive', 'removed')),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  removed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(team_owner_id, member_email)
);

-- Team invitations
CREATE TABLE team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  invitation_token text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz
);

-- RLS policies
ALTER TABLE team_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Team owners can see their own team data
CREATE POLICY "Team owners access own subscription" ON team_subscriptions
  FOR ALL USING (auth.uid() = owner_user_id);

CREATE POLICY "Team owners manage own members" ON team_members
  FOR ALL USING (auth.uid() = team_owner_id);

CREATE POLICY "Team members see own record" ON team_members
  FOR SELECT USING (auth.uid() = member_user_id);

CREATE POLICY "Team owners manage invitations" ON team_invitations
  FOR ALL USING (auth.uid() = team_owner_id);
```

---

### User Flows

#### Flow 1: Pro User Invites Team Member

1. Pro user (Entrepreneur path, business owner) goes to "Team" tab
2. Clicks "Invite Team Member"
3. Enters employee email(s)
4. System sends email invitation with magic link
5. Employee clicks link, creates account (or logs in if existing)
6. Employee is automatically assigned Professional path
7. Employee completes Professional mini-onboarding
8. Employee gets Pro-tier limits for Professional features
9. Team owner sees employee in roster (status: active)

#### Flow 2: Team Member Experience

1. Receives invitation email
2. Creates account via invitation link
3. Automatically assigned to Professional path (cannot choose Entrepreneur)
4. Completes Professional mini-onboarding (employment status, career goals, etc.)
5. Gets full Professional path access with Pro limits
6. If tries to switch to Entrepreneur → blocked with message:
   - "Entrepreneur path is not available on your team account. To access Entrepreneur features, upgrade to your own Plus or Pro plan."

#### Flow 3: Team Owner Removes Member

1. Team owner goes to Team roster
2. Clicks "Remove" on team member
3. Confirmation: "This will deactivate [name]'s access. Continue?"
4. Team member account is deactivated
5. Team member can no longer log in (or logs in to see upgrade prompt)
6. Seat is freed up for new invitations

---

## 🔒 PATH SWITCHING: DETAILED RULES

### Onboarding Path Choice (New Users)

**Path Choice Page:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome to Felon Entrepreneur

Choose your path to get personalized guidance:

┌─────────────────────────────────────────────┐
│ 🏢 Professional                             │
│                                             │
│ Level up and become the employee, manager,  │
│ supervisor, president or CEO that is        │
│ irreplaceable and the company you work for  │
│ can't live without.                         │
│                                             │
│ [Choose Professional]                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🚀 Entrepreneur                             │
│                                             │
│ Launch into the life of passionate business │
│ adventure that you can't stop thinking      │
│ about and build an empire and a legacy.     │
│                                             │
│ [Choose Entrepreneur]                       │
└─────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: PATH SWITCHING RULES

• Starter Plan: You can switch paths ONCE. After that, your 
  path is locked unless you upgrade to Plus.

• Plus Plan: Unlimited path switching. Full access to both 
  Professional and Entrepreneur features.

• Pro Plan: Unlimited path switching + Team Accounts for 
  business owners to add employees.

Choose carefully, but don't worry — you can always upgrade!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Switching Paths (Existing Users)

**Starter User (First Switch - Allowed):**

1. User goes to Settings → "Switch Path"
2. Sees current path + option to switch
3. Clicks "Switch to Entrepreneur" (or Professional)
4. **Verification Modal:**
   ```
   ⚠️ Confirm Path Switch

   You are about to switch from Professional to Entrepreneur.

   IMPORTANT: This is your only path switch on the Starter plan.
   After this switch, you will NOT be able to switch back unless 
   you upgrade to Plus.

   Your Life Plan will be regenerated for the Entrepreneur path.
   
   [ Cancel ]  [ Yes, Switch Path (Final) ]
   ```
5. User confirms
6. Path switch recorded in database
7. User redirected to mini-onboarding for new path
8. Mini-onboarding completed (collect path-specific data)
9. Life Plan regenerated with new path
10. User sees new path experience

**Starter User (Second Switch Attempt - Blocked):**

1. User (already switched once) tries to switch again
2. **Blocked Modal:**
   ```
   🔒 Path Switch Not Available

   You have already used your one path switch on the Starter plan.

   To switch paths again or access both paths simultaneously:

   [Upgrade to Plus - $15/month]

   Plus includes:
   • Unlimited path switching
   • Full access to both Professional and Entrepreneur features
   • Resume Builder (5/month)
   • Application Assistant (15/month)
   • Interview Prep (3/month)

   [ Cancel ]  [ Upgrade to Plus ]
   ```

**Plus/Pro User (Unlimited Switches):**

1. User goes to Settings → "Switch Path"
2. Sees current path + option to switch
3. Clicks "Switch to Entrepreneur" (or Professional)
4. **Simple Confirmation:**
   ```
   Switch Path?

   You are about to switch to Entrepreneur.
   
   Your Life Plan will be regenerated for this path.
   You can switch back anytime (unlimited switches on Plus/Pro).

   [ Cancel ]  [ Switch Path ]
   ```
5. User confirms
6. Redirected to mini-onboarding for new path (if first time)
7. Life Plan regenerated
8. User sees new path experience

---

### Mini-Onboarding on Path Switch

**Why it's necessary:**
- Each path needs different data to function properly
- Professional needs: employment status, career goals, industry
- Entrepreneur needs: business idea, stage, funding approach

**What happens:**

1. User confirms path switch
2. Redirected to `/onboarding/path-switch?new_path=entrepreneur`
3. Sees mini-onboarding (3-5 questions specific to new path)
4. Questions automatically saved to `user_path_preferences`
5. Life Plan generation triggers (uses new path data)
6. User redirected to dashboard with new path active

**Professional Mini-Onboarding:**
```
1. What's your current employment status?
   [ ] Employed (want to advance)
   [ ] Employed (looking for new job)
   [ ] Unemployed (actively job hunting)
   [ ] Unemployed (not ready yet)

2. What's your current job title? (or "Unemployed")
   [Text input]

3. What role do you want in 1 year?
   [Text input]

4. Interested in leadership/management roles?
   [ ] Yes, that's my goal
   [ ] Open to it
   [ ] No, prefer individual contributor

5. What industry? (optional)
   [Dropdown or text input]
```

**Entrepreneur Mini-Onboarding:**
```
1. Do you have a business idea?
   [ ] No, still exploring
   [ ] Yes, exploring ideas
   [ ] Yes, have a specific idea
   [ ] Already started

2. What kind of business?
   [ ] Service-based
   [ ] Product (physical)
   [ ] Digital product/SaaS
   [ ] Mixed/Hybrid

3. Funding approach?
   [ ] Bootstrap (self-funded)
   [ ] Seeking investors
   [ ] Small business loan
   [ ] Not sure yet

4. Revenue goal?
   [ ] Side hustle ($1-2K/month)
   [ ] Replace my income
   [ ] Six figures ($100K+/year)
   [ ] Seven figures ($1M+/year)

5. What's your biggest fear? (optional)
   [Text input]
```

---

## 💾 DATABASE STORAGE CONCERNS

**Your question:** "If they can switch back and forth freely, won't that eat up our database storage?"

**Answer:** Not significantly. Here's why:

### Storage Analysis

**What gets stored on path switch:**
1. `user_path_preferences` row (< 5 KB)
2. New `life_plan_versions` row (~50-100 KB JSON)
3. Updated profile rows (user_jobs_profiles, etc.) (~5-10 KB each)

**Total per switch:** ~100-150 KB

**Scenario:** User switches paths 100 times (extreme case)
- Storage: 100 × 150 KB = 15 MB
- **Cost:** ~$0.0003 on most cloud databases (negligible)

**Reality:** Most users will switch 0-2 times ever

### Mitigation Strategies

**1. Version Retention Policy** (Recommended)

```sql
-- Keep only last 5 Life Plan versions per user
CREATE OR REPLACE FUNCTION cleanup_old_life_plan_versions()
RETURNS void AS $$
BEGIN
  DELETE FROM life_plan_versions
  WHERE id NOT IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (
        PARTITION BY user_id ORDER BY created_at DESC
      ) as rn
      FROM life_plan_versions
    ) sub
    WHERE rn <= 5
  );
END;
$$ LANGUAGE plpgsql;

-- Run nightly via cron job
```

**2. Rate Limiting** (Optional)

```typescript
// lib/tier/check-path-switch.ts

export async function canSwitchPath(userId: string, tier: string): Promise<boolean> {
  if (tier === 'starter') {
    // Check if already switched once
    const { count } = await supabase
      .from('profiles')
      .select('path_switch_count')
      .eq('user_id', userId)
      .single();
    
    return count < 1;
  }
  
  // Plus/Pro: unlimited switches, but rate-limit to prevent abuse
  const { data: recentSwitches } = await supabase
    .from('user_path_switches')
    .select('switched_at')
    .eq('user_id', userId)
    .gte('switched_at', new Date(Date.now() - 24 * 60 * 60 * 1000)); // Last 24 hours
  
  // Max 5 switches per 24 hours (prevents abuse/automation)
  return recentSwitches.length < 5;
}
```

**3. Archive Old Versions** (Advanced)

- Move Life Plan versions older than 90 days to cold storage (S3 Glacier)
- Reduces database size
- Can still retrieve if needed (just slower)

**Verdict:** Storage is not a concern. Database costs are negligible compared to subscription revenue.

---

## 📊 REVISED TIER COMPARISON TABLE

| Feature | Starter | Plus | Pro |
|---------|---------|------|-----|
| **Path Access** | 1 path (1 switch allowed) | Both paths, unlimited switches | Both paths, unlimited switches |
| **Life Plan Regenerations** | 0/month | 4/month | 8/month |
| **Resume Builder** | Locked | 5/month | 10/month |
| **Application Assistant** | 1 sample | 15/month | 30/month |
| **Interview Prep** | Locked | 3/month | 6/month |
| **BMB (Build My Business)** | Locked | Full access | Full access + analytics |
| **BMC (Build My Career)** | Locked | Full access | Full access + analytics |
| **Advanced Power Profile** | No | No | Yes (20-30 deep questions) |
| **AI Weekly Check-ins** | No | No | Yes |
| **Team Accounts** | No | No | Yes (3 seats included) |
| **Priority Support** | No | No | Yes |

**Additional Seats (Pro only):** $5/month per additional team member beyond 3 included

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Path Switching Rules

- [ ] Add `path_switch_count` to profiles table
- [ ] Add `path_switches` event tracking table
- [ ] Implement path switch verification modal (Starter vs Plus/Pro)
- [ ] Create mini-onboarding flow for path switches
- [ ] Update Settings page with "Switch Path" option
- [ ] Add tier enforcement (Starter = 1 switch max)

### Phase 2: Team Accounts (Pro Feature)

- [ ] Create database schema (team_subscriptions, team_members, team_invitations)
- [ ] Build Team Owner dashboard
- [ ] Implement invitation system (email + magic links)
- [ ] Create team member account flow
- [ ] Add seat management (add/remove members)
- [ ] Integrate with Stripe (seat-based billing)
- [ ] Add Team tab to Pro users' navigation

### Phase 3: Path-Specific Onboarding

- [ ] Create Professional mini-onboarding (5 questions)
- [ ] Create Entrepreneur mini-onboarding (5 questions)
- [ ] Trigger on first visit to path features
- [ ] Trigger on path switch
- [ ] Store data in `user_path_preferences`

### Phase 4: Team Member Experience

- [ ] Auto-assign Professional path to team members
- [ ] Block Entrepreneur path access for team members
- [ ] Apply Pro-tier limits to team member features
- [ ] Handle team member account deactivation
- [ ] Add upgrade prompt if team member wants Entrepreneur path

---

## 💰 REVENUE PROJECTION

**Scenario:** 100 Pro subscribers with teams

**Conservative:**
- 50 solo Pro users ($25/month) = $1,250/month
- 50 team Pro users with average 5 seats ($25 + $10) = $1,750/month
- **Total:** $3,000/month from 100 Pro subs

**Optimistic:**
- 30 solo Pro users ($25/month) = $750/month
- 70 team Pro users with average 10 seats ($25 + $35) = $4,200/month
- **Total:** $4,950/month from 100 Pro subs

**B2B Impact:**
- Each team account = stickier subscription (harder to cancel)
- Network effects (team members become advocates)
- Potential for enterprise/custom pricing (25+ seats)

---

## ✅ FINAL DECISIONS SUMMARY

1. **Plus and Pro:** Full access to both paths, unlimited switching ✓
2. **Starter:** 1 path, 1 switch maximum ✓
3. **Path Switch Verification:** Required for Starter, simple for Plus/Pro ✓
4. **Mini-Onboarding:** Required on path switch for proper data collection ✓
5. **Pro Team Feature:** Yes, with seat-based pricing ($5/seat beyond 3 included) ✓
6. **Database Storage:** Not a concern, can implement version retention if needed ✓

**Ready to build?** This strategy is solid, revenue-positive, and user-friendly. 🚀
