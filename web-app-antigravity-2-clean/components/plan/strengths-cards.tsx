"use client";

import { Lightbulb } from "lucide-react";

interface StrengthsCardsProps {
  strengths: string[];
}

export function StrengthsCards({ strengths }: StrengthsCardsProps) {
  const handleStrengthClick = (strength: string) => {
    // Scroll to FE Coach section
    const feCoachSection = document.querySelector('[data-fe-coach]');
    if (feCoachSection) {
      feCoachSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Wait for scroll, then focus the chat input
      setTimeout(() => {
        const chatInput = document.querySelector('[data-fe-coach-input]') as HTMLInputElement;
        if (chatInput) {
          chatInput.focus();
          // Pre-fill a suggested question
          const event = new CustomEvent('fe-coach-prefill', {
            detail: { message: `How can I leverage my "${strength}" strength to reach my goals?` }
          });
          window.dispatchEvent(event);
        }
      }, 500);
    }
  };

  return (
    <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-cyber-red" />
        <h2 className="text-lg font-bold text-white glow-text-red">
          What You Bring to the Table
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {strengths.map((strength) => (
          <button
            key={strength}
            onClick={() => handleStrengthClick(strength)}
            className="glass rounded-xl px-4 py-3 border border-cyber-red/30 text-center
                       hover:border-cyber-red/60 hover:shadow-glow-red hover:scale-105
                       active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            <span className="text-sm text-cyber-text font-medium group-hover:text-white">
              {strength}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-cyber-text-secondary">
        We use these to match you with jobs, courses, and support that fit who you are.{" "}
        <span className="text-cyber-red">Click any strength to ask your FE Coach how to leverage it.</span>
      </p>
    </div>
  );
}
