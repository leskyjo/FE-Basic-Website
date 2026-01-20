"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Briefcase, User } from "lucide-react";
import Image from "next/image";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/app/home",
    label: "Home",
    icon: <Home className="w-6 h-6" />,
  },
  {
    href: "/app/plan",
    label: "Plan",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    href: "/app/jobs",
    label: "Jobs",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    href: "/app/profile",
    label: "Profile",
    icon: <User className="w-6 h-6" />,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
      {/* Backdrop to prevent content from showing through */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/95 to-transparent pointer-events-none" />

      <div className="relative px-4 pb-6 pointer-events-auto">
        {/* Main nav bar with glossy effect */}
        <div className="relative">
          {/* Bottom red glow */}
          <div className="absolute -bottom-2 left-0 right-0 h-8 bg-cyber-red/40 blur-2xl" />

          {/* Glossy nav container */}
          <div className="relative rounded-[32px] overflow-visible"
               style={{
                 background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(5, 5, 5, 0.98) 100%)',
                 backdropFilter: 'blur(24px)',
                 border: '1px solid rgba(225, 6, 0, 0.2)',
                 boxShadow: `
                   0 0 40px 0 rgba(225, 6, 0, 0.25),
                   0 8px 32px 0 rgba(0, 0, 0, 0.6),
                   inset 0 2px 0 0 rgba(255, 255, 255, 0.1),
                   inset 0 -1px 0 0 rgba(225, 6, 0, 0.15)
                 `
               }}>
            <div className="relative flex items-center justify-around px-6 py-4">
              {/* Home */}
              <NavButton
                href="/app/home"
                label="Home"
                icon={navItems[0].icon}
                isActive={pathname === "/app/home"}
              />

              {/* Plan */}
              <NavButton
                href="/app/plan"
                label="Plan"
                icon={navItems[1].icon}
                isActive={pathname === "/app/plan"}
              />

              {/* Center FE Button - Elevated */}
              <div className="relative -mt-16">
                {/* Outer massive glow */}
                <div className="absolute -inset-8 bg-gradient-radial from-cyber-red/60 via-cyber-red/20 to-transparent rounded-full blur-3xl animate-pulse-glow" />

                {/* Button with ring */}
                <Link
                  href="/app/courses"
                  className="relative block"
                  aria-label="FE Hub"
                >
                  {/* Outer ring glow */}
                  <div className="absolute -inset-3 bg-cyber-red/40 rounded-full blur-xl" />

                  {/* Main button - Single clean circle */}
                  <div className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                       style={{
                         background: 'radial-gradient(circle at 30% 30%, rgba(30, 30, 30, 1) 0%, rgba(0, 0, 0, 1) 100%)',
                         border: '3px solid #E10600',
                         boxShadow: `
                           0 0 60px 0 rgba(225, 6, 0, 0.8),
                           0 4px 20px 0 rgba(0, 0, 0, 0.8),
                           inset 0 2px 8px 0 rgba(255, 255, 255, 0.15),
                           inset 0 -2px 8px 0 rgba(225, 6, 0, 0.3)
                         `
                       }}>
                    {/* Logo - Centered and contained within circle */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src="/icon1.png"
                        alt="FE"
                        fill
                        sizes="64px"
                        className="object-contain scale-110"
                        priority
                      />
                    </div>
                  </div>
                </Link>

                {/* Bottom indicator */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 bg-cyber-red rounded-full blur-sm" />
              </div>

              {/* Jobs */}
              <NavButton
                href="/app/jobs"
                label="Jobs"
                icon={navItems[2].icon}
                isActive={pathname === "/app/jobs"}
              />

              {/* Profile */}
              <NavButton
                href="/app/profile"
                label="Profile"
                icon={navItems[3].icon}
                isActive={pathname === "/app/profile"}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function NavButton({ href, label, icon, isActive }: NavButtonProps) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center gap-1 transition-all duration-300 group min-h-[56px] justify-center"
    >
      {/* Icon */}
      <div
        className={`transition-all duration-300 pointer-events-none ${
          isActive
            ? "text-cyber-red scale-110"
            : "text-cyber-gray group-hover:text-cyber-red/70"
        }`}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className={`text-xs font-medium transition-all duration-300 pointer-events-none ${
          isActive ? "text-cyber-red glow-text-red" : "text-cyber-gray group-hover:text-cyber-red/70"
        }`}
      >
        {label}
      </span>

      {/* Active indicator glow */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyber-red rounded-full blur-sm animate-pulse pointer-events-none" />
      )}
    </Link>
  );
}
