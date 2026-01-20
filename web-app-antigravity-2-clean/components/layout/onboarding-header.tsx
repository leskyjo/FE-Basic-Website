"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";

const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

export function OnboardingHeader() {
  const router = useRouter();
  const { isLoggedIn, signOut } = useAuth();
  const [idleMessage, setIdleMessage] = useState<string | null>(null);
  const signOutRef = useRef(signOut);
  const routerRef = useRef(router);

  // Keep refs updated
  useEffect(() => {
    signOutRef.current = signOut;
    routerRef.current = router;
  }, [signOut, router]);

  useEffect(() => {
    // On mount, check if we previously performed an idle logout.
    try {
      const flag = localStorage.getItem("fe_onboarding_idle_logout");
      if (flag === "1") {
        setIdleMessage(
          "We signed you out after 15 minutes of inactivity to keep your account safe. Log back in to continue onboarding.",
        );
        localStorage.removeItem("fe_onboarding_idle_logout");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    let lastActive = Date.now();

    const markActive = () => {
      lastActive = Date.now();
    };

    const handleIdleCheck = async () => {
      if (Date.now() - lastActive < IDLE_LIMIT_MS) return;

      try {
        localStorage.setItem("fe_onboarding_idle_logout", "1");
      } catch {
        // ignore
      }

      await signOutRef.current();
      routerRef.current.replace("/");
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, markActive));
    const interval = window.setInterval(handleIdleCheck, 30_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, markActive));
      window.clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleBackHome = () => {
    const confirmed = window.confirm(
      "Your answers are saved as you go. Leave onboarding and go back to the home page?",
    );
    if (!confirmed) return;
    router.push("/");
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm(
      "Save your progress and sign out? You'll be able to resume onboarding next time you log in.",
    );
    if (!confirmed) return;

    await signOut();
    router.push("/");
  };

  return (
    <div className="mb-8 flex flex-col gap-3">
      {idleMessage && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {idleMessage}
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackHome}
          className="flex items-center gap-3 text-left"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
            FE
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
              FlowEngine
            </p>
            <p className="text-sm text-gray-600">Secure access + onboarding</p>
          </div>
        </button>

        <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
          <button
            type="button"
            onClick={handleBackHome}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            Back to Home
          </button>
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gray-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
