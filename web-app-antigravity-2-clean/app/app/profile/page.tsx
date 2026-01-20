"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { User, MapPin, Settings, LogOut, RotateCcw, Briefcase, ArrowRight } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, resetProfile, signOut } = useAuth();
  const [name, setName] = useState(profile.preferred_name ?? profile.name ?? "");
  const [zip, setZip] = useState(profile.zip_code ?? profile.zip ?? "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(profile.preferred_name ?? profile.name ?? "");
    setZip(profile.zip_code ?? profile.zip ?? "");
  }, [profile.preferred_name, profile.name, profile.zip_code, profile.zip]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({ name, zip });
    setMessage("Profile saved.");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleResetOnboarding = () => {
    resetProfile();
    setMessage("Onboarding restarted. Taking you to step 1...");
    setTimeout(() => {
      router.push("/onboarding/name");
    }, 600);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative glass-strong rounded-2xl border border-cyber-red/30 p-6 overflow-hidden">
        {/* Red glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/10 via-transparent to-transparent animate-pulse opacity-50" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyber-red/10 border border-cyber-red/30">
              <User className="w-5 h-5 text-cyber-red" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyber-red">Profile</p>
          </div>
          <h1 className="text-3xl font-bold text-white glow-text-red">Your details</h1>
          <p className="mt-2 text-sm text-cyber-text-secondary leading-relaxed">
            Update the info used across your app experience.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="relative glass-strong rounded-2xl border border-cyber-red/30 p-6 space-y-4"
      >
        {/* Preferred Name */}
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-cyber-red" />
            <span className="text-sm font-semibold text-cyber-text">Preferred name</span>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-cyber-red/30 bg-cyber-black-lighter px-4 py-3 text-sm text-cyber-text shadow-sm outline-none transition focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20"
          />
        </label>

        {/* ZIP Code */}
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-cyber-red" />
            <span className="text-sm font-semibold text-cyber-text">ZIP / Postal code</span>
          </div>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="10001"
            className="w-full rounded-xl border border-cyber-red/30 bg-cyber-black-lighter px-4 py-3 text-sm text-cyber-text shadow-sm outline-none transition focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20"
          />
        </label>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full cyber-button rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-glow-red flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Save profile
        </button>

        {/* Success Message */}
        {message && (
          <p className="text-center text-sm font-semibold text-cyber-red animate-pulse">{message}</p>
        )}
      </form>

      {/* Employment Details - NEW */}
      <Link
        href="/app/employment"
        className="block group relative glass-strong rounded-2xl border border-cyber-red/30 hover:border-cyber-red p-6 overflow-hidden transition-all duration-300 hover:shadow-glow-red"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-red/20 to-purple-900/20 border border-cyber-red/30 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-6 h-6 text-cyber-red" />
            </div>
            <div>
              <p className="text-lg font-bold text-white group-hover:text-cyber-red transition-colors">Employment Details</p>
              <p className="text-sm text-cyber-text-secondary mt-0.5">
                Power up Resume Builder, Application Assistant & Job Search
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-cyber-red group-hover:translate-x-2 transition-transform duration-300" />
        </div>

        {/* Progress indicator */}
        <div className="relative mt-4 bg-cyber-black-lighter rounded-full h-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-red to-purple-600 w-0 group-hover:w-full transition-all duration-1000" />
        </div>
        <p className="text-xs text-gray-500 mt-2">Complete your career profile to unlock all Career Finder Studio tools</p>
      </Link>

      {/* Priorities Section */}
      <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
        <p className="text-sm font-semibold text-white">Priorities</p>
        <p className="mt-2 text-sm text-cyber-text-secondary leading-relaxed">
          Priorities are saved during onboarding and will appear here after completion.
        </p>
      </div>

      {/* Session Controls - Danger Zone */}
      <div className="relative glass-strong rounded-2xl border border-red-500/40 p-6 overflow-hidden">
        {/* Red glow for danger */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />

        <div className="relative">
          <p className="text-sm font-semibold text-red-400">Session controls</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {/* Restart Onboarding */}
            <button
              onClick={handleResetOnboarding}
              className="flex-1 rounded-xl border border-red-500/40 bg-cyber-black-lighter px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart onboarding
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="flex-1 rounded-xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:shadow-[0_0_24px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
