"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export function OnboardingCompleteScreen({
  name,
  zip,
  answers,
  userId,
}: {
  name: string;
  zip: string;
  answers: string[];
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { reloadProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFinish = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_step: 5 })
      .eq("user_id", userId)
      .or("onboarding_step.is.null,onboarding_step.lt.5");

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    try {
      localStorage.setItem("fe_onboarding_done", "1");
      localStorage.setItem("fe_onboarding_done_at", String(Date.now()));
    } catch {
      // Ignore storage errors (privacy mode / denied access).
    }

    await reloadProfile();
    // After finishing onboarding, take the user directly to their plan view.
    router.push("/app/plan");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-indigo-50">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Step 4 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">You&apos;re set.</h1>
      <p className="mt-2 text-sm text-gray-700">
        Here&apos;s a quick recap before we open your app experience.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5 text-sm text-gray-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Preferred name</span>
          <span>{name || "Not provided"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">ZIP</span>
          <span>{zip || "Not provided"}</span>
        </div>
        <div>
          <p className="font-semibold">Priorities</p>
          {answers.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
              {answers.map((item, index) => (
                <li key={`answer-${index}`}>{item.replace(/-/g, " ")}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-600">You skipped the optional choices.</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleFinish}
        disabled={isSubmitting}
        className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Finishing..." : "Continue to Dashboard"}
      </button>
    </div>
  );
}
