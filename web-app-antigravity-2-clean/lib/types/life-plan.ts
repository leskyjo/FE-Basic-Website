/**
 * Life Plan Type Definitions
 *
 * These types define the structure of AI-generated Life Plans.
 * The AI will generate JSON matching these TypeScript interfaces.
 *
 * Based on the 20-question Life Plan Questionnaire (questionnaire3)
 */

export interface LifePlan {
  // Metadata
  plan_id: string;
  user_id: string;
  generated_at: string;
  model_version: string;

  // Core Plan Structure
  overview: {
    headline: string;                    // "Your Path to [Primary Goal]"
    personal_situation_summary: string;  // 2-3 sentences about where user is now
    primary_goal: string;                // From q19 (12-month goal)
    motivation: string;                  // From q20 (why making this change)
    motivational_opener: string;         // Personalized encouragement
  };

  // Current State Assessment
  current_state: {
    employment_status: string;           // From q1
    financial_situation: string;         // From q2
    background_record: string;           // From q3
    tech_access: string;                 // From q4
    resume_status: string;               // From q5
    key_strengths: string[];             // Derived from answers
    immediate_needs: string[];           // What needs addressing first
    barriers: {
      financial: string[];               // From q2
      legal: string[];                   // From q3
      skills: string[];                  // From q6, q10
      confidence: string[];              // From q10
      resources: string[];               // From q4, q5
    };
  };

  // Career Path Insights
  career_path: {
    working_style_preference: string;    // From q9 (9-to-5, freelancer, business owner, hybrid)
    business_interest: string;           // From q8 (service, digital, physical, social media, job)
    social_media_interest: string;       // From q7
    tech_skill_level: string;            // From q6
    biggest_blocker: string;             // From q10
    recommended_path: string;            // AI recommendation based on all answers
  };

  // Learning & Growth Profile
  learning_profile: {
    daily_study_time: string;            // From q11
    learning_preference: string;         // From q12 (video, reading, hands-on, coaching)
    camera_comfort: string;              // From q13
    main_distractions: string;           // From q14
    recommended_learning_approach: string;
  };

  // Health & Wellness Assessment
  wellness: {
    physical_priority: string;           // From q15 (sleep, diet, exercise, substance use)
    stress_handling: string;             // From q16
    support_system: string;              // From q17
    inner_growth_focus: string;          // From q18
    wellness_recommendations: string[];
  };

  // Timeframed Action Plan
  timeframes: {
    next_7_days: TimeframeAction[];
    next_30_days: TimeframeAction[];
    next_90_days: TimeframeAction[];
    next_12_months: TimeframeAction[];
  };

  // Domain-Specific Plans
  domains: {
    employment_and_income: DomainPlan;
    financial_stability: DomainPlan;
    skills_and_learning: DomainPlan;
    health_and_wellness: DomainPlan;
    mindset_and_growth: DomainPlan;
  };

  // Risk Flags & Immediate Concerns
  risk_flags: RiskFlag[];

  // Encouragement & Resources
  encouragement: {
    short_message: string;
    progress_reminders: string[];
    fe_tools_to_start_with: string[];   // Which FE features to use first
    external_resources: ExternalResource[];
  };
}

export interface TimeframeAction {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: "employment" | "financial" | "skills" | "health" | "mindset" | "legal";
  title: string;
  description: string;
  why_it_matters: string;
  estimated_time: string;              // "15 minutes", "1-2 hours", etc.
  fe_tools_to_use: string[];          // ["Jobs search", "Resume Builder", "Courses"]
  external_resources: string[];        // External links/orgs if needed
  completion_criteria: string;
  is_quick_win: boolean;               // True if this is an easy first step
}

export interface DomainPlan {
  domain_name: string;
  current_situation: string;            // What's true right now
  target_outcome: string;               // What success looks like here
  key_actions: TimeframeAction[];
  progress_milestones: string[];
  resources_needed: string[];
  fe_tools_recommended: string[];
}

export interface RiskFlag {
  flag_type: "financial_crisis" | "skills_gap" | "confidence_block" | "resource_limitation" | "support_deficit" | "health_concern";
  severity: "urgent" | "important" | "watch";
  description: string;
  recommended_action: string;
  resource_link: string | null;
}

export interface ExternalResource {
  name: string;
  type: "organization" | "hotline" | "website" | "program";
  description: string;
  contact?: string;
  url?: string;
}

/**
 * Questionnaire Answer Mapping
 * Maps question IDs to their answers for AI prompt generation
 */
export interface QuestionnaireAnswers {
  // Current Situation & Background (Group 1)
  q1_employment_status: string;
  q2_income_vs_bills: string;
  q3_background_record: string;
  q4_tech_equipment: string;
  q5_resume_ready: string;

  // Career, Tech & Social Media Interests (Group 2)
  q6_website_app_experience: string;
  q7_social_media_interest: string;
  q8_business_focus: string;
  q9_working_style: string;
  q10_biggest_blocker: string;

  // Learning Style & Habits (Group 3)
  q11_daily_study_time: string;
  q12_learning_preference: string;
  q13_camera_comfort: string;
  q14_goal_distractions: string;

  // Holistic Health & Goals (Group 4)
  q15_physical_improvement: string;
  q16_stress_management: string;
  q17_support_system: string;
  q18_inner_growth: string;
  q19_12_month_goal: string;
  q20_change_reason: string;
}

/**
 * DERIVED PROFILES
 * These are auto-extracted from the Life Plan and stored in separate tables
 * for fast querying by specific features
 */

/**
 * Jobs/Career Profile - Powers Jobs, Resume Builder, Application Assistant
 */
export interface UserJobsProfile {
  user_id: string;
  working_style_preference: "employee" | "freelancer" | "business_owner" | "hybrid";
  career_goal_12_month: string;
  background_record_status: "clean" | "misdemeanors" | "felonies_old" | "felonies_recent";
  resume_readiness: "none" | "outdated" | "gaps" | "current";
  biggest_blocker: "record" | "skills" | "confidence" | "overwhelmed";
  employment_status: "unemployed" | "part_time" | "full_time_unhappy" | "self_employed_unstable";
  skills_to_highlight: string[];
  recommended_job_types: string[];
  felon_friendly_filter_needed: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Learning Profile - Powers Courses recommendations
 */
export interface UserLearningProfile {
  user_id: string;
  learning_preference: "video" | "reading" | "hands_on" | "coaching";
  daily_study_time_available: "under_30min" | "1_2_hours" | "3_5_hours" | "6plus_hours";
  camera_comfort_level: "love_it" | "willing_to_learn" | "behind_scenes_only" | "refuse";
  recommended_course_categories: string[];
  skills_gaps_to_address: string[];
  tech_skill_level: "beginner" | "played_around" | "tried_code" | "built_projects";
  business_interest: "service" | "digital" | "physical" | "social_media" | "job_only";
  social_media_interest: "influencer" | "marketing" | "business_promo" | "not_interested";
  created_at?: string;
  updated_at?: string;
}

/**
 * Wellness Profile - Powers FE Button, Daily Boost, wellness features
 */
export interface UserWellnessProfile {
  user_id: string;
  physical_priority_area: "sleep" | "diet" | "exercise" | "substance_use";
  stress_management_style: "shut_down" | "get_angry" | "unhealthy_habits" | "manage_okay";
  support_system_status: "none" | "negative_people" | "few_supporters" | "strong_support";
  inner_growth_focus: "purpose" | "mindfulness" | "faith" | "discipline";
  main_distractions: "social_media" | "entertainment" | "party_lifestyle" | "family_obligations";
  motivation_reason: "family" | "prove_wrong" | "tired_struggling" | "fulfill_potential";
  wellness_recommendations: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Next Actions - Powers Dashboard "Your Next Steps"
 */
export interface UserNextAction {
  id: string;
  user_id: string;
  life_plan_version_id: string;
  timeframe: "7_days" | "30_days" | "90_days" | "12_months";
  action_order: number;
  priority: "critical" | "high" | "medium" | "low";
  category: "employment" | "financial" | "skills" | "health" | "mindset" | "legal";
  title: string;
  description: string;
  why_it_matters: string;
  estimated_time: string;
  fe_tools_to_use: string[];
  external_resources: string[];
  completion_criteria: string;
  is_quick_win: boolean;
  status: "pending" | "in_progress" | "completed" | "skipped";
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Financial Profile - Powers financial tracking, budget features (future)
 */
export interface UserFinancialProfile {
  user_id: string;
  income_vs_bills_status: "drowning_debt" | "breaking_even" | "little_leftover" | "stable_invest";
  financial_priority: "immediate_income" | "debt_management" | "build_savings" | "invest_growth";
  tech_equipment_available: "smartphone_only" | "tablet_chromebook" | "laptop_desktop" | "full_setup";
  created_at?: string;
  updated_at?: string;
}
