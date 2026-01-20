import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";
import { checkQuota } from "@/lib/tier/check-quota";
import { incrementUsage } from "@/lib/tier/increment-usage";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * POST /api/fe-coach/chat
 *
 * FE Coach AI chat endpoint with Life Plan context and tier-aware limits
 *
 * Flow:
 * 1. Authenticate user
 * 2. Check tier and quota (Starter: 10 AI credits/week, Plus/Pro: unlimited)
 * 3. Load user profile and Life Plan context
 * 4. Build personalized system prompt
 * 5. Call OpenAI with conversation history
 * 6. Increment usage counter
 * 7. Return response with updated credits
 *
 * Security:
 * - Server-side only (OpenAI API key never exposed)
 * - Tier-based quota enforcement
 * - RLS via Supabase auth
 */
export async function POST(request: Request) {
  const supabase = createClient();

  // 1. AUTHENTICATE
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  // 2. VERIFY OPENAI API KEY
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 }
    );
  }

  // 3. PARSE REQUEST BODY
  const body = await request.json();
  const { message: userMessage, conversationHistory } = body;

  if (!userMessage || typeof userMessage !== "string") {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const messages: Message[] = Array.isArray(conversationHistory)
    ? conversationHistory
    : [];

  // 4. CHECK QUOTA (tier-aware)
  try {
    const quotaCheck = await checkQuota(supabase, userId, "ai_message");

    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: quotaCheck.message,
          upgradeUrl: quotaCheck.upgradeUrl,
          creditsRemaining: quotaCheck.remaining,
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("[FE Coach] Quota check failed:", error);
    return NextResponse.json(
      { error: "Failed to check quota" },
      { status: 500 }
    );
  }

  // 5. LOAD USER PROFILE (for personalization)
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "tier, preferred_name, strategic_goal_30_days, biggest_barrier, commitment_level, willingness_level, starter_ai_credits_remaining"
    )
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 }
    );
  }

  const preferredName = profile.preferred_name || "there";
  const strategicGoal = profile.strategic_goal_30_days || "your goals";
  const biggestBarrier = profile.biggest_barrier || "unknown";
  const commitmentLevel = profile.commitment_level || 3;
  const tier = profile.tier as "starter" | "trial" | "plus" | "pro";

  // 6. LOAD LIFE PLAN CONTEXT
  const { data: lifePlan } = await supabase
    .from("life_plans")
    .select("current_version_id")
    .eq("user_id", userId)
    .maybeSingle();

  let lifePlanContext = "";

  if (lifePlan?.current_version_id) {
    const { data: version } = await supabase
      .from("life_plan_versions")
      .select("plan_json")
      .eq("id", lifePlan.current_version_id)
      .single();

    if (version?.plan_json) {
      const planJson = version.plan_json as any;

      // Extract key points from Life Plan for context
      const overview = planJson.overview || {};
      const currentState = planJson.current_state || {};
      const next7Days = planJson.timeframes?.next_7_days || [];

      lifePlanContext = `
LIFE PLAN SUMMARY:
- Headline: ${overview.headline || "Not set"}
- Current Employment: ${currentState.employment_status || "Not set"}
- Income Gap: ${currentState.income_gap || "Not set"}
- Housing Status: ${currentState.housing_status || "Not set"}
- Key Strengths: ${currentState.key_strengths?.join(", ") || "Not set"}
- Immediate Needs: ${currentState.immediate_needs?.join(", ") || "Not set"}

NEXT 7-DAY ACTIONS (Top 3):
${next7Days
  .slice(0, 3)
  .map((action: any, i: number) => `${i + 1}. ${action.title} - ${action.why_it_matters}`)
  .join("\n")}
`;
    }
  }

  // 7. BUILD SYSTEM PROMPT (personalized)
  const systemPrompt = `You are the FE Coach for Felon Entrepreneur, a supportive AI mentor helping ${preferredName} achieve their goals.

CONTEXT ABOUT ${preferredName.toUpperCase()}:
- 30-Day Goal: "${strategicGoal}" (THIS IS THEIR #1 PRIORITY)
- Biggest Barrier: ${biggestBarrier}
- Commitment Level: ${commitmentLevel}/5
${lifePlanContext}

YOUR ROLE:
- Be empowering, street-smart, and specific (not corporate or vague)
- Always reference their 30-day goal ("${strategicGoal}")
- Give actionable steps with numbers (not "try to..." but "Call this number...")
- Use their name (${preferredName}) naturally
- Celebrate wins, but stay realistic

TONE GUIDELINES:
- "Here's the move..." (direct)
- "Real talk..." (honest)
- "You got this, ${preferredName}." (encouraging)
- AVOID: "You might want to consider...", "It's important to...", "Stay positive!"

WHEN THEY ASK FOR HELP:
- Connect advice to their goal ("${strategicGoal}")
- Give specific next steps (not general advice)
- Recommend FE tools when relevant (Resume Builder, Application Assistant, Jobs search, Courses)
- Reference their Life Plan actions when applicable

KEEP RESPONSES:
- Under 250 words (concise and actionable)
- Focused on their specific situation
- Connected to their 30-day goal`;

  // 8. CALL OPENAI
  try {
    console.log(`[FE Coach] Starting chat for user ${userId}, tier: ${tier}`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper for chat
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
        { role: "user", content: userMessage },
      ],
      temperature: 0.8, // Slightly creative for conversational tone
      max_tokens: 500, // Keep responses concise
    });

    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      throw new Error("Empty response from AI");
    }

    // 9. INCREMENT USAGE (Starter: decrement credits, Plus/Pro: track usage)
    await incrementUsage(supabase, userId, "ai_message", {
      message_length: userMessage.length,
      response_length: responseContent.length,
      tokens_used: completion.usage?.total_tokens || 0,
    });

    // 10. GET UPDATED CREDITS (Starter only)
    let creditsRemaining: number | null = null;

    if (tier === "starter") {
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("starter_ai_credits_remaining")
        .eq("user_id", userId)
        .single();

      creditsRemaining = updatedProfile?.starter_ai_credits_remaining ?? null;
    }

    console.log(
      `[FE Coach] Success for user ${userId}, credits remaining: ${creditsRemaining}`
    );

    // 11. RETURN RESPONSE
    return NextResponse.json(
      {
        message: responseContent,
        creditsRemaining,
        tier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FE Coach] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate response",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}
