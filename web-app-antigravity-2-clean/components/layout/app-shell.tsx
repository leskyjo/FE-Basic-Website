"use client";

import { BottomNav, TopNav } from "../navigation/app-nav";
import { MobileBottomNav } from "../nav/mobile-bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text cyber-grid overflow-x-hidden max-w-full">
      {/* Subtle scan line effect overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-50" />

      {/* Desktop/Tablet Top Nav */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Main content */}
      <main className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-40 pt-6 md:px-8 md:pb-12 md:pt-24 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav (new cyberpunk design) */}
      <MobileBottomNav />

      {/* Old desktop nav hidden for now - will redesign later */}
      <div className="hidden">
        <BottomNav />
      </div>
    </div>
  );
}
