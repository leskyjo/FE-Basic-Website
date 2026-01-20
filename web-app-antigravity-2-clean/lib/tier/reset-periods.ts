/**
 * Usage Period Reset Logic
 *
 * Handles automatic resets for weekly (Starter AI credits) and monthly (Plus/Pro) quotas
 */

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Check and reset Starter AI credits if needed
 *
 * Starter tier gets 10 AI credits every 7 days.
 * This function checks if the reset date has passed and resets if needed.
 *
 * Called at the start of quota checks for AI features.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 */
export async function checkAndResetStarterAICredits(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, starter_ai_credits_remaining, starter_ai_reset_at")
    .eq("user_id", userId)
    .single();

  if (!profile || profile.tier !== "starter") {
    return; // Only applies to Starter tier
  }

  const resetAt = profile.starter_ai_reset_at
    ? new Date(profile.starter_ai_reset_at)
    : null;
  const now = new Date();

  // Check if reset is needed
  if (!resetAt || now >= resetAt) {
    const nextResetAt = new Date(now);
    nextResetAt.setDate(nextResetAt.getDate() + 7); // 7 days from now

    await supabase
      .from("profiles")
      .update({
        starter_ai_credits_remaining: 10, // Reset to 10 credits
        starter_ai_reset_at: nextResetAt.toISOString(),
      })
      .eq("user_id", userId);

    // Log reset event
    await supabase.from("usage_events").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      event_type: "starter_ai_credits_reset",
      metadata: {
        previous_credits: profile.starter_ai_credits_remaining,
        new_credits: 10,
        next_reset_at: nextResetAt.toISOString(),
      },
      created_at: now.toISOString(),
    });
  }
}

/**
 * Create new monthly usage period if needed
 *
 * Monthly periods run from 1st of month to last day of month.
 * This function checks if we're in a new month and creates a fresh period.
 *
 * Called at the start of quota checks for monthly features.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns The current usage period (existing or newly created)
 */
export async function ensureCurrentMonthlyPeriod(
  supabase: SupabaseClient,
  userId: string
): Promise<any> {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Check if current period exists
  const { data: existingPeriod } = await supabase
    .from("usage_periods")
    .select("*")
    .eq("user_id", userId)
    .gte("period_end", now.toISOString())
    .maybeSingle();

  if (existingPeriod) {
    return existingPeriod; // Period already exists for current month
  }

  // Create new period
  const { data: newPeriod, error } = await supabase
    .from("usage_periods")
    .insert({
      user_id: userId,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      lifeplan_regens_count: 0,
      resume_generations_count: 0,
      application_assists_count: 0,
      interview_preps_count: 0,
      ai_messages_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create usage period: ${error.message}`);
  }

  // Log period creation
  await supabase.from("usage_events").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    event_type: "monthly_period_created",
    metadata: {
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    },
    created_at: now.toISOString(),
  });

  return newPeriod;
}

/**
 * Archive old usage periods (cleanup job)
 *
 * Keeps last 12 months of usage periods for historical tracking.
 * Older periods can be archived or deleted.
 *
 * This should be run periodically (e.g., monthly cron job).
 *
 * @param supabase - Supabase client
 */
export async function archiveOldUsagePeriods(
  supabase: SupabaseClient
): Promise<void> {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  // For now, we'll just keep them all
  // In the future, could move to an archive table or delete
  // This is a placeholder for future optimization

  // Get count of old periods (for logging)
  const { count } = await supabase
    .from("usage_periods")
    .select("*", { count: "exact", head: true })
    .lt("period_end", twelveMonthsAgo.toISOString());

  console.log(`[Usage Periods] Found ${count} periods older than 12 months`);

  // TODO: Implement archival strategy when needed
}

/**
 * Get remaining days until next reset for a user
 *
 * Useful for UI display ("Your credits reset in X days")
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param resetType - Type of reset to check
 * @returns Number of days until next reset
 */
export async function getDaysUntilReset(
  supabase: SupabaseClient,
  userId: string,
  resetType: "weekly" | "monthly"
): Promise<number> {
  if (resetType === "weekly") {
    // Check Starter AI credits reset
    const { data: profile } = await supabase
      .from("profiles")
      .select("starter_ai_reset_at")
      .eq("user_id", userId)
      .single();

    if (!profile || !profile.starter_ai_reset_at) {
      return 0;
    }

    const resetAt = new Date(profile.starter_ai_reset_at);
    const now = new Date();
    const diffMs = resetAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  if (resetType === "monthly") {
    // Monthly resets on first day of next month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffMs = nextMonth.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  return 0;
}

/**
 * Get current usage period for a user
 *
 * Useful for displaying usage stats in UI
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Current usage period or null
 */
export async function getCurrentUsagePeriod(
  supabase: SupabaseClient,
  userId: string
): Promise<any | null> {
  const now = new Date();

  const { data: period } = await supabase
    .from("usage_periods")
    .select("*")
    .eq("user_id", userId)
    .gte("period_end", now.toISOString())
    .maybeSingle();

  return period;
}
