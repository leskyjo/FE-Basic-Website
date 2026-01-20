# Felon Entrepreneur - Project CLAUDE.md

## Project Identity

**Felon Entrepreneur (FE)** is a mobile-first web application designed to help people rebuild their lives after incarceration or hardship. The core promise: turn a user's situation + goals into a personalized Life Plan, then provide action tools (jobs, resume builder, courses, etc.) to execute that plan.

**Tech Stack:**
- Frontend: Next.js 14+ App Router, React, TypeScript, Tailwind CSS
- Backend: Next.js Route Handlers + Supabase Postgres
- Auth: Supabase Auth (email/password)
- Payments: Stripe (subscriptions + one-time purchases)
- AI: OpenAI (server-side only, never client-exposed)

## Non-Negotiable Principles

### 1. Mobile-First, Always
- Design for thumb-friendly mobile UI first
- Desktop/tablet share "wide layout" but mobile is the primary experience
- Bottom navigation on mobile (Home, Plan, FE Button, Jobs, Profile)
- Top navigation on desktop/tablet
- Never assume desktop - verify mobile breakpoints first

### 2. Security-First Architecture
- **AI keys never in client** - all AI calls server-side only
- **RLS (Row-Level Security) required** - users can only access their own data
- **Server-authoritative entitlements** - tier/quota checks happen server-side
- **Webhook verification** - Stripe webhooks are source of truth for billing
- **Signed URLs** - private media (courses, cheat codes) use signed URLs
- **Input validation everywhere** - never trust client data
- Ask before any security-sensitive changes

### 3. Tier System is Canonical
The user is always in exactly ONE tier state:
- **Starter** (Free): 10 AI credits/7 days, 1 app assist sample, 0 resume builder
- **Trial** (7-Day ProLite): AI enabled, 3 app assists, 1 plan regen, 0 resume
- **Plus** ($15/month): 4 plan regens, 5 resumes, 15 app assists/month
- **Pro** ($25/month): 8 plan regens, 10 resumes, 30 app assists/month

**Critical:** Client NEVER writes tier state, trial dates, credit balances, or usage counters. These are server-controlled via billing webhooks and usage tracking tables.

### 4. Navigation States (Enforced by Routing)
Three distinct navigation experiences:
- **Public (Landing Page)**: Header with logo + "Log In" + "Join Free" only
- **Onboarding Tunnel**: NO navigation (no bottom nav, no header)
- **Authenticated App**: Bottom nav (mobile) or top nav (desktop/tablet)

Onboarding step enforcement via `profiles.onboarding_step` field prevents URL manipulation.

### 5. Onboarding is the Master Tunnel
Users must complete 4-step onboarding before accessing the app:
1. Preferred Name
2. Location (ZIP → City/State resolution)
3. Bridge (welcome video + expectations)
4. Life Plan Questionnaire (20 questions)

After questionnaire submission, Life Plan is generated (AI) and user enters main app.

## Development Workflow

### Task Size Guidelines
- **Simple tasks** (1-2 file changes): Implement directly
- **Medium tasks** (3-5 files, or single complex change): Brief plan first
- **Complex tasks** (6+ files, architectural decisions): Use plan mode

### Before Every Implementation
1. **Review related code** - understand existing patterns before adding new code
2. **Check blueprints** - verify requirements match blueprint specifications
3. **Verify tier rules** - if feature is tier-gated, implement server-side checks
4. **Mobile-first** - design mobile layout first, then adapt for desktop

### Verification Requirements
After implementing any feature:
- **Build check**: `npm run build` (must pass)
- **Type check**: `npm run type-check` (if separate)
- **Lint**: `npm run lint` (must pass)
- **Database**: If RLS changes, test with different user IDs
- **Tier gating**: Test with Starter/Trial/Plus/Pro states
- **Mobile**: Test at 375px width (iPhone SE size)

### Ask Before
- Adding/updating/removing dependencies
- Changing database schema (migrations)
- Modifying RLS policies
- Creating new AI endpoints (security review needed)
- Changing tier entitlements
- Modifying billing/webhook logic

## Project Memory System

**Purpose:** Maintain context across sessions, track decisions, document innovations

### Memory Files (Must Keep Updated)

**CURRENT_WORK.md** - What we're working on RIGHT NOW
- Update at end of each session
- Lists current phase, completed work, next steps
- Includes session notes and quick resume instructions
- **Update when:** Starting/ending work, completing major features

**ARCHITECTURE_DECISIONS.md** - Why we made key choices
- Documents major architectural decisions with alternatives and rationale
- Includes files affected and date of decision
- Future questions section for pending decisions
- **Update when:** Making architectural choices, choosing between patterns

**BLUEPRINT_IMPROVEMENTS.md** - How we've exceeded original vision
- Tracks innovations beyond blueprints
- Documents why improvements are better
- Includes ideas for future innovations
- **Update when:** Implementing features that exceed blueprints, having breakthrough ideas

**CHANGELOG.md** - Chronological development history
- All notable changes with date, description, impact, files
- Unreleased section for work in progress
- **Update when:** Completing features, fixing bugs, making any significant change

**LIFE_PLAN_SYSTEM_SUMMARY.md** - Complete Life Plan system documentation
- Comprehensive reference for Life Plan architecture
- Data flow diagrams, code examples, troubleshooting
- **Update when:** Changing Life Plan generation, extraction, or display logic

### Session Handoff Protocol

**When ending a significant session:**
1. Update `CURRENT_WORK.md` with current status
2. Add completed work to `CHANGELOG.md`
3. Document any architectural decisions in `ARCHITECTURE_DECISIONS.md`
4. If we exceeded blueprints, update `BLUEPRINT_IMPROVEMENTS.md`
5. Mark TodoWrite items as completed

**When starting a new session:**
1. Read `CURRENT_WORK.md` first (always shows current state)
2. If working on Life Plan system, read `LIFE_PLAN_SYSTEM_SUMMARY.md`
3. If questioning a decision, check `ARCHITECTURE_DECISIONS.md`
4. For context on innovations, check `BLUEPRINT_IMPROVEMENTS.md`

**If approaching AutoCompact:**
- Memory files are persistent (they survive context reset)
- User should say: "Read CURRENT_WORK.md - continuing from last session"
- All critical context is preserved in these files

### Proactive Documentation

**You MUST update memory files when:**
- Making any architectural decision (→ ARCHITECTURE_DECISIONS.md)
- Completing a feature (→ CHANGELOG.md + CURRENT_WORK.md)
- Innovating beyond blueprints (→ BLUEPRINT_IMPROVEMENTS.md)
- Ending a work session (→ CURRENT_WORK.md)

**Don't ask permission** - just update the files as you work. Documentation is part of development.

## Module Architecture (Vertical Slices)

Each module is a vertical slice delivering end-to-end user value:

### Slice 1: Foundation + Public Landing ✅ COMPLETE
- Public landing page at `/`
- Supabase auth setup
- Database schema foundation
- Responsive shell (mobile/desktop)

### Slice 2: Onboarding Tunnel → Life Plan 🚧 IN PROGRESS
- ✅ 4-step onboarding flow with server-enforced routing
- ✅ 20-question questionnaire with autosave
- 🚧 Life Plan AI generation (server-side) - CURRENT FOCUS
- Post-onboarding redirect to dashboard

### Slice 3: Dashboard/Home
- Post-onboarding landing page
- Tier badge + trial countdown
- "Your Next Moves" recommendations (server-generated)
- Progress snapshots (Plan, Jobs, Courses)

### Slice 4: Plan Tab
- View Life Plan (read-only + edit modes)
- Phase badge + progress indicators
- Plan regeneration (tier-limited)
- FE Coach AI chat (tier-aware)

### Slice 5: Jobs Discovery
- Job search with filters (location, type, felon-friendly)
- Job cards and detail view
- Saved jobs (tier-limited storage)
- Job matching/scoring (AI-powered)

### Slice 6: Jobs Tools
- Resume Builder (Plus/Pro: 5-10/month, single purchase $3.99)
- Application Assistant (Starter: 1 sample, Plus: 15/month, Pro: 30/month)
- Interview Prep (Plus: 3/month, Pro: 6/month)
- Usage tracking via `usage_periods` table

### Slice 7: FE Button/Hub (Mobile Only)
- Center glowing button in mobile bottom nav
- Overlay with 4 cards: Courses, Cheat Codes, Daily Boost, Tiny Wins
- Daily Boost (AI motivational message, tier-aware)
- Tiny Wins micro-journaling (append-only)

### Slice 8: Courses
- Course catalog (FE Originals + partners)
- Course player with progress tracking
- Tier-based pricing discounts (Plus 10-15%, Pro 20-25%)
- Purchase grants tokens (1 resume + 1 app assist + 1 interview prep)
- Certificate issuance on completion

### Slice 9: Cheat Codes
- Micro-paid "life hack" videos ($2-10 each)
- Teaser always available, full video requires purchase
- Creator types: Kyle/Nate, Community (future), AI (future)
- Permanent access after purchase (revoked on refund/chargeback)

### Slice 10: Shop
- Merchandise storefront (apparel/accessories)
- Public browsing (no auth required)
- Guest checkout + logged-in checkout
- Product variants (size/color) with inventory tracking
- Stripe Checkout Session (hosted)

### Slice 11: Tier System + Billing
- Subscription management (Stripe)
- 7-day trial logic (requires payment method)
- Upgrade/downgrade flows
- Webhook handling (authoritative source of truth)
- Usage metering and quota enforcement

## Database Design Principles

### Core Tables (Minimum Viable)
- `profiles`: user identity, onboarding state, tier, trial dates
- `usage_periods`: monthly counters (resumes, app assists, plan regens, AI messages)
- `usage_events`: append-only audit log
- `life_plans`: plan data (JSONB), version, status, AI summary
- `questionnaire_answers`: 20-question responses (JSONB)
- `jobs`, `saved_jobs`, `fe_resumes`, `applications`
- `courses`, `course_lessons`, `course_purchases`, `course_tokens`, `course_progress`
- `cheat_codes`, `cheat_code_purchases`, `cheat_code_access`
- `products`, `product_variants`, `orders`, `order_items`
- `subscriptions`, `billing_events`

### RLS Requirements
Every user-scoped table must have RLS policies:
```sql
-- Example pattern
CREATE POLICY "Users can only access own data"
ON table_name
FOR ALL
USING (auth.uid() = user_id);
```

### Migrations
- Use Supabase migrations (timestamped files)
- Always include both `up` and `down` migrations
- Test migrations on local Supabase instance before production
- Ask before creating migrations (schema changes are high-risk)

## AI Integration Rules

### Server-Side Only
- AI provider keys stored in environment variables (server-side only)
- All AI calls via Next.js Route Handlers (never client fetch to OpenAI)
- Example endpoint pattern: `/api/ai/generate-plan`, `/api/ai/fe-coach`, `/api/ai/daily-boost`

### Every AI Endpoint Must
1. **Authenticate** - verify user session via Supabase auth
2. **Resolve tier** - fetch user's current tier from `profiles` table
3. **Check quota** - verify user has remaining credits/usage
4. **Rate limit** - prevent abuse (e.g., max 10 requests/minute)
5. **Log usage** - append to `usage_events` table
6. **Decrement quota** - update `usage_periods` or AI credit counters
7. **Return error if quota exceeded** - with upgrade CTA in response

### AI Credit System (Starter Tier)
- Starter users get 10 AI credits per 7-day period
- Credits reset weekly (tracked via `profiles.starter_ai_reset_at`)
- Credits consumed by: FE Coach chat, Daily Boost, Plan regeneration prompts
- When exhausted, show trial offer modal

## Code Style and Patterns

### Component Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (landing)
│   ├── (tunnel)/          # Onboarding tunnel
│   ├── (authenticated)/   # Main app routes
│   └── api/               # Route handlers
├── components/
│   ├── ui/                # Shadcn/ui primitives
│   ├── mobile/            # Mobile-specific components
│   ├── desktop/           # Desktop-specific components
│   └── shared/            # Cross-device components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   ├── stripe/            # Stripe utilities
│   ├── ai/                # AI integration helpers
│   └── utils/             # General utilities
└── types/                 # TypeScript types
```

### Mobile-First Component Pattern
```tsx
// Always design mobile first, then adapt for desktop
export function FeatureCard() {
  return (
    <div className="
      flex flex-col gap-4 p-4        // Mobile: stacked, compact
      md:flex-row md:gap-6 md:p-6    // Desktop: side-by-side, spacious
    ">
      {/* Content */}
    </div>
  );
}
```

### Tier-Gated Feature Pattern
```tsx
// Always show feature, lock if tier insufficient
export function PremiumFeature() {
  const { tier, isLoading } = useUserTier();
  const canAccess = tier === 'plus' || tier === 'pro';

  if (isLoading) return <Skeleton />;

  return (
    <div className="relative">
      {!canAccess && <LockOverlay tier="plus" />}
      <FeatureContent disabled={!canAccess} />
    </div>
  );
}
```

### Server Action Pattern (Tier + Quota Check)
```tsx
// app/api/generate-resume/route.ts
export async function POST(request: Request) {
  // 1. Authenticate
  const session = await getServerSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // 2. Resolve tier
  const profile = await supabase
    .from('profiles')
    .select('tier, subscription_status')
    .eq('user_id', session.user.id)
    .single();

  // 3. Check quota
  const usage = await getCurrentPeriodUsage(session.user.id);
  const limit = getResumeLimit(profile.tier);
  if (usage.resume_generations_count >= limit) {
    return new Response(JSON.stringify({
      error: 'QUOTA_EXCEEDED',
      upgradeUrl: '/pricing'
    }), { status: 403 });
  }

  // 4. Execute feature logic
  const resume = await generateResume(requestData);

  // 5. Log usage
  await incrementUsage(session.user.id, 'resume_generation');

  return new Response(JSON.stringify(resume), { status: 200 });
}
```

## Communication Style

- **Be direct and professional** - this is a serious product helping real people
- **Explain "why"** - especially for architectural decisions
- **Highlight risks** - if a change could affect billing, AI costs, or user data
- **Mobile-first language** - always mention mobile implications first
- **Security callouts** - if a change touches auth, AI, or billing, explicitly state security measures

## Quality Gates

Before marking any slice as "complete":
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] RLS policies tested (cannot access other users' data)
- [ ] Tier gating tested (Starter/Trial/Plus/Pro all behave correctly)
- [ ] Mobile breakpoint tested (375px width minimum)
- [ ] Desktop breakpoint tested (1024px+ width)
- [ ] AI endpoints rate-limited and logged (if applicable)
- [ ] Usage quotas enforced server-side (if applicable)

## Current Status

**Current Slice**: Slice 2 - Onboarding Tunnel → Life Plan (Life Plan AI generation)

**Completed**:
- ✅ Public landing page
- ✅ Auth (signup, login, password reset)
- ✅ Onboarding steps 1-2 (name, zip)
- ✅ 20-question questionnaire with autosave
- ✅ Database schema (profiles, questionnaire_answers)

**In Progress**:
- 🚧 Life Plan AI generation endpoint (`/api/life-plan/generate`)
- 🚧 Life Plan data model and storage
- 🚧 Generating screen with real-time status
- 🚧 Post-generation redirect to dashboard

**Next Steps**:
1. Complete Life Plan generation system (AI + data model)
2. Implement generating screen with progress tracking
3. Create dashboard/home page
4. Begin Plan tab implementation

## References

- Blueprint location: `/home/leskyjo/Documents/FE WEBSITE BLUEPRINT/project blueprints/project/`
- Complete overview: `COMPLETE OVERVIEW.txt`
- Module blueprints: Individual folders (ONBOARDING, PLAN, JOBS, COURSES, etc.)
- Questionnaire: `FINALquestionnaire.txt` (20 questions)

---

**Remember**: This app is designed to help people rebuild their lives. Every feature must work correctly, securely, and with dignity. Mobile-first, security-first, tier-aware, always.
