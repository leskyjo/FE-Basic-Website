"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function OnboardingTabSync() {
  const router = useRouter();
  const pathname = usePathname();
  const didRedirectRef = useRef(false);

  useEffect(() => {
    didRedirectRef.current = false;
  }, [pathname]);

  useEffect(() => {
    const checkAndRedirect = () => {
      if (document?.visibilityState && document.visibilityState !== "visible") {
        return;
      }

      let isDone = false;
      try {
        isDone = localStorage.getItem("fe_onboarding_done") === "1";
      } catch {
        return;
      }

      if (!isDone || didRedirectRef.current) return;
      if (pathname.startsWith("/app")) return;

      didRedirectRef.current = true;
      router.replace("/app/home");
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== "fe_onboarding_done") return;
      checkAndRedirect();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", checkAndRedirect);
    document.addEventListener("visibilitychange", checkAndRedirect);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", checkAndRedirect);
      document.removeEventListener("visibilitychange", checkAndRedirect);
    };
  }, [pathname, router]);

  return null;
}
