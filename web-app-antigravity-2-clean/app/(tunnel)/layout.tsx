import { OnboardingHeader } from "@/components/layout/onboarding-header";

export default function TunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_520px_at_12%_-10%,#e0e7ff,transparent),radial-gradient(900px_520px_at_100%_0%,#f5f3ff,transparent)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        <OnboardingHeader />
        {children}
      </div>
    </div>
  );
}
