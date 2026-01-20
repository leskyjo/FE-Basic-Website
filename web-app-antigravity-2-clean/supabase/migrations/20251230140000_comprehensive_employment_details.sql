-- ============================================================================
-- COMPREHENSIVE EMPLOYMENT DETAILS SYSTEM
-- ============================================================================
-- Purpose: Store all employment data needed for Resume Builder, Application
--          Assistant, Interview Prep, and Job Search matching
-- Location: Profile tab (cross-functional data)
-- ============================================================================

-- 1. WORK HISTORY (multiple jobs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_work_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'temporary', 'internship', 'volunteer')),
  industry TEXT,

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE, -- NULL if current job
  is_current_job BOOLEAN DEFAULT FALSE,

  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'United States',
  is_remote BOOLEAN DEFAULT FALSE,

  -- Detailed description
  responsibilities TEXT[], -- Array of bullet points
  achievements TEXT[], -- Array of accomplishments
  technologies_used TEXT[], -- Skills/tools used in this role

  -- Metadata
  reason_for_leaving TEXT,
  supervisor_name TEXT,
  supervisor_contact TEXT,
  can_contact_employer BOOLEAN DEFAULT TRUE,

  -- Display order
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_work_history_user ON user_work_history(user_id);
CREATE INDEX idx_work_history_current ON user_work_history(user_id, is_current_job);

-- RLS policies
ALTER TABLE user_work_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own work history"
  ON user_work_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work history"
  ON user_work_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work history"
  ON user_work_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work history"
  ON user_work_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. EDUCATION HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  school_name TEXT NOT NULL,
  degree_type TEXT, -- "High School Diploma", "Associate's", "Bachelor's", "Master's", "PhD", "Certification"
  field_of_study TEXT,

  -- Dates
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  graduation_date DATE,

  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'United States',

  -- Details
  gpa DECIMAL(3,2), -- 3.75
  honors TEXT[], -- ["Dean's List", "Summa Cum Laude"]
  relevant_coursework TEXT[],
  activities TEXT[], -- Clubs, sports, organizations

  -- Display order
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_user ON user_education(user_id);

-- RLS policies
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own education"
  ON user_education FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. CERTIFICATIONS & LICENSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  credential_id TEXT, -- Certificate number
  credential_url TEXT, -- Link to verify

  -- Dates
  issue_date DATE,
  expiration_date DATE,
  does_not_expire BOOLEAN DEFAULT FALSE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_user ON user_certifications(user_id);

-- RLS policies
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own certifications"
  ON user_certifications FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. PROJECTS & PORTFOLIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_url TEXT,
  github_url TEXT,

  -- Details
  role TEXT, -- "Lead Developer", "Team Member", "Solo Project"
  technologies_used TEXT[], -- ["React", "Node.js", "PostgreSQL"]
  key_features TEXT[], -- Bullet points of what it does

  -- Dates
  start_date DATE,
  end_date DATE,
  is_ongoing BOOLEAN DEFAULT FALSE,

  -- Media
  image_url TEXT,
  demo_video_url TEXT,

  -- Display order
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON user_projects(user_id);
CREATE INDEX idx_projects_featured ON user_projects(user_id, is_featured);

-- RLS policies
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects"
  ON user_projects FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. PROFESSIONAL REFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contact info
  reference_name TEXT NOT NULL,
  relationship TEXT NOT NULL, -- "Former Manager", "Coworker", "Professor"
  company TEXT,
  job_title TEXT,

  -- Contact details
  phone TEXT,
  email TEXT,

  -- Metadata
  can_contact BOOLEAN DEFAULT TRUE,
  contacted_recently BOOLEAN DEFAULT FALSE,
  notes TEXT, -- Private notes about this reference

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_references_user ON user_references(user_id);

-- RLS policies
ALTER TABLE user_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own references"
  ON user_references FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. LANGUAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  language_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('elementary', 'limited-working', 'professional-working', 'full-professional', 'native')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, language_name)
);

CREATE INDEX idx_languages_user ON user_languages(user_id);

-- RLS policies
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own languages"
  ON user_languages FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. VOLUNTEER EXPERIENCE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_volunteer_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  organization_name TEXT NOT NULL,
  role TEXT NOT NULL,
  cause TEXT, -- "Education", "Environment", "Poverty Alleviation"

  -- Dates
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,

  -- Description
  description TEXT,
  achievements TEXT[],

  -- Display order
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_volunteer_user ON user_volunteer_experience(user_id);

-- RLS policies
ALTER TABLE user_volunteer_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own volunteer experience"
  ON user_volunteer_experience FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 8. AWARDS & HONORS
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  award_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  date_received DATE,
  description TEXT,

  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_awards_user ON user_awards(user_id);

-- RLS policies
ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own awards"
  ON user_awards FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. ENHANCED USER_JOBS_PROFILES (extend existing table)
-- ============================================================================
-- Add new columns to existing user_jobs_profiles table for comprehensive data

ALTER TABLE user_jobs_profiles
ADD COLUMN IF NOT EXISTS professional_summary TEXT,
ADD COLUMN IF NOT EXISTS career_objective TEXT,
ADD COLUMN IF NOT EXISTS key_strengths TEXT[],

-- Job preferences
ADD COLUMN IF NOT EXISTS desired_salary_min INTEGER,
ADD COLUMN IF NOT EXISTS desired_salary_max INTEGER,
ADD COLUMN IF NOT EXISTS desired_job_types TEXT[], -- ["full-time", "contract"]
ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS willing_to_travel BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS travel_percentage INTEGER, -- 0-100
ADD COLUMN IF NOT EXISTS available_start_date DATE,
ADD COLUMN IF NOT EXISTS work_authorization TEXT, -- "US Citizen", "Green Card", "Work Visa"

-- Background (FE-specific)
ADD COLUMN IF NOT EXISTS has_conviction BOOLEAN,
ADD COLUMN IF NOT EXISTS willing_to_disclose BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS conviction_explanation TEXT,
ADD COLUMN IF NOT EXISTS rehabilitation_story TEXT,
ADD COLUMN IF NOT EXISTS years_since_release INTEGER,

-- Profile completion tracking
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_profile_update TIMESTAMPTZ;

-- ============================================================================
-- 10. PROFILE COMPLETION TRACKING FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_employment_profile_completion(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion_score INTEGER := 0;
  work_count INTEGER;
  education_count INTEGER;
  skills_count INTEGER;
BEGIN
  -- Professional summary (10 points)
  IF EXISTS (
    SELECT 1 FROM user_jobs_profiles
    WHERE user_id = p_user_id
    AND professional_summary IS NOT NULL
    AND LENGTH(professional_summary) > 50
  ) THEN
    completion_score := completion_score + 10;
  END IF;

  -- Work history (30 points - max 3 jobs)
  SELECT COUNT(*) INTO work_count
  FROM user_work_history
  WHERE user_id = p_user_id;

  completion_score := completion_score + LEAST(work_count * 10, 30);

  -- Education (15 points)
  SELECT COUNT(*) INTO education_count
  FROM user_education
  WHERE user_id = p_user_id;

  IF education_count > 0 THEN
    completion_score := completion_score + 15;
  END IF;

  -- Skills (20 points - need at least 5)
  SELECT COALESCE(array_length(skills_normalized, 1), 0) INTO skills_count
  FROM user_skills
  WHERE user_id = p_user_id;

  IF skills_count >= 5 THEN
    completion_score := completion_score + 20;
  ELSIF skills_count > 0 THEN
    completion_score := completion_score + (skills_count * 4);
  END IF;

  -- Career objective (10 points)
  IF EXISTS (
    SELECT 1 FROM user_jobs_profiles
    WHERE user_id = p_user_id
    AND career_objective IS NOT NULL
  ) THEN
    completion_score := completion_score + 10;
  END IF;

  -- Certifications (5 points)
  IF EXISTS (SELECT 1 FROM user_certifications WHERE user_id = p_user_id) THEN
    completion_score := completion_score + 5;
  END IF;

  -- Projects (5 points)
  IF EXISTS (SELECT 1 FROM user_projects WHERE user_id = p_user_id) THEN
    completion_score := completion_score + 5;
  END IF;

  -- References (5 points)
  IF EXISTS (SELECT 1 FROM user_references WHERE user_id = p_user_id) THEN
    completion_score := completion_score + 5;
  END IF;

  RETURN completion_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created:
-- 1. user_work_history - Job history with responsibilities, achievements
-- 2. user_education - Schools, degrees, certifications
-- 3. user_certifications - Professional certifications & licenses
-- 4. user_projects - Portfolio projects
-- 5. user_references - Professional references
-- 6. user_languages - Language proficiency
-- 7. user_volunteer_experience - Volunteer work
-- 8. user_awards - Awards & honors
-- 9. user_jobs_profiles - Enhanced with new fields
--
-- All tables have:
-- - RLS enabled (users can only access their own data)
-- - Proper indexes for performance
-- - Timestamps for audit trail
-- ============================================================================
