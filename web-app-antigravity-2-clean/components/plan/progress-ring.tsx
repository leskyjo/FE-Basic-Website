"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label: string;
  subtitle?: string;
  showPercentage?: boolean;
  color?: "red" | "green" | "blue";
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  subtitle,
  showPercentage = true,
  color = "red",
}: ProgressRingProps) {
  const [progress, setProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClasses = {
    red: {
      stroke: "#E10600",
      glow: "drop-shadow-[0_0_12px_rgba(225,6,0,0.8)]",
      bg: "#E10600",
    },
    green: {
      stroke: "#00ff88",
      glow: "drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]",
      bg: "#00ff88",
    },
    blue: {
      stroke: "#00aaff",
      glow: "drop-shadow-[0_0_10px_rgba(0,170,255,0.8)]",
      bg: "#00aaff",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Ring */}
      <div className="relative">
        {/* Glow effect behind ring */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse`}
          style={{ backgroundColor: colors.bg }}
        />

        <svg
          width={size}
          height={size}
          className="relative transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2a2a2a"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-1000 ease-out ${colors.glow}`}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke})`,
            }}
          />
        </svg>

        {/* Center content */}
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white glow-text-red">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-cyber-text">{label}</p>
        {subtitle && (
          <p className="text-xs text-cyber-text-dim mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
