# Changelog - Felon Entrepreneur Platform

All notable changes to this project will be documented in this file.

**Format:** Date | Change | Impact | Files

---

## [Unreleased]

### Bridge Screen + Empty Life Plan Handling (NEXT UP)
- [ ] Create bridge screen between zip and questionnaire
- [ ] Add skip option to go straight to app
- [ ] Add Life Plan generation access point in app (/app/plan/generate)
- [ ] Handle empty Life Plan state with prompt to complete questionnaire
- [ ] Add new question: "What do you hope to gain from FE membership?"

### Tier System Implementation (COMPLETE ✅)
- [x] Complete tier system extraction from blueprints
- [x] Created TIER_SYSTEM.md (400+ line single source of truth)
- [x] Created TIER_SYSTEM_EXTENSIBILITY.md (future-proofing guide)
- [x] Resolved 6 tier ambiguities with user decisions
- [x] Built centralized tier utilities (lib/tier/)
- [x] Built Regenerate Plan API endpoint with tier enforcement
- [x] Built Regenerate Plan button UI component
- [x] Integrated Regenerate button into Plan page
- [x] Test regeneration with tier limits ✅ WORKING
- [x] Fixed tier validation bug (runtime validation)
- [x] Fixed JSON parsing errors (8000 token limit)

### Life Plan UI Expansion
- [ ] Display all 4 timeframes on Plan page (7-day, 30-day, 90-day, 12-month)
- [ ] Display all 5 domain strategies on Plan page
- [ ] Add category filtering to Plan page
- [ ] Add progress tracking UI for actions

### Feature Integration
- [ ] Jobs page: Query and display user_jobs_profiles data
- [ ] Courses page: Query and display user_learning_profiles data
- [ ] Dashboard: Query and display user_next_actions
- [ ] FE Button: Integrate user_wellness_profiles

---

## [2025-12-29] - Critical Bug Fixes + AI Personalization Improvements

### Fixed

**🚨 CRITICAL: Questionnaire Save/Resume Bug**
- Fixed showstopper bug where users logging out mid-questionnaire lost all progress
- Problem: User at 75% completion logged out, returned to home page with no plan and no way to resume
- Root cause: Progress tracking relied on localStorage (cleared on logout, browser-specific)
- Solution: Implemented smart resume logic that calculates starting section from database answers
- Now works across browsers, devices, and survives logout
- Updated "Save & finish later" message to clarify auto-save across devices

**Impact:** Users can now resume questionnaire exactly where they left off, even after logout or on different device
**Files:** `app/(tunnel)/onboarding/questions/onboarding-questions-form.tsx` (lines 82-101)

**🎯 Fixed AI Business Bias (Critical UX Issue)**
- Fixed AI generating business/LLC content for users seeking employment
- Problem: User entered Q9 "make progress at my current job" but AI generated LLC formation content because Q2 selected "business"
- Root cause: AI prioritized Q2 (multiple choice) over Q9 (free text user intent)
- Solution: Added user type detection from Q9 free-text keywords
  - Employee keywords: "job", "work", "career", "promotion", "raise", "employer"
  - Entrepreneur keywords: "business", "LLC", "clients", "startup", "self-employed"
- Q9 now overrides Q2 if they conflict
- AI explicitly instructed: "DO NOT recommend LLC/business if user is EMPLOYEE"

**Impact:** AI now generates appropriate content for job seekers vs entrepreneurs
**Files:** `lib/ai/life-plan-prompts.ts` (lines 734-752)

**"Crew member" Name Display Bug**
- Fixed home page and profile page showing "Crew member" instead of user's preferred name
- Changed fallback chain: `profile.preferred_name || profile.name || "there"`

**Impact:** Proper name personalization throughout app
**Files:** `app/app/home/page.tsx` (line 46), `app/app/profile/page.tsx` (lines 12-19)

**FE Button Styling**
- Fixed FE button showing square artifact around circular button
- Made clean single circle with proper border and shadow

**Impact:** Visual polish on mobile navigation
**Files:** `components/nav/mobile-bottom-nav.tsx` (lines 93-115)

### Added

**✂️ Reduced Q9 Repetition (UX Polish)**
- Fixed AI repeating "You said your goal is '[full Q9 quote]'..." in every action
- AI now quotes Q9 ONCE in overview.headline
- References 2-3 times using shortened form: "this LLC", "your business launch", "the goal you set"
- Uses pronouns after first reference: "This", "Your", "The business you're building"

**Impact:** More natural, less repetitive AI output
**Files:** `lib/ai/life-plan-prompts.ts` (lines 736-748)

**📋 Added Step-by-Step Instructions Format**
- Enhanced AI prompt to generate actionable, specific instructions
- Every action now follows 4-part pattern:
  1. **What to do** (action verb)
  2. **Where/how to do it** (URL, phone, location)
  3. **What to expect** (timeline, cost, outcome)
  4. **Next step** (what happens after)
- Added 3 detailed examples: LLC formation, job application, budgeting

**Impact:** Users get actionable, step-by-step guidance instead of vague advice
**Files:** `lib/ai/life-plan-prompts.ts` (lines 203-223)

**💪 Enhanced Health & Wellness Domain**
- Created comprehensive health actions despite no health questions in questionnaire
- Added 3 specific actions:
  - Sleep routine with tracking (connects to Q2 employment demands)
  - Daily movement (no gym required, free resources)
  - Simplified nutrition (80/20 rule, budget-conscious)
- Includes specific apps, local resources, budget savings
- Ties health to employment/business success

**Impact:** Valuable wellness guidance without requiring health questions in questionnaire
**Files:** `lib/ai/life-plan-prompts.ts` (lines 544-588)

**Improved Auth Session Config**
- Enhanced browser Supabase client with better session management
- Added autoRefreshToken, persistSession, PKCE flow
- Custom headers for application identification

**Impact:** More reliable authentication experience
**Files:** `lib/supabase/browser.ts` (lines 13-32)

### Changed

**🏗️ Onboarding Step Renumbering (Prep for Bridge Screen)**
- Renumbered all onboarding step references to insert bridge screen
- New flow:
  - Step 0: Name
  - Step 1: Zip
  - Step 2: Bridge (NEW - not yet created)
  - Step 3: Questions (was 2)
  - Step 4: Generating (was 3)
  - Step 5: Complete (was 4)

**Impact:** Clean foundation for adding bridge screen without breaking existing flow
**Files:**
- `lib/profiles.ts` - Updated `routeForOnboardingStep()`
- `app/(tunnel)/onboarding/questions/page.tsx` (lines 19-33)
- `app/(tunnel)/onboarding/questions/onboarding-questions-form.tsx` (lines 268-273)
- `app/(tunnel)/onboarding/complete/onboarding-complete-screen.tsx` (lines 29-33)
- `app/api/life-plan/generate/route.ts` (lines 277-280)

---

## [2025-12-26] - Tier System + Enhanced Life Plan AI

### Added

**Comprehensive Tier System (MAJOR)**
- Created centralized tier/quota enforcement system for ALL features
- Built `lib/tier/check-quota.ts` - Universal quota checker (works for any feature)
- Built `lib/tier/increment-usage.ts` - Universal usage tracker with priority system (tokens → purchases → tier allowance)
- Built `lib/tier/tier-limits.ts` - Configuration for all tier limits (single source of truth)
- Built `lib/tier/reset-periods.ts` - Automatic weekly/monthly reset logic
- Created `lib/types/tier.ts` - Complete TypeScript types for tier system
- Created `TIER_SYSTEM.md` - 400+ line comprehensive tier documentation
- Created `TIER_SYSTEM_EXTENSIBILITY.md` - Future-proofing guide for adding new features
- Created `app/api/life-plan/regenerate/route.ts` - First implementation using tier system
- Resolved 6 tier ambiguities from blueprints with user decisions

**Tier System Features:**
- Feature-agnostic design (works for ANY tier-restricted feature)
- Priority system: Course tokens → Single-use purchases → Tier allowance
- Automatic resets: Weekly (Starter AI credits), Monthly (Plus/Pro quotas)
- Comprehensive audit logging
- Future-proof extensibility (add new features in 5 steps, ~20 lines of code)

**Impact:** All future tier-restricted features (Resume Builder, Application Assistant, Interview Prep, etc.) now plug into this single system. No more custom tier logic per feature.
**Files:** `lib/tier/*`, `lib/types/tier.ts`, `TIER_SYSTEM.md`, `TIER_SYSTEM_EXTENSIBILITY.md`, `app/api/life-plan/regenerate/route.ts`

**Life Plan AI Prompt Enhancement**
- Increased action count from 3-5 to 6-10 per timeframe
- Added critical category coverage requirements (employment, financial, skills, health, mindset, legal)
- Added question group mapping (all 4 groups must be addressed)
- Added domain completeness rules (all 5 domains must be populated)
- Added comprehensive verification checklist (7 checkpoints)
- Added detailed category coverage rules (99 lines of specific guidance)

**Impact:** Life Plans will now be significantly more comprehensive and personalized
**Files:** `lib/ai/life-plan-prompts.ts`

**Project Memory System**
- Created `CURRENT_WORK.md` - Always shows active work and next steps
- Created `ARCHITECTURE_DECISIONS.md` - Documents major decisions and rationale
- Created `BLUEPRINT_IMPROVEMENTS.md` - Tracks innovations beyond original blueprints
- Created `CHANGELOG.md` - This file
- Created session handoff protocol for context preservation

**Impact:** Development context is now persistent across sessions
**Files:** `CURRENT_WORK.md`, `ARCHITECTURE_DECISIONS.md`, `BLUEPRINT_IMPROVEMENTS.md`, `CHANGELOG.md`

### Fixed
- Removed unused import in `lib/ai/life-plan-prompts.ts` (QuestionnaireAnswers)

---

## [2025-12-26] - Initial Life Plan System (Previous Session)

### Added

**Complete Life Plan Generation System**
- OpenAI GPT-4o integration with structured JSON output
- AI prompt system with role definition and output structure
- Profile extraction engine (auto-distributes data to 4 profile types)
- 8 database tables (life_plans, life_plan_versions, 4 profile tables, next_actions, events)
- Row-Level Security policies on all tables
- Complete TypeScript type system for Life Plan structures
- API endpoint: POST /api/life-plan/generate
- Audit logging for all generations

**Impact:** Users can now generate comprehensive, personalized Life Plans
**Files:**
- `lib/types/life-plan.ts` (9.5 KB)
- `lib/ai/life-plan-prompts.ts` (7.5 KB → 8 KB today)
- `lib/ai/extract-profiles.ts` (20 KB)
- `supabase/migrations/20251226054344_life_plan_system.sql` (13 KB)
- `app/api/life-plan/generate/route.ts`
- `LIFE_PLAN_SYSTEM_SUMMARY.md` (documentation)

**Database Schema**
- `life_plan_versions` - Stores each AI generation with complete JSON
- `life_plans` - Points to current active version
- `plan_generation_events` - Audit log
- `user_jobs_profiles` - Career/employment data → Powers Jobs features
- `user_learning_profiles` - Learning style data → Powers Courses features
- `user_wellness_profiles` - Health/wellness data → Powers FE Button, Daily Boost
- `user_financial_profiles` - Financial situation data → Powers future budget features
- `user_next_actions` - Timeframed actions → Powers Dashboard

**Dependencies**
- Installed `openai` npm package
- Added `OPENAI_API_KEY` to `.env.local`

### Fixed
- AI JSON structure enforcement (added explicit schema to prompt)
- Database migration issues (dropped and recreated all tables with CASCADE)
- Tables in wrong schema (verified all tables in public schema)
- Session caching preventing new account creation

---

## [Earlier] - Onboarding & Questionnaire System

### Added
- 20-question Life Plan questionnaire
- 4 question groups (Current Situation, Career/Tech, Learning Style, Health/Goals)
- Questionnaire answer storage in `questionnaire_answers` table
- Onboarding flow with step tracking

**Files:**
- `src/content/lifePlanQuestionnaire.ts`
- Database: `questionnaire_answers` table

---

## How to Update This Changelog

**After completing a feature:**
```markdown
### Added / Changed / Fixed / Removed

**Feature Name**
- Bullet point describing what changed
- Bullet point describing impact
- Why we did it (if not obvious)

**Impact:** How this helps users
**Files:** List of files affected
```

**When starting a new day:**
- Create new date section at top
- Move completed Unreleased items to dated section
- Update CURRENT_WORK.md to reflect new state

**When shipping to users:**
- Add version number to date: `## [1.0.0] - 2025-12-26`
- Tag git commit with version
- Celebrate! 🎉
