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

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Enter the email address tied to your account.");
      return;
    }

    setIsSubmitting(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSent(true);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-indigo-100">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Password reset
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ll send a secure link to reset your password.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Check your email for a reset link. It should arrive in a few minutes.
        </div>
      ) : (
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
