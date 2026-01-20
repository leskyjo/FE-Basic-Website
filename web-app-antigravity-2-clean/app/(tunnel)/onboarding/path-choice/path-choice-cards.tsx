"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Rocket } from "lucide-react";

interface PathChoiceCardsProps {
    onPathSelect: (path: "professional" | "entrepreneur") => void;
    isLoading: boolean;
}

export function PathChoiceCards({ onPathSelect, isLoading }: PathChoiceCardsProps) {
    const [selectedPath, setSelectedPath] = useState<"professional" | "entrepreneur" | null>(null);

    const handleSelect = (path: "professional" | "entrepreneur") => {
        setSelectedPath(path);
        // Small delay for visual feedback
        setTimeout(() => {
            onPathSelect(path);
        }, 200);
    };

    return (
        <div className="space-y-4 w-full max-w-2xl mx-auto px-4">
            {/* Professional Path Card */}
            <button
                onClick={() => handleSelect("professional")}
                disabled={isLoading}
                className={`
          w-full min-h-[200px] p-6 rounded-xl border-2 text-left transition-all
          ${selectedPath === "professional"
                        ? "border-blue-600 bg-blue-50 scale-[0.98]"
                        : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-md active:scale-[0.98]"
                    }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          md:p-8
        `}
            >
                <div className="flex items-start gap-4">
                    <div className={`
            p-3 rounded-lg
            ${selectedPath === "professional" ? "bg-blue-600" : "bg-blue-100"}
          `}>
                        <Briefcase className={`
              w-8 h-8
              ${selectedPath === "professional" ? "text-white" : "text-blue-600"}
            `} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            🏢 Professional
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Level up and become the employee, manager, supervisor, president or CEO that is irreplaceable and the company you work for can't live without.
                        </p>
                    </div>
                </div>
            </button>

            {/* Entrepreneur Path Card */}
            <button
                onClick={() => handleSelect("entrepreneur")}
                disabled={isLoading}
                className={`
          w-full min-h-[200px] p-6 rounded-xl border-2 text-left transition-all
          ${selectedPath === "entrepreneur"
                        ? "border-purple-600 bg-purple-50 scale-[0.98]"
                        : "border-gray-200 bg-white hover:border-purple-400 hover:shadow-md active:scale-[0.98]"
                    }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          md:p-8
        `}
            >
                <div className="flex items-start gap-4">
                    <div className={`
            p-3 rounded-lg
            ${selectedPath === "entrepreneur" ? "bg-purple-600" : "bg-purple-100"}
          `}>
                        <Rocket className={`
              w-8 h-8
              ${selectedPath === "entrepreneur" ? "text-white" : "text-purple-600"}
            `} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            🚀 Entrepreneur
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Launch into the life of passionate business adventure that you can't stop thinking about and build an empire and a legacy.
                        </p>
                    </div>
                </div>
            </button>

            {/* Tier Rules Notice */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">
                    IMPORTANT: PATH SWITCHING RULES
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                        • <strong>Starter Plan:</strong> You can switch paths ONCE. After that, upgrade to Plus.
                    </li>
                    <li>
                        • <strong>Plus/Pro:</strong> Unlimited path switching. Full access to both paths.
                    </li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                    Choose carefully, but don't worry — you can always upgrade!
                </p>
            </div>
        </div>
    );
}
