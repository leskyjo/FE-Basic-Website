"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { lifePlanQuestionnaire, LifePlanQuestion } from "@/src/content/lifePlanQuestionnaire";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

type AnswerValue = string | string[] | number | null;

const GROUP_STORAGE_KEY = "fe_questionnaire_group";

function normalizeAnswer(question: LifePlanQuestion, raw: unknown): AnswerValue {
  if (raw === null || raw === undefined) return null;
  if (question.type === "multi_choice") {
    if (Array.isArray(raw)) return raw as string[];
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as string[];
      } catch {
        return [];
      }
    }
    return [];
  }
  if (question.type === "numeric") {
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") return raw;
    return null;
  }
  return String(raw);
}

function serializeAnswer(value: AnswerValue): string | number | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    return value.length ? JSON.stringify(value) : null;
  }
  if (typeof value === "number") return Number.isNaN(value) ? null : value;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function isRequiredAnswered(question: LifePlanQuestion, value: AnswerValue) {
  if (!question.required) return true;
  if (question.type === "multi_choice") {
    return Array.isArray(value) && value.length > 0;
  }
  if (question.type === "numeric") {
    if (typeof value === "number") return !Number.isNaN(value);
    if (typeof value === "string") return value.trim() !== "" && !Number.isNaN(Number(value));
    return false;
  }
  if (typeof value === "string") return value.trim() !== "";
  return false;
}

export function OnboardingQuestionsForm({
  userId,
  initialAnswers,
}: {
  userId: string;
  initialAnswers: Record<string, unknown>;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { reloadProfile, signOut } = useAuth();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(() => {
    const result: Record<string, AnswerValue> = {};
    lifePlanQuestionnaire.forEach((group) => {
      group.questions.forEach((question) => {
        result[question.question_id] = normalizeAnswer(
          question,
          initialAnswers[question.question_id],
        );
      });
    });
    return result;
  });
  const [groupIndex, setGroupIndex] = useState<number>(() => {
    // SMART RESUME: Calculate which section to start on based on answered questions
    // This works across browsers/devices and survives logout
    for (let i = 0; i < lifePlanQuestionnaire.length; i++) {
      const group = lifePlanQuestionnaire[i];
      const allRequiredAnswered = group.questions.every((q) => {
        if (!q.required) return true;
        const value = normalizeAnswer(q, initialAnswers[q.question_id]);
        return isRequiredAnswered(q, value);
      });

      // If this group has unanswered required questions, start here
      if (!allRequiredAnswered) {
        return i;
      }
    }

    // All groups are complete - start at last group (user can hit "Generate")
    return lifePlanQuestionnaire.length - 1;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");
  const hasMountedRef = useRef(false);

  const group = lifePlanQuestionnaire[groupIndex];
  const totalGroups = lifePlanQuestionnaire.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${GROUP_STORAGE_KEY}_${userId}`, String(groupIndex));
    } catch {
      // Ignore storage errors.
    }
  }, [groupIndex, userId]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!group) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    const rows = group.questions.map((question) => ({
      user_id: userId,
      question_id: question.question_id,
      group_id: question.group_id,
      answer_value: serializeAnswer(answers[question.question_id]),
    }));

    const payloadKey = JSON.stringify(rows.map((row) => [row.question_id, row.answer_value]));
    if (payloadKey === lastSavedRef.current) return;

    const nonNullRows = rows.filter((row) => row.answer_value !== null);

    saveTimerRef.current = setTimeout(async () => {
      setSaveState("saving");
      const { error } = await supabase
        .from("questionnaire_answers")
        .upsert(nonNullRows, { onConflict: "user_id,question_id" });

      if (error) {
        setSaveState("error");
        return;
      }

      lastSavedRef.current = payloadKey;
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    }, 600);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [answers, group, supabase, userId]);

  if (!group) {
    return null;
  }

  const progress = Math.round(((groupIndex + 1) / totalGroups) * 100);
  const allRequiredAnsweredCurrent = group.questions.every((question) =>
    isRequiredAnswered(question, answers[question.question_id]),
  );

  const findFirstMissingRequiredGroup = () => {
    for (let index = 0; index < lifePlanQuestionnaire.length; index += 1) {
      const missing = lifePlanQuestionnaire[index].questions.some(
        (question) => !isRequiredAnswered(question, answers[question.question_id]),
      );
      if (missing) return index;
    }
    return null;
  };

  const handleBack = () => {
    setErrorMessage("");
    if (groupIndex === 0) {
      router.push("/onboarding/zip");
      return;
    }
    setGroupIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setErrorMessage("");
    if (!allRequiredAnsweredCurrent) {
      setErrorMessage("Please answer the required questions before continuing.");
      return;
    }
    setGroupIndex((prev) => Math.min(totalGroups - 1, prev + 1));
  };

  const handleSaveAndExit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    const rows = lifePlanQuestionnaire.flatMap((groupConfig) =>
      groupConfig.questions.map((question) => ({
        user_id: userId,
        question_id: question.question_id,
        group_id: question.group_id,
        answer_value: serializeAnswer(answers[question.question_id]),
      })),
    );

    const nonNullRows = rows.filter((row) => row.answer_value !== null);
    const payloadKey = JSON.stringify(nonNullRows.map((row) => [row.question_id, row.answer_value]));

    const { error } = await supabase
      .from("questionnaire_answers")
      .upsert(nonNullRows, { onConflict: "user_id,question_id" });

    if (error) {
      setErrorMessage(error.message);
      setSaveState("error");
      setIsSubmitting(false);
      return;
    }

    lastSavedRef.current = payloadKey;
    setSaveState("saved");

    try {
      localStorage.setItem(`${GROUP_STORAGE_KEY}_${userId}`, String(groupIndex));
    } catch {
      // Ignore storage errors.
    }

    setIsSubmitting(false);

    const shouldLogout = window.confirm(
      "Your progress is automatically saved. Do you want to log out now?\n\nYou can resume exactly where you left off when you sign back in - even from a different device.",
    );

    if (shouldLogout) {
      await signOut();
      router.replace("/");
    }
    // If the user chooses not to log out, we keep them on the page so their
    // current in-memory answers remain visible. They can close the tab or
    // navigate away manually when they are ready.
  };

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const missingGroupIndex = findFirstMissingRequiredGroup();
    if (missingGroupIndex !== null) {
      setErrorMessage("Please complete all required questions before generating your plan.");
      setGroupIndex(missingGroupIndex);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_step: 3 })
      .eq("user_id", userId)
      .or("onboarding_step.is.null,onboarding_step.lt.3");

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await reloadProfile();
    router.push("/onboarding/generating");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-indigo-50 sm:p-8">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
        <span>
          Section {groupIndex + 1} of {totalGroups}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">{group.title}</h1>
      {group.description && (
        <p className="mt-2 text-sm text-gray-600">{group.description}</p>
      )}

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleGenerate} className="mt-6 space-y-6">
        {group.questions.map((question) => {
          const value = answers[question.question_id];
          return (
            <div key={question.question_id} className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                {question.label}
                {question.required && <span className="text-rose-500"> *</span>}
              </p>
              {question.type === "single_choice" && question.options && (
                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const active = value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.question_id]: option.value,
                          }))
                        }
                        className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          active
                            ? "border-indigo-300 bg-indigo-50 text-indigo-900 shadow-sm"
                            : "border-gray-200 bg-white text-gray-800 hover:border-indigo-200 hover:bg-indigo-50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full border ${
                            active
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === "multi_choice" && question.options && (
                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const current = Array.isArray(value) ? value : [];
                    const active = current.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => {
                            const nextValues = Array.isArray(prev[question.question_id])
                              ? [...(prev[question.question_id] as string[])]
                              : [];
                            const next = nextValues.includes(option.value)
                              ? nextValues.filter((item) => item !== option.value)
                              : [...nextValues, option.value];
                            return {
                              ...prev,
                              [question.question_id]: next,
                            };
                          })
                        }
                        className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          active
                            ? "border-indigo-300 bg-indigo-50 text-indigo-900 shadow-sm"
                            : "border-gray-200 bg-white text-gray-800 hover:border-indigo-200 hover:bg-indigo-50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full border ${
                            active
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === "short_text" && (
                <input
                  value={typeof value === "string" ? value : ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.question_id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}

              {question.type === "long_text" && (
                <textarea
                  rows={4}
                  value={typeof value === "string" ? value : ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.question_id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}

              {question.type === "numeric" && (
                <input
                  type="number"
                  value={typeof value === "number" ? value : value ?? ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.question_id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 sm:w-auto"
          >
            Back
          </button>

          <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-gray-500">
              {saveState === "saving" && "Saving..."}
              {saveState === "saved" && "Saved"}
              {saveState === "error" && "Save failed"}
            </span>
            <button
              type="button"
              onClick={handleSaveAndExit}
              disabled={isSubmitting}
              className="inline-flex rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50"
            >
              Save & finish later
            </button>
            {groupIndex < totalGroups - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!allRequiredAnsweredCurrent || isSubmitting}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !allRequiredAnsweredCurrent}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? "Generating..." : "Generate My Life Plan"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
