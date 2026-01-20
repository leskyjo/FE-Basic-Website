"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/lib/auth-context";
import { routeForOnboardingStep } from "@/lib/profiles";

export function AppRouteGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isLoggedIn, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const didRedirectRef = useRef(false);

  useEffect(() => {
    didRedirectRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isLoggedIn) {
      if (didRedirectRef.current || pathname === "/login") return;
      didRedirectRef.current = true;
      router.replace("/login");
      return;
    }

    const step = profile.onboardingStep ?? 0;
    if (step >= 4) return;
    const target = routeForOnboardingStep(step);
    if (pathname === target) return;
    if (didRedirectRef.current) return;
    didRedirectRef.current = true;
    router.replace(target);
  }, [hydrated, isLoggedIn, pathname, profile.onboardingStep, router]);

  return <>{children}</>;
}
