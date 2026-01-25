import { BenefitCardsRow } from "@/components/landing/benefit-cards-row";
import { FeatureSection } from "@/components/landing/feature-section";
import { FoundersSection } from "@/components/landing/founders-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksBand } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { SupportHubSection } from "@/components/landing/support-hub-section";
import { WhatsInsideSection } from "@/components/landing/whats-inside-section";
import { features } from "@/src/content/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50">
      <LandingHeader />
      <HeroSection />
      <WhatsInsideSection />
      <BenefitCardsRow />
      {features.map((feature) => (
        <div key={feature.id}>
          <FeatureSection feature={feature} />
          {feature.id === "stories" && <SupportHubSection />}
        </div>
      ))}
      <HowItWorksBand />
      <FoundersSection />
      <LandingFooter />
    </div>
  );
}
