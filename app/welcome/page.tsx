"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function WelcomePage() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [showElectricity, setShowElectricity] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [waitlistPosition] = useState(() => Math.floor(Math.random() * 200) + 100);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    // Trigger electricity animation after mount
    const timer1 = setTimeout(() => setShowElectricity(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 flex flex-col overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.08),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Electricity Effect Container */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            {/* Outer glow rings */}
            <div className={`absolute inset-0 rounded-full bg-red-500/20 blur-xl transition-all duration-1000 ${showElectricity ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
            <div className={`absolute inset-0 rounded-full bg-red-600/30 blur-lg transition-all duration-700 delay-100 ${showElectricity ? 'scale-125 opacity-100' : 'scale-100 opacity-0'}`} />

            {/* Electric arcs */}
            {showElectricity && (
              <>
                <svg className="absolute inset-0 w-full h-full animate-pulse" viewBox="0 0 100 100">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Lightning bolts radiating outward */}
                  <path d="M50,50 L30,20 L35,35 L15,25" stroke="#ef4444" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                  <path d="M50,50 L70,20 L65,35 L85,25" stroke="#ef4444" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }} />
                  <path d="M50,50 L80,50 L70,45 L90,40" stroke="#f87171" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                  <path d="M50,50 L70,80 L65,65 L85,75" stroke="#ef4444" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }} />
                  <path d="M50,50 L30,80 L35,65 L15,75" stroke="#f87171" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
                  <path d="M50,50 L20,50 L30,45 L10,40" stroke="#ef4444" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-[electricArc_0.5s_ease-in-out_infinite]" style={{ animationDelay: '150ms' }} />
                </svg>

                {/* Additional spark particles */}
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping" style={{ animationDuration: '1s' }} />
                <div className="absolute top-1/4 right-0 w-1 h-1 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.3s' }} />
                <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-red-400 rounded-full animate-ping" style={{ animationDuration: '0.8s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '1.1s', animationDelay: '0.2s' }} />
              </>
            )}

            {/* Main success icon */}
            <div className={`relative z-10 w-full h-full rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.5)] transition-all duration-500 ${showElectricity ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <svg
                className={`w-16 h-16 text-white transition-all duration-500 delay-300 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Welcome Message */}
          <div className={`transition-all duration-700 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              You&apos;re{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                In.
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-2">
              Welcome to the movement.
            </p>

            {profile?.email && (
              <p className="text-sm text-slate-500 mb-6">
                {profile.email}
              </p>
            )}
          </div>

          {/* Waitlist Position Badge */}
          <div className={`inline-flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 mb-8 transition-all duration-700 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Your Position</p>
              <p className="text-2xl font-bold text-white">#{waitlistPosition}</p>
            </div>
            <div className="w-px h-10 bg-red-500/30" />
            <p className="text-sm text-slate-400 text-left max-w-[140px]">
              Among the first to believe in this mission
            </p>
          </div>

          {/* What's Coming Card */}
          <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left transition-all duration-700 delay-900 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              What&apos;s Coming
            </h2>
            <div className="grid gap-3">
              {[
                { icon: "📱", title: "Mobile App", desc: "iOS & Android" },
                { icon: "📋", title: "AI Life Plan", desc: "Personalized roadmap" },
                { icon: "💼", title: "Job Discovery", desc: "Fair-chance employers" },
                { icon: "🏢", title: "Business Builder", desc: "Start your own" },
                { icon: "🎓", title: "Cheat Codes", desc: "Quick-win lessons" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className={`mb-8 transition-all duration-700 delay-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="text-sm text-slate-500 mb-4">
              Follow us for exclusive updates
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.facebook.com/REENTRYSGOAT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-red-500/20 hover:text-white"
                aria-label="Follow on Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/felon_entrepreneur/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-red-500/20 hover:text-white"
                aria-label="Follow on Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className={`transition-all duration-700 delay-1100 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-center font-semibold text-white shadow-lg shadow-red-900/30 transition hover:from-red-500 hover:to-red-600 hover:-translate-y-0.5"
            >
              Explore the Vision
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-white/10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Felon Entrepreneur. All rights reserved.
      </footer>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes electricArc {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
