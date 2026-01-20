"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, Zap, TrendingUp } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

type PlanSummaryStatus = "none" | "queued" | "processing" | "complete" | "error";

type PlanSummary = {
  status: PlanSummaryStatus;
  title: string;
  summary: string;
};

const quickActions = [
  {
    title: "Finish today's sprint",
    body: "15 minutes: outline your story and publish one small update.",
    href: "/app/plan",
    icon: Target,
  },
  {
    title: "Apply with a tailored resume",
    body: "Use the FE Button to generate a targeted resume for the top match.",
    href: "/app/jobs",
    icon: Zap,
  },
  {
    title: "Level up with a micro-course",
    body: "Complete a 30-minute module to unlock next week's badge.",
    href: "/app/courses",
    icon: TrendingUp,
  },
];

const signals = [
  "Jobs curated from your zip and preferences",
  "Courses mapped to your plan milestones",
  "Shop items matched to your stack and location",
];

export default function HomePage() {
  const { profile } = useAuth();
  const name = profile.preferred_name || profile.name || "there";
  const [planSummary, setPlanSummary] = useState<PlanSummary | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlan = async () => {
      try {
        const response = await fetch("/api/life-plan/summary");
        if (!response.ok) {
          // In dev, log the error but don't crash the page.
          try {
            const text = await response.text();
            console.error("Failed to load Life Plan summary", response.status, text);
          } catch {
            console.error("Failed to load Life Plan summary", response.status);
          }
          return;
        }
        const data = (await response.json()) as PlanSummary;
        if (!isMounted) return;
        setPlanSummary(data);
      } catch (error) {
        console.error("Error loading Life Plan summary", error);
      }
    };

    void loadPlan();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <div className="relative glass-strong rounded-2xl border border-cyber-red/30 px-6 py-8 overflow-hidden">
        {/* Red glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/10 via-transparent to-transparent animate-pulse opacity-50" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyber-red">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white glow-text-red">Welcome back, {name}.</h1>
          <p className="mt-3 max-w-2xl text-sm text-cyber-text-secondary leading-relaxed">
            Tap the FE Button for your next best action, or jump into plan, jobs, courses, and shop from here.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/app/plan"
              className="cyber-button rounded-full px-6 py-2.5 transition-all duration-300 hover:shadow-glow-red"
            >
              Open my plan
            </Link>
            <Link
              href="/app/jobs"
              className="rounded-full border border-cyber-red/30 px-6 py-2.5 text-cyber-text transition-all duration-300 hover:border-cyber-red hover:text-cyber-red hover:shadow-glow-red"
            >
              View jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Life Plan status card */}
      {planSummary && (
        <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyber-red">
                Life Plan
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                {planSummary.status === "queued" || planSummary.status === "processing"
                  ? "We're wiring your Life Plan"
                  : planSummary.title}
              </h2>
              <p className="mt-2 text-sm text-cyber-text-secondary">{planSummary.summary}</p>
            </div>
            <div className="mt-3 flex flex-col gap-2 md:mt-0 md:items-end">
              {planSummary.status === "queued" || planSummary.status === "processing" ? (
                <button className="inline-flex items-center gap-2 rounded-full border border-cyber-red/30 px-4 py-2 text-xs font-semibold text-cyber-red">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyber-red" />
                  Generating
                </button>
              ) : (
                <Link
                  href="/app/plan"
                  className="cyber-button rounded-full px-5 py-2.5 text-sm transition-all duration-300 hover:shadow-glow-red"
                >
                  View Life Plan
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group relative glass-strong rounded-2xl border border-cyber-red/30 p-5 transition-all duration-300 hover:border-cyber-red/60 hover:shadow-glow-red"
            >
              {/* Red glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{action.title}</h3>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyber-red/10 border border-cyber-red/30">
                    <Icon className="w-5 h-5 text-cyber-red" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-cyber-text-secondary leading-relaxed">{action.body}</p>
                <p className="mt-4 text-sm font-semibold text-cyber-red group-hover:glow-text-red transition-all">
                  Go now →
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Signals Section */}
      <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyber-red">Signals</p>
            <h2 className="text-xl font-bold text-white">What we&apos;re watching for you</h2>
          </div>
          <Link
            href="/app/profile"
            className="text-sm font-semibold text-cyber-red hover:glow-text-red transition-all"
          >
            Update preferences →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {signals.map((item) => (
            <div
              key={item}
              className="glass rounded-xl border border-cyber-red/30 px-4 py-3 text-sm font-medium text-cyber-text hover:border-cyber-red/60 hover:shadow-glow-red transition-all duration-300 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
