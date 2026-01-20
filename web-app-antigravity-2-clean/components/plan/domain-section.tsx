"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase, DollarSign, GraduationCap, Heart, Brain } from "lucide-react";

interface FETool {
  tool_name: string;
  pricing?: string;
  show_cta?: boolean;
  why_recommend?: string;
}

interface DomainPlan {
  domain_name: string;
  current_situation: string;
  target_outcome: string;
  key_actions?: Array<{
    id: string;
    title: string;
    description: string;
    why_it_matters?: string;
  }>;
  progress_milestones: string[];
  resources_needed: string[];
  fe_tools_recommended: (string | FETool)[];
}

interface DomainSectionProps {
  domain: DomainPlan;
  icon: "employment" | "financial" | "skills" | "health" | "mindset";
}

const ICON_MAP = {
  employment: Briefcase,
  financial: DollarSign,
  skills: GraduationCap,
  health: Heart,
  mindset: Brain,
};

export function DomainSection({ domain, icon }: DomainSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICON_MAP[icon];

  return (
    <div className="glass-strong rounded-2xl border border-cyber-red/30 overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-cyber-red/5 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyber-red rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
            {/* Icon */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyber-red/30 to-cyber-red/10 flex items-center justify-center border border-cyber-red/40">
              <Icon className="w-6 h-6 text-cyber-red" />
            </div>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-bold text-white glow-text-red group-hover:scale-105 transition-transform">
              {domain.domain_name}
            </h3>
            <p className="text-sm text-cyber-text-dim mt-1">
              {isExpanded ? "Click to collapse" : "Click to expand"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Milestones count badge */}
          {domain.progress_milestones && domain.progress_milestones.length > 0 && (
            <div className="glass rounded-full px-3 py-1 border border-cyber-red/30">
              <span className="text-xs text-cyber-red font-semibold">
                {domain.progress_milestones.length} milestones
              </span>
            </div>
          )}

          {/* Chevron */}
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-cyber-red" />
          ) : (
            <ChevronDown className="w-6 h-6 text-cyber-red group-hover:animate-bounce" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-cyber-red/20">
          {/* Current Situation & Target */}
          <div className="grid gap-4 md:grid-cols-2 pt-6">
            <div className="glass rounded-xl p-4 border border-cyber-red/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyber-text-dim mb-2">
                Current Situation
              </p>
              <p className="text-sm text-cyber-text leading-relaxed">
                {domain.current_situation}
              </p>
            </div>

            <div className="glass rounded-xl p-4 border border-cyber-red/20 bg-cyber-red/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyber-red mb-2">
                Target Outcome
              </p>
              <p className="text-sm text-white leading-relaxed">
                {domain.target_outcome}
              </p>
            </div>
          </div>

          {/* Key Actions */}
          {domain.key_actions && domain.key_actions.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyber-red mb-3">
                Key Actions
              </h4>
              <div className="space-y-3">
                {domain.key_actions.slice(0, 3).map((action, idx) => (
                  <div
                    key={action.id || idx}
                    className="glass rounded-xl p-4 border border-cyber-red/20 hover:border-cyber-red/50 hover:shadow-glow-red transition-all duration-300"
                  >
                    <h5 className="text-sm font-semibold text-white mb-1">{action.title}</h5>
                    <p className="text-xs text-cyber-text">{action.description}</p>
                    {action.why_it_matters && (
                      <p className="text-xs text-cyber-text-dim italic mt-2">
                        → {action.why_it_matters}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Milestones */}
          {domain.progress_milestones && domain.progress_milestones.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyber-red mb-3">
                Progress Milestones
              </h4>
              <div className="space-y-2">
                {domain.progress_milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyber-red/20 border border-cyber-red/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-cyber-red">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-cyber-text flex-1">{milestone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FE Tools Recommended */}
          {domain.fe_tools_recommended && domain.fe_tools_recommended.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyber-red mb-3">
                FE Tools to Use
              </h4>
              <div className="flex flex-wrap gap-2">
                {domain.fe_tools_recommended.map((tool, idx) => {
                  // Handle both string and object formats
                  const toolName = typeof tool === 'string' ? tool : tool?.tool_name || 'Unknown Tool';
                  const toolPricing = typeof tool === 'object' && tool?.pricing ? ` (${tool.pricing})` : '';

                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full glass border border-cyber-red/40 px-3 py-1.5 text-xs font-medium text-cyber-red"
                    >
                      {toolName}{toolPricing}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
