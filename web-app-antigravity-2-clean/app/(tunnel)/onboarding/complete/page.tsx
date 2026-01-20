import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { OnboardingCompleteScreen } from "./onboarding-complete-screen";

export default async function OnboardingCompletePage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getOrCreateProfile(supabase, userData.user);
  const step = profile.onboarding_step ?? 0;

  // Users should only see the complete screen after generation has finished.
  if (step < 3) {
    redirect("/onboarding/questions");
  }

  const { data: answersData } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer_value")
    .eq("user_id", userData.user.id);

  const answers =
    answersData
      ?.filter(
        (answer) =>
          answer.answer_value !== null &&
          answer.answer_value !== undefined &&
          String(answer.answer_value).trim() !== "" &&
          String(answer.answer_value).toLowerCase() !== "false",
      )
      .flatMap((answer) => {
        const value = answer.answer_value;
        // Handle arrays (multi-select questions)
        if (Array.isArray(value)) {
          return value.map(String);
        }
        // Handle single values
        return [String(value)];
      }) ?? [];

  return (
    <OnboardingCompleteScreen
      name={profile.preferred_name ?? ""}
      zip={profile.zip_code ?? ""}
      answers={answers}
      userId={userData.user.id}
    />
  );
}
