/**
 * Quota Checking System
 *
 * Centralized quota checking for all tier-restricted features.
 * Works for ANY feature - just pass the feature name.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  QuotaCheckResult,
  TierRestrictedFeature,
  UserTierProfile,
  UsagePeriod,
} from "@/lib/types/tier";
import { TIER_LIMITS, getLimitsForTier } from "./tier-limits";

/**
 * Check if user can perform an action based on their tier and current usage
 *
 * This function:
 * 1. Fetches user's tier
 * 2. Gets feature limits for that tier
 * 3. Gets current usage from database
 * 4. Checks course tokens (consumed first)
 * 5. Checks single-use purchases (consumed second)
 * 6. Checks tier allowance (consumed third)
 * 7. Returns comprehensive result
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param feature - Feature name
 * @returns Quota check result with allowed status and metadata
 */
export async function checkQuota(
  supabase: SupabaseClient,
  userId: string,
  feature: TierRestrictedFeature
): Promise<QuotaCheckResult> {
  // 1. GET USER'S TIER
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "user_id, tier, subscription_status, trial_started_at, trial_ends_at, starter_ai_credits_remaining, starter_ai_reset_at, starter_app_assist_sample_used"
    )
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error(`Failed to fetch user profile: ${profileError?.message}`);
  }

  const userProfile = profile as UserTierProfile;
  const tier = userProfile.tier;

  // 2. GET FEATURE LIMITS FOR THIS TIER
  const limits = getLimitsForTier(feature, tier);
  const featureConfig = TIER_LIMITS[feature];

  // SPECIAL CASE: AI Messages (FE Coach)
  if (feature === "ai_message") {
    // Trial, Plus, and Pro tiers get UNLIMITED AI messages
    if (tier === "trial" || tier === "plus" || tier === "pro") {
      return {
        allowed: true,
        tier,
        limit: 999999, // Effectively unlimited
        used: 0,
        remaining: 999999,
        message: undefined,
        upgradeUrl: undefined,
        canPurchase: false,
        purchasePrice: null,
        hasTokens: false,
        tokenCount: 0,
      };
    }

    // Starter tier has weekly credit limit (10 messages/week)
    if (tier === "starter") {
      const creditsRemaining = userProfile.starter_ai_credits_remaining;
      const allowed = creditsRemaining > 0;

      return {
        allowed,
        tier,
        limit: 10,
        used: 10 - creditsRemaining,
        remaining: creditsRemaining,
        message: allowed
          ? undefined
          : "You've used all your weekly AI credits. Upgrade to Trial, Plus, or Pro for unlimited AI access.",
        upgradeUrl: allowed ? undefined : "/pricing",
        canPurchase: false,
        purchasePrice: null,
        hasTokens: false,
        tokenCount: 0,
      };
    }
  }

  // SPECIAL CASE: Application Assistant Starter Sample
  if (feature === "application_assist" && tier === "starter") {
    const sampleUsed = userProfile.starter_app_assist_sample_used;

    // If sample not used yet, allow it
    if (!sampleUsed) {
      return {
        allowed: true,
        tier,
        limit: 1,
        used: 0,
        remaining: 1,
        message: undefined,
        upgradeUrl: undefined,
        canPurchase: featureConfig.singlePurchasePrice !== null,
        purchasePrice: featureConfig.singlePurchasePrice,
        hasTokens: false,
        tokenCount: 0,
      };
    }

    // Sample already used, check for purchases/tokens
    // (handled below in normal flow)
  }

  // 4. GET CURRENT USAGE FROM DATABASE

  let currentUsage = 0;

  // For monthly reset features, get from usage_periods
  if (limits.resetPeriod === "monthly") {
    const { data: usagePeriod } = await supabase
      .from("usage_periods")
      .select("*")
      .eq("user_id", userId)
      .gte("period_end", new Date().toISOString()) // Current period only
      .single();

    if (usagePeriod) {
      const period = usagePeriod as UsagePeriod;
      currentUsage = getUsageCountForFeature(period, feature);
    }
  }

  // For trial reset features, get total usage during trial
  if (limits.resetPeriod === "trial") {
    // Get all usage since trial started
    if (userProfile.trial_started_at) {
      const { count } = await supabase
        .from("usage_events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("event_type", `${feature}_used`)
        .gte("created_at", userProfile.trial_started_at);

      currentUsage = count || 0;
    }
  }

  // 5. CHECK COURSE TOKENS (PRIORITY 1)

  let hasTokens = false;
  let tokenCount = 0;

  if (featureConfig.courseTokenGranted) {
    const tokenType = mapFeatureToTokenType(feature);
    const { data: tokens } = await supabase
      .from("course_tokens")
      .select("id")
      .eq("user_id", userId)
      .eq("token_type", tokenType)
      .eq("used", false);

    tokenCount = tokens?.length || 0;
    hasTokens = tokenCount > 0;

    // If user has tokens, they can proceed
    if (hasTokens) {
      return {
        allowed: true,
        tier,
        limit: limits.limit,
        used: currentUsage,
        remaining: limits.limit - currentUsage,
        message: undefined,
        upgradeUrl: undefined,
        canPurchase: featureConfig.singlePurchasePrice !== null,
        purchasePrice: featureConfig.singlePurchasePrice,
        hasTokens: true,
        tokenCount,
      };
    }
  }

  // 6. CHECK TIER ALLOWANCE

  const remaining = limits.limit - currentUsage;
  const allowed = remaining > 0;

  // 7. BUILD RESPONSE

  // If allowed, return success
  if (allowed) {
    return {
      allowed: true,
      tier,
      limit: limits.limit,
      used: currentUsage,
      remaining,
      message: undefined,
      upgradeUrl: undefined,
      canPurchase: featureConfig.singlePurchasePrice !== null,
      purchasePrice: featureConfig.singlePurchasePrice,
      hasTokens: false,
      tokenCount: 0,
    };
  }

  // If NOT allowed, build helpful message
  const message = buildQuotaExceededMessage(feature, tier, limits.limit);
  const upgradeUrl = getUpgradeUrl(tier);

  return {
    allowed: false,
    tier,
    limit: limits.limit,
    used: currentUsage,
    remaining: 0,
    message,
    upgradeUrl,
    canPurchase: featureConfig.singlePurchasePrice !== null,
    purchasePrice: featureConfig.singlePurchasePrice,
    hasTokens: false,
    tokenCount: 0,
  };
}

/**
 * Helper: Get usage count for a specific feature from usage period
 */
function getUsageCountForFeature(
  period: UsagePeriod,
  feature: TierRestrictedFeature
): number {
  switch (feature) {
    case "lifeplan_regen":
      return period.lifeplan_regens_count;
    case "resume_builder":
      return period.resume_generations_count;
    case "application_assist":
      return period.application_assists_count;
    case "interview_prep":
      return period.interview_preps_count;
    case "ai_message":
      return period.ai_messages_count;
    default:
      return 0;
  }
}

/**
 * Helper: Map feature to course token type
 */
function mapFeatureToTokenType(
  feature: TierRestrictedFeature
): "resume" | "application_assist" | "interview_prep" {
  switch (feature) {
    case "resume_builder":
    case "cover_letter":
      return "resume";
    case "application_assist":
      return "application_assist";
    case "interview_prep":
      return "interview_prep";
    default:
      return "resume"; // Fallback
  }
}

/**
 * Helper: Build user-friendly quota exceeded message
 */
function buildQuotaExceededMessage(
  feature: TierRestrictedFeature,
  tier: "starter" | "trial" | "plus" | "pro",
  limit: number
): string {
  const featureNames: Record<TierRestrictedFeature, string> = {
    lifeplan_regen: "Life Plan regenerations",
    resume_builder: "Resume Builder uses",
    application_assist: "Application Assistant uses",
    interview_prep: "Interview Prep sessions",
    ai_message: "AI messages",
    cover_letter: "Cover Letter generations",
  };

  const featureName = featureNames[feature] || "uses";

  if (tier === "starter") {
    return `You've reached your limit. Upgrade to Trial, Plus, or Pro to unlock ${featureName}.`;
  }

  if (tier === "trial") {
    return `You've used your ${limit} ${featureName} for this trial period. Upgrade to Plus or Pro for monthly allowances.`;
  }

  if (tier === "plus") {
    return `You've used all ${limit} ${featureName} this month. Upgrade to Pro for ${getProLimit(feature)} per month, or purchase additional uses.`;
  }

  if (tier === "pro") {
    return `You've used all ${limit} ${featureName} this month. Your limit will reset at the start of next month, or you can purchase additional uses.`;
  }

  return `You've reached your monthly limit for ${featureName}.`;
}

/**
 * Helper: Get Pro tier limit for a feature (for upgrade messaging)
 */
function getProLimit(feature: TierRestrictedFeature): number {
  return TIER_LIMITS[feature].pro.limit;
}

/**
 * Helper: Get upgrade URL based on current tier
 */
function getUpgradeUrl(tier: "starter" | "trial" | "plus" | "pro"): string {
  if (tier === "starter" || tier === "trial") {
    return "/pricing";
  }
  if (tier === "plus") {
    return "/pricing?upgrade=pro";
  }
  return "/pricing"; // Pro users can't upgrade further
}
