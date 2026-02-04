"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/browser";

// Password strength calculation
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
  return { score: 5, label: "Very Strong", color: "bg-emerald-400" };
}

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

  const passwordStrength = getPasswordStrength(password);

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

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail || !sanitizedEmail.includes("@")) {
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
    // Use production URL for email redirects
    // In production, always use the custom domain; locally use origin for dev
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const siteUrl = isLocalhost ? window.location.origin : 'https://www.felonentrepreneur.com';
    const emailRedirectTo = `${siteUrl}/auth/callback`;
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      const lowered = error.message.toLowerCase();
      let friendlyMessage = "Unable to create account. Please check your information and try again.";

      // Check for account already exists
      if (lowered.includes("already registered") || lowered.includes("already exists") || lowered.includes("user already")) {
        friendlyMessage = "An account with this email already exists. Please log in instead.";
      } else if (lowered.includes("rate limit") || lowered.includes("too many")) {
        friendlyMessage = "Too many attempts. Please wait a few minutes and try again.";
      } else if (lowered.includes("invalid email")) {
        friendlyMessage = "Please enter a valid email address.";
      }

      setErrorMessage(friendlyMessage);
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.push("/welcome");
      return;
    }

    // Send admin notification (fire-and-forget, don't block user)
    fetch("/api/admin-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: sanitizedEmail }),
    }).catch(() => {
      // Silently fail - admin notification is not critical for user
    });

    setSuccessEmail(sanitizedEmail);
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

            <div>
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
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.score >= 3 ? 'text-emerald-400' : passwordStrength.score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Use 8+ characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>

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
                I agree to the{" "}
                <Link href="/terms" className="text-red-400 hover:text-red-300 underline" target="_blank">
                  Terms of Service
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy-policy" className="text-red-400 hover:text-red-300 underline" target="_blank">
                  Privacy Policy
                </Link>
                . This is required to continue.
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
