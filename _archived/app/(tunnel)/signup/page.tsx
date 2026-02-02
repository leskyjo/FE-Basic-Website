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
    const targetPath = "/welcome";
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
        emailRedirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.push("/welcome");
      return;
    }

    setSuccessEmail(email);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Join free
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Join the Waitlist</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign up to get early access when Felon Entrepreneur launches.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {successEmail ? (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
            <p className="text-base font-semibold text-emerald-200">Check your email</p>
            <p className="mt-1">
              We sent a verification link to {successEmail}. Click it to complete your signup.
            </p>
          </div>
          <Link
            href="/login"
            className="block w-full rounded-lg bg-red-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400"
          >
            I verified — Log in
          </Link>
          <div className="text-center text-sm text-slate-400">
            <Link href="/" className="font-semibold text-red-400 hover:text-red-300">
              Back to home
            </Link>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Password
              <div className="relative mt-2">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-16 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-400 hover:text-red-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Confirm password
              <div className="relative mt-2">
                <input
                  required
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-16 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-400 hover:text-red-300"
                  aria-label={
                    showConfirm ? "Hide password confirmation" : "Show password confirmation"
                  }
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400">
              <input
                required
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500/50"
              />
              <span>
                I agree to the terms and acknowledge the privacy policy. This is required to
                continue.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Join the Waitlist"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>Already have an account?</span>
            <Link href="/login" className="font-semibold text-red-400 hover:text-red-300">
              Log in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
