import { redirect } from "next/navigation";

import { getOrCreateProfile, routeForOnboardingStep } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingNameForm } from "./onboarding-name-form";

export default async function OnboardingNamePage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getOrCreateProfile(supabase, userData.user);
  const step = profile.onboarding_step ?? 0;

  if (step >= 4) {
    redirect("/app/home");
  }

  if (step > 0) {
    redirect(routeForOnboardingStep(step));
  }

  return (
    <OnboardingNameForm
      initialName={profile.preferred_name ?? ""}
      userId={userData.user.id}
    />
  );
}
