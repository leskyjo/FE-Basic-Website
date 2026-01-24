"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, isLoggedIn } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We no longer auto-redirect away from the login page based on client-side
  // auth state alone. This avoids navigation loops when the server session
  // disagrees with the browser session or when Supabase returns 401/403.

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Enter the email you used to sign up.");
      return;
    }

    if (!password) {
      setErrorMessage("Enter your password to continue.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const lowered = error.message.toLowerCase();
      const friendlyMessage = lowered.includes("email not confirmed")
        ? "Your email isn’t verified yet. Check your inbox for the verification link, then try logging in again."
        : error.message;
      setErrorMessage(friendlyMessage);
      setIsSubmitting(false);
      return;
    }

    router.push("/welcome");
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-indigo-100">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Log in to Felon Entrepreneur</h1>
        <p className="mt-2 text-sm text-gray-600">Access your waitlist account.</p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log in & continue"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </Link>
        <span>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Join free
          </Link>
        </span>
      </div>
    </div>
  );
}
