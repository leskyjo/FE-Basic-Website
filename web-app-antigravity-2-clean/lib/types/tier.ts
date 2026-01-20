/**
 * Tier System Type Definitions
 *
 * Core types for the tier/quota enforcement system
 */

/**
 * User tier levels
 */
export type UserTier = "starter" | "trial" | "plus" | "pro";

/**
 * Reset period types for quota limits
 */
export type ResetPeriod = "none" | "weekly" | "monthly" | "trial";

/**
 * Feature names that have tier-based restrictions
 */
export type TierRestrictedFeature =
  | "lifeplan_regen"
  | "resume_builder"
  | "application_assist"
  | "interview_prep"
  | "cover_letter" // Future feature example
  | "ai_message"; // For FE Coach, Daily Boost, etc.

/**
 * Tier limit configuration for a single tier
 */
export interface TierLimit {
  /** Maximum allowed uses for this tier */
  limit: number;
  /** How often the limit resets */
  resetPeriod: ResetPeriod;
}

/**
 * Complete limit configuration for a feature across all tiers
 */
export interface FeatureLimits {
  starter: TierLimit;
  trial: TierLimit;
  plus: TierLimit;
  pro: TierLimit;
  /** Price for single-use purchase (null if not available) */
  singlePurchasePrice: number | null;
  /** Whether course purchases grant a token for this feature */
  courseTokenGranted: boolean;
}

/**
 * Result of a quota check
 */
export interface QuotaCheckResult {
  /** Whether the action is allowed */
  allowed: boolean;
  /** User's current tier */
  tier: UserTier;
  /** Limit for this feature at user's tier */
  limit: number;
  /** Current usage count */
  used: number;
  /** Remaining uses */
  remaining: number;
  /** Message to display to user if not allowed */
  message?: string;
  /** URL to upgrade page */
  upgradeUrl?: string;
  /** Whether single-use purchase is available */
  canPurchase: boolean;
  /** Price for single-use purchase */
  purchasePrice: number | null;
  /** Whether user has course tokens available */
  hasTokens: boolean;
  /** Number of course tokens available */
  tokenCount: number;
}

/**
 * User profile data needed for tier checks
 */
export interface UserTierProfile {
  user_id: string;
  tier: UserTier;
  subscription_status: string | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  starter_ai_credits_remaining: number;
  starter_ai_reset_at: string | null;
  starter_app_assist_sample_used: boolean;
}

/**
 * Usage period data for monthly limits
 */
export interface UsagePeriod {
  user_id: string;
  period_start: string;
  period_end: string;
  lifeplan_regens_count: number;
  resume_generations_count: number;
  application_assists_count: number;
  interview_preps_count: number;
  ai_messages_count: number;
}

/**
 * Course token data
 */
export interface CourseToken {
  id: string;
  user_id: string;
  token_type: "resume" | "application_assist" | "interview_prep";
  course_purchase_id: string;
  used: boolean;
  used_at: string | null;
}
