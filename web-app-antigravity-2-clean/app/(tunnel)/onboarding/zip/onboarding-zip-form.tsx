"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export function OnboardingZipForm({
  initialZip,
  userId,
}: {
  initialZip: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { reloadProfile } = useAuth();
  const [zip, setZip] = useState(initialZip);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!zip.trim()) {
      setErrorMessage("Please enter your ZIP or postal code.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({ zip_code: zip.trim(), onboarding_step: 2 })
      .eq("user_id", userId)
      .or("onboarding_step.is.null,onboarding_step.lt.2");

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await reloadProfile();
    router.push("/onboarding/path-choice");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-indigo-50">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Step 2 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">Where are you based?</h1>
      <p className="mt-2 text-sm text-gray-700">
        We use your zip code to surface nearby opportunities and shipping options.
      </p>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          ZIP / Postal code
          <input
            required
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="10001"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        {/* Privacy Notice */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-indigo-900">🔒 Your Privacy:</span> Your information is completely confidential and will never be shared outside of Felon Entrepreneur. We use it solely to personalize your experience and help you achieve your goals.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Continue to Life Plan Questionnaire"}
        </button>
      </form>
    </div>
  );
}
