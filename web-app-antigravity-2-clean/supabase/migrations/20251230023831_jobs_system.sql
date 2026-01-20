-- ============================================================================
-- JOBS SYSTEM - Complete Database Schema
-- ============================================================================
-- This migration creates all tables needed for the Career Finder Studio (Jobs)
-- system including job listings, saved jobs, resumes, applications, interview
-- prep, and usage tracking.
--
-- Structure:
-- 1. Core Job tables (listings, saved jobs)
-- 2. User Career Data (skills, career intent)
-- 3. Generated Content (resumes, application sessions, interview prep)
-- 4. Usage Tracking (periods, events, audit log)
-- 5. Row-Level Security (RLS) policies
-- 6. Indexes for performance
-- ============================================================================

-- ============================================================================
-- 1. CORE JOB TABLES
-- ============================================================================

-- Jobs (cached job listings from JSearch API)
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,                  -- JSearch job ID
  title text NOT NULL,
  company text NOT NULL,
  description text,
  location jsonb,                           -- {city, state, zip, coordinates, formatted_address}
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'USD',
  job_type text,                            -- full-time, part-time, contract, temporary
  experience_level text,                    -- entry, mid, senior, executive
  requirements jsonb,                       -- {degree: bool, experience_years: int, skills: [], certifications: []}
  tags text[] DEFAULT '{}',
  apply_url text,
  posted_at timestamptz,
  expires_at timestamptz,
  source text DEFAULT 'jsearch',            -- jsearch, manual, etc.
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Saved Jobs (user bookmarks with tier limits: Starter 5, Trial 10, Plus 15, Pro 30)
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score integer,                      -- Cached AI score at save time
  notes text,
  status text CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'hired')),
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- ============================================================================
-- 2. USER CAREER DATA (Skills, Intent, Work History)
-- ============================================================================

-- User Skills (detailed employment information beyond questionnaire)
CREATE TABLE IF NOT EXISTS public.user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  skills_raw text[] DEFAULT '{}',           -- User-entered skills
  skills_normalized text[] DEFAULT '{}',    -- AI-normalized for matching
  work_bullets text[] DEFAULT '{}',         -- Brief work history bullets
  certifications text[] DEFAULT '{}',
  licenses text[] DEFAULT '{}',
  proof_links text[] DEFAULT '{}',          -- Portfolio URLs, LinkedIn, etc.
  ats_keywords text[] DEFAULT '{}',         -- Extracted by AI for resume optimization
  last_updated_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User Career Intent (Career Intent Box - free-form + AI-parsed)
CREATE TABLE IF NOT EXISTS public.user_career_intent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  raw_text text,                            -- User's free-form career goals
  parsed_data jsonb,                        -- AI-extracted: {target_roles: [], industries: [], constraints: {}}
  locked_constraints jsonb,                 -- User-locked constraints (e.g., "no travel", "remote only")
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. GENERATED CONTENT (Resumes, Application Assists, Interview Prep)
-- ============================================================================

-- FE Resumes (AI-generated resumes with ATS scoring)
-- Tier limits: Plus 5/month, Pro 10/month, Single purchase $3.99
CREATE TABLE IF NOT EXISTS public.fe_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  resume_data jsonb NOT NULL,               -- Full resume content (structured)
  resume_type text CHECK (resume_type IN ('ats', 'creative')) DEFAULT 'ats',
  tailored_to_job uuid REFERENCES public.jobs(id),
  ats_score integer,                        -- AI-calculated ATS compatibility (0-100)
  pdf_url text,                             -- Generated PDF storage URL
  docx_url text,                            -- Generated DOCX storage URL
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Application Sessions (Application Assistant history)
-- Tier limits: Starter 1 sample, Plus 15/month, Pro 30/month
CREATE TABLE IF NOT EXISTS public.application_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.jobs(id),
  resume_id uuid REFERENCES public.fe_resumes(id),
  questions jsonb NOT NULL,                 -- Application questions from job posting
  answers jsonb NOT NULL,                   -- AI-generated answers
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Interview Prep Sessions (Interview preparation content)
-- Tier limits: Plus 3/month, Pro 6/month
CREATE TABLE IF NOT EXISTS public.interview_prep_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.jobs(id),
  resume_id uuid REFERENCES public.fe_resumes(id),
  prep_type text CHECK (prep_type IN ('standard', 'behavioral', 'technical')),
  generated_content jsonb NOT NULL,         -- Questions, answers, tips, company research
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. USAGE TRACKING (Monthly quotas and audit log)
-- ============================================================================

-- Usage Periods (monthly quota tracking per user)
CREATE TABLE IF NOT EXISTS public.usage_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  lifeplan_regens_count integer DEFAULT 0,
  resume_generations_count integer DEFAULT 0,
  application_assists_count integer DEFAULT 0,
  interview_preps_count integer DEFAULT 0,
  ai_messages_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_start)
);

-- Usage Events (append-only audit log for all feature usage)
CREATE TABLE IF NOT EXISTS public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,                 -- 'resume_generated', 'job_saved', 'application_assist', etc.
  tier_at_time text NOT NULL,               -- User's tier when event occurred
  metadata jsonb,                           -- Event-specific data (job_id, resume_id, etc.)
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all user-scoped tables
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_career_intent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fe_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_prep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- Note: public.jobs table does NOT have RLS (all users can view all jobs)

-- RLS Policies: Users can only access their own data

CREATE POLICY "Users access own saved jobs" ON public.saved_jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own skills" ON public.user_skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own career intent" ON public.user_career_intent
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own resumes" ON public.fe_resumes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own application sessions" ON public.application_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own interview prep sessions" ON public.interview_prep_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own usage periods" ON public.usage_periods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own usage events" ON public.usage_events
  FOR ALL USING (auth.uid() = user_id);

-- Public jobs table: all authenticated users can read
CREATE POLICY "All users can view jobs" ON public.jobs
  FOR SELECT USING (true);

-- Only system can insert/update/delete jobs (via service role)
-- No INSERT/UPDATE/DELETE policies means only service role can modify

-- ============================================================================
-- 6. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

-- Reuse existing set_updated_at function (from profiles migration)

CREATE TRIGGER set_updated_at_jobs
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_saved_jobs
BEFORE UPDATE ON public.saved_jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_career_intent
BEFORE UPDATE ON public.user_career_intent
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_fe_resumes
BEFORE UPDATE ON public.fe_resumes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_usage_periods
BEFORE UPDATE ON public.usage_periods
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Job listings indexes (for search and filtering)
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs USING GIN (location);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON public.jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs USING gin(to_tsvector('english', company));
CREATE INDEX IF NOT EXISTS idx_jobs_tags ON public.jobs USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON public.jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_jobs_external_id ON public.jobs (external_id);

-- Saved jobs indexes
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_status ON public.saved_jobs (user_id, status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_created ON public.saved_jobs (created_at DESC);

-- User skills indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills (user_id);

-- Resumes indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user ON public.fe_resumes (user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_active ON public.fe_resumes (user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resumes_job ON public.fe_resumes (tailored_to_job);

-- Application sessions indexes
CREATE INDEX IF NOT EXISTS idx_app_sessions_user ON public.application_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_app_sessions_created ON public.application_sessions (created_at DESC);

-- Interview prep indexes
CREATE INDEX IF NOT EXISTS idx_interview_prep_user ON public.interview_prep_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_interview_prep_created ON public.interview_prep_sessions (created_at DESC);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_periods_user ON public.usage_periods (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_periods_current ON public.usage_periods (user_id, period_start DESC);

CREATE INDEX IF NOT EXISTS idx_usage_events_user ON public.usage_events (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON public.usage_events (event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created ON public.usage_events (created_at DESC);
