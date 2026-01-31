# Archived Code

This folder contains code from the original full web app that was archived when the project was simplified to a landing page + waitlist signup.

**Archived on:** 2026-01-30

**Why archived:** The project was originally a full web app (mobile-first PWA) but was converted to a simple landing page website when the decision was made to build a native mobile app instead. This code was preserved for potential future use.

---

## What's Here

### components/layout/

| File | Purpose | Original Location |
|------|---------|-------------------|
| `app-shell.tsx` | Main app shell with top/bottom navigation for the authenticated app experience | `components/layout/app-shell.tsx` |
| `onboarding-header.tsx` | Header for the onboarding flow with idle timeout, back/logout buttons | `components/layout/onboarding-header.tsx` |

---

## Database Tables (Already in Supabase)

These tables exist in the production database and are ready to use if you reconnect this code:

| Table | Purpose | Used By |
|-------|---------|---------|
| `profiles` | User profile data (name, zip, onboarding step) | Waitlist (active), Onboarding (archived) |
| `questionnaire_answers` | Life Plan questionnaire responses | Life Plan system |
| `life_plans` | Generated life plans | Life Plan system |
| `jobs` | Job listings | Jobs feature |
| `saved_jobs` | User's saved jobs | Jobs feature |
| `fe_resumes` | User-generated resumes | Resume builder |
| `path_questionnaire_answers` | User path selection | Onboarding flow |

The migrations for these tables are in `supabase/migrations/` and have already been applied to production.

---

## How to Reconnect

### App Shell (Full App Navigation)

1. Move `_archived/components/layout/app-shell.tsx` back to `components/layout/`
2. The file imports navigation components that don't exist yet:
   - `../navigation/app-nav` (TopNav, BottomNav)
   - `../nav/mobile-bottom-nav` (MobileBottomNav)
3. You'll need to either:
   - Create these navigation components, OR
   - Modify app-shell.tsx to use different navigation

### Onboarding Header

1. Move `_archived/components/layout/onboarding-header.tsx` back to `components/layout/`
2. Import it in your onboarding pages:
   ```tsx
   import { OnboardingHeader } from "@/components/layout/onboarding-header";
   ```
3. Uses `useAuth` from `@/lib/auth-context` (still in the project)

---

## Related: Life Plan Preview Feature

If you want to add a Life Plan preview to the website (let users try the questionnaire and see a sample plan), you would need:

1. **Questionnaire UI** - Build a form for the 20 questions
2. **API endpoint** - Create `/api/life-plan/generate` to call OpenAI
3. **Plan display** - Component to show the generated plan

The database tables (`questionnaire_answers`, `life_plans`) are already in place. The same Supabase auth that powers the waitlist signup would work for this.

---

## Notes

- All code here is tracked in git history
- Database migrations should NOT be moved - they're already applied to production
- The `profiles` table is actively used by the waitlist; other tables are dormant
