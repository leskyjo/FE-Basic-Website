"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { lifePlanQuestionnaire, LifePlanQuestion } from "@/src/content/lifePlanQuestionnaire";
import { createClient } from "@/lib/supabase/browser";

type AnswerValue = string | string[] | number | null;

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

export function GenerateQuestionsForm({
  userId,
  userName,
  initialAnswers,
}: {
  userId: string;
  userName: string;
  initialAnswers: Record<string, unknown>;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
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
    for (let i = 0; i < lifePlanQuestionnaire.length; i++) {
      const group = lifePlanQuestionnaire[i];
      const allRequiredAnswered = group.questions.every((q) => {
        if (!q.required) return true;
        const value = normalizeAnswer(q, initialAnswers[q.question_id]);
        return isRequiredAnswered(q, value);
      });

      if (!allRequiredAnswered) {
        return i;
      }
    }

    return lifePlanQuestionnaire.length - 1;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const lastSaveRef = useRef<Record<string, AnswerValue>>({});

  const currentGroup = lifePlanQuestionnaire[groupIndex];
  const isLastGroup = groupIndex === lifePlanQuestionnaire.length - 1;

  // Auto-save answers to database (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const changed = Object.keys(answers).filter(
        (key) => answers[key] !== lastSaveRef.current[key],
      );

      if (changed.length === 0) return;

      const rows = changed
        .map((question_id) => {
          const question = lifePlanQuestionnaire
            .flatMap((g) => g.questions)
            .find((q) => q.question_id === question_id);

          if (!question) return null;

          const serialized = serializeAnswer(answers[question_id]);
          if (serialized === null) return null;

          return {
            user_id: userId,
            question_id,
            group_id: question.group_id,
            answer_value: serialized,
          };
        })
        .filter(Boolean);

      if (rows.length === 0) return;

      await supabase.from("questionnaire_answers").upsert(rows, {
        onConflict: "user_id,question_id",
      });

      lastSaveRef.current = { ...answers };
    }, 600);

    return () => clearTimeout(timer);
  }, [answers, userId, supabase]);

  const handleNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Validate current group
    const unanswered = currentGroup.questions.filter(
      (q) => !isRequiredAnswered(q, answers[q.question_id]),
    );

    if (unanswered.length > 0) {
      setErrorMessage("Please answer all required questions before continuing.");
      return;
    }

    if (isLastGroup) {
      // Generate Life Plan
      await handleGenerate();
    } else {
      // Move to next group
      setGroupIndex(groupIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGenerate = async () => {
    console.log("[Generate Form] Starting Life Plan generation...");
    setErrorMessage("");
    setIsGenerating(true);

    try {
      console.log("[Generate Form] Calling /api/life-plan/generate...");

      // Create timeout controller (2 minutes max)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

      const response = await fetch("/api/life-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("[Generate Form] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Generate Form] Error response:", errorData);

        // Handle tier quota exceeded
        if (errorData.error === "QUOTA_EXCEEDED") {
          const message =
            errorData.message ||
            "Free tier does not include Life Plan regenerations. Please upgrade to Plus or purchase a one-time regeneration for $2.99.";
          console.warn("[Generate Form] Quota exceeded:", message);
          setErrorMessage(message);
          setIsGenerating(false);
          return;
        }

        throw new Error(errorData.message || errorData.error || "Failed to generate Life Plan");
      }

      const result = await response.json();
      console.log("[Generate Form] Success! Result:", result);

      // Success! Redirect to plan page
      console.log("[Generate Form] Redirecting to /app/plan");
      router.push("/app/plan");
    } catch (error) {
      console.error("[Generate Form] Generation failed:", error);

      // Handle timeout
      if (error instanceof Error && error.name === "AbortError") {
        setErrorMessage(
          "Generation is taking longer than expected. This might be due to high server load. Please try again in a few moments."
        );
      } else {
        const message = error instanceof Error ? error.message : "Failed to generate Life Plan. Please try again.";
        setErrorMessage(message);
      }

      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isGenerating) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 shadow-lg shadow-indigo-50 text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"></div>
        <h2 className="text-2xl font-semibold text-gray-900">Generating Your Life Plan...</h2>
        <p className="mt-3 text-sm text-gray-600">
          This may take 30-60 seconds. Please don&apos;t close this window.
        </p>
        <div className="mt-8 space-y-2 text-left rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <p className="text-sm text-gray-700">✨ Analyzing your responses...</p>
          <p className="text-sm text-gray-700">🎯 Identifying your strengths and goals...</p>
          <p className="text-sm text-gray-700">📋 Creating your personalized action plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-indigo-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Section {groupIndex + 1} of {lifePlanQuestionnaire.length}
          </p>
          <button
            onClick={() => router.push("/app/plan")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{currentGroup.title}</h1>
        {currentGroup.description && (
          <p className="mt-2 text-sm text-gray-700">{currentGroup.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((groupIndex + 1) / lifePlanQuestionnaire.length) * 100}%` }}
        />
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Questions */}
      <form onSubmit={handleNext} className="space-y-6">
        {currentGroup.questions.map((question) => {
          const value = answers[question.question_id];

          return (
            <div key={question.question_id} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                {question.label}
                {question.required && <span className="ml-1 text-rose-500">*</span>}
              </label>
              {question.helper_text && (
                <p className="text-xs text-gray-500">{question.helper_text}</p>
              )}

              {question.type === "single_choice" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <input
                        type="radio"
                        name={question.question_id}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.question_id]: e.target.value })
                        }
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "multi_choice" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const checked = Array.isArray(value) && value.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-indigo-300 hover:bg-indigo-50/50"
                      >
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={checked}
                          onChange={(e) => {
                            const current = Array.isArray(value) ? value : [];
                            const next = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v) => v !== option.value);
                            setAnswers({ ...answers, [question.question_id]: next });
                          }}
                          className="h-4 w-4 rounded text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {(question.type === "short_text" || question.type === "long_text") && (
                <input
                  type="text"
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [question.question_id]: e.target.value })
                  }
                  placeholder={question.helper_text || "Type your answer here..."}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}

              {question.type === "numeric" && (
                <input
                  type="number"
                  value={typeof value === "number" || typeof value === "string" ? value : ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [question.question_id]: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  placeholder={question.helper_text || "Enter a number..."}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </div>
          );
        })}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {groupIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving
              ? "Saving..."
              : isLastGroup
              ? "Generate My Life Plan"
              : "Continue"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Your answers are automatically saved as you go.
      </p>
    </div>
  );
}
