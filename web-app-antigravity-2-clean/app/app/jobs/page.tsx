import { createClient } from "@/lib/supabase/server";
import { JobsClient } from "@/components/jobs/jobs-client";

/**
 * Jobs Hub Page (Server Component)
 *
 * Loads user data server-side, then delegates to client component for interactivity
 */
export default async function JobsPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const userId = userData.user.id;

  // Fetch user profile data for auto-search
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_name, zip_code, city, state, tier")
    .eq("user_id", userId)
    .single();

  // Check if user has completed Life Plan (for auto-search)
  const { data: lifePlan } = await supabase
    .from("life_plans")
    .select("current_version_id")
    .eq("user_id", userId)
    .maybeSingle();

  // Get user's jobs profile (for auto-search query building)
  const { data: jobsProfile } = await supabase
    .from("user_jobs_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // Get user skills (to check if they've filled detailed employment section)
  const { data: userSkills } = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const hasLifePlan = !!lifePlan?.current_version_id;
  const hasDetailedSkills = !!(userSkills?.skills_raw?.length || userSkills?.work_bullets?.length);

  // Generic job titles for users without specific career goals
  const GENERIC_JOB_SUGGESTIONS = [
    "warehouse worker",
    "construction worker",
    "delivery driver",
    "customer service representative",
    "retail sales associate",
    "forklift operator",
    "maintenance technician",
    "security guard",
  ];

  // Rotate through suggestions based on user ID (consistent but appears random)
  const suggestionIndex = userId ? parseInt(userId.slice(0, 8), 16) % GENERIC_JOB_SUGGESTIONS.length : 0;
  const genericSuggestion = GENERIC_JOB_SUGGESTIONS[suggestionIndex];

  // Build initial search query - always use generic suggestions (no questionnaire text)
  // The questionnaire doesn't have job titles, only business goals which don't belong here
  const initialQuery = genericSuggestion;

  // Parse location into city and state separately
  const initialCity = profile?.city || "";
  const initialState = profile?.state || "";
  const initialZip = profile?.zip_code || "";

  return (
    <JobsClient
      hasLifePlan={hasLifePlan}
      hasDetailedSkills={hasDetailedSkills}
      initialQuery={initialQuery}
      initialCity={initialCity}
      initialState={initialState}
      initialZip={initialZip}
      userName={profile?.preferred_name || ""}
      userTier={profile?.tier || "starter"}
    />
  );
}
