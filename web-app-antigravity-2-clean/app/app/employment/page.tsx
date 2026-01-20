import { createClient } from "@/lib/supabase/server";
import { EmploymentDetailsClient } from "@/components/employment/employment-details-client";
import { redirect } from "next/navigation";

/**
 * Employment Details Page (Server Component)
 *
 * Comprehensive employment data collection for:
 * - Job Search matching
 * - Resume Builder auto-population
 * - Application Assistant pre-filling
 * - Interview Prep personalization
 *
 * Location: Profile section (cross-functional data)
 */
export default async function EmploymentDetailsPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const userId = userData.user.id;

  // Fetch all employment data in parallel
  const [
    { data: profile },
    { data: jobsProfile },
    { data: workHistory },
    { data: education },
    { data: skills },
    { data: certifications },
    { data: projects },
    { data: references },
    { data: languages },
    { data: volunteer },
    { data: awards },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).single(),
    supabase.from("user_jobs_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_work_history").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("user_education").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("user_skills").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_certifications").select("*").eq("user_id", userId).order("issue_date", { ascending: false }),
    supabase.from("user_projects").select("*").eq("user_id", userId).order("display_order"),
    supabase.from("user_references").select("*").eq("user_id", userId),
    supabase.from("user_languages").select("*").eq("user_id", userId),
    supabase.from("user_volunteer_experience").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("user_awards").select("*").eq("user_id", userId).order("date_received", { ascending: false }),
  ]);

  // Calculate profile completion percentage
  const { data: completionData } = await supabase.rpc(
    "calculate_employment_profile_completion",
    { p_user_id: userId }
  );
  const completionPercentage = completionData || 0;

  return (
    <EmploymentDetailsClient
      userName={profile?.preferred_name || ""}
      userTier={profile?.tier || "starter"}
      completionPercentage={completionPercentage}
      initialData={{
        jobsProfile: jobsProfile || null,
        workHistory: workHistory || [],
        education: education || [],
        skills: skills || null,
        certifications: certifications || [],
        projects: projects || [],
        references: references || [],
        languages: languages || [],
        volunteer: volunteer || [],
        awards: awards || [],
      }}
    />
  );
}
