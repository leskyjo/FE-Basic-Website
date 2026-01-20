import type { SupabaseClient, User } from "@supabase/supabase-js";

export type ProfileRow = {
  user_id: string;
  email: string | null;
  preferred_name: string | null;
  zip_code: string | null;
  onboarding_step: number | null;
  user_path: string | null;
  primary_path: string | null;
};

export async function getOrCreateProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<ProfileRow> {
  const { data: existing, error } = await supabase
    .from("profiles")
    .select("user_id, email, preferred_name, zip_code, onboarding_step, user_path, primary_path")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email ?? null,
      onboarding_step: 0,
    })
    .select("user_id, email, preferred_name, zip_code, onboarding_step, user_path, primary_path")
    .single();

  if (createError || !created) {
    throw new Error(createError?.message ?? "Failed to create profile.");
  }

  return created;
}

export function routeForOnboardingStep(step: number | null) {
  if (step === null || step <= 0) return "/onboarding/name";
  if (step === 1) return "/onboarding/zip";
  if (step === 2) return "/onboarding/path-choice";
  if (step === 3) return "/onboarding/generating";
  return "/app/home";
}
