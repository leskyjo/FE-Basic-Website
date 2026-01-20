"use client";

import { useState } from "react";

export function DevTierSwitcher() {
    const [currentTier, setCurrentTier] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const switchTier = async (tier: "starter" | "trial" | "plus" | "pro") => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/dev/set-tier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier }),
            });

            const data = await response.json();
            if (data.success) {
                setCurrentTier(tier);
                // Reload the page to refresh tier-aware components
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to switch tier:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-strong rounded-xl border border-cyber-red/30 p-4">
            <h3 className="text-sm font-bold text-cyber-red mb-2">
                🛠️ Dev: Quick Tier Switcher
            </h3>
            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={() => switchTier("starter")}
                    disabled={isLoading}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                    Starter
                </button>
                <button
                    onClick={() => switchTier("trial")}
                    disabled={isLoading}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                    Trial
                </button>
                <button
                    onClick={() => switchTier("plus")}
                    disabled={isLoading}
                    className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                    Plus
                </button>
                <button
                    onClick={() => switchTier("pro")}
                    disabled={isLoading}
                    className="text-xs bg-cyber-red hover:bg-cyber-red-dark text-white px-2 py-1 rounded disabled:opacity-50"
                >
                    Pro ⭐
                </button>
            </div>
            <p className="text-xs text-cyber-text-dim mt-2">
                Click to instantly switch your tier (page will reload)
            </p>
        </div>
    );
}
