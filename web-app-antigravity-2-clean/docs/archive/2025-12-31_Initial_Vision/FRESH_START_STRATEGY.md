# FRESH_START_STRATEGY.md

**Generated:** 2025-12-31  
**Purpose:** Reality check + cleanup strategy after migration  
**Status:** Ready for review and execution

---

## 🎯 THE REALITY CHECK

### What's Actually Working

**✅ Core Infrastructure (Solid Foundation)**
- Next.js 14 App Router with TypeScript
- Supabase Auth + Postgres with RLS enabled
- 6 database migrations applied successfully
- Build passes with zero TypeScript errors
- Mobile-first responsive layout with bottom nav
- Onboarding tunnel enforced by routing

**✅ Life Plan System (98% Complete)**
- 20-question progressive questionnaire with autosave
- OpenAI GPT-4o integration (server-side only)
- AI generation endpoint with tier checking
- Profile extraction to 4 feature tables (jobs, learning, wellness, financial)
- Smart resume logic (survives logout/device change)
- FE Coach AI chat with tier limits
- Life Plan display with 4 timeframes + 5 domains

**✅ Jobs System (Phase 1 Ready)**
- JSearch API integration configured
- Database schema complete (`jobs_system` migration applied)
- Tier-based limits defined and enforced
- Jobs search UI skeleton created
- Employment details tracking implemented

**✅ Tier System (Framework Complete)**
- Tier definitions: Starter/Trial/Plus/Pro
- Usage period tracking (monthly resets)
- Quota enforcement utilities (`lib/tier/`)
- AI credit system (10 credits/7 days for Starter)
- Server-authoritative entitlements

**✅ Security Posture (Production-Ready)**
- AI keys never exposed to client
- RLS policies on all user tables
- Row-level security prevents cross-user access
- Auth context with stable function refs (fixed)
- Webhook-ready billing architecture

---

### What's NOT Working (Reality vs Documentation)

**❌ Documentation Drift**
- `CURRENT_WORK.md` says "JOBS PLANNING COMPLETE — Ready to Build"
  - **Reality:** Jobs Phase 1 is ~40% implemented (UI exists, backend integration incomplete)
- `TIER_SYSTEM.md` says Interview Prep is "Plus: 3/month, Pro: 6/month"
  - **Reality:** Not implemented at all (no code, no UI)
- Multiple docs claim "Session 5 Complete" dated 2025-12-29
  - **Reality:** We're on 2025-12-31, work has continued past Session 5

**❌ Ghost Code (Undocumented Features)**
- `app/app/employment/page.tsx` — Employment details page exists but not mentioned in CURRENT_WORK.md
- `EMPLOYMENT_DETAILS_INTEGRATION.md` — Created but not referenced in any session notes
- `lib/geo/zip-coordinates.ts` — ZIP code geocoding exists but not documented

**❌ Missing Code (Marked Done But Not Implemented)**
- Resume Builder (marked as "Plus/Pro only" but zero implementation)
- Application Assistant (1 sample use for Starter — no code exists)
- Interview Prep (entire feature missing)
- Daily Boost (wellness feature - no implementation)
- Tiny Wins (micro-journaling - no implementation)
- Cheat Codes (micro-paid videos - no implementation)
- Shop/Merch (standard ecommerce - no implementation)
- Courses catalog (database ready, UI missing)

**🔴 CRITICAL: Migration Status Unclear**
- `MIGRATION_TO_RUN.sql` exists in root (247 lines, creates Life Plan system tables)
- Supabase `/migrations` folder has 6 migrations already
- **UNKNOWN:** Has `MIGRATION_TO_RUN.sql` been applied or is it a duplicate?
- **RISK:** Running it could create duplicate tables or fail with "already exists" errors

---

## 🧹 THE CLEANUP LIST

### 1. Hardcoded Values (Anti-Pattern)

**Location:** Throughout codebase  
**Severity:** Medium  
**Impact:** Difficult to maintain, prone to drift from blueprints

```typescript
// ❌ BAD: Magic numbers scattered throughout
const STARTER_AI_CREDITS = 10;  // lib/tier/tier-limits.ts
const PLUS_RESUMES_MONTHLY = 5; // lib/tier/tier-limits.ts
const PRO_RESUMES_MONTHLY = 10;

// ✅ GOOD: Single source of truth
// Should be in tier-limits.ts only, not repeated
```

**Action Items:**
- Audit all tier limits against `TIER_SYSTEM.md` (the canonical source)
- Create tier constants object exported from `lib/tier/tier-limits.ts`
- Replace all hardcoded limits with imported constants

---

### 2. Type Safety Gaps (Sloppy Patterns)

**Location:** API routes, form handling  
**Severity:** High (security risk)  
**Impact:** Runtime errors, potential exploits

```typescript
// ❌ BAD: No validation, trust client data
const { query, location } = await req.json();
// Immediately use in database query — UNSAFE

// ✅ GOOD: Validate and sanitize
import { z } from "zod";
const schema = z.object({
  query: z.string().max(200),
  location: z.string().optional()
});
const validated = schema.parse(await req.json());
```

**Action Items:**
- Install `zod` for runtime type validation
- Add input schemas to all API routes
- Never trust client-submitted data (tier, credits, etc.)

---

### 3. Missing Error Handling (Production Risk)

**Location:** AI endpoints, database queries  
**Severity:** High  
**Impact:** Poor UX, no debugging info, potential crashes

```typescript
// ❌ BAD: No try-catch, generic errors
export async function POST(req: Request) {
  const data = await supabase.from("profiles").select();
  return Response.json(data);
}

// ✅ GOOD: Comprehensive error handling
export async function POST(req: Request) {
  try {
    const { data, error } = await supabase.from("profiles").select();
    if (error) throw error;
    return Response.json(data);
  } catch (err) {
    console.error("[API Error]", err);
    return Response.json({ 
      error: "Failed to fetch profile",
      code: "PROFILE_FETCH_ERROR"
    }, { status: 500 });
  }
}
```

**Action Items:**
- Wrap all database calls in try-catch
- Add descriptive error logging (with request context)
- Return user-friendly error messages (never expose stack traces)

---

### 4. Incomplete Tier Enforcement (Security Issue)

**Location:** Jobs search, Plan regeneration  
**Severity:** Critical (money leak)  
**Impact:** Starter users could access paid features

```typescript
// ❌ BAD: Client-side "gating" only
{tier !== 'starter' && <ResumeBuilderButton />}
// Anyone can open DevTools and change tier state

// ✅ GOOD: Server-side enforcement
export async function POST(req: Request) {
  const tier = await getUserTier(session.user.id);
  if (tier === 'starter') {
    return Response.json({ 
      error: "Resume Builder requires Plus or Pro" 
    }, { status: 403 });
  }
  // ... proceed with generation
}
```

**Action Items:**
- Audit all premium features for server-side tier checks
- Add `checkQuota()` calls before AI generations
- Log all tier violations to `usage_events` for security monitoring

---

### 5. Stale Documentation (Maintenance Burden)

**Location:** Multiple markdown files with conflicting info  
**Severity:** Medium (but growing)  
**Impact:** Wastes time, causes confusion, erodes trust in docs

**Conflicts Found:**
- `CURRENT_WORK.md` (Last Updated 2025-12-29) vs actual code state
- `START_HERE_NEXT_SESSION.md` references Phase 1 database migration that's already applied
- `TIER_SYSTEM.md` defines Interview Prep limits but feature doesn't exist

**Action Items:**
- Update `CURRENT_WORK.md` with today's actual state
- Mark incomplete features as "[NOT IMPLEMENTED]" explicitly
- Add "Last Verified: YYYY-MM-DD" to all major docs

---

### 6. Missing Usage Tracking (Billing Compliance)

**Location:** Resume Builder, Application Assistant, Interview Prep  
**Severity:** High (breaks tier system)  
**Impact:** Can't enforce quotas, can't bill accurately

**Current State:**
- `usage_periods` table exists
- `increment-usage.ts` utility exists
- **BUT:** Only Life Plan generation actually logs usage
- Resume Builder, App Assistant, Interview Prep: **NO USAGE LOGGING**

**Action Items:**
- Add `logUsageEvent()` to all AI feature endpoints
- Implement monthly reset cron job (or Edge Function)
- Add usage meters to Profile page UI

---

### 7. TODO Comments (Technical Debt)

**Found 4 TODOs:**

1. `lib/tier/reset-periods.ts:162` — "TODO: Implement archival strategy when needed"
2. `app/api/jobs/search/route.ts:57` — "TODO: Check daily search limit"
3. `app/api/life-plan/generate/route.ts:136` — "TODO: Implement usage period checking"
4. `lib/tier/increment-usage.ts:131` — "TODO: Implement when we build purchase system"

**Action Items:**
- Create GitHub issues (or linear tasks) for each TODO
- Prioritize TODOs #2 and #3 (affect tier enforcement)
- Remove TODOs from production code (replace with issue tracker links)

---

## 🚀 THE IMMEDIATE PLAN

### Task 1: Database Migration Verification (30 min)

**Goal:** Determine if `MIGRATION_TO_RUN.sql` needs to be run

**Steps:**
1. Connect to Supabase and run:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN (
     'life_plan_versions', 'life_plans', 'user_jobs_profiles', 
     'user_learning_profiles', 'user_wellness_profiles', 
     'user_financial_profiles', 'user_next_actions'
   );
   ```
2. Compare result against `MIGRATION_TO_RUN.sql` table list
3. If ALL tables exist → `MIGRATION_TO_RUN.sql` already applied (rename to `MIGRATION_TO_RUN_ARCHIVE.sql`)
4. If ANY tables missing → Review migration, run via Supabase CLI

**Success Criteria:**
- Know definitive migration status
- Either: Migration applied correctly OR plan to apply it
- Document result in `CURRENT_WORK.md`

---

### Task 2: Tier Enforcement Audit (2 hours)

**Goal:** Ensure all paid features have server-side tier checks

**Steps:**
1. Inventory all premium features from `TIER_SYSTEM.md`:
   - Life Plan regeneration ✅ (has tier check)
   - Resume Builder ❌ (not implemented)
   - Application Assistant ❌ (not implemented)
   - Interview Prep ❌ (not implemented)
   - Jobs scoring/insights ? (check code)
   - FE Coach AI credits ✅ (has tier check)

2. For each implemented feature:
   - Confirm API route exists
   - Verify `getUserTier()` is called
   - Verify `checkQuota()` is called
   - Verify `incrementUsage()` is called
   - Verify proper error response (403 with upgrade CTA)

3. Add missing checks where found

**Success Criteria:**
- No starter user can access paid features via API manipulation
- All premium endpoints return 403 with clear upgrade message
- All usage logged to `usage_events` table

---

### Task 3: Documentation Reconciliation (1 hour)

**Goal:** Bring docs into alignment with reality

**Steps:**
1. Update `CURRENT_WORK.md`:
   - Set "Last Updated" to today (2025-12-31)
   - Change "Ready to Build Jobs" → "Jobs Phase 1: 40% Complete"
   - Mark unimplemented features with [NOT IMPLEMENTED] tag
   - Remove "Session 5" language (use ongoing "Current Status")

2. Add implementation status tags to feature list:
   ```markdown
   - ✅ COMPLETE: Life Plan generation
   - 🚧 IN PROGRESS: Jobs search (40%)
   - ❌ NOT STARTED: Resume Builder
   - ❌ NOT STARTED: Application Assistant
   - ❌ NOT STARTED: Interview Prep
   - ❌ NOT STARTED: Courses
   - ❌ NOT STARTED: Shop
   - ❌ NOT STARTED: Cheat Codes
   ```

3. Create `KNOWN_ISSUES.md` with:
   - Migration status uncertainty
   - Missing usage tracking on 3 features
   - 4 prioritized TODOs

**Success Criteria:**
- Anyone reading docs knows exact implementation state
- No surprises ("wait, this isn't done?")
- Clear next steps for each incomplete feature

---

## 📊 Implementation Priority Matrix

### Critical Path (Do First)

**Week 1 (Jan 1-7, 2026)**
1. ✅ Task 1: Database migration verification
2. ✅ Task 2: Tier enforcement audit
3. ✅ Task 3: Documentation reconciliation

**Week 2 (Jan 8-14, 2026)**
4. Implement Resume Builder (Plus: 5/mo, Pro: 10/mo)
   - UI flow: contact → work history → skills (pre-filled from Life Plan)
   - AI generation endpoint with GPT-4o
   - Tier checking + usage logging
   - PDF/DOCX export

5. Implement Application Assistant (Starter: 1 sample, Plus: 15/mo, Pro: 30/mo)
   - UI flow: select job → paste questions → AI answers
   - Starter gets 1 free sample (tracked in `profiles.starter_app_assist_sample_used`)
   - Plus/Pro get monthly quotas

### High Value (Do Next)

**Week 3-4 (Jan 15-28, 2026)**
6. Complete Jobs Phase 1
   - JSearch API integration (search + filters)
   - Job card display with felon-friendly tags
   - Saved jobs feature (Starter: 5, Plus: 15, Pro: 30)
   - "Matches Life Plan" indicator

7. Implement Interview Prep (Plus: 3/mo, Pro: 6/mo)
   - Select job context + resume
   - AI-generated practice Q&A
   - Tier-gated with usage logging

### Medium Priority (Do Later)

**Month 2 (Feb 2026)**
8. Courses catalog
9. Daily Boost (AI motivational message, 1/day)
10. Tiny Wins (micro-journaling, unlimited)

### Low Priority (Future)

11. Cheat Codes ($2-10 micro-paid videos)
12. Shop/Merch (standard ecommerce)
13. Community features

---

## 🧪 Verification Checklist

Before marking any feature "complete":

- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console warnings in browser
- [ ] Server-side tier check implemented
- [ ] Usage logging to `usage_events` table
- [ ] Quota enforcement tested (Starter/Trial/Plus/Pro)
- [ ] Mobile breakpoint tested (375px width)
- [ ] Desktop breakpoint tested (1024px+ width)
- [ ] RLS policies tested (cannot access other users' data)
- [ ] Error handling tested (what if API fails?)
- [ ] Documentation updated (CURRENT_WORK.md + feature-specific docs)

---

## 💡 Key Insights

### What We Did Right

1. **Mobile-First Discipline:** Bottom nav, thumb-friendly UI, proper breakpoints
2. **Security Architecture:** RLS everywhere, server-side AI, no client trust
3. **Life Plan Foundation:** Solid extraction pipeline, ready for all features
4. **Tier Framework:** Clean utilities, ready to enforce (just need to use them)

### What Needs Improvement

1. **Documentation Hygiene:** Docs drift faster than code changes — need "Last Verified" dates
2. **Feature Completion Definition:** "Planning complete" ≠ "Implementation complete"
3. **Usage Tracking:** Built the plumbing, forgot to connect it to features
4. **Migration Management:** Unclear if `MIGRATION_TO_RUN.sql` is applied or duplicate

### Lessons for Next Session

1. **Update CURRENT_WORK.md at end of EVERY work session** (not just major milestones)
2. **Tag features explicitly:** ✅ COMPLETE, 🚧 IN PROGRESS (X%), ❌ NOT STARTED
3. **No "Ready to Build" language** unless database + types + utils are 100% done
4. **Usage tracking is NOT optional** — add `logUsageEvent()` to every premium feature

---

## 🎯 Success Metrics (30 Days)

By January 31, 2026:

- [ ] Resume Builder live (Plus/Pro users generating resumes)
- [ ] Application Assistant live (Starter gets 1 sample, Plus/Pro get quotas)
- [ ] Jobs search functional (JSearch API returning real results)
- [ ] 100% of implemented features have usage tracking
- [ ] Zero tier enforcement gaps (tested with all 4 tiers)
- [ ] Documentation matches reality (95%+ accuracy)
- [ ] Zero critical TODOs (all converted to tracked issues)

---

**Bottom Line:**  
You have a **solid foundation** (infrastructure, auth, Life Plan, tier framework).  
You have a **clear feature roadmap** (Resume Builder → App Assistant → Jobs → Interview Prep).  
You have a **documentation problem** (drift, optimism bias, "ready to build" vs "40% done").

**Fix the docs first** (Tasks 1-3), then execute the roadmap with discipline.  
Every feature MUST have: tier check + usage logging + error handling + mobile testing + docs update.

**No shortcuts. No "almost done." No premature victory laps.**

🚀 **Ready to execute?** Start with Task 1 (database verification) — it's the linchpin.
