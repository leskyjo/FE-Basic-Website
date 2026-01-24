"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function WelcomePage() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-bold">Felon Entrepreneur</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          Sign out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            You&apos;re on the list!
          </h1>

          <p className="text-lg text-slate-300 mb-6">
            Welcome to the Felon Entrepreneur community
            {profile?.email && (
              <span className="block text-sm text-slate-400 mt-2">
                {profile.email}
              </span>
            )}
          </p>

          {/* Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-3 text-emerald-400">
              What happens next?
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">1</span>
                <span>We&apos;ll send you updates as we get closer to launch</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">2</span>
                <span>You&apos;ll get early access to the app before everyone else</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">3</span>
                <span>Exclusive resources and content coming your way</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-center font-semibold text-white shadow-lg shadow-red-900/30 transition hover:from-red-500 hover:to-red-600"
            >
              Back to Home
            </Link>

            <p className="text-sm text-slate-500">
              Follow us on social media for the latest updates
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Image src="/FB1.png" alt="Facebook" width={20} height={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Image src="/IG1.png" alt="Instagram" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Felon Entrepreneur. All rights reserved.
      </footer>
    </div>
  );
}
