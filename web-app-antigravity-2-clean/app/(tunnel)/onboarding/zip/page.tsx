import { redirect } from "next/navigation";

import { getOrCreateProfile, routeForOnboardingStep } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingZipForm } from "./onboarding-zip-form";

export default async function OnboardingZipPage() {
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

  if (step < 1) {
    redirect("/onboarding/name");
  }

  if (step > 1) {
    redirect(routeForOnboardingStep(step));
  }

  return (
    <OnboardingZipForm
      initialZip={profile.zip_code ?? ""}
      userId={userData.user.id}
    />
  );
}
