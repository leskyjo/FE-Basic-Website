-- Path-specific questionnaire answers table
-- Stores responses from the 3-question mini-questionnaire after path selection

CREATE TABLE IF NOT EXISTS public.path_questionnaire_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path text NOT NULL CHECK (path IN ('professional', 'entrepreneur')),
  
  -- Entrepreneur path answers
  business_stage text,
  business_story text,
  entrepreneur_challenge text,
  
  -- Professional path answers
  employment_status text,
  interests_skills text,
  work_concern text,
  
  -- Metadata
  completed_at timestamptz DEFAULT now(),
  word_count integer, -- Total words across all text answers
  used_speech_to_text boolean DEFAULT false,
  
  -- Ensure only one questionnaire per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.path_questionnaire_answers ENABLE ROW LEVEL SECURITY;

-- Users can only access their own answers
DROP POLICY IF EXISTS "path_questionnaire_self_access" ON public.path_questionnaire_answers;
CREATE POLICY "path_questionnaire_self_access" ON public.path_questionnaire_answers
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_path_questionnaire_user 
ON public.path_questionnaire_answers(user_id);

CREATE INDEX IF NOT EXISTS idx_path_questionnaire_path 
ON public.path_questionnaire_answers(path);
