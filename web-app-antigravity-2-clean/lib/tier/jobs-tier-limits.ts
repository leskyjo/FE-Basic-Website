/**
 * Jobs System Tier Limits
 *
 * Defines what each tier can access in the Jobs system
 */

export const JOBS_TIER_LIMITS = {
  starter: {
    // Search limits
    searches_per_day: 5,
    results_per_search: 10,

    // Job saves
    saved_jobs_max: 5,

    // Features
    can_save_searches: false,
    can_create_alerts: false,
    can_use_map_view: false,
    can_export_jobs: false,

    // Advanced features (all disabled)
    resume_builder_access: false,
    application_assist_samples: 1, // One free sample
    interview_prep_access: false,

    // Display
    show_upgrade_prompts: true,
  },

  trial: {
    // Search limits (same as Plus for trial)
    searches_per_day: 50,
    results_per_search: 25,

    // Job saves
    saved_jobs_max: 15,

    // Features
    can_save_searches: true,
    can_create_alerts: true,
    max_alerts: 2,
    can_use_map_view: true,
    can_export_jobs: false,

    // Advanced features (limited)
    resume_builder_access: true,
    resume_generations_per_month: 1,
    application_assist_samples: 3,
    interview_prep_access: false,

    // Display
    show_upgrade_prompts: true,
  },

  plus: {
    // Search limits
    searches_per_day: 50,
    results_per_search: 25,

    // Job saves
    saved_jobs_max: 30,

    // Features
    can_save_searches: true,
    can_create_alerts: true,
    max_alerts: 5,
    can_use_map_view: true,
    can_export_jobs: true,

    // Advanced features
    resume_builder_access: true,
    resume_generations_per_month: 5,
    application_assist_per_month: 15,
    interview_prep_per_month: 3,

    // Display
    show_upgrade_prompts: true, // Show Pro upsells
  },

  pro: {
    // Search limits
    searches_per_day: 200,
    results_per_search: 50,

    // Job saves
    saved_jobs_max: 100,

    // Features
    can_save_searches: true,
    can_create_alerts: true,
    max_alerts: 20,
    can_use_map_view: true,
    can_export_jobs: true,

    // Advanced features
    resume_builder_access: true,
    resume_generations_per_month: 10,
    application_assist_per_month: 30,
    interview_prep_per_month: 6,

    // Display
    show_upgrade_prompts: false,
  },
} as const;

export type TierName = keyof typeof JOBS_TIER_LIMITS;

/**
 * Get tier limits for a specific tier
 */
export function getJobsTierLimits(tier: string) {
  const normalizedTier = tier.toLowerCase() as TierName;
  return JOBS_TIER_LIMITS[normalizedTier] || JOBS_TIER_LIMITS.starter;
}

/**
 * Check if a tier can perform a specific action
 */
export function canPerformAction(
  tier: string,
  action: keyof typeof JOBS_TIER_LIMITS.starter
): boolean {
  const limits = getJobsTierLimits(tier);
  const value = limits[action];

  // For boolean flags
  if (typeof value === 'boolean') {
    return value;
  }

  // For numeric limits (assume they can if limit exists and > 0)
  if (typeof value === 'number') {
    return value > 0;
  }

  return false;
}

/**
 * Get the upgrade message for a locked feature
 */
export function getUpgradeMessage(
  feature: string,
  currentTier: string
): { title: string; message: string; targetTier: string } {
  const tier = currentTier.toLowerCase();

  if (tier === 'starter') {
    return {
      title: 'Upgrade to Plus',
      message: `Unlock ${feature} and more with FE Plus.`,
      targetTier: 'plus',
    };
  }

  if (tier === 'trial' || tier === 'plus') {
    return {
      title: 'Upgrade to Pro',
      message: `Get unlimited ${feature} with FE Pro.`,
      targetTier: 'pro',
    };
  }

  return {
    title: 'Feature Locked',
    message: `${feature} requires a paid plan.`,
    targetTier: 'plus',
  };
}
