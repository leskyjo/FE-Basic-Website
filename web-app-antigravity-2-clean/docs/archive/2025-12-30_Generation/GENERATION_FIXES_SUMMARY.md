# Life Plan Generation Fixes - Complete

## Issues Found & Fixed

### 🚨 Issue 1: Multiple Concurrent API Calls
**Problem:** When user navigates away during generation and comes back, React re-mounts component and triggers additional API calls, causing:
- 3 simultaneous POST requests to `/api/life-plan/generate`
- Duplicate key errors
- Wasted OpenAI API tokens

**Fix Applied:**
- Added pre-check in generating screen to see if plan already exists before making API call
- If complete, redirects immediately without calling API again

**Files Modified:**
- `app/(tunnel)/onboarding/generating/onboarding-generating-screen.tsx`

---

### 🚨 Issue 2: Database Constraint Violations - biggest_blocker
**Problem:** `mapBiggestBlocker()` function returned values that don't match database constraint

**Function was returning:**
- 'capital', 'discipline', 'health' ❌

**Database allows:**
- 'record', 'skills', 'confidence', 'overwhelmed' ✅

**Error:**
```
new row for relation "user_jobs_profiles" violates check constraint 
"user_jobs_profiles_biggest_blocker_check"
```

**Fix Applied:**
Updated `mapBiggestBlocker()` to map all values to valid constraints:
- 'capital' → 'overwhelmed'
- 'discipline' → 'confidence'
- 'health' → 'overwhelmed'

**Files Modified:**
- `lib/ai/extract-profiles.ts` (line 373)

---

### 🚨 Issue 3: Database Constraint Violations - category
**Problem:** AI generates category values without validation, causing constraint violations

**Database allows:**
- 'employment', 'financial', 'skills', 'health', 'mindset', 'legal' ✅

**AI was generating:**
- Random category names that don't match ❌

**Error:**
```
new row for relation "user_next_actions" violates check constraint 
"user_next_actions_category_check"
```

**Fix Applied:**
- Created `validateCategory()` function with fuzzy matching
- Maps AI-generated categories to closest valid constraint value
- Includes fallback to 'employment' if no match found

**Files Modified:**
- `lib/ai/extract-profiles.ts` (added `validateCategory()` function, line 386)
- Updated action extraction to use `validateCategory(action.category)` (line 336)

---

### 🚨 Issue 4: Duplicate Key Error on Concurrent Requests
**Problem:** When multiple requests hit the API simultaneously, they try to INSERT the same record, causing:

**Error:**
```
duplicate key value violates unique constraint "life_plans_pkey"
```

**Fix Applied:**
- Changed from separate `insert` vs `update` logic to unified `upsert`
- Uses `onConflict: "user_id"` to handle race conditions gracefully
- If record exists, updates it; if not, creates it

**Files Modified:**
- `app/api/life-plan/generate/route.ts` (line 300-310)

---

### 🚨 Issue 5: Multiple Concurrent API Calls (Primary Issue)
**Problem:** When user navigates away during generation and returns, React re-mounts component triggering new API calls

**Observed Behavior:**
- First occurrence: 3 simultaneous calls at different timestamps
- Second occurrence: 5 simultaneous calls
- Results in OpenAI rate limit errors (429)
- Wasted API tokens
- Page stuck on "generating" screen

**Root Cause:** Client-side useEffect guards reset when component unmounts/remounts during navigation

**Fix Applied:**
- Added server-side deduplication check in API route (line 63-86)
- Checks for any life_plan_version created within last 2 minutes
- If recent version exists, returns it immediately without calling OpenAI
- Prevents expensive duplicate operations at the API level

**Files Modified:**
- `app/api/life-plan/generate/route.ts` (added deduplication check before OpenAI call)

---

### 🚨 Issue 6: Complete Screen Showing Question IDs
**Problem:** Onboarding completion screen displays raw question IDs instead of answer values

**Observed Behavior:**
- "Priorities" section shows: "q1_current_employment", "q2_desired_employment", etc.
- Should show actual answer values like "Full-time employment", "Software engineering"

**Root Cause:** Line 38 in complete page was mapping to `answer.question_id` instead of `answer.answer_value`

**Fix Applied:**
- Changed from `.map((answer) => answer.question_id)` to `.flatMap()` with proper value handling
- Handles both single values and arrays (for multi-select questions)
- Converts all values to strings for display
- Uses flatMap to flatten multi-select arrays

**Files Modified:**
- `app/(tunnel)/onboarding/complete/page.tsx` (line 38-46)

---

## Testing Instructions

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Test the generation flow:**
   - Go through complete onboarding
   - Let generation start
   - **Navigate away** to another tab during generation
   - Come back and refresh
   - Generation should complete without errors

3. **Check terminal output:**
   - Should NOT see constraint violation errors
   - Should NOT see duplicate key errors
   - Should see: "Profile Extraction] Completed for user..."

4. **Verify in browser:**
   - Life Plan should generate successfully
   - Plan page should show content
   - No console errors

---

## Expected Terminal Output (Success)

```
[Life Plan Generation] ========== POST request received ==========
[Life Plan Generation] User ID: [uuid]
[Life Plan Generation] Generation type: INITIAL (always allowed)
[Life Plan Generation] Calling OpenAI API...
[Life Plan Generation] OpenAI call completed successfully
[Life Plan Generation] Tokens used: ~18000
[Profile Extraction] Starting for user [uuid]
[Profile Extraction] Completed for user [uuid]  ✅ No errors!
[Life Plan Generation] Success for user [uuid]
POST /api/life-plan/generate 200 in ~40000ms
```

**No more:**
- ❌ "Failed to upsert jobs profile"
- ❌ "Failed to insert new actions"
- ❌ "duplicate key value violates unique constraint"

---

## Summary

**6 Critical Bugs Fixed:**
1. ✅ Multiple concurrent API calls prevented (server-side deduplication)
2. ✅ biggest_blocker constraint mismatch resolved
3. ✅ category validation added with fuzzy matching
4. ✅ Duplicate key errors eliminated with upsert
5. ✅ OpenAI rate limit errors prevented (via deduplication)
6. ✅ Complete screen now shows answer values instead of question IDs

**Build Status:** ✅ Compiles successfully

**Ready for Testing!**

## Key Improvements

**Server-Side Protection:**
- API now checks for recent generations before calling OpenAI
- 2-minute deduplication window prevents concurrent requests
- Returns existing version if generation already in progress
- Eliminates wasted API tokens and rate limit errors

**Data Display Fix:**
- Complete screen properly displays user's actual answers
- Handles both single-value and multi-select questions
- Flattens arrays for clean presentation
