/**
 * Tier System - Main Exports
 *
 * Centralized tier/quota enforcement system for all tier-restricted features.
 *
 * Usage Example:
 *
 * ```typescript
 * import { checkQuota, incrementUsage } from "@/lib/tier";
 *
 * // In your API route:
 * const quotaCheck = await checkQuota(supabase, userId, "resume_builder");
 *
 * if (!quotaCheck.allowed) {
 *   return NextResponse.json({
 *     error: "QUOTA_EXCEEDED",
 *     message: quotaCheck.message,
 *     upgradeUrl: quotaCheck.upgradeUrl,
 *   }, { status: 403 });
 * }
 *
 * // ... do your feature logic ...
 *
 * await incrementUsage(supabase, userId, "resume_builder");
 * ```
 */

// Core quota functions
export { checkQuota } from "./check-quota";
export { incrementUsage } from "./increment-usage";

// Reset period utilities
export {
  checkAndResetStarterAICredits,
  ensureCurrentMonthlyPeriod,
  archiveOldUsagePeriods,
  getDaysUntilReset,
  getCurrentUsagePeriod,
} from "./reset-periods";

// Tier limits configuration
export {
  TIER_LIMITS,
  getLimitsForTier,
  canPurchaseFeature,
  getPurchasePrice,
  grantsCourseToken,
} from "./tier-limits";

// Types (re-export from lib/types/tier.ts for convenience)
export type {
  UserTier,
  ResetPeriod,
  TierRestrictedFeature,
  TierLimit,
  FeatureLimits,
  QuotaCheckResult,
  UserTierProfile,
  UsagePeriod,
  CourseToken,
} from "@/lib/types/tier";
