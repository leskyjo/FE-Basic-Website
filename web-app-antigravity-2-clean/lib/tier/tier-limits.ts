/**
 * Tier Limits Configuration
 *
 * Single source of truth for all tier-based feature limits.
 * Add new tier-restricted features here.
 *
 * Based on: TIER_SYSTEM.md
 * Last Updated: 2025-12-26
 */

import type { FeatureLimits, TierRestrictedFeature } from "@/lib/types/tier";

/**
 * Tier limit configurations for all features
 *
 * To add a new tier-restricted feature:
 * 1. Add feature name to TierRestrictedFeature type in lib/types/tier.ts
 * 2. Add configuration here
 * 3. Add database column if needed (for monthly/weekly counters)
 * 4. Use checkQuota() and incrementUsage() in your API route
 */
export const TIER_LIMITS: Record<TierRestrictedFeature, FeatureLimits> = {
  /**
   * Life Plan Regeneration
   *
   * Starter: Must upgrade or purchase
   * Trial: 1 total for entire 7-day period
   * Plus: 4 per month
   * Pro: 8 per month
   */
  lifeplan_regen: {
    starter: {
      limit: 0,
      resetPeriod: "none",
    },
    trial: {
      limit: 1,
      resetPeriod: "trial", // Does NOT reset during trial
    },
    plus: {
      limit: 4,
      resetPeriod: "monthly",
    },
    pro: {
      limit: 8,
      resetPeriod: "monthly",
    },
    singlePurchasePrice: 2.99,
    courseTokenGranted: false,
  },

  /**
   * Resume Builder
   *
   * Starter/Trial: Must purchase
   * Plus: 5 per month
   * Pro: 10 per month
   */
  resume_builder: {
    starter: {
      limit: 0,
      resetPeriod: "none",
    },
    trial: {
      limit: 0,
      resetPeriod: "none",
    },
    plus: {
      limit: 5,
      resetPeriod: "monthly",
    },
    pro: {
      limit: 10,
      resetPeriod: "monthly",
    },
    singlePurchasePrice: 3.99,
    courseTokenGranted: true, // Course purchases grant resume token
  },

  /**
   * Application Assistant
   *
   * Starter: 1 sample (one-time at account creation), then must purchase
   * Trial: 3 total for entire 7-day period
   * Plus: 15 per month
   * Pro: 30 per month
   *
   * Note: Starter sample is tracked separately in profiles.starter_app_assist_sample_used
   */
  application_assist: {
    starter: {
      limit: 0, // Sample tracked separately
      resetPeriod: "none",
    },
    trial: {
      limit: 3,
      resetPeriod: "trial", // Does NOT reset during trial
    },
    plus: {
      limit: 15,
      resetPeriod: "monthly",
    },
    pro: {
      limit: 30,
      resetPeriod: "monthly",
    },
    singlePurchasePrice: 2.99,
    courseTokenGranted: true, // Course purchases grant app assist token
  },

  /**
   * Interview Prep
   *
   * Starter/Trial: Must upgrade
   * Plus: 3 per month (DECISION: Plus-unlocked)
   * Pro: 6 per month
   */
  interview_prep: {
    starter: {
      limit: 0,
      resetPeriod: "none",
    },
    trial: {
      limit: 0,
      resetPeriod: "none",
    },
    plus: {
      limit: 3,
      resetPeriod: "monthly",
    },
    pro: {
      limit: 6,
      resetPeriod: "monthly",
    },
    singlePurchasePrice: null, // Not available for single purchase
    courseTokenGranted: true, // Course purchases grant interview prep token
  },

  /**
   * AI Messages (FE Coach, Daily Boost, etc.)
   *
   * Starter: 10 universal AI credits, resets weekly
   * Trial/Plus/Pro: Soft caps, tracked but not enforced (DECISION: 4-C)
   *
   * Note: Starter credits tracked in profiles.starter_ai_credits_remaining
   */
  ai_message: {
    starter: {
      limit: 10,
      resetPeriod: "weekly",
    },
    trial: {
      limit: Infinity, // Tracked but not enforced
      resetPeriod: "none",
    },
    plus: {
      limit: 500, // Soft cap - tracked but not enforced yet (DECISION: 4-C)
      resetPeriod: "monthly",
    },
    pro: {
      limit: 1000, // Soft cap - tracked but not enforced yet (DECISION: 4-C)
      resetPeriod: "monthly",
    },
    singlePurchasePrice: null,
    courseTokenGranted: false,
  },

  /**
   * FUTURE FEATURE EXAMPLE: Cover Letter Generator
   *
   * Uncomment and customize when implementing:
   */
  cover_letter: {
    starter: {
      limit: 0,
      resetPeriod: "none",
    },
    trial: {
      limit: 2,
      resetPeriod: "trial",
    },
    plus: {
      limit: 10,
      resetPeriod: "monthly",
    },
    pro: {
      limit: 20,
      resetPeriod: "monthly",
    },
    singlePurchasePrice: 2.99,
    courseTokenGranted: true,
  },
};

/**
 * Helper: Get limits for a specific feature and tier
 */
export function getLimitsForTier(
  feature: TierRestrictedFeature,
  tier: "starter" | "trial" | "plus" | "pro"
) {
  return TIER_LIMITS[feature][tier];
}

/**
 * Helper: Check if a feature supports single-use purchases
 */
export function canPurchaseFeature(feature: TierRestrictedFeature): boolean {
  return TIER_LIMITS[feature].singlePurchasePrice !== null;
}

/**
 * Helper: Get single-use purchase price for a feature
 */
export function getPurchasePrice(feature: TierRestrictedFeature): number | null {
  return TIER_LIMITS[feature].singlePurchasePrice;
}

/**
 * Helper: Check if course purchases grant tokens for a feature
 */
export function grantsCourseToken(feature: TierRestrictedFeature): boolean {
  return TIER_LIMITS[feature].courseTokenGranted;
}
