import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingGeneratingScreen } from "./onboarding-generating-screen";

export default async function OnboardingGeneratingPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getOrCreateProfile(supabase, userData.user);
  const step = profile.onboarding_step ?? 0;

  if (step >= 5) {
    redirect("/app/home");
  }

  if (step < 2) {
    redirect("/onboarding/questions");
  }

  return <OnboardingGeneratingScreen userId={userData.user.id} />;
}
