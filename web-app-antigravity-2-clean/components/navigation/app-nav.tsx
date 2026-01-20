"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/lib/auth-context";

const topLinks = [
  { href: "/app/home", label: "Home" },
  { href: "/app/plan", label: "Plan" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/courses", label: "Courses" },
  { href: "/app/shop", label: "Shop" },
  { href: "/app/profile", label: "Profile" },
];

const bottomLinks = [
  { href: "/app/home", label: "Home", icon: "🏠" },
  { href: "/app/plan", label: "Plan", icon: "🧭" },
  { href: "/app/plan", label: "FE", icon: "⚡", isCenter: true },
  { href: "/app/jobs", label: "Jobs", icon: "💼" },
  { href: "/app/profile", label: "Profile", icon: "🙂" },
];

export function TopNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 hidden items-center justify-between border-b border-cyber-red/20 bg-cyber-black/95 px-8 py-4 backdrop-blur md:flex">
      {/* FE Logo */}
      <Link href="/app/home" className="flex items-center gap-3">
        <div className="relative h-12 w-12">
          <Image
            src="/icon1.png"
            alt="FE Logo"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div className="relative h-8 w-48">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            fill
            sizes="192px"
            className="object-contain object-left"
          />
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-2">
        {topLinks.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active
                  ? "bg-cyber-red text-white shadow-glow-red"
                  : "text-cyber-text-secondary hover:bg-cyber-black-lighter hover:text-cyber-red"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {!isLoggedIn && (
          <>
            <Link
              href="/login"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-cyber-text-secondary hover:bg-cyber-black-lighter hover:text-cyber-red transition-all duration-300"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="cyber-button"
            >
              Join free
            </Link>
          </>
        )}

        {/* Social Icons */}
        <div className="ml-2 flex items-center gap-3">
          <Link href="https://www.facebook.com" target="_blank" className="relative w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
            <Image
              src="/FB1.png"
              alt="Facebook"
              fill
              sizes="24px"
              className="object-contain"
            />
          </Link>
          <Link href="https://www.instagram.com" target="_blank" className="relative w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
            <Image
              src="/IG1.png"
              alt="Instagram"
              fill
              sizes="24px"
              className="object-contain"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 px-2 py-2 text-xs font-semibold text-gray-700">
        {bottomLinks.map((link) => {
          const active = pathname.startsWith(link.href);
          const base =
            "flex flex-col items-center justify-center rounded-full py-2 transition";

          if (link.isCenter) {
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="relative flex items-center justify-center"
              >
                <span className="absolute -top-6 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-500">
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-sm font-bold">
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </span>
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${base} ${active ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"}`}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
