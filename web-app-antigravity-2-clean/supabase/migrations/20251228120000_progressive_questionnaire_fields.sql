-- ============================================================================
-- PROGRESSIVE QUESTIONNAIRE SYSTEM - New Fields Migration
-- ============================================================================
-- This migration adds columns to support the new progressive questionnaire system:
-- - 10-question onboarding (saved to profiles table)
-- - 6-question Jobs section questionnaire (saved to user_jobs_profiles)
-- - 8-question Courses section questionnaire (saved to user_learning_profiles)
--
-- Pattern: Current → Desired → Willingness
-- Enables: GAP analysis, buying intent qualification, hyper-personalization
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE - Onboarding Questionnaire Data (Q1-Q10)
-- ============================================================================

-- Employment & Income (Q1-Q3)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_employment text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS desired_employment text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_income_range text;

-- Barriers & Solutions (Q4-Q6)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biggest_barrier text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS willingness_level integer CHECK (willingness_level >= 1 AND willingness_level <= 5);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS willingness_strategies text[] DEFAULT '{}';

-- Housing & Stability (Q7-Q8)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS housing_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS housing_goal text;

-- Goals & Commitment (Q9-Q10)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS strategic_goal_30_days text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commitment_level integer CHECK (commitment_level >= 1 AND commitment_level <= 5);

-- ============================================================================
-- 2. USER_JOBS_PROFILES TABLE - Jobs Section Questionnaire Data (Q11-Q16)
-- ============================================================================

-- Career Direction (Q11-Q12)
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS desired_employment_type text;
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS desired_industries text[] DEFAULT '{}';
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS desired_salary_range text;

-- Legal Barriers (Q13-Q14)
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS incarceration_timeline text;
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS legal_restrictions text[] DEFAULT '{}';

-- Practical Constraints (Q15-Q16)
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS transportation_access text;
ALTER TABLE public.user_jobs_profiles ADD COLUMN IF NOT EXISTS supervision_status text;

-- ============================================================================
-- 3. USER_LEARNING_PROFILES TABLE - Courses Section Questionnaire Data (Q17-Q24)
-- ============================================================================

-- Current Skills (Q17-Q18)
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS computer_literacy_level text;
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS existing_skills text[] DEFAULT '{}';

-- Skill Goals (Q19-Q20)
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS digital_skill_interest text;
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS physical_skill_interest text;

-- Learning Capacity (Q21-Q22)
-- Note: learning_preference already exists (different question)
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS hardware_access text;

-- Business Ambition (Q23-Q24)
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS business_model_preference text;
ALTER TABLE public.user_learning_profiles ADD COLUMN IF NOT EXISTS business_experience_level text;

-- ============================================================================
-- 4. USER_FINANCIAL_PROFILES TABLE - Financial Data from Onboarding
-- ============================================================================

-- Income & Housing (from onboarding Q3, Q7, Q8)
ALTER TABLE public.user_financial_profiles ADD COLUMN IF NOT EXISTS monthly_income_range text;
ALTER TABLE public.user_financial_profiles ADD COLUMN IF NOT EXISTS housing_status text;
ALTER TABLE public.user_financial_profiles ADD COLUMN IF NOT EXISTS housing_goal text;

-- ============================================================================
-- 5. USER_WELLNESS_PROFILES TABLE - Wellness Data from Onboarding
-- ============================================================================

-- Willingness & Commitment (from onboarding Q5, Q6, Q10)
ALTER TABLE public.user_wellness_profiles ADD COLUMN IF NOT EXISTS willingness_level integer CHECK (willingness_level >= 1 AND willingness_level <= 5);
ALTER TABLE public.user_wellness_profiles ADD COLUMN IF NOT EXISTS commitment_level integer CHECK (commitment_level >= 1 AND commitment_level <= 5);
ALTER TABLE public.user_wellness_profiles ADD COLUMN IF NOT EXISTS accountability_preferences text[] DEFAULT '{}';

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN public.profiles.current_employment IS 'Q1: Current employment situation (unemployed, part-time, full-time, self-employed, zero_income)';
COMMENT ON COLUMN public.profiles.desired_employment IS 'Q2: Desired employment type (full-time W2, own business, etc.)';
COMMENT ON COLUMN public.profiles.current_income_range IS 'Q3: Current monthly income range';
COMMENT ON COLUMN public.profiles.biggest_barrier IS 'Q4: Biggest barrier to success (criminal record, skills gap, confidence, overwhelm)';
COMMENT ON COLUMN public.profiles.willingness_level IS 'Q5: Willingness level 1-5 (1=exploring, 5=make it happen)';
COMMENT ON COLUMN public.profiles.willingness_strategies IS 'Q6: Multi-select willingness strategies (training_courses, life_coach, invest_tools, strict_routine, none) - CRITICAL for buying intent qualification';
COMMENT ON COLUMN public.profiles.housing_status IS 'Q7: Current housing situation';
COMMENT ON COLUMN public.profiles.housing_goal IS 'Q8: Housing goal/desire';
COMMENT ON COLUMN public.profiles.strategic_goal_30_days IS 'Q9: Free-text 30-day goal - GOLDEN QUESTION for hyper-personalization';
COMMENT ON COLUMN public.profiles.commitment_level IS 'Q10: Commitment level 1-5 (scales plan aggressiveness)';

COMMENT ON COLUMN public.user_jobs_profiles.desired_employment_type IS 'Q11 equivalent: Desired employment type (duplicates Q2 for consistency)';
COMMENT ON COLUMN public.user_jobs_profiles.desired_industries IS 'Q11: Multi-select desired industries (construction, tech, healthcare, etc.)';
COMMENT ON COLUMN public.user_jobs_profiles.desired_salary_range IS 'Q12: Desired salary range for job matching';
COMMENT ON COLUMN public.user_jobs_profiles.incarceration_timeline IS 'Q13: When incarceration occurred (affects background check strategy)';
COMMENT ON COLUMN public.user_jobs_profiles.legal_restrictions IS 'Q14: Multi-select legal restrictions (probation, parole, travel limits, etc.)';
COMMENT ON COLUMN public.user_jobs_profiles.transportation_access IS 'Q15: Transportation access level (none, public, own_car, etc.)';
COMMENT ON COLUMN public.user_jobs_profiles.supervision_status IS 'Q16: Supervision status (none, probation, parole)';

COMMENT ON COLUMN public.user_learning_profiles.computer_literacy_level IS 'Q17: Computer literacy level (beginner, basic, intermediate, advanced)';
COMMENT ON COLUMN public.user_learning_profiles.existing_skills IS 'Q18: Multi-select existing certifications/skills';
COMMENT ON COLUMN public.user_learning_profiles.digital_skill_interest IS 'Q19: Digital skill interest (coding, design, marketing, etc.)';
COMMENT ON COLUMN public.user_learning_profiles.physical_skill_interest IS 'Q20: Physical/trade skill interest (welding, HVAC, CDL, etc.)';
COMMENT ON COLUMN public.user_learning_profiles.hardware_access IS 'Q22: Hardware access (smartphone_only, tablet, laptop, full_setup)';
COMMENT ON COLUMN public.user_learning_profiles.business_model_preference IS 'Q23: Business model preference (service, product, digital, social_media)';
COMMENT ON COLUMN public.user_learning_profiles.business_experience_level IS 'Q24: Business experience level (never, tried, active, successful)';

COMMENT ON COLUMN public.user_financial_profiles.monthly_income_range IS 'From Q3: Current monthly income for financial planning';
COMMENT ON COLUMN public.user_financial_profiles.housing_status IS 'From Q7: Current housing for financial stability assessment';
COMMENT ON COLUMN public.user_financial_profiles.housing_goal IS 'From Q8: Housing goal for financial planning';

COMMENT ON COLUMN public.user_wellness_profiles.willingness_level IS 'From Q5: Willingness level for wellness commitment assessment';
COMMENT ON COLUMN public.user_wellness_profiles.commitment_level IS 'From Q10: Commitment level for wellness program intensity';
COMMENT ON COLUMN public.user_wellness_profiles.accountability_preferences IS 'From Q6 willingness_strategies: Accountability preferences (strict_routine, life_coach, etc.)';
