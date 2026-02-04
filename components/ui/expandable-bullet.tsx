"use client";

import { useState } from "react";

import { BulletItem } from "@/src/content/landing";

type ExpandableBulletProps = {
  bullet: BulletItem;
  icon?: string;
};

export function ExpandableBullet({ bullet, icon = "✓" }: ExpandableBulletProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      className="group cursor-pointer rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-500/20 text-sm">
          {icon}
        </span>
        <span className="flex-1">{bullet.text}</span>
        <span
          className={`mt-0.5 text-slate-400 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 pt-3">
            <h4 className="mb-2 font-semibold text-red-300">{bullet.expandedTitle}</h4>
            <p className="text-slate-400 leading-relaxed">{bullet.expandedContent}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
