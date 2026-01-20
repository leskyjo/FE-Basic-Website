"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegeneratePlanButtonProps {
  /** Current tier of the user */
  tier: "starter" | "trial" | "plus" | "pro";
  /** Current usage count */
  used: number;
  /** Limit for this tier */
  limit: number;
  /** Whether user can purchase if quota exceeded */
  canPurchase?: boolean;
  /** Price for single-use purchase */
  purchasePrice?: number | null;
}

export function RegeneratePlanButton({
  tier,
  used,
  limit,
  canPurchase = false,
  purchasePrice = null,
}: RegeneratePlanButtonProps) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const remaining = Math.max(0, limit - used);
  const isQuotaExceeded = remaining === 0;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/life-plan/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle quota exceeded
        if (data.error === "QUOTA_EXCEEDED") {
          setError(data.message);
          return;
        }

        // Handle other errors
        throw new Error(data.error || "Failed to regenerate Life Plan");
      }

      // Success!
      setSuccess(true);

      // Refresh the page after 2 seconds to show new plan
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  // Tier display names
  const tierNames = {
    starter: "Starter",
    trial: "Trial",
    plus: "Plus",
    pro: "Pro",
  };

  return (
    <div className="space-y-4">
      {/* Usage Meter */}
      <div className="glass-strong rounded-2xl border border-cyber-red/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Regenerations This {tier === "trial" ? "Trial" : "Month"}
            </p>
            <p className="text-xs text-cyber-text-dim">
              {tierNames[tier]} tier
              {tier === "starter" && " (Upgrade to unlock)"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-cyber-red glow-text-red">
              {used}/{limit === Infinity ? "∞" : limit}
            </p>
            <p className="text-xs text-cyber-text-dim">
              {limit === Infinity
                ? "Unlimited"
                : remaining === 0
                ? "No regens left"
                : `${remaining} remaining`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {limit !== Infinity && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-cyber-black-lighter border border-cyber-red/20">
              <div
                className={`h-full transition-all ${
                  remaining === 0
                    ? "bg-cyber-red shadow-glow-red"
                    : remaining <= 1
                    ? "bg-cyber-red/70"
                    : "bg-cyber-red/50"
                }`}
                style={{
                  width: `${Math.min(100, (used / limit) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-2xl border border-cyber-red/50 bg-cyber-red/10 p-4">
          <p className="text-sm font-semibold text-white">
            ✓ Life Plan regenerated successfully!
          </p>
          <p className="mt-1 text-xs text-cyber-text">
            Your updated plan will appear below. Refreshing page...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-cyber-red bg-cyber-red/20 p-4">
          <p className="text-sm font-semibold text-cyber-red glow-text-red">Error</p>
          <p className="mt-1 text-xs text-cyber-text">{error}</p>

          {/* Upgrade CTA if quota exceeded */}
          {isQuotaExceeded && (
            <div className="mt-3 space-y-2">
              <a
                href="/pricing"
                className="cyber-button block text-center"
              >
                Upgrade to {tier === "starter" || tier === "trial" ? "Plus" : "Pro"}
              </a>

              {canPurchase && purchasePrice && (
                <button
                  type="button"
                  className="block w-full rounded-lg glass border border-cyber-red/40 px-4 py-2 text-center text-sm font-semibold text-cyber-red hover:border-cyber-red hover:shadow-glow-red transition-all duration-300"
                >
                  Purchase One-Time Regeneration (${purchasePrice.toFixed(2)})
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Regenerate Button */}
      <button
        type="button"
        onClick={handleRegenerate}
        disabled={isRegenerating || success}
        className={`cyber-button w-full transition-all ${
          isRegenerating || success
            ? "!cursor-not-allowed !bg-cyber-gray/30 !text-cyber-text-dim !border-cyber-gray/50 !shadow-none"
            : isQuotaExceeded
            ? "!bg-cyber-black-lighter !text-cyber-text-dim !border-cyber-red/20"
            : ""
        }`}
      >
        {isRegenerating
          ? "Regenerating Your Life Plan..."
          : success
          ? "Regeneration Complete!"
          : isQuotaExceeded
          ? `No Regenerations Left (${used}/${limit} used)`
          : `Regenerate Life Plan (${remaining} left)`}
      </button>

      {/* Info Text */}
      <p className="text-center text-sm text-cyber-text-secondary">
        {tier === "starter" && (
          <>
            Starter tier does not include regenerations.{" "}
            <a href="/pricing" className="text-cyber-red font-semibold hover:glow-text-red transition-all text-base">
              Upgrade to Trial, Plus, or Pro
            </a>{" "}
            to unlock this feature.
          </>
        )}
        {tier === "trial" && (
          <>
            Trial includes 1 regeneration for the entire 7-day period.{" "}
            {used >= limit ? (
              <>
                <a href="/pricing" className="text-cyber-red font-semibold hover:glow-text-red transition-all text-base">
                  Upgrade to Plus or Pro
                </a>{" "}
                for monthly regenerations.
              </>
            ) : (
              "Use it wisely!"
            )}
          </>
        )}
        {tier === "plus" && (
          <>
            Plus includes 4 regenerations per month.{" "}
            {remaining === 0 ? (
              <>
                <a href="/pricing?upgrade=pro" className="text-cyber-red font-semibold hover:glow-text-red transition-all text-base">
                  Upgrade to Pro
                </a>{" "}
                for 8 per month.
              </>
            ) : (
              "Resets on the 1st of each month."
            )}
          </>
        )}
        {tier === "pro" && (
          <>
            Pro includes 8 regenerations per month. Resets on the 1st of each month.
          </>
        )}
      </p>

      {/* Warning for low usage */}
      {!isQuotaExceeded && remaining <= 1 && tier !== "starter" && (
        <div className="rounded-2xl border border-cyber-red/40 bg-cyber-red/10 p-3">
          <p className="text-xs font-semibold text-cyber-red">
            ⚠️ Only {remaining} regeneration{remaining === 1 ? "" : "s"} left this{" "}
            {tier === "trial" ? "trial period" : "month"}
          </p>
          <p className="mt-1 text-xs text-cyber-text-dim">
            {tier === "trial"
              ? "Consider upgrading to Plus or Pro for monthly allowances."
              : tier === "plus"
              ? "Upgrade to Pro for 8 regenerations per month."
              : "Your limit will reset at the start of next month."}
          </p>
        </div>
      )}
    </div>
  );
}
