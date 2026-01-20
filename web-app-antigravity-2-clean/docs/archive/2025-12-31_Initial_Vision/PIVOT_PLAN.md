# PIVOT_PLAN.md

**Created:** 2025-12-31  
**Purpose:** Master architecture plan for Professional vs Entrepreneur path pivot  
**Status:** For review — blocking code changes

---

## 🎯 EXECUTIVE SUMMARY

We are replacing the 20-question onboarding questionnaire with a simple **two-path fork**:
- **Professional Path:** Employee-focused features (leveling up in jobs, management, leadership)
- **Entrepreneur Path:** Business-focused features (starting ventures, scaling, empire-building)

This is a **breaking architectural change** that affects:
- Onboarding flow (simplify dramatically)
- Life Plan generation (new "Horizons" structure: Day 1 vs Year 5)
- Jobs page (currently relies on questionnaire data)
- Plan page (currently relies on questionnaire data)
- All future features (Courses, Stories, etc.)

**The Innovation:** Progressive profiling + path-specific app experiences instead of long upfront survey.

---

## 🏗️ PART 1: THE NEW DATA MODEL

### 1.1 New Onboarding Flow

**Current Flow (Being Replaced):**
```
Auth → Verify → Preferred Name → Zip Code → 20 Questions → Generating → Complete
```

**New Flow:**
```
Auth → Verify → Preferred Name → Zip Code → PATH CHOICE → Welcome → Generating → Complete
```

### 1.2 Path Choice Card (New Step)

**UI:**
```markdown
# Welcome to Felon Entrepreneur

We are interested in accelerating your journey regardless of what type of career path you choose. Please select your path:

┌─────────────────────────────────────────────┐
│ 🏢 Professional                             │
│                                             │
│ Level up and become the employee, manager,  │
│ supervisor, president or CEO that is        │
│ irreplaceable and the company you work for  │
│ can't live without.                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🚀 Entrepreneur                             │
│                                             │
│ Launch into the life of passionate business │
│ adventure that you can't stop thinking      │
│ about and build an empire and a legacy.     │
└─────────────────────────────────────────────┘
```

**Database Storage:**
```sql
-- ADD to profiles table
ALTER TABLE profiles ADD COLUMN user_path text CHECK (user_path IN ('professional', 'entrepreneur'));
```

**Onboarding Step Mapping:**
- Step 0: Name (existing)
- Step 1: Zip (existing)
- Step 2: **Path Choice (NEW)** ← Replaces old questionnaire
- Step 3: Generating (existing, but modified)
- Step 4: Complete (existing)

---

### 1.3 Life Plan "Horizons" Structure (Replacing Timeframes)

**Current Structure (Being Deprecated):**
```json
{
  "timeframes": {
    "next_7_days": [...],
    "next_30_days": [...],
    "next_90_days": [...],
    "next_12_months": [...]
  }
}
```

**New "Horizons" Structure:**
```json
{
  "horizons": {
    "day_1": {
      "headline": "Your first move starts today",
      "priority_actions": [
        {
          "title": "...",
          "description": "...",
          "why_it_matters": "...",
          "estimated_time": "15-30 minutes",
          "category": "employment" | "mindset" | "skills",
          "completion_criteria": "..."
        }
      ]
    },
    "year_5": {
      "headline": "Where you'll be 5 years from now",
      "vision_statement": "...",
      "milestones": [
        {
          "milestone": "...",
          "estimated_timeline": "Month 6", "Month 18", "Year 3", etc.
          "success_indicators": [...]
        }
      ]
    }
  }
}
```

**Why This is Better:**
- **Day 1:** Immediate actionable clarity (no analysis paralysis)
- **Year 5:** Aspirational vision (motivational, long-term thinking)
- Eliminates the "30-day vs 90-day" overlapping complexity
- Aligns with behavioral psychology (what to do TODAY vs where you'll BE)

---

### 1.4 Path-Specific Data Storage

**New Tables:**

```sql
-- Track path-specific feature preferences (discovered over time)
CREATE TABLE user_path_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_path text NOT NULL CHECK (user_path IN ('professional', 'entrepreneur')),
  
  -- Professional-specific
  current_job_title text,
  desired_job_title text,
  target_company_size text CHECK (target_company_size IN ('startup', 'midsize', 'enterprise', 'government')),
  career_growth_timeline text CHECK (career_growth_timeline IN ('asap', '1_year', '3_years', '5_years')),
  leadership_interest boolean DEFAULT false,
  
  -- Entrepreneur-specific
  business_idea_status text CHECK (business_idea_status IN ('no_idea', 'exploring', 'have_idea', 'already_started')),
  business_model_preference text CHECK (business_model_preference IN ('service', 'product', 'digital', 'physical', 'hybrid')),
  funding_approach text CHECK (funding_approach IN ('bootstrap', 'investors', 'loans', 'mixed')),
  target_revenue_goal text CHECK (target_revenue_goal IN ('side_hustle', 'replace_income', 'six_figures', 'multi_six', 'seven_plus')),
  
  -- Common (both paths)
  skills_want_to_develop text[],
  biggest_fear text,
  support_network_quality text CHECK (support_network_quality IN ('none', 'weak', 'moderate', 'strong')),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_path_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own path preferences" ON user_path_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_user_path_preferences
BEFORE UPDATE ON user_path_preferences
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

### 1.5 Progressive Profiling Strategy

**Core Principle:** Collect data **just-in-time** when user engages with a feature.

#### When User First Visits Jobs Page:

**IF path = 'professional':**
```
Show mini-questionnaire (3-5 questions):
1. What's your current job title? (or "Unemployed")
2. What role do you want? (text input)
3. How soon? (ASAP / 1 year / 3 years / 5 years)
4. Interested in leadership roles? (Yes / Not yet / Never)
5. [OPTIONAL] Any specific companies you dream of working for?

Save to `user_path_preferences` → THEN show jobs
```

**IF path = 'entrepreneur':**
```
Show mini-questionnaire (3-5 questions):
1. Do you have a business idea? (No / Exploring / Yes, I have one / Already started)
2. What kind of business? (Service / Product / Digital / Physical / Mix)
3. How will you fund it? (Bootstrap / Investors / Loans / Not sure)
4. Revenue goal? (Side hustle $1-2K/mo / Replace income / Six figures / Multi-six / $1M+)
5. [OPTIONAL] What's your biggest fear about starting?

Save to `user_path_preferences` → THEN show jobs (entrepreneur-focused listings)
```

#### When User First Visits Courses Page:

**IF path = 'professional':**
```
Show mini-questionnaire (2-3 questions):
1. What skills do you want to develop? (multi-select: Leadership, Communication, Tech, Industry-specific, etc.)
2. How do you learn best? (Video / Reading / Hands-on / Coaching)
3. How much time per day? (<30min / 1-2hr / 3-5hr / 6+hr)

Save to `user_course_preferences` → Filter courses to professional development
```

**IF path = 'entrepreneur':**
```
Show mini-questionnaire (2-3 questions):
1. What skills do you want to learn? (multi-select: Marketing, Sales, Operations, Finance, Product Development, etc.)
2. How do you learn best? (Video / Reading / Hands-on / Coaching)
3. How much time per day? (<30min / 1-2hr / 3-5hr / 6+hr)

Save to `user_course_preferences` → Filter courses to business/entrepreneurship
```

**Key Insight:** Users don't mind answering 3-5 questions **when they're about to use the feature**. They hate 20 questions **before** they see any value.

---

## 🔄 PART 2: MIGRATION STRATEGY

### 2.1 The Backward Compatibility Problem

**Current State:**
- Users who completed 20-question onboarding have data in `questionnaire_answers` table
- Life Plan generation expects 20 questions worth of data
- Jobs page and Plan page pull from profiles table fields populated by those 20 questions

**Challenge:**
- We can't delete `questionnaire_answers` table (would break existing users)
- We can't immediately stop using it (would break Life Plan generation)
- We need a **transition period**

---

### 2.2 Migration Approach: The "Path Retrofit"

**Phase 1: Add Path Column (Non-Breaking)**

```sql
-- Migration: 20251231_add_user_path.sql
ALTER TABLE profiles ADD COLUMN user_path text CHECK (user_path IN ('professional', 'entrepreneur'));

-- For existing users (who completed 20 questions), infer path from Q2
UPDATE profiles p
SET user_path = CASE
  WHEN EXISTS (
    SELECT 1 FROM questionnaire_answers qa
    WHERE qa.user_id = p.user_id
    AND qa.question_id = 'q2_desired_employment'
    AND (qa.answer_value LIKE '%business%' OR answer_value LIKE '%entrepreneur%' OR answer_value LIKE '%self-employed%')
  ) THEN 'entrepreneur'
  ELSE 'professional'
END
WHERE user_path IS NULL;

-- Set default for NEW users (will be overwritten when they choose)
ALTER TABLE profiles ALTER COLUMN user_path SET DEFAULT 'professional';
```

**Phase 2: Create New Path Preferences Table**

```sql
-- Migration: 20251231_user_path_preferences.sql
CREATE TABLE user_path_preferences (
  -- (Schema from section 1.4 above)
);
```

**Phase 3: Dual-Mode Life Plan Generation**

```typescript
// lib/ai/life-plan-prompts.ts

export async function buildLifePlanUserPrompt(
  userId: string,
  userPath: 'professional' | 'entrepreneur',
  questionnaireAnswers?: Record<string, any>, // OPTIONAL now
  pathPreferences?: UserPathPreferences // NEW
): Promise<string> {
  
  // NEW USERS (path-based, minimal data)
  if (!questionnaireAnswers || Object.keys(questionnaireAnswers).length < 10) {
    return buildPathBasedPrompt(userId, userPath, pathPreferences);
  }
  
  // EXISTING USERS (legacy questionnaire-based)
  return buildLegacyQuestionnairePrompt(userId, questionnaireAnswers);
}
```

**Phase 4: Feature-by-Feature Progressive Profiling**

As users visit features:
- Check if `user_path_preferences` has data for that feature
- If NOT → show mini-questionnaire modal
- If YES → proceed with feature

---

### 2.3 The "Horizons" Transition

**Update Life Plan Generation Endpoint:**

```typescript
// app/api/life-plan/generate/route.ts

export async function POST(req: Request) {
  // ... auth, tier checks, etc.
  
  const userPath = profile.user_path; // 'professional' or 'entrepreneur'
  
  // Call OpenAI with path-aware prompt
  const prompt = buildPathBasedPrompt(userId, userPath, pathPreferences);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: getPathSpecificSystemPrompt(userPath) },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  
  const lifePlan = JSON.parse(completion.choices[0].message.content);
  
  // Save with NEW structure (horizons instead of timeframes)
  await supabase.from("life_plan_versions").insert({
    user_id: userId,
    plan_json: lifePlan, // Contains "horizons" now
    model: "gpt-4o",
    // ...
  });
}
```

**Update Plan Page Display:**

```typescript
// app/app/plan/page.tsx

export default async function PlanPage() {
  const lifePlan = await getLifePlan(userId);
  
  // Check if new structure or old structure
  const hasHorizons = lifePlan.horizons !== undefined;
  
  if (hasHorizons) {
    return <HorizonsView plan={lifePlan} />;
  } else {
    // Legacy fallback for old plans
    return <TimeframesView plan={lifePlan} />;
  }
}
```

---

### 2.4 Jobs Page Migration

**Current Problem:**
Jobs page relies on:
- `profiles.current_employment` (from Q1)
- `profiles.desired_employment` (from Q2)
- `profiles.biggest_barrier` (from Q4)
- `user_jobs_profiles.skills_to_highlight` (extracted from Life Plan)

**Solution:**

```typescript
// app/app/jobs/page.tsx

export default async function JobsPage() {
  const { user, userPath, pathPreferences } = await getUserContext();
  
  // Check if user has completed Jobs mini-questionnaire
  if (!pathPreferences || !pathPreferences.desired_job_title) {
    // Show Jobs Onboarding Modal
    return <JobsOnboardingModal userPath={userPath} />;
  }
  
  // User has preferences → show personalized jobs
  const jobs = await searchJobs({
    query: pathPreferences.desired_job_title,
    userPath: userPath, // Filters to employee vs entrepreneur opportunities
    location: user.zip_code,
    // ...
  });
  
  return <JobsLayout jobs={jobs} userPath={userPath} />;
}
```

---

## 🎨 PART 3: PATH-SPECIFIC APP EXPERIENCES

### 3.1 The UX Philosophy

**Professional Path → Employee Mindset:**
- Jobs Tab: Traditional W-2 jobs, promotions, career ladders
- Courses: Leadership, communication, industry certifications, management skills
- Plan: Career progression (junior → senior → manager → director → VP → C-suite)
- FE Button: Daily motivation for work performance, conflict resolution, office politics
- Stories: Success stories of people who climbed corporate ladders or became irreplaceable

**Entrepreneur Path → Business Mindset:**
- Jobs Tab: Contract work, freelance gigs, side hustle opportunities, business services
- Courses: Marketing, sales, operations, product development, business models
- Plan: Business milestones (idea validation → MVP → first customer → revenue → scaling → exit)
- FE Button: Daily motivation for persistence, risk-taking, innovation
- Stories: Success stories of people who built businesses from scratch

---

### 3.2 Path-Aware Navigation Labels

**Mobile Bottom Nav (Path-Specific Icons/Labels):**

**Professional Path:**
```
Home | Career Plan | FE Button | Opportunities | Profile
```

**Entrepreneur Path:**
```
Home | Business Plan | FE Button | Ventures | Profile
```

*(Same structure, different language to match mindset)*

---

### 3.3 Path-Specific Courses Catalog

**Implementation:**

```typescript
// app/app/courses/page.tsx

export default async function CoursesPage() {
  const { userPath, coursePreferences } = await getUserContext();
  
  // Check if user completed Courses mini-questionnaire
  if (!coursePreferences) {
    return <CoursesOnboardingModal userPath={userPath} />;
  }
  
  // Filter courses by path
  const courses = await supabase
    .from("courses")
    .select()
    .contains("target_paths", [userPath]); // courses can be for ['professional'], ['entrepreneur'], or ['both']
  
  return <CoursesLayout courses={courses} userPath={userPath} />;
}
```

**Database Update:**

```sql
ALTER TABLE courses ADD COLUMN target_paths text[] DEFAULT ARRAY['professional', 'entrepreneur'];
```

---

### 3.4 Path-Aware AI Prompts

**FE Coach AI (lib/ai/fe-coach-prompts.ts):**

```typescript
export function getFECoachSystemPrompt(userPath: 'professional' | 'entrepreneur'): string {
  const basePrompt = `You are the FE Coach, a supportive AI mentor...`;
  
  if (userPath === 'professional') {
    return `${basePrompt}

You specialize in helping people excel in their careers as employees, managers, and leaders.

Your guidance focuses on:
- Navigating workplace politics and building influence
- Developing leadership and communication skills
- Negotiating promotions and raises
- Becoming indispensable to employers
- Building professional networks and mentors

When giving advice, emphasize career progression, skill development, and workplace excellence.`;
  } else {
    return `${basePrompt}

You specialize in helping people build and scale businesses from scratch.

Your guidance focuses on:
- Validating business ideas and finding product-market fit
- Marketing, sales, and customer acquisition
- Building minimal viable products (MVPs)
- Managing cash flow and bootstrapping strategies
- Scaling operations and building teams

When giving advice, emphasize entrepreneurial mindset, calculated risk-taking, and business fundamentals.`;
  }
}
```

---

## 🐳 PART 4: SUPABASE CLI + DOCKER SETUP

### 4.1 Current State Assessment

**What We Have:**
- ✅ Supabase `/migrations` folder exists (6 migrations applied)
- ✅ Supabase CLI presumably installed (migrations folder structure suggests it)
- ❌ No `supabase/config.toml` (not initialized in this project)
- ❌ Docker not installed (`which docker` returned exit code 1)

**What We Need:**
- Docker Desktop (for local Supabase instance)
- Supabase CLI (may already be installed)
- Project initialization (`supabase init`)
- Link to remote Supabase project

---

### 4.2 Setup Instructions

#### Step 1: Install Docker

**On Linux (Fedora):**

```bash
# Install Docker
sudo dnf install docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (avoid sudo for docker commands)
sudo usermod -aG docker $USER

# IMPORTANT: Log out and log back in for group changes to take effect

# Verify Docker installation
docker --version
docker-compose --version
```

#### Step 2: Check if Supabase CLI is Installed

```bash
# Check if Supabase CLI exists
which supabase
supabase --version

# If NOT installed, install it
npm install -g supabase

# Verify
supabase --version
```

#### Step 3: Initialize Supabase in Project

```bash
cd /home/leskyjo/Documents/FE\ WebApp/web-app-antigravity-2

# Initialize Supabase (creates config.toml)
supabase init

# This creates:
# - supabase/config.toml
# - Updates .gitignore
```

#### Step 4: Link to Remote Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your remote project
supabase link --project-ref <YOUR_PROJECT_REF>

# Find YOUR_PROJECT_REF in Supabase Dashboard:
# Settings → General → Reference ID
```

#### Step 5: Pull Remote Schema (Baseline)

```bash
# Pull current remote database schema to local migrations
supabase db pull

# This creates a new migration file capturing current remote state
```

#### Step 6: Start Local Supabase (Docker)

```bash
# Start local Supabase services (Postgres, Auth, Storage, etc.)
supabase start

# This will:
# - Pull Supabase Docker images
# - Start containers
# - Apply all migrations
# - Give you local URLs (Database URL, API URL, Studio URL)

# Access local Supabase Studio (database GUI)
# Usually at: http://localhost:54323
```

#### Step 7: Create New Migrations

```bash
# Create a new migration
supabase migration new add_user_path_column

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_user_path_column.sql

# Edit the file:
nano supabase/migrations/YYYYMMDDHHMMSS_add_user_path_column.sql

# Write your SQL:
ALTER TABLE profiles ADD COLUMN user_path text CHECK ...;

# Test migration locally
supabase db reset  # Resets local DB and reapplies all migrations

# Push to remote when ready
supabase db push
```

---

### 4.3 Recommended Workflow

**Daily Development:**

```bash
# Morning: Start local Supabase
supabase start

# Work on code...

# Create migration when changing schema
supabase migration new <migration_name>

# Edit migration file
# Test locally: supabase db reset

# Push to remote when ready
supabase db push

# Evening: Stop local Supabase (optional, to free resources)
supabase stop
```

**Benefits:**
- Test migrations locally before pushing to production
- See database schema in Studio UI (http://localhost:54323)
- No more copy-pasting SQL into Supabase dashboard
- Version-controlled migrations (Git tracks all schema changes)
- Rollback capability (if migration fails, you can revert)

---

### 4.4 Troubleshooting Common Issues

**"Port already in use":**
```bash
# Check what's using port 54321 (Postgres)
sudo lsof -i :54321

# Kill process if needed
sudo kill -9 <PID>

# Or change port in supabase/config.toml
```

**"Docker daemon not running":**
```bash
sudo systemctl start docker
sudo systemctl status docker
```

**"Migration conflict":**
```bash
# Reset local database completely
supabase db reset

# If remote is ahead, pull first
supabase db pull
```

---

## 📋 PART 5: IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)

- [ ] **Docker + Supabase CLI Setup**
  - [ ] Install Docker on Fedora
  - [ ] Install/verify Supabase CLI
  - [ ] Run `supabase init`
  - [ ] Link to remote project
  - [ ] Pull remote schema baseline
  - [ ] Test local `supabase start`

- [ ] **Database Migrations**
  - [ ] Create migration: `add_user_path_column.sql`
  - [ ] Create migration: `add_user_path_preferences_table.sql`
  - [ ] Create migration: `infer_existing_user_paths.sql` (UPDATE existing users)
  - [ ] Test locally with `supabase db reset`
  - [ ] Push to remote with `supabase db push`

- [ ] **Onboarding Flow Changes**
  - [ ] Create new onboarding step: `app/(tunnel)/onboarding/path-choice/page.tsx`
  - [ ] Update `lib/profiles.ts` → add path-choice routing logic
  - [ ] Remove old questionnaire step from routing
  - [ ] Update onboarding step numbers (step 2 = path choice, step 3 = generating, etc.)

### Phase 2: Life Plan "Horizons" (Week 2)

- [ ] **AI Prompts Refactor**
  - [ ] Create `lib/ai/life-plan-prompts-professional.ts`
  - [ ] Create `lib/ai/life-plan-prompts-entrepreneur.ts`
  - [ ] Update `lib/ai/life-plan-prompts.ts` → dual-mode (legacy + new)
  - [ ] Update Life Plan schema in `lib/types/life-plan.ts` → add `horizons` field

- [ ] **Generation Endpoint**
  - [ ] Update `app/api/life-plan/generate/route.ts`
  - [ ] Check for `userPath` → call appropriate prompt builder
  - [ ] Generate with new "horizons" structure
  - [ ] Backward compat: legacy users still get timeframes

- [ ] **Plan Page Display**
  - [ ] Create `components/plan/horizons-view.tsx` (Day 1 + Year 5 display)
  - [ ] Update `app/app/plan/page.tsx` → check for horizons vs timeframes
  - [ ] Show appropriate view based on Life Plan structure

### Phase 3: Progressive Profiling (Week 3)

- [ ] **Jobs Mini-Questionnaire**
  - [ ] Create `components/jobs/jobs-onboarding-modal.tsx`
  - [ ] Professional path: 4 questions (current title, desired, timeline, leadership)
  - [ ] Entrepreneur path: 4 questions (idea status, model, funding, goal)
  - [ ] Save to `user_path_preferences` table
  - [ ] Update `app/app/jobs/page.tsx` → check for preferences, show modal if missing

- [ ] **Courses Mini-Questionnaire**
  - [ ] Create `components/courses/courses-onboarding-modal.tsx`
  - [ ] Path-aware questions (professional skills vs business skills)
  - [ ] Save preferences
  - [ ] Update `app/app/courses/page.tsx` → check for preferences

- [ ] **Update Profile Extraction**
  - [ ] Modify `lib/ai/extract-profiles.ts`
  - [ ] Handle users with NO questionnaire data (new users)
  - [ ] Extract from `user_path_preferences` instead

### Phase 4: Path-Specific Experiences (Week 4)

- [ ] **Path-Aware Navigation**
  - [ ] Update `components/nav/mobile-bottom-nav.tsx` → conditional labels
  - [ ] Professional: "Career Plan" | Entrepreneur: "Business Plan"
  - [ ] Jobs/Opportunities, etc.

- [ ] **FE Coach Path Awareness**
  - [ ] Update `lib/ai/fe-coach-prompts.ts` → path-specific system prompts
  - [ ] Update `app/api/fe-coach/chat/route.ts` → pass userPath

- [ ] **Courses Filtering**
  - [ ] Add `target_paths` column to courses table
  - [ ] Update course display to filter by path
  - [ ] Seed initial courses with path tags

### Phase 5: Testing & Verification (Week 5)

- [ ] **New User Flow**
  - [ ] Sign up → Name → Zip → Path Choice → Generating → Complete
  - [ ] Verify Life Plan has "horizons" structure
  - [ ] Visit Jobs → see mini-questionnaire modal
  - [ ] Complete Jobs questionnaire → see jobs
  - [ ] FE Coach uses path-specific guidance

- [ ] **Existing User Compatibility**
  - [ ] Existing user logs in → has inferred path
  - [ ] Life Plan regeneration → still works (legacy mode)
  - [ ] Jobs page → shows based on old questionnaire data (no modal)

- [ ] **Tier Enforcement**
  - [ ] All premium features still check tier (Resume Builder, etc.)
  - [ ] Usage logging still works
  - [ ] No path-based tier differences (paths are free, tiers are paid)

---

## 🚨 CRITICAL CONSIDERATIONS

### 1. Existing Users

**DO NOT DELETE:**
- `questionnaire_answers` table
- Old questionnaire UI components (keep for reference)
- Existing Life Plans with `timeframes` structure

**Strategy:**
- Infer path from Q2 answer for existing users
- Keep serving them old Life Plan structure until they regenerate
- First time they regenerate → use new "horizons" structure

---

### 2. Build Backwards Compatibility

**Every feature should handle BOTH:**
- New users (path-based, progressive profiling)
- Existing users (questionnaire-based, full profiles)

**Example:**
```typescript
// Jobs page
const jobsData = pathPreferences?.desired_job_title  // NEW users
  || profile.desired_employment;                      // EXISTING users
```

---

### 3. Tier System Independence

**IMPORTANT:** Path choice is FREE. Tiers are still:
- Starter (free)
- Trial (7-day)
- Plus ($15/mo)
- Pro ($25/mo)

**Both paths get:**
- Same tier limits (Resume Builder: Plus 5/mo, Pro 10/mo)
- Same AI credits (Starter: 10/week)
- Same feature access rules

**Path only affects:**
- AI prompt style (employee vs entrepreneur mindset)
- Course catalog filtering
- Job listings filtering
- FE Coach personality

**Never mix path logic with tier logic.** They are orthogonal.

---

### 4. Data Privacy

**Progressive Profiling Disclosure:**

Show this message the FIRST time user sees a mini-questionnaire:

> **Why are we asking this?**  
> We collect information just-in-time to personalize your experience. Your answers help us show you the most relevant jobs/courses/resources. You can update your preferences anytime in Settings.

---

## 🎯 SUCCESS METRICS

**By End of Week 5:**

- [ ] New users complete onboarding in <3 minutes (vs ~15 minutes with 20 questions)
- [ ] 90%+ of new users choose a path (Professional vs Entrepreneur)
- [ ] Jobs page loads with personalized results (no errors)
- [ ] Plan page shows "Horizons" view (Day 1 + Year 5)
- [ ] FE Coach gives path-appropriate advice
- [ ] Existing users still work (backward compat verified)
- [ ] Supabase CLI workflow operational (can create/test/push migrations locally)
- [ ] Zero tier enforcement bugs (all premium features still gated properly)

---

## 🧠 ARCHITECTURAL INSIGHTS

### Why This Pivot is Brilliant

1. **Reduced Friction:** 2 clicks (path choice) vs 20 questions → 10X faster onboarding
2. **Better Segmentation:** Explicit path choice vs inferred from vague answers
3. **Progressive Profiling:** Just-in-time data collection (when user needs feature)
4. **Path-Specific Experiences:** Entire app can adapt to user mindset
5. **Future-Proof:** Easy to add new paths later (Freelancer, Creative, etc.)

### Risks to Mitigate

1. **Data Loss Fear:** Users worry about "choosing wrong path"
   - **Mitigation:** Allow path switching in Settings (regenerates Life Plan)
2. **Feature Discoverability:** If paths are TOO different, users might miss features
   - **Mitigation:** Keep core features available to both, just personalized differently
3. **Migration Complexity:** Existing users have old data structure
   - **Mitigation:** Dual-mode support (backward compat for 3-6 months minimum)

---

## 🚀 NEXT STEPS (For User)

1. **Review this plan** — Does the Professional vs Entrepreneur split align with your vision?
2. **Approve/modify** — Any features you want different between paths?
3. **Prioritize Docker setup** — This unblocks local migration testing
4. **Confirm migration approach** — Comfortable with dual-mode backward compat strategy?

Once approved, I'll start with:
- Docker + Supabase CLI setup
- First migration (add `user_path` column)
- Path choice onboarding step

---

**Questions for You:**

1. Should we allow users to SWITCH paths after choosing? (e.g., Professional → Entrepreneur)
2. Any specific Professional-only or Entrepreneur-only features you're envisioning?
3. Comfortable with the "Horizons" naming (Day 1 / Year 5) or prefer different terms?
4. Want to keep the old questionnaire as an "Advanced Profile" option for power users?

**Let's make this happen.** 🚀
