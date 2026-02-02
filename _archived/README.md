# Archived Code

This folder contains code from the original full web app that was archived when the project was simplified to an informational landing page only.

**Archived on:** 2026-01-31

**Why archived:** The project was originally a full web app with authentication and waitlist signup, but was converted to a simple informational landing page for developer account approval. The native mobile app will handle all user accounts and features. This code is preserved for potential future use on the website.

---

## What's Here

### app/(tunnel)/ - Authentication Pages

| File/Folder | Purpose | Original Location |
|-------------|---------|-------------------|
| `signup/page.tsx` | User registration/waitlist signup form | `app/(tunnel)/signup/page.tsx` |
| `login/page.tsx` | User login form | `app/(tunnel)/login/page.tsx` |
| `forgot-password/page.tsx` | Password reset request form | `app/(tunnel)/forgot-password/page.tsx` |
| `reset-password/page.tsx` | Password reset form (from email link) | `app/(tunnel)/reset-password/page.tsx` |
| `layout.tsx` | Shared layout for auth tunnel pages | `app/(tunnel)/layout.tsx` |

### app/auth/ - Auth Callback

| File | Purpose | Original Location |
|------|---------|-------------------|
| `callback/route.ts` | Supabase auth callback handler (email verification) | `app/auth/callback/route.ts` |

### app/ - Other App Pages

| File | Purpose | Original Location |
|------|---------|-------------------|
| `welcome/page.tsx` | Post-signup "You're on the list!" confirmation page | `app/welcome/page.tsx` |
| `providers.tsx` | React context providers (AuthProvider, ErrorBoundary) | `app/providers.tsx` |

### lib/ - Auth Infrastructure

| File | Purpose | Original Location |
|------|---------|-------------------|
| `auth-context.tsx` | React context for auth state (session, user, signOut) | `lib/auth-context.tsx` |
| `supabase/server.ts` | Supabase client for server-side operations | `lib/supabase/server.ts` |
| `supabase/browser.ts` | Supabase client for browser-side operations | `lib/supabase/browser.ts` |

### components/ - UI Components

| File | Purpose | Original Location |
|------|---------|-------------------|
| `error-boundary.tsx` | React error boundary component | `components/error-boundary.tsx` |
| `layout/app-shell.tsx` | Main app shell with navigation (from earlier archive) | `components/layout/app-shell.tsx` |
| `layout/onboarding-header.tsx` | Header for onboarding flow | `components/layout/onboarding-header.tsx` |

---

## Database Tables (Already in Supabase)

These tables exist in the production database and are ready to use if you reconnect auth:

| Table | Purpose | Status |
|-------|---------|--------|
| `profiles` | User profile data (name, zip, onboarding step) | Dormant (no users without auth) |
| `questionnaire_answers` | Life Plan questionnaire responses | Dormant |
| `life_plans` | Generated life plans | Dormant |
| `jobs` | Job listings | Dormant |
| `saved_jobs` | User's saved jobs | Dormant |
| `fe_resumes` | User-generated resumes | Dormant |
| `path_questionnaire_answers` | User path selection | Dormant |

The migrations for these tables are in `supabase/migrations/` and have already been applied to production.

---

## How to Reconnect Authentication

### Step 1: Restore Supabase Clients

```bash
mkdir -p lib/supabase
mv _archived/lib/supabase/server.ts lib/supabase/
mv _archived/lib/supabase/browser.ts lib/supabase/
mv _archived/lib/auth-context.tsx lib/
```

### Step 2: Restore Providers

```bash
mv _archived/app/providers.tsx app/
mv _archived/components/error-boundary.tsx components/
```

Update `app/layout.tsx` to wrap children with Providers:
```tsx
import { Providers } from "./providers";
// ...
<Providers>{children}</Providers>
```

### Step 3: Restore Auth Pages

```bash
mkdir -p "app/(tunnel)"
mv "_archived/app/(tunnel)/signup" "app/(tunnel)/"
mv "_archived/app/(tunnel)/login" "app/(tunnel)/"
mv "_archived/app/(tunnel)/forgot-password" "app/(tunnel)/"
mv "_archived/app/(tunnel)/reset-password" "app/(tunnel)/"
mv "_archived/app/(tunnel)/layout.tsx" "app/(tunnel)/"

mkdir -p app/auth
mv _archived/app/auth/callback app/auth/

mv _archived/app/welcome app/
```

### Step 4: Restore Header/Footer Links

Update `components/landing/landing-header.tsx` to add login/signup links back.
Update `components/landing/landing-footer.tsx` to add login/signup links back.

### Step 5: Update Content CTAs

Update `src/content/landing.ts` to change `href: "#"` back to `href: "/signup"` for CTAs.

---

## Environment Variables Required

When reconnecting auth, ensure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Notes

- All code here is tracked in git history
- Database migrations should NOT be moved - they're already applied to production
- The Supabase project is still connected and ready to use
- Mobile app will use the same Supabase project, so users created on web would work in the app
