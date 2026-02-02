"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { hydrated, session } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setReady(true);
  }, [hydrated]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (session) {
      router.replace("/welcome");
    } else {
      router.replace("/login");
    }
  };

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <p className="text-sm text-slate-400">Preparing reset link...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Set a new password
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use at least 8 characters to keep your account secure.
        </p>
      </div>

      {!session && (
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          This reset link may be expired. Request a new one if you run into issues.
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-300">
          New password
          <div className="relative mt-2">
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a new password"
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
              placeholder="Re-enter your new password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-16 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-400 hover:text-red-300"
              aria-label={showConfirm ? "Hide password confirmation" : "Show password confirmation"}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving new password..." : "Update password"}
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-400">
        <Link href="/login" className="font-semibold text-red-400 hover:text-red-300">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
