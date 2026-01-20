"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

type GenerationStatus = "idle" | "queued" | "processing" | "complete" | "error";

export function OnboardingGeneratingScreen({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const { reloadProfile } = useAuth();
  const didStartRef = useRef(false);
  const didFinishRef = useRef(false);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [message, setMessage] = useState("Starting your plan generation...");

  useEffect(() => {
    if (didStartRef.current) return;
    didStartRef.current = true;

    const startGeneration = async () => {
      // Check if generation is already in progress or complete
      const statusCheck = await fetch("/api/life-plan/status");
      if (statusCheck.ok) {
        const data = await statusCheck.json();
        if (data.status === "complete") {
          // Plan already exists, redirect to complete
          setStatus("complete");
          await reloadProfile();
          router.replace("/app/plan");
          return;
        }
      }

      setStatus("queued");
      const response = await fetch("/api/life-plan/generate", {
        method: "POST",
      });

      if (!response.ok) {
        setStatus("error");
        setMessage("We hit a snag. Please refresh to try again.");
        return;
      }

      setStatus("processing");
      setMessage("Building your Life Plan...");
    };

    void startGeneration();
  }, [reloadProfile, router]);

  useEffect(() => {
    if (status !== "processing") return;
    if (didFinishRef.current) return;

    const poll = async () => {
      const response = await fetch("/api/life-plan/status");
      if (!response.ok) return;
      const data = (await response.json()) as { status?: string };
      if (data.status === "complete") {
        didFinishRef.current = true;

        // Move to the final recap step of onboarding.
        await reloadProfile();
        router.replace("/app/plan");
      }
    };

    const interval = setInterval(poll, 1500);
    void poll();

    return () => clearInterval(interval);
  }, [router, status, reloadProfile]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg shadow-indigo-50">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Step 3 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">Generating your Life Plan</h1>
      <p className="mt-3 text-sm text-gray-700">{message}</p>
      <div className="mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-500 shadow-xl shadow-indigo-200">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-950/90 ring-4 ring-indigo-200/60">
          <div className="flex flex-col items-center justify-center text-xs font-semibold text-indigo-100">
            <span className="text-lg">FE</span>
            <span className="mt-1 animate-pulse text-[10px] uppercase tracking-[0.18em]">
              Generating
            </span>
          </div>
        </div>
      </div>
      {status === "error" && (
        <p className="mt-6 text-sm font-semibold text-rose-600">
          Please try again or come back later.
        </p>
      )}
    </div>
  );
}
