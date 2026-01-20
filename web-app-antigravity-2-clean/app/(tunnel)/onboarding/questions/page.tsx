import { redirect } from "next/navigation";

import { getOrCreateProfile, routeForOnboardingStep } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingQuestionsForm } from "./onboarding-questions-form";

export default async function OnboardingQuestionsPage() {
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

  if (step === 3) {
    redirect("/onboarding/generating");
  }

  if (step < 2) {
    redirect(routeForOnboardingStep(step));
  }

  if (step > 2) {
    redirect(routeForOnboardingStep(step));
  }

  const { data: answersData } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer_value")
    .eq("user_id", userData.user.id);

  const initialAnswers =
    answersData?.reduce<Record<string, unknown>>((acc, answer) => {
      acc[answer.question_id] = answer.answer_value;
      return acc;
    }, {}) ?? {};

  return <OnboardingQuestionsForm initialAnswers={initialAnswers} userId={userData.user.id} />;
}
