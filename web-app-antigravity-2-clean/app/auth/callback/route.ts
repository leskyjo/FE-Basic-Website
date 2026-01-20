import { NextResponse } from "next/server";

import { getOrCreateProfile, routeForOnboardingStep } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const profile = await getOrCreateProfile(supabase, userData.user);
    const step = profile.onboarding_step ?? 0;
    return NextResponse.redirect(`${origin}${routeForOnboardingStep(step)}`);
  } catch {
    return NextResponse.redirect(`${origin}/login`);
  }
}
