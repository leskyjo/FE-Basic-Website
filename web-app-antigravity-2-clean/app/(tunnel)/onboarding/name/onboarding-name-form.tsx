"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export function OnboardingNameForm({
  initialName,
  userId,
}: {
  initialName: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { reloadProfile } = useAuth();
  const [name, setName] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your preferred name.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_name: name.trim(), onboarding_step: 1 })
      .eq("user_id", userId)
      .or("onboarding_step.is.null,onboarding_step.lt.1");

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await reloadProfile();
    router.push("/onboarding/zip");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-indigo-50">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Step 1 of 5</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">What&apos;s your preferred name?</h1>
      <p className="mt-2 text-sm text-gray-700">
        We use this to personalize your plan and messages.
      </p>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Preferred name
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Continue to zip code"}
        </button>
      </form>
    </div>
  );
}
