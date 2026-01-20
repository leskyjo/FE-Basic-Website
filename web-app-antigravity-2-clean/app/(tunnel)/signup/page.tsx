"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const pathname = usePathname();
  const didRedirect = useRef(false);
  const { hydrated, isLoggedIn } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    didRedirect.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!hydrated || !isLoggedIn) return;
    const targetPath = "/onboarding/name";
    if (didRedirect.current || pathname === targetPath) return;
    didRedirect.current = true;
    router.replace(targetPath);
  }, [hydrated, isLoggedIn, pathname, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Enter a valid email address to continue.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the terms to create your account.");
      return;
    }

    setIsSubmitting(true);
    const emailRedirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Keep email verification landing on onboarding instead of the public landing page.
        emailRedirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.push("/onboarding/name");
      return;
    }

    setSuccessEmail(email);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-indigo-100">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Join free
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Create your FlowEngine account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Start with a quick signup, then we&apos;ll guide you through onboarding.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      {successEmail ? (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
            <p className="text-base font-semibold text-emerald-800">Check your email</p>
            <p className="mt-1">
              We sent a verification link to {successEmail}. Click it to continue to onboarding.
            </p>
          </div>
          <Link
            href="/login"
            className="block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            I verified — Log in
          </Link>
          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Back to landing
            </Link>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-800">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block text-sm font-semibold text-gray-800">
              Password
              <div className="relative mt-2">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="block text-sm font-semibold text-gray-800">
              Confirm password
              <div className="relative mt-2">
                <input
                  required
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                  aria-label={
                    showConfirm ? "Hide password confirmation" : "Show password confirmation"
                  }
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm text-gray-700">
              <input
                required
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                I agree to the terms and acknowledge the privacy policy. This is required to
                continue.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Join free & start onboarding"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <span>Already have an account?</span>
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
