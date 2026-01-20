-- ============================================================================
-- LIFE PLAN SYSTEM - Complete Database Schema
-- ============================================================================
-- This migration creates all tables needed for the Life Plan generation system
-- and derived profiles that power different features across the app.
--
-- Structure:
-- 1. Core Life Plan tables (versions, current plan pointer)
-- 2. Derived Profile tables (jobs, learning, wellness, financial)
-- 3. User Actions tracking (for dashboard)
-- 4. Audit/Events logging
-- 5. Row-Level Security (RLS) policies
-- ============================================================================

-- ============================================================================
-- 1. CORE LIFE PLAN TABLES
-- ============================================================================

-- Life Plan Versions (stores each AI generation)
CREATE TABLE IF NOT EXISTS public.life_plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
  model text NOT NULL,                      -- "gpt-4o-2024-08-06", etc.
  prompt_version text NOT NULL,             -- "v1", "v2" for tracking prompt changes
  source_answers jsonb NOT NULL,            -- Snapshot of questionnaire answers
  plan_json jsonb NOT NULL,                 -- The full LifePlan object
  tokens_used integer DEFAULT 0,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Life Plans (points to current active version)
CREATE TABLE IF NOT EXISTS public.life_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_version_id uuid REFERENCES public.life_plan_versions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Plan Generation Events (audit log)
CREATE TABLE IF NOT EXISTS public.plan_generation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,  -- 'initial_generation', 'regeneration', 'generation_failed'
  tier_at_time text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. DERIVED PROFILE TABLES (Auto-extracted from Life Plan)
-- ============================================================================

-- Jobs/Career Profile (for Jobs, Resume Builder, Application Assistant)
CREATE TABLE IF NOT EXISTS public.user_jobs_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  life_plan_version_id uuid REFERENCES public.life_plan_versions(id),
  working_style_preference text CHECK (working_style_preference IN ('employee', 'freelancer', 'business_owner', 'hybrid')),
  career_goal_12_month text NOT NULL,
  background_record_status text CHECK (background_record_status IN ('clean', 'misdemeanors', 'felonies_old', 'felonies_recent')),
  resume_readiness text CHECK (resume_readiness IN ('none', 'outdated', 'gaps', 'current')),
  biggest_blocker text CHECK (biggest_blocker IN ('record', 'skills', 'confidence', 'overwhelmed')),
  employment_status text CHECK (employment_status IN ('unemployed', 'part_time', 'full_time_unhappy', 'self_employed_unstable')),
  skills_to_highlight text[] DEFAULT '{}',
  recommended_job_types text[] DEFAULT '{}',
  felon_friendly_filter_needed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Learning Profile (for Courses)
CREATE TABLE IF NOT EXISTS public.user_learning_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  life_plan_version_id uuid REFERENCES public.life_plan_versions(id),
  learning_preference text CHECK (learning_preference IN ('video', 'reading', 'hands_on', 'coaching')),
  daily_study_time_available text CHECK (daily_study_time_available IN ('under_30min', '1_2_hours', '3_5_hours', '6plus_hours')),
  camera_comfort_level text CHECK (camera_comfort_level IN ('love_it', 'willing_to_learn', 'behind_scenes_only', 'refuse')),
  recommended_course_categories text[] DEFAULT '{}',
  skills_gaps_to_address text[] DEFAULT '{}',
  tech_skill_level text CHECK (tech_skill_level IN ('beginner', 'played_around', 'tried_code', 'built_projects')),
  business_interest text CHECK (business_interest IN ('service', 'digital', 'physical', 'social_media', 'job_only')),
  social_media_interest text CHECK (social_media_interest IN ('influencer', 'marketing', 'business_promo', 'not_interested')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Wellness Profile (for FE Button, Daily Boost, wellness features)
CREATE TABLE IF NOT EXISTS public.user_wellness_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  life_plan_version_id uuid REFERENCES public.life_plan_versions(id),
  physical_priority_area text CHECK (physical_priority_area IN ('sleep', 'diet', 'exercise', 'substance_use')),
  stress_management_style text CHECK (stress_management_style IN ('shut_down', 'get_angry', 'unhealthy_habits', 'manage_okay')),
  support_system_status text CHECK (support_system_status IN ('none', 'negative_people', 'few_supporters', 'strong_support')),
  inner_growth_focus text CHECK (inner_growth_focus IN ('purpose', 'mindfulness', 'faith', 'discipline')),
  main_distractions text CHECK (main_distractions IN ('social_media', 'entertainment', 'party_lifestyle', 'family_obligations')),
  motivation_reason text CHECK (motivation_reason IN ('family', 'prove_wrong', 'tired_struggling', 'fulfill_potential')),
  wellness_recommendations text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Financial Profile (for financial tracking, budget features)
CREATE TABLE IF NOT EXISTS public.user_financial_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  life_plan_version_id uuid REFERENCES public.life_plan_versions(id),
  income_vs_bills_status text CHECK (income_vs_bills_status IN ('drowning_debt', 'breaking_even', 'little_leftover', 'stable_invest')),
  financial_priority text CHECK (financial_priority IN ('immediate_income', 'debt_management', 'build_savings', 'invest_growth')),
  tech_equipment_available text CHECK (tech_equipment_available IN ('smartphone_only', 'tablet_chromebook', 'laptop_desktop', 'full_setup')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. USER ACTIONS TRACKING (for Dashboard "Your Next Steps")
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_next_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  life_plan_version_id uuid NOT NULL REFERENCES public.life_plan_versions(id) ON DELETE CASCADE,
  timeframe text NOT NULL CHECK (timeframe IN ('7_days', '30_days', '90_days', '12_months')),
  action_order integer NOT NULL,
  priority text NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  category text NOT NULL CHECK (category IN ('employment', 'financial', 'skills', 'health', 'mindset', 'legal')),
  title text NOT NULL,
  description text NOT NULL,
  why_it_matters text NOT NULL,
  estimated_time text NOT NULL,
  fe_tools_to_use text[] DEFAULT '{}',
  external_resources text[] DEFAULT '{}',
  completion_criteria text NOT NULL,
  is_quick_win boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast queries by user + timeframe
CREATE INDEX IF NOT EXISTS idx_user_next_actions_user_timeframe
  ON public.user_next_actions(user_id, timeframe, action_order);

-- Index for fast queries by status
CREATE INDEX IF NOT EXISTS idx_user_next_actions_status
  ON public.user_next_actions(user_id, status);

-- ============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.life_plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_generation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_jobs_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wellness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_next_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

CREATE POLICY "Users access own plan versions" ON public.life_plan_versions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own plan" ON public.life_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own generation events" ON public.plan_generation_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own jobs profile" ON public.user_jobs_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own learning profile" ON public.user_learning_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own wellness profile" ON public.user_wellness_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own financial profile" ON public.user_financial_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own next actions" ON public.user_next_actions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

-- Reuse existing set_updated_at function (from profiles migration)

CREATE TRIGGER set_updated_at_life_plans
BEFORE UPDATE ON public.life_plans
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_jobs_profiles
BEFORE UPDATE ON public.user_jobs_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_learning_profiles
BEFORE UPDATE ON public.user_learning_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_wellness_profiles
BEFORE UPDATE ON public.user_wellness_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_financial_profiles
BEFORE UPDATE ON public.user_financial_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_user_next_actions
BEFORE UPDATE ON public.user_next_actions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for looking up current plan by user
CREATE INDEX IF NOT EXISTS idx_life_plans_user
  ON public.life_plans(user_id);

-- Index for looking up versions by user
CREATE INDEX IF NOT EXISTS idx_life_plan_versions_user
  ON public.life_plan_versions(user_id, created_at DESC);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_user_jobs_profiles_user
  ON public.user_jobs_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_learning_profiles_user
  ON public.user_learning_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_wellness_profiles_user
  ON public.user_wellness_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_financial_profiles_user
  ON public.user_financial_profiles(user_id);
