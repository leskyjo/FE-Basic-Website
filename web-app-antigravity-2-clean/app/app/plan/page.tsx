import { createClient } from "@/lib/supabase/server";
import { RegeneratePlanButton } from "@/components/life-plan/regenerate-plan-button";
import { TIER_LIMITS } from "@/lib/tier/tier-limits";
import { ProgressRing } from "@/components/plan/progress-ring";
import { FeCoachClientWrapper } from "@/components/plan/fe-coach-client-wrapper";
import { StrengthsCards } from "@/components/plan/strengths-cards";
import { DomainSection } from "@/components/plan/domain-section";
import { Target, Zap, Shield, Lightbulb, TrendingUp, Trophy, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlanJsonTask {
  id: string;
  title: string;
  description: string;
  why_it_matters?: string;
  estimated_time?: string;
  fe_tools_to_use?: string[];
  external_resources?: string[];
  completion_criteria?: string;
  is_quick_win?: boolean;
  conversion_opportunity?: string;
  priority?: string;
  category?: string;
}

interface FETool {
  tool_name: string;
  pricing?: string;
  show_cta?: boolean;
  why_recommend?: string;
}

interface DomainPlan {
  domain_name: string;
  current_situation: string;
  target_outcome: string;
  key_actions?: PlanJsonTask[];
  progress_milestones: string[];
  resources_needed: string[];
  fe_tools_recommended: (string | FETool)[];
}

interface PlanJson {
  plan_title?: string;
  overview?: { summary?: string };
  timeframes?: {
    next_7_days?: PlanJsonTask[];
    next_30_days?: PlanJsonTask[];
    next_90_days?: PlanJsonTask[];
    next_12_months?: PlanJsonTask[];
  };
  domains?: {
    employment_and_income?: DomainPlan;
    financial_stability?: DomainPlan;
    skills_and_learning?: DomainPlan;
    mindset_and_growth?: DomainPlan;
  };
}

export default async function PlanPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    // App layout has already gated access, but we guard again defensively.
    return null;
  }

  const userId = userData.user.id;

  // Fetch user's tier and profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, starter_ai_credits_remaining")
    .eq("user_id", userId)
    .single();

  // Validate and default the tier value
  const tierValue = profile?.tier;
  const userTier: "starter" | "trial" | "plus" | "pro" =
    tierValue === "starter" ||
      tierValue === "trial" ||
      tierValue === "plus" ||
      tierValue === "pro"
      ? tierValue
      : "starter";

  // Get tier limits for regeneration
  const tierLimits = TIER_LIMITS.lifeplan_regen[userTier];
  const regenerationLimit = tierLimits.limit;

  // Get current usage count
  let currentUsage = 0;

  if (tierLimits.resetPeriod === "monthly") {
    // For Plus/Pro, get from usage_periods
    const now = new Date();
    const { data: usagePeriod } = await supabase
      .from("usage_periods")
      .select("lifeplan_regens_count")
      .eq("user_id", userId)
      .gte("period_end", now.toISOString())
      .maybeSingle();

    currentUsage = usagePeriod?.lifeplan_regens_count || 0;
  } else if (tierLimits.resetPeriod === "trial") {
    // For Trial, count usage_events since trial started
    const { count } = await supabase
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "lifeplan_regen_used");

    currentUsage = count || 0;
  }

  // Fetch Life Plan data
  const { data: lifePlan } = await supabase
    .from("life_plans")
    .select("current_version_id")
    .eq("user_id", userId)
    .maybeSingle();

  let planJson: PlanJson | null = null;

  if (lifePlan?.current_version_id) {
    const { data: version } = await supabase
      .from("life_plan_versions")
      .select("plan_json, created_at, status")
      .eq("id", lifePlan.current_version_id)
      .maybeSingle();

    if (version?.plan_json) {
      planJson = version.plan_json as PlanJson;
    }
  }

  const title = planJson?.plan_title ?? "Your Life Goal Plan";
  const summary = planJson?.overview?.summary;
  const timeframes = planJson?.timeframes ?? {};

  const next7 = timeframes.next_7_days ?? [];
  const next30 = timeframes.next_30_days ?? [];
  const next90 = timeframes.next_90_days ?? [];
  const next12 = timeframes.next_12_months ?? [];

  // Check if plan exists AND has actual content
  const hasPlan = planJson !== null;
  const hasContent = hasPlan && (next7.length > 0 || next30.length > 0 || next90.length > 0 || next12.length > 0);
  const showEmptyState = !hasContent;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative glass-strong rounded-2xl border border-cyber-red/30 p-6 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 via-transparent to-transparent animate-pulse opacity-50" />

        <div className="relative">
          {/* FE Logo with massive glow */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-cyber-red rounded-full blur-2xl opacity-70 animate-pulse-glow" />
              {/* Logo */}
              <div className="relative w-20 h-20">
                <Image
                  src="/icon1.png"
                  alt="FE Logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-full"
                />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyber-red mb-1">
                Your Life Plan
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white glow-text-red">
                {title}
              </h1>
            </div>
          </div>

          {summary && (
            <p className="text-sm text-cyber-text leading-relaxed">{summary}</p>
          )}

          {/* Always show generate/regenerate button at the top */}
          <div className="mt-4">
            {showEmptyState ? (
              <div className="glass rounded-xl border border-cyber-red/30 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyber-red" />
                  <h3 className="text-base font-semibold text-white">
                    {hasPlan ? "Regenerate Your Life Plan" : "Complete Your Life Plan Questionnaire"}
                  </h3>
                </div>
                <p className="text-sm text-cyber-text leading-relaxed">
                  {hasPlan
                    ? "It looks like your Life Plan generation didn't complete successfully. Let's regenerate it to create your personalized roadmap."
                    : "Your personalized Life Plan will be generated after you complete the questionnaire. This helps us understand your goals, challenges, and create a tailored roadmap for your success."}
                </p>
                <Link
                  href="/app/plan/generate"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyber-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyber-red/30 transition hover:-translate-y-0.5 hover:bg-cyber-red/90 hover:shadow-glow-red"
                >
                  {hasPlan ? "Regenerate Life Plan" : "Start Questionnaire"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-cyber-text-dim">
                  {hasPlan
                    ? "This will use your existing answers to generate a fresh plan"
                    : "Takes 3-5 minutes · Completely confidential · Can be updated anytime"}
                </p>
              </div>
            ) : (
              <Link
                href="/app/plan/generate"
                className="inline-flex items-center gap-2 rounded-xl bg-cyber-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyber-red/30 transition hover:-translate-y-0.5 hover:bg-cyber-red/90 hover:shadow-glow-red"
              >
                Regenerate My Life Plan
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Privacy badge */}
          <div className="mt-4 flex items-center gap-2 text-sm text-cyber-text-secondary">
            <Shield className="w-6 h-6 text-cyber-red" />
            <span>100% Private - Only you can see this</span>
          </div>
        </div>
      </div>

      {/* Progress & Stability Section */}
      <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
        <h2 className="text-lg font-bold text-white glow-text-red mb-6">
          Your Progress & Stability
        </h2>

        <div className="grid grid-cols-2 gap-6 md:gap-8">
          <ProgressRing
            value={100}
            label="Life Plan Complete"
            subtitle="All questions answered"
            color="red"
          />

          <ProgressRing
            value={75}
            label="Support & Stability"
            subtitle="Building range"
            color="red"
          />
        </div>

        {/* Phase Badge */}
        <div className="mt-6 pt-6 border-t border-cyber-red/20">
          <div className="flex items-center gap-3">
            <div className="glass rounded-full px-4 py-2 border border-cyber-red/40">
              <p className="text-xs text-cyber-text-dim">Current Phase</p>
              <p className="text-sm font-bold text-cyber-red">Rebuilding Step-by-Step</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Skills Section */}
      <StrengthsCards
        strengths={[
          "Responsible Parent",
          "Hustler Mindset",
          "Hands-On Worker",
          "Strong Communicator",
          "Fast Learner",
          "Leadership Potential"
        ]}
      />

      {/* FE Coach Chat */}
      <FeCoachClientWrapper
        tier={userTier}
        creditsRemaining={userTier === "starter" ? profile?.starter_ai_credits_remaining : undefined}
      />

      {/* Action Cards - Next 7 Days & Next 30 Days */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Next 7 Days */}
        <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-cyber-red" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyber-red">
              Next 7 Days
            </h2>
          </div>

          {next7.length ? (
            <div className="space-y-4">
              {next7.map((task) => (
                <div
                  key={task.id}
                  className="relative glass rounded-xl border border-cyber-red/20 p-4
                             hover:border-cyber-red/50 hover:shadow-glow-red transition-all duration-300"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.is_quick_win && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/20 border border-cyber-red/40 px-2 py-0.5 text-xs font-medium text-cyber-red">
                            Quick Win
                          </span>
                        )}
                        {task.priority === "critical" && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/30 border border-cyber-red px-2 py-0.5 text-xs font-medium text-cyber-red glow-text-red">
                            Critical
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white">{task.title}</h3>
                    </div>
                    {task.estimated_time && (
                      <span className="text-xs text-cyber-text-dim whitespace-nowrap">{task.estimated_time}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-cyber-text mb-3">{task.description}</p>

                  {/* Why it matters */}
                  {task.why_it_matters && (
                    <div className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                      <Lightbulb className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-cyber-text italic">{task.why_it_matters}</p>
                    </div>
                  )}

                  {/* FE Tools */}
                  {task.fe_tools_to_use && task.fe_tools_to_use.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-cyber-text-dim mb-2">FE Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.fe_tools_to_use.map((tool, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-md glass border border-cyber-red/30 px-2 py-1 text-xs font-medium text-cyber-red">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversion opportunity */}
                  {task.conversion_opportunity && (
                    <div className="mt-3 rounded-lg bg-gradient-to-r from-cyber-red/20 to-cyber-red/10 p-3 border border-cyber-red/30">
                      <p className="text-xs font-medium text-white">{task.conversion_opportunity}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyber-text-dim">
              As we improve plan generation, you&apos;ll see concrete actions for the next 7 days here.
            </p>
          )}
        </div>

        {/* Next 30 Days */}
        <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-cyber-red" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyber-red">
              Next 30 Days
            </h2>
          </div>

          {next30.length ? (
            <div className="space-y-4">
              {next30.map((task) => (
                <div
                  key={task.id}
                  className="relative glass rounded-xl border border-cyber-red/20 p-4
                             hover:border-cyber-red/50 hover:shadow-glow-red transition-all duration-300"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.is_quick_win && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/20 border border-cyber-red/40 px-2 py-0.5 text-xs font-medium text-cyber-red">
                            Quick Win
                          </span>
                        )}
                        {task.priority === "critical" && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/30 border border-cyber-red px-2 py-0.5 text-xs font-medium text-cyber-red glow-text-red">
                            Critical
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white">{task.title}</h3>
                    </div>
                    {task.estimated_time && (
                      <span className="text-xs text-cyber-text-dim whitespace-nowrap">{task.estimated_time}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-cyber-text mb-3">{task.description}</p>

                  {/* Why it matters */}
                  {task.why_it_matters && (
                    <div className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                      <Lightbulb className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-cyber-text italic">{task.why_it_matters}</p>
                    </div>
                  )}

                  {/* FE Tools */}
                  {task.fe_tools_to_use && task.fe_tools_to_use.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-cyber-text-dim mb-2">FE Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.fe_tools_to_use.map((tool, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-md glass border border-cyber-red/30 px-2 py-1 text-xs font-medium text-cyber-red">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversion opportunity */}
                  {task.conversion_opportunity && (
                    <div className="mt-3 rounded-lg bg-gradient-to-r from-cyber-red/20 to-cyber-red/10 p-3 border border-cyber-red/30">
                      <p className="text-xs font-medium text-white">{task.conversion_opportunity}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyber-text-dim">
              Longer-range moves (up to 30 days) will appear here as we enrich the plan.
            </p>
          )}
        </div>
      </div>

      {/* 90-Day and 12-Month Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Next 90 Days */}
        <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-cyber-red" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyber-red">
              Next 90 Days
            </h2>
          </div>

          {next90.length ? (
            <div className="space-y-4">
              {next90.map((task) => (
                <div
                  key={task.id}
                  className="relative glass rounded-xl border border-cyber-red/20 p-4
                             hover:border-cyber-red/50 hover:shadow-glow-red transition-all duration-300"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.is_quick_win && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/20 border border-cyber-red/40 px-2 py-0.5 text-xs font-medium text-cyber-red">
                            Quick Win
                          </span>
                        )}
                        {task.priority === "critical" && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/30 border border-cyber-red px-2 py-0.5 text-xs font-medium text-cyber-red glow-text-red">
                            Critical
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white">{task.title}</h3>
                    </div>
                    {task.estimated_time && (
                      <span className="text-xs text-cyber-text-dim whitespace-nowrap">{task.estimated_time}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-cyber-text mb-3">{task.description}</p>

                  {/* Why it matters */}
                  {task.why_it_matters && (
                    <div className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                      <Lightbulb className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-cyber-text italic">{task.why_it_matters}</p>
                    </div>
                  )}

                  {/* FE Tools */}
                  {task.fe_tools_to_use && task.fe_tools_to_use.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-cyber-text-dim mb-2">FE Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.fe_tools_to_use.map((tool, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-md glass border border-cyber-red/30 px-2 py-1 text-xs font-medium text-cyber-red">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversion opportunity */}
                  {task.conversion_opportunity && (
                    <div className="mt-3 rounded-lg bg-gradient-to-r from-cyber-red/20 to-cyber-red/10 p-3 border border-cyber-red/30">
                      <p className="text-xs font-medium text-white">{task.conversion_opportunity}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyber-text-dim">
              Strategic moves for the next 90 days will appear here.
            </p>
          )}
        </div>

        {/* Next 12 Months */}
        <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-cyber-red" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyber-red">
              Next 12 Months
            </h2>
          </div>

          {next12.length ? (
            <div className="space-y-4">
              {next12.map((task) => (
                <div
                  key={task.id}
                  className="relative glass rounded-xl border border-cyber-red/20 p-4
                             hover:border-cyber-red/50 hover:shadow-glow-red transition-all duration-300"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.is_quick_win && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/20 border border-cyber-red/40 px-2 py-0.5 text-xs font-medium text-cyber-red">
                            Quick Win
                          </span>
                        )}
                        {task.priority === "critical" && (
                          <span className="inline-flex items-center rounded-full bg-cyber-red/30 border border-cyber-red px-2 py-0.5 text-xs font-medium text-cyber-red glow-text-red">
                            Critical
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white">{task.title}</h3>
                    </div>
                    {task.estimated_time && (
                      <span className="text-xs text-cyber-text-dim whitespace-nowrap">{task.estimated_time}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-cyber-text mb-3">{task.description}</p>

                  {/* Why it matters */}
                  {task.why_it_matters && (
                    <div className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                      <Lightbulb className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-cyber-text italic">{task.why_it_matters}</p>
                    </div>
                  )}

                  {/* FE Tools */}
                  {task.fe_tools_to_use && task.fe_tools_to_use.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-cyber-text-dim mb-2">FE Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.fe_tools_to_use.map((tool, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-md glass border border-cyber-red/30 px-2 py-1 text-xs font-medium text-cyber-red">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversion opportunity */}
                  {task.conversion_opportunity && (
                    <div className="mt-3 rounded-lg bg-gradient-to-r from-cyber-red/20 to-cyber-red/10 p-3 border border-cyber-red/30">
                      <p className="text-xs font-medium text-white">{task.conversion_opportunity}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyber-text-dim">
              Long-term goals and milestones for the next year will appear here.
            </p>
          )}
        </div>
      </div>

      {/* Domain Sections */}
      {planJson?.domains && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white glow-text-red">
            Your Life Domains
          </h2>
          <p className="text-sm text-cyber-text-dim mb-4">
            Tap each domain to see your personalized plan for that area of your life.
          </p>

          {planJson.domains.employment_and_income && (
            <DomainSection
              domain={planJson.domains.employment_and_income}
              icon="employment"
            />
          )}

          {planJson.domains.financial_stability && (
            <DomainSection
              domain={planJson.domains.financial_stability}
              icon="financial"
            />
          )}

          {planJson.domains.skills_and_learning && (
            <DomainSection
              domain={planJson.domains.skills_and_learning}
              icon="skills"
            />
          )}


          {planJson.domains.mindset_and_growth && (
            <DomainSection
              domain={planJson.domains.mindset_and_growth}
              icon="mindset"
            />
          )}
        </div>
      )}
    </div>
  );
}
