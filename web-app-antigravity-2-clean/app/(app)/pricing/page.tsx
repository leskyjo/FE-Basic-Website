import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function PricingPage() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("user_id", userData.user.id)
        .single();

    const currentTier = profile?.tier || "starter";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white glow-text-red">
                    Choose Your Plan
                </h1>
                <p className="mt-2 text-cyber-text">
                    Unlock more tools and features to accelerate your success
                </p>
                <p className="mt-1 text-sm text-cyber-text-dim">
                    Current Plan: <span className="text-cyber-red font-semibold capitalize">{currentTier}</span>
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Starter */}
                <div className={`glass-strong rounded-2xl border p-6 ${currentTier === 'starter' ? 'border-cyber-red' : 'border-cyber-red/30'}`}>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white">Starter</h3>
                        <p className="text-3xl font-bold text-cyber-red mt-2">Free</p>
                        <p className="text-sm text-cyber-text-dim mt-1">Forever</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>10 FE Coach messages/week</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>1 Life Plan generation</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Job Finder access</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Resume Builder ($3.99 one-time)</span>
                        </li>
                    </ul>

                    {currentTier === 'starter' ? (
                        <div className="text-center text-cyber-red font-semibold">Current Plan</div>
                    ) : (
                        <button disabled className="cyber-button w-full opacity-50">
                            Current: {currentTier}
                        </button>
                    )}
                </div>

                {/* Plus */}
                <div className={`glass-strong rounded-2xl border p-6 relative ${currentTier === 'plus' ? 'border-cyber-red' : 'border-cyber-red/30'}`}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-cyber-red text-white text-xs font-bold px-3 py-1 rounded-full">
                            Most Popular
                        </span>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white">Plus</h3>
                        <p className="text-3xl font-bold text-cyber-red mt-2">$15<span className="text-lg">/mo</span></p>
                        <p className="text-sm text-cyber-text-dim mt-1">7-day free trial</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span><strong>Unlimited</strong> FE Coach messages</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>4 Life Plan regenerations/month</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Build My Business (BMB) OR Build My Career (BMC)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Resume Builder included</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>15 Application Assists/month</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>10% off all courses</span>
                        </li>
                    </ul>

                    {currentTier === 'plus' ? (
                        <div className="text-center text-cyber-red font-semibold">Current Plan</div>
                    ) : (
                        <button className="cyber-button w-full">
                            Start 7-Day Trial
                        </button>
                    )}
                </div>

                {/* Pro */}
                <div className={`glass-strong rounded-2xl border p-6 ${currentTier === 'pro' ? 'border-cyber-red' : 'border-cyber-red/30'}`}>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white">Pro</h3>
                        <p className="text-3xl font-bold text-cyber-red mt-2">$25<span className="text-lg">/mo</span></p>
                        <p className="text-sm text-cyber-text-dim mt-1">For serious growth</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span><strong>Everything in Plus</strong></span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>BOTH BMB AND BMC access</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>30 Application Assists/month</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Unlimited Resume generations</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>20% off all courses</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-cyber-text">
                            <Check className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                            <span>Priority support</span>
                        </li>
                    </ul>

                    {currentTier === 'pro' ? (
                        <div className="text-center text-cyber-red font-semibold">Current Plan</div>
                    ) : (
                        <button className="cyber-button w-full">
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            </div>

            {/* FAQ */}
            <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6 text-center">
                <p className="text-cyber-text text-sm">
                    Payment processing coming soon. For now, this is a preview of our pricing tiers.
                </p>
                <p className="text-cyber-text-dim text-xs mt-2">
                    Need help choosing? <Link href="/app/plan" className="text-cyber-red hover:underline">Talk to FE Coach</Link>
                </p>
            </div>
        </div>
    );
}
