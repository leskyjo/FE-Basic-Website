/**
 * Usage Increment System
 *
 * Handles consuming tokens, purchases, and tier allowances in correct priority order.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { TierRestrictedFeature, UserTierProfile } from "@/lib/types/tier";
import { TIER_LIMITS } from "./tier-limits";

/**
 * Increment usage for a feature
 *
 * Priority order:
 * 1. Course tokens (if available and applicable)
 * 2. Single-use purchases (if available) - FUTURE
 * 3. Tier allowance (monthly/weekly/trial limit)
 *
 * Also creates audit event in usage_events table
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param feature - Feature name
 * @param metadata - Optional metadata to log
 */
export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: TierRestrictedFeature,
  metadata?: Record<string, any>
): Promise<void> {
  const featureConfig = TIER_LIMITS[feature];

  // 1. GET USER'S TIER AND PROFILE
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "user_id, tier, starter_ai_credits_remaining, starter_app_assist_sample_used"
    )
    .eq("user_id", userId)
    .single();

  if (!profile) {
    throw new Error("User profile not found");
  }

  const userProfile = profile as UserTierProfile;

  // 2. HANDLE SPECIAL CASES FIRST

  // SPECIAL CASE: Starter AI Credits (decrement directly on profile)
  if (feature === "ai_message" && userProfile.tier === "starter") {
    await supabase
      .from("profiles")
      .update({
        starter_ai_credits_remaining: Math.max(
          0,
          userProfile.starter_ai_credits_remaining - 1
        ),
      })
      .eq("user_id", userId);

    // Log event
    await logUsageEvent(supabase, userId, feature, {
      ...metadata,
      source: "starter_ai_credits",
      credits_remaining: userProfile.starter_ai_credits_remaining - 1,
    });

    return;
  }

  // SPECIAL CASE: Application Assistant Starter Sample (mark as used)
  if (
    feature === "application_assist" &&
    userProfile.tier === "starter" &&
    !userProfile.starter_app_assist_sample_used
  ) {
    await supabase
      .from("profiles")
      .update({ starter_app_assist_sample_used: true })
      .eq("user_id", userId);

    // Log event
    await logUsageEvent(supabase, userId, feature, {
      ...metadata,
      source: "starter_sample",
    });

    return;
  }

  // 3. CHECK FOR COURSE TOKENS (PRIORITY 1)

  if (featureConfig.courseTokenGranted) {
    const tokenType = mapFeatureToTokenType(feature);

    // Find oldest unused token
    const { data: token } = await supabase
      .from("course_tokens")
      .select("id")
      .eq("user_id", userId)
      .eq("token_type", tokenType)
      .eq("used", false)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (token) {
      // Mark token as used
      await supabase
        .from("course_tokens")
        .update({
          used: true,
          used_at: new Date().toISOString(),
        })
        .eq("id", token.id);

      // Log event
      await logUsageEvent(supabase, userId, feature, {
        ...metadata,
        source: "course_token",
        token_id: token.id,
      });

      return;
    }
  }

  // 4. CHECK FOR SINGLE-USE PURCHASES (PRIORITY 2)
  // TODO: Implement when we build purchase system
  // For now, skip to tier allowance

  // 5. INCREMENT TIER ALLOWANCE (PRIORITY 3)

  const limits = TIER_LIMITS[feature][userProfile.tier];

  // For monthly reset features, increment usage_periods counter
  if (limits.resetPeriod === "monthly") {
    await incrementMonthlyUsage(supabase, userId, feature);

    // Log event
    await logUsageEvent(supabase, userId, feature, {
      ...metadata,
      source: "tier_allowance",
      tier: userProfile.tier,
    });

    return;
  }

  // For trial/weekly/one-time features, log event only
  // (usage is counted from usage_events for these)
  await logUsageEvent(supabase, userId, feature, {
    ...metadata,
    source: "tier_allowance",
    tier: userProfile.tier,
  });
}

/**
 * Increment monthly usage counter for a feature
 */
async function incrementMonthlyUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: TierRestrictedFeature
): Promise<void> {
  // Get or create current usage period
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const { data: existingPeriod } = await supabase
    .from("usage_periods")
    .select("*")
    .eq("user_id", userId)
    .gte("period_end", now.toISOString())
    .single();

  const columnName = getColumnNameForFeature(feature);

  if (existingPeriod) {
    // Increment existing period
    await supabase
      .from("usage_periods")
      .update({
        [columnName]: (existingPeriod[columnName] || 0) + 1,
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId)
      .eq("id", existingPeriod.id);
  } else {
    // Create new period with first usage
    await supabase.from("usage_periods").insert({
      user_id: userId,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      [columnName]: 1,
      lifeplan_regens_count: feature === "lifeplan_regen" ? 1 : 0,
      resume_generations_count: feature === "resume_builder" ? 1 : 0,
      application_assists_count: feature === "application_assist" ? 1 : 0,
      interview_preps_count: feature === "interview_prep" ? 1 : 0,
      ai_messages_count: feature === "ai_message" ? 1 : 0,
    });
  }
}

/**
 * Log usage event to audit trail
 */
async function logUsageEvent(
  supabase: SupabaseClient,
  userId: string,
  feature: TierRestrictedFeature,
  metadata: Record<string, any>
): Promise<void> {
  await supabase.from("usage_events").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    event_type: `${feature}_used`,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  });
}

/**
 * Helper: Map feature to usage_periods column name
 */
function getColumnNameForFeature(feature: TierRestrictedFeature): string {
  switch (feature) {
    case "lifeplan_regen":
      return "lifeplan_regens_count";
    case "resume_builder":
      return "resume_generations_count";
    case "application_assist":
      return "application_assists_count";
    case "interview_prep":
      return "interview_preps_count";
    case "ai_message":
      return "ai_messages_count";
    default:
      throw new Error(`Unknown feature: ${feature}`);
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
