import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getOrCreateProfile, routeForOnboardingStep } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getOrCreateProfile(supabase, userData.user);
  const step = profile.onboarding_step ?? 0;

  if (step < 4) {
    redirect(routeForOnboardingStep(step));
  }

  return <AppShell>{children}</AppShell>;
}
