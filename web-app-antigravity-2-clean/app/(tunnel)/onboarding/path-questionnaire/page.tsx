import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profiles";
import PathQuestionnaireForm from "./questionnaire-form";

export default async function PathQuestionnairePage() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        redirect("/login");
    }

    const profile = await getOrCreateProfile(supabase, userData.user);

    // Check if user has selected a path
    if (!profile.user_path) {
        redirect("/onboarding/path-choice");
    }

    // Check onboarding step - should be at step 2 (questionnaire)
    const step = profile.onboarding_step ?? 0;

    if (step < 2) {
        redirect("/onboarding/path-choice");
    }

    if (step >= 3) {
        redirect("/onboarding/generating");
    }

    return (
        <PathQuestionnaireForm
            path={profile.user_path as "professional" | "entrepreneur"}
            userId={userData.user.id}
        />
    );
}
