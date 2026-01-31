"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const { hydrated, isLoggedIn } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        ? "Your email isn't verified yet. Check your inbox for the verification link, then try logging in again."
        : error.message;
      setErrorMessage(friendlyMessage);
      setIsSubmitting(false);
      return;
    }

    router.push("/welcome");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Log in to Felon Entrepreneur</h1>
        <p className="mt-2 text-sm text-slate-400">Access your waitlist account.</p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-red-400 hover:text-red-300">
          Forgot password?
        </Link>
        <span>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-red-400 hover:text-red-300">
            Join free
          </Link>
        </span>
      </div>
    </div>
  );
}
