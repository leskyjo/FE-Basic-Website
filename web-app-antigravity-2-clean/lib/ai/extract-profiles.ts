/**
 * Profile Extraction Functions
 *
 * NEW STRUCTURE: Works with 10-question onboarding + feature-specific questionnaires
 *
 * These functions extract derived profiles from the Life Plan and questionnaire
 * answers to populate feature-specific tables.
 *
 * Called automatically after Life Plan generation.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  LifePlan,
  UserJobsProfile,
  UserLearningProfile,
  UserWellnessProfile,
  UserFinancialProfile,
  UserNextAction,
} from "@/lib/types/life-plan";

/**
 * Main function: Extract and save ALL derived profiles
 */
export async function extractAndSaveProfiles(
  supabase: SupabaseClient,
  userId: string,
  versionId: string,
  lifePlan: LifePlan,
  questionnaireAnswers: Record<string, any>
): Promise<void> {
  console.log(`[Profile Extraction] Starting for user ${userId}`);

  // Extract profiles from questionnaire + Life Plan
  const jobsProfile = extractJobsProfile(userId, versionId, questionnaireAnswers, lifePlan);
  const learningProfile = extractLearningProfile(userId, versionId, questionnaireAnswers, lifePlan);
  const wellnessProfile = extractWellnessProfile(userId, versionId, questionnaireAnswers, lifePlan);
  const financialProfile = extractFinancialProfile(userId, versionId, questionnaireAnswers);
  const nextActions = extractNextActions(userId, versionId, lifePlan);

  // Also update profiles table with onboarding data
  await updateProfilesTable(supabase, userId, questionnaireAnswers);

  // Save all profiles (upsert to handle regenerations)
  await Promise.all([
    upsertJobsProfile(supabase, jobsProfile),
    upsertLearningProfile(supabase, learningProfile),
    upsertWellnessProfile(supabase, wellnessProfile),
    upsertFinancialProfile(supabase, financialProfile),
    saveNextActions(supabase, userId, nextActions),
  ]);

  console.log(`[Profile Extraction] Completed for user ${userId}`);
}

/**
 * Update profiles table with onboarding questionnaire data
 */
async function updateProfilesTable(
  supabase: SupabaseClient,
  userId: string,
  answers: Record<string, any>
): Promise<void> {
  // Extract willingness strategies (multi-select array from Q6)
  const willingnessStrategies = Array.isArray(answers.q6_willingness_strategies)
    ? answers.q6_willingness_strategies
    : [];

  const { error } = await supabase
    .from("profiles")
    .update({
      // Employment & Income data (Q1-Q3)
      current_employment: answers.q1_current_employment || null,
      desired_employment: answers.q2_desired_employment || null,
      current_income_range: answers.q3_current_income || null,

      // Barriers & Solutions data (Q4-Q6)
      biggest_barrier: answers.q4_biggest_barrier || null,
      willingness_level: parseInt(answers.q5_willingness_level) || null,
      willingness_strategies: willingnessStrategies,

      // Housing & Stability data (Q7-Q8)
      housing_status: answers.q7_current_housing || null,
      housing_goal: answers.q8_housing_goal || null,

      // Goals & Commitment data (Q9-Q10)
      strategic_goal_30_days: answers.q9_30_day_goal || null,
      commitment_level: parseInt(answers.q10_commitment_level) || null,

      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to update profiles table:", error);
    throw error;
  }
}

/**
 * Extract Jobs/Career Profile
 *
 * NOTE: This uses onboarding data (Q1-Q4). Will be enhanced when user completes Jobs questionnaire (Q11-Q16).
 */
function extractJobsProfile(
  userId: string,
  versionId: string,
  answers: Record<string, any>,
  lifePlan: LifePlan
): Omit<UserJobsProfile, "created_at" | "updated_at"> {
  // Current employment from Q1
  const employmentStatus = mapEmploymentStatus(answers.q1_current_employment);

  // Desired employment from Q2
  const desiredEmployment = answers.q2_desired_employment || "";

  // Biggest blocker from Q4
  const biggestBlocker = mapBiggestBlocker(answers.q4_biggest_barrier);

  // Skills from Life Plan
  const skillsToHighlight = lifePlan.current_state?.key_strengths || [];

  // Recommended job types from career path in Life Plan
  const recommendedJobTypes = lifePlan.career_path?.recommended_path
    ? [lifePlan.career_path.recommended_path]
    : [];

  // Determine if felon-friendly filter is needed (from Q4 barrier)
  const felonFriendlyNeeded = biggestBlocker === "record";

  return {
    user_id: userId,
    life_plan_version_id: versionId,
    working_style_preference: null, // Will be set from Jobs questionnaire later
    career_goal_12_month: lifePlan.overview?.primary_goal || answers.q9_30_day_goal || "",
    background_record_status: null, // Will be set from Jobs questionnaire (Q13)
    resume_readiness: null, // Will be set from Jobs questionnaire if we add that question
    biggest_blocker: biggestBlocker,
    employment_status: employmentStatus,
    desired_employment_type: desiredEmployment,
    skills_to_highlight: skillsToHighlight,
    recommended_job_types: recommendedJobTypes,
    felon_friendly_filter_needed: felonFriendlyNeeded,

    // These will be populated when user completes Jobs questionnaire (Q11-Q16)
    desired_industries: null,
    desired_salary_range: null,
    incarceration_timeline: null,
    legal_restrictions: null,
    transportation_access: null,
    supervision_status: null,
  };
}

/**
 * Extract Learning Profile
 *
 * NOTE: Minimal data from onboarding. Will be enhanced when user completes Courses questionnaire (Q17-Q24).
 */
function extractLearningProfile(
  userId: string,
  versionId: string,
  answers: Record<string, any>,
  lifePlan: LifePlan
): Omit<UserLearningProfile, "created_at" | "updated_at"> {
  // Recommended courses from Life Plan
  const recommendedCategories: string[] = [];
  const skillsGaps: string[] = [];

  // Extract from Life Plan domains
  if (lifePlan.domains?.skills_and_learning) {
    const skillsDomain = lifePlan.domains.skills_and_learning;
    if (skillsDomain.fe_tools_recommended) {
      skillsDomain.fe_tools_recommended.forEach((tool: any) => {
        if (typeof tool === "string" && tool.toLowerCase().includes("course")) {
          recommendedCategories.push(tool);
        } else if (tool?.tool_name?.toLowerCase().includes("course")) {
          recommendedCategories.push(tool.tool_name);
        }
      });
    }
  }

  // Skills gaps from barriers (Q4)
  if (answers.q4_biggest_barrier === "lack_skills") {
    skillsGaps.push("General high-income skills needed");
  }

  if (lifePlan.current_state?.barriers?.skills) {
    skillsGaps.push(...lifePlan.current_state.barriers.skills);
  }

  return {
    user_id: userId,
    life_plan_version_id: versionId,
    learning_preference: null, // Will be set from Courses questionnaire (Q21)
    daily_study_time_available: null, // Not in onboarding anymore
    camera_comfort_level: null, // Not in onboarding anymore
    recommended_course_categories: recommendedCategories,
    skills_gaps_to_address: skillsGaps,
    tech_skill_level: null, // Will be set from Courses questionnaire (Q17)
    business_interest: null, // Will be set from Courses questionnaire (Q23)
    social_media_interest: null, // Not in onboarding anymore

    // These will be populated when user completes Courses questionnaire (Q17-Q24)
    computer_literacy_level: null,
    existing_skills: null,
    digital_skill_interest: null,
    physical_skill_interest: null,
    hardware_access: null,
    business_model_preference: null,
    business_experience_level: null,
  };
}

/**
 * Extract Wellness Profile
 *
 * NOTE: Uses onboarding data (Q4, Q5, Q6, Q10).
 */
function extractWellnessProfile(
  userId: string,
  versionId: string,
  answers: Record<string, any>,
  lifePlan: LifePlan
): Omit<UserWellnessProfile, "created_at" | "updated_at"> {
  // Check if addiction/mental health is the biggest barrier (Q4)
  const hasHealthBarrier = answers.q4_biggest_barrier === "addiction_mental_health";

  // Willingness level from Q5
  const willingnessLevel = parseInt(answers.q5_willingness_level) || 3;

  // Commitment level from Q10
  const commitmentLevel = parseInt(answers.q10_commitment_level) || 3;

  // Willingness strategies from Q6
  const willingnessStrategies = Array.isArray(answers.q6_willingness_strategies)
    ? answers.q6_willingness_strategies
    : [];

  // Motivation reason - default to generic value since we don't collect this in onboarding anymore
  // The actual motivation is captured in Q9 (30-day goal) which is saved to profiles table
  const motivationReason = "fulfill_potential"; // Safe default that passes CHECK constraint

  // Wellness recommendations from Life Plan
  const wellnessRecs = lifePlan.wellness?.wellness_recommendations || [];

  return {
    user_id: userId,
    life_plan_version_id: versionId,
    physical_priority_area: hasHealthBarrier ? "mental_health" : null, // Generic, will be refined later
    stress_management_style: null, // Not in onboarding anymore
    support_system_status: null, // Not in onboarding anymore
    inner_growth_focus: null, // Not in onboarding anymore
    main_distractions: null, // Not in onboarding anymore
    motivation_reason: motivationReason, // Safe value that passes CHECK constraint
    wellness_recommendations: wellnessRecs,
    willingness_level: willingnessLevel,
    commitment_level: commitmentLevel,
    accountability_preferences: willingnessStrategies.includes("strict_routine") ? ["routine", "accountability"] : [],
  };
}

/**
 * Extract Financial Profile
 *
 * NOTE: Uses onboarding data (Q3, Q7, Q8).
 */
function extractFinancialProfile(
  userId: string,
  versionId: string,
  answers: Record<string, any>
): Omit<UserFinancialProfile, "created_at" | "updated_at"> {
  // Current income from Q3
  const incomeRange = answers.q3_current_income || "";

  // Housing status from Q7
  const housingStatus = answers.q7_current_housing || "";

  // Housing goal from Q8
  const housingGoal = answers.q8_housing_goal || "";

  // Determine financial priority based on income + housing
  let financialPriority: "immediate_income" | "debt_management" | "build_savings" | "invest_growth" | "housing_stability" = "immediate_income";

  if (housingStatus === "homeless_no_address" || housingStatus === "unstable_couch_surfing") {
    financialPriority = "housing_stability";
  } else if (incomeRange === "0_500") {
    financialPriority = "immediate_income";
  } else if (incomeRange === "500_1500") {
    financialPriority = "debt_management";
  } else if (incomeRange === "1500_3000") {
    financialPriority = "build_savings";
  } else if (incomeRange === "3000_5000" || incomeRange === "5000_plus") {
    financialPriority = "invest_growth";
  }

  return {
    user_id: userId,
    life_plan_version_id: versionId,
    income_vs_bills_status: null, // Old question, not in new onboarding
    monthly_income_range: incomeRange,
    financial_priority: financialPriority,
    tech_equipment_available: null, // Not in onboarding anymore
    housing_status: housingStatus,
    housing_goal: housingGoal,
  };
}

/**
 * Extract Next Actions from Life Plan timeframes
 */
function extractNextActions(
  userId: string,
  versionId: string,
  lifePlan: LifePlan
): Omit<UserNextAction, "id" | "created_at" | "updated_at">[] {
  const actions: Omit<UserNextAction, "id" | "created_at" | "updated_at">[] = [];

  // Extract from each timeframe
  const timeframes: Array<{ key: "7_days" | "30_days" | "90_days" | "12_months"; data: any[] }> = [
    { key: "7_days", data: lifePlan.timeframes?.next_7_days || [] },
    { key: "30_days", data: lifePlan.timeframes?.next_30_days || [] },
    { key: "90_days", data: lifePlan.timeframes?.next_90_days || [] },
    { key: "12_months", data: lifePlan.timeframes?.next_12_months || [] },
  ];

  timeframes.forEach(({ key, data }) => {
    data.forEach((action, index) => {
      actions.push({
        user_id: userId,
        life_plan_version_id: versionId,
        timeframe: key,
        action_order: index + 1,
        priority: action.priority || "medium",
        category: validateCategory(action.category),
        title: action.title || "",
        description: action.description || "",
        why_it_matters: action.why_it_matters || "",
        estimated_time: action.estimated_time || "Unknown",
        fe_tools_to_use: action.fe_tools_to_use || [],
        external_resources: action.external_resources || [],
        completion_criteria: action.completion_criteria || "",
        is_quick_win: action.is_quick_win || false,
        status: "pending",
      });
    });
  });

  return actions;
}

// ============================================================================
// MAPPING FUNCTIONS (Questionnaire answers → enum values)
// ============================================================================

/**
 * Map current employment (Q1)
 */
function mapEmploymentStatus(answer: string): "unemployed" | "part_time" | "full_time_unhappy" | "self_employed_unstable" | "zero_income" {
  if (!answer) return "unemployed";
  if (answer.includes("unemployed_looking")) return "unemployed";
  if (answer.includes("part_time_odd_jobs")) return "part_time";
  if (answer.includes("full_time_w2")) return "full_time_unhappy"; // Assuming they're in onboarding because unhappy
  if (answer.includes("self_employed_hustling")) return "self_employed_unstable";
  if (answer.includes("zero_income")) return "zero_income";
  return "unemployed"; // Default
}

/**
 * Map biggest blocker (Q4)
 */
function mapBiggestBlocker(answer: string): "record" | "skills" | "confidence" | "overwhelmed" {
  if (!answer) return "skills";
  if (answer.includes("criminal_record")) return "record";
  if (answer.includes("lack_skills")) return "skills";
  if (answer.includes("no_capital")) return "overwhelmed"; // Map capital issues to overwhelmed
  if (answer.includes("lack_discipline")) return "confidence"; // Map discipline to confidence
  if (answer.includes("addiction_mental_health")) return "overwhelmed"; // Map health to overwhelmed
  return "skills"; // Default
}

/**
 * Validate and map category to allowed constraint values
 */
function validateCategory(category: string | undefined): "employment" | "financial" | "skills" | "health" | "mindset" | "legal" {
  if (!category) return "employment";
  const normalized = category.toLowerCase();

  // Direct matches
  if (normalized === "employment") return "employment";
  if (normalized === "financial") return "financial";
  if (normalized === "skills") return "skills";
  if (normalized === "health") return "health";
  if (normalized === "mindset") return "mindset";
  if (normalized === "legal") return "legal";

  // Fuzzy matches - map similar terms
  if (normalized.includes("job") || normalized.includes("career") || normalized.includes("work")) return "employment";
  if (normalized.includes("money") || normalized.includes("budget") || normalized.includes("income")) return "financial";
  if (normalized.includes("learn") || normalized.includes("education") || normalized.includes("training")) return "skills";
  if (normalized.includes("wellness") || normalized.includes("mental") || normalized.includes("physical")) return "health";
  if (normalized.includes("mindset") || normalized.includes("growth") || normalized.includes("confidence")) return "mindset";
  if (normalized.includes("legal") || normalized.includes("record") || normalized.includes("court")) return "legal";

  return "employment"; // Default fallback
}

// ============================================================================
// LEGACY MAPPING FUNCTIONS (for backward compatibility if needed)
// ============================================================================

function mapWorkingStyle(answer: string): "employee" | "freelancer" | "business_owner" | "hybrid" {
  if (!answer) return "employee";
  if (answer?.includes("Employee")) return "employee";
  if (answer?.includes("Freelancer")) return "freelancer";
  if (answer?.includes("Business Owner")) return "business_owner";
  if (answer?.includes("Hybrid")) return "hybrid";
  return "employee"; // Default
}

function mapBackgroundRecord(answer: string): "clean" | "misdemeanors" | "felonies_old" | "felonies_recent" {
  if (!answer) return "clean";
  if (answer?.includes("Clean record")) return "clean";
  if (answer?.includes("Misdemeanors")) return "misdemeanors";
  if (answer?.includes("over 5 years ago")) return "felonies_old";
  if (answer?.includes("within the last 5 years")) return "felonies_recent";
  return "clean"; // Default
}

function mapResumeReadiness(answer: string): "none" | "outdated" | "gaps" | "current" {
  if (!answer) return "none";
  if (answer?.includes("do not have")) return "none";
  if (answer?.includes("old and outdated")) return "outdated";
  if (answer?.includes("big gaps")) return "gaps";
  if (answer?.includes("current and looks professional")) return "current";
  return "none"; // Default
}

function mapLearningPreference(answer: string): "video" | "reading" | "hands_on" | "coaching" {
  if (!answer) return "video";
  if (answer?.includes("video")) return "video";
  if (answer?.includes("Reading")) return "reading";
  if (answer?.includes("Doing it")) return "hands_on";
  if (answer?.includes("coaching")) return "coaching";
  return "video"; // Default
}

function mapStudyTime(answer: string): "under_30min" | "1_2_hours" | "3_5_hours" | "6plus_hours" {
  if (!answer) return "under_30min";
  if (answer?.includes("Less than 30")) return "under_30min";
  if (answer?.includes("1–2 hours")) return "1_2_hours";
  if (answer?.includes("3–5 hours")) return "3_5_hours";
  if (answer?.includes("6+")) return "6plus_hours";
  return "under_30min"; // Default
}

function mapCameraComfort(answer: string): "love_it" | "willing_to_learn" | "behind_scenes_only" | "refuse" {
  if (!answer) return "behind_scenes_only";
  if (answer?.includes("love it")) return "love_it";
  if (answer?.includes("nervous but willing")) return "willing_to_learn";
  if (answer?.includes("prefer editing")) return "behind_scenes_only";
  if (answer?.includes("refuse")) return "refuse";
  return "behind_scenes_only"; // Default
}

function mapTechSkillLevel(answer: string): "beginner" | "played_around" | "tried_code" | "built_projects" {
  if (!answer) return "beginner";
  if (answer?.includes("Never") || answer?.includes("beginner")) return "beginner";
  if (answer?.includes("played around")) return "played_around";
  if (answer?.includes("tried to learn code")) return "tried_code";
  if (answer?.includes("built a few")) return "built_projects";
  return "beginner"; // Default
}

function mapBusinessInterest(answer: string): "service" | "digital" | "physical" | "social_media" | "job_only" {
  if (!answer) return "job_only";
  if (answer?.includes("Service-based")) return "service";
  if (answer?.includes("Digital Products")) return "digital";
  if (answer?.includes("Physical Products")) return "physical";
  if (answer?.includes("Social Media")) return "social_media";
  if (answer?.includes("prefer just getting a better job")) return "job_only";
  return "job_only"; // Default
}

function mapSocialMediaInterest(answer: string): "influencer" | "marketing" | "business_promo" | "not_interested" {
  if (!answer) return "not_interested";
  if (answer?.includes("Influencer")) return "influencer";
  if (answer?.includes("behind-the-scenes")) return "marketing";
  if (answer?.includes("promotes my other business")) return "business_promo";
  if (answer?.includes("Not interested")) return "not_interested";
  return "not_interested"; // Default
}

function mapPhysicalPriority(answer: string): "sleep" | "diet" | "exercise" | "substance_use" {
  if (!answer) return "sleep";
  if (answer?.includes("Sleep")) return "sleep";
  if (answer?.includes("Diet")) return "diet";
  if (answer?.includes("Exercise")) return "exercise";
  if (answer?.includes("Substance")) return "substance_use";
  return "sleep"; // Default
}

function mapStressManagement(answer: string): "shut_down" | "get_angry" | "unhealthy_habits" | "manage_okay" {
  if (!answer) return "manage_okay";
  if (answer?.includes("shut down")) return "shut_down";
  if (answer?.includes("angry")) return "get_angry";
  if (answer?.includes("unhealthy habits")) return "unhealthy_habits";
  if (answer?.includes("manage it okay")) return "manage_okay";
  return "manage_okay"; // Default
}

function mapSupportSystem(answer: string): "none" | "negative_people" | "few_supporters" | "strong_support" {
  if (!answer) return "none";
  if (answer?.includes("No one")) return "none";
  if (answer?.includes("negative people")) return "negative_people";
  if (answer?.includes("few friends")) return "few_supporters";
  if (answer?.includes("strong mentor")) return "strong_support";
  return "none"; // Default
}

function mapInnerGrowth(answer: string): "purpose" | "mindfulness" | "faith" | "discipline" {
  if (!answer) return "purpose";
  if (answer?.includes("purpose")) return "purpose";
  if (answer?.includes("Meditation") || answer?.includes("mindfulness")) return "mindfulness";
  if (answer?.includes("faith") || answer?.includes("prayer")) return "faith";
  if (answer?.includes("discipline")) return "discipline";
  return "purpose"; // Default
}

function mapDistractions(answer: string): "social_media" | "entertainment" | "party_lifestyle" | "family_obligations" {
  if (!answer) return "social_media";
  if (answer?.includes("Social media")) return "social_media";
  if (answer?.includes("games") || answer?.includes("TV")) return "entertainment";
  if (answer?.includes("party")) return "party_lifestyle";
  if (answer?.includes("Family")) return "family_obligations";
  return "social_media"; // Default
}

function mapMotivation(answer: string): "family" | "prove_wrong" | "tired_struggling" | "fulfill_potential" {
  if (!answer) return "fulfill_potential";
  if (answer?.includes("children") || answer?.includes("family")) return "family";
  if (answer?.includes("prove everyone wrong")) return "prove_wrong";
  if (answer?.includes("tired of struggling")) return "tired_struggling";
  if (answer?.includes("fulfill my potential")) return "fulfill_potential";
  return "fulfill_potential"; // Default
}

function mapIncomeStatus(answer: string): "drowning_debt" | "breaking_even" | "little_leftover" | "stable_invest" {
  if (!answer) return "breaking_even";
  if (answer?.includes("drowning in debt")) return "drowning_debt";
  if (answer?.includes("breaking even")) return "breaking_even";
  if (answer?.includes("little leftover")) return "little_leftover";
  if (answer?.includes("stable")) return "stable_invest";
  return "breaking_even"; // Default
}

function mapTechEquipment(answer: string): "smartphone_only" | "tablet_chromebook" | "laptop_desktop" | "full_setup" {
  if (!answer) return "smartphone_only";
  if (answer?.includes("smartphone")) return "smartphone_only";
  if (answer?.includes("Tablet") || answer?.includes("Chromebook")) return "tablet_chromebook";
  if (answer?.includes("Laptop") || answer?.includes("Desktop")) return "laptop_desktop";
  if (answer?.includes("full setup")) return "full_setup";
  return "smartphone_only"; // Default
}

// ============================================================================
// DATABASE UPSERT FUNCTIONS
// ============================================================================

async function upsertJobsProfile(supabase: SupabaseClient, profile: Omit<UserJobsProfile, "created_at" | "updated_at">): Promise<void> {
  const { error } = await supabase
    .from("user_jobs_profiles")
    .upsert(profile, { onConflict: "user_id" });

  if (error) {
    console.error("Failed to upsert jobs profile:", error);
    throw error;
  }
}

async function upsertLearningProfile(supabase: SupabaseClient, profile: Omit<UserLearningProfile, "created_at" | "updated_at">): Promise<void> {
  const { error } = await supabase
    .from("user_learning_profiles")
    .upsert(profile, { onConflict: "user_id" });

  if (error) {
    console.error("Failed to upsert learning profile:", error);
    throw error;
  }
}

async function upsertWellnessProfile(supabase: SupabaseClient, profile: Omit<UserWellnessProfile, "created_at" | "updated_at">): Promise<void> {
  const { error } = await supabase
    .from("user_wellness_profiles")
    .upsert(profile, { onConflict: "user_id" });

  if (error) {
    console.error("Failed to upsert wellness profile:", error);
    throw error;
  }
}

async function upsertFinancialProfile(supabase: SupabaseClient, profile: Omit<UserFinancialProfile, "created_at" | "updated_at">): Promise<void> {
  const { error } = await supabase
    .from("user_financial_profiles")
    .upsert(profile, { onConflict: "user_id" });

  if (error) {
    console.error("Failed to upsert financial profile:", error);
    throw error;
  }
}

async function saveNextActions(
  supabase: SupabaseClient,
  userId: string,
  actions: Omit<UserNextAction, "id" | "created_at" | "updated_at">[]
): Promise<void> {
  // Delete old actions for this user (since we're regenerating)
  const { error: deleteError } = await supabase
    .from("user_next_actions")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Failed to delete old actions:", deleteError);
    throw deleteError;
  }

  // Insert new actions
  if (actions.length > 0) {
    const { error: insertError } = await supabase
      .from("user_next_actions")
      .insert(actions);

    if (insertError) {
      console.error("Failed to insert new actions:", insertError);
      throw insertError;
    }
  }
}
