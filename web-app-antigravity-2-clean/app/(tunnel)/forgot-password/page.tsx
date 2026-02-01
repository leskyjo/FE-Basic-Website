"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail || !sanitizedEmail.includes("@")) {
      setErrorMessage("Enter the email address tied to your account.");
      return;
    }

    setIsSubmitting(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo,
    });

    // Always show success to avoid revealing if account exists
    setSent(true);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Password reset
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-400">
          We&apos;ll send a secure link to reset your password.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {sent ? (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Check your email for a reset link. It should arrive in a few minutes.
        </div>
      ) : (
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-sm text-slate-400">
        <Link href="/login" className="font-semibold text-red-400 hover:text-red-300">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
