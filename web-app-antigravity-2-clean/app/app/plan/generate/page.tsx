import { redirect } from "next/navigation";

import { getOrCreateProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

import { GenerateQuestionsForm } from "./generate-questions-form";

export default async function PlanGeneratePage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getOrCreateProfile(supabase, userData.user);

  // Load existing answers (if any)
  const { data: answersData } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer_value")
    .eq("user_id", userData.user.id);

  const initialAnswers =
    answersData?.reduce<Record<string, unknown>>((acc, answer) => {
      acc[answer.question_id] = answer.answer_value;
      return acc;
    }, {}) ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 py-8">
      <div className="mx-auto max-w-2xl">
        <GenerateQuestionsForm
          initialAnswers={initialAnswers}
          userId={userData.user.id}
          userName={profile.preferred_name || profile.name || "there"}
        />
      </div>
    </div>
  );
}
