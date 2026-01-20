import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * DEVELOPMENT ONLY - Quick tier switcher for testing
 * DELETE THIS FILE BEFORE PRODUCTION
 */
export async function POST(request: Request) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tier } = body;

    // Validate tier
    const validTiers = ["starter", "trial", "plus", "pro"];
    if (!validTiers.includes(tier)) {
        return NextResponse.json(
            { error: `Invalid tier. Must be one of: ${validTiers.join(", ")}` },
            { status: 400 }
        );
    }

    // Update tier
    const { error } = await supabase
        .from("profiles")
        .update({ tier })
        .eq("user_id", userData.user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: `Tier updated to: ${tier}`,
        tier
    });
}

export async function GET() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("tier, starter_ai_credits_remaining")
        .eq("user_id", userData.user.id)
        .single();

    return NextResponse.json({
        currentTier: profile?.tier || "starter",
        creditsRemaining: profile?.starter_ai_credits_remaining
    });
}
