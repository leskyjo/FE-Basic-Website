import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingTabSync } from "./onboarding-tab-sync";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <>
      <OnboardingTabSync />
      {children}
    </>
  );
}
