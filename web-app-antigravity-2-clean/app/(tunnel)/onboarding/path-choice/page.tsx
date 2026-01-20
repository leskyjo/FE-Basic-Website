"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PathChoiceCards } from "./path-choice-cards";
import { createClient } from "@/lib/supabase/browser";

export default function PathChoicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePathSelect = async (path: "professional" | "entrepreneur") => {
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("Not authenticated");
            }

            // Update profiles table with selected path
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    user_path: path,
                    primary_path: path, // First choice = primary path
                    onboarding_step: 2, // Move to questionnaire step
                })
                .eq("user_id", user.id);

            if (updateError) throw updateError;

            // Redirect to questionnaire
            router.push(`/onboarding/path-questionnaire?path=${path}`);

        } catch (err) {
            console.error("Error saving path:", err);
            setError("Failed to save your choice. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Welcome to Felon Entrepreneur
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose your path to get personalized guidance:
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Path Choice Cards */}
                <PathChoiceCards
                    onPathSelect={handlePathSelect}
                    isLoading={isLoading}
                />

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="mt-6 text-center">
                        <div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-sm text-gray-600">Saving your choice...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
