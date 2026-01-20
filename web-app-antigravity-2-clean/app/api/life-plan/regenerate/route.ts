/**
 * POST /api/life-plan/regenerate
 *
 * Regenerates a user's Life Plan using OpenAI GPT-4.
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Checks tier quota (uses centralized tier system)
 * 3. Verifies OpenAI API key
 * 4. Loads existing questionnaire answers
 * 5. Loads user profile for personalization
 * 6. Initializes OpenAI client
 * 7. Builds AI prompts with user profile
 * 8. Calls OpenAI to generate new Life Plan
 * 9. Parses and validates AI response
 * 10. Saves new version to database
 * 11. Updates life_plans table
 * 12. Extracts and saves derived profiles
 * 13. Increments usage counter
 * 14. Logs generation event
 * 15. Returns success response
 *
 * Tier Limits:
 * - Starter: 0 (must purchase $2.99/use or upgrade)
 * - Trial: 1 total (for entire 7-day trial)
 * - Plus: 4/month
 * - Pro: 8/month
 */

import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";
import { checkQuota, incrementUsage } from "@/lib/tier";
import {
  LIFE_PLAN_SYSTEM_PROMPT,
  buildLifePlanUserPrompt,
} from "@/lib/ai/life-plan-prompts";
import { extractAndSaveProfiles } from "@/lib/ai/extract-profiles";
import type { LifePlan } from "@/lib/types/life-plan";

export async function POST() {
  const supabase = createClient();

  // 1. AUTHENTICATE
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  // 2. CHECK TIER QUOTA (CRITICAL - TIER ENFORCEMENT)
  const quotaCheck = await checkQuota(supabase, userId, "lifeplan_regen");

  if (!quotaCheck.allowed) {
    return NextResponse.json(
      {
        error: "QUOTA_EXCEEDED",
        message: quotaCheck.message,
        upgradeUrl: quotaCheck.upgradeUrl,
        currentTier: quotaCheck.tier,
        limit: quotaCheck.limit,
        used: quotaCheck.used,
        remaining: quotaCheck.remaining,
        canPurchase: quotaCheck.canPurchase,
        purchasePrice: quotaCheck.purchasePrice,
      },
      { status: 403 }
    );
  }

  // 3. VERIFY OPENAI API KEY EXISTS
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 }
    );
  }

  // 4. LOAD QUESTIONNAIRE ANSWERS
  const { data: answerRows, error: answersError } = await supabase
    .from("questionnaire_answers")
    .select("question_id, group_id, answer_value")
    .eq("user_id", userId);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  if (!answerRows || answerRows.length === 0) {
    return NextResponse.json(
      {
        error:
          "Questionnaire not complete. Please complete all questions first.",
      },
      { status: 400 }
    );
  }

  // Convert to Record<question_id, answer_value>
  const answers: Record<string, any> = {};
  answerRows.forEach((row) => {
    answers[row.question_id] = row.answer_value;
  });

  // 5. LOAD USER PROFILE (for personalization)
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("preferred_name, zip_code")
    .eq("user_id", userId)
    .single();

  if (profileError || !userProfile) {
    console.error("[Life Plan Regeneration] Profile error:", profileError);
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 500 }
    );
  }

  const profileForPrompts = {
    preferred_name: userProfile.preferred_name || "there",
    zip_code: userProfile.zip_code || "",
    city: "", // Not yet in database
    state: "", // Not yet in database
  };

  // 6. INITIALIZE OPENAI CLIENT
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // 7. BUILD AI PROMPTS
  const systemPrompt = LIFE_PLAN_SYSTEM_PROMPT;
  const userPrompt = buildLifePlanUserPrompt(answers, profileForPrompts);

  // 8. CALL OPENAI API
  try {
    console.log(`[Life Plan Regeneration] Starting for user ${userId}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Latest GPT-4o with structured outputs support
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Force JSON output
      temperature: 0.7,
      max_tokens: 8000, // Increased from 4000 to handle comprehensive plans
    });

    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      throw new Error("Empty response from AI");
    }

    // 9. PARSE AND VALIDATE AI RESPONSE
    let planJson: Partial<LifePlan>;
    try {
      planJson = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      throw new Error("Invalid JSON response from AI");
    }

    // Basic validation
    if (!planJson.overview || !planJson.timeframes || !planJson.domains) {
      console.error("Invalid Life Plan structure:", planJson);
      throw new Error("AI generated incomplete Life Plan structure");
    }

    // Add metadata to plan
    const completePlan: LifePlan = {
      ...planJson,
      plan_id: crypto.randomUUID(),
      user_id: userId,
      generated_at: new Date().toISOString(),
      model_version: "gpt-4o-2024-08-06",
    } as LifePlan;

    // 10. STORE IN DATABASE
    const versionId = crypto.randomUUID();

    const { error: versionError } = await supabase
      .from("life_plan_versions")
      .insert({
        id: versionId,
        user_id: userId,
        status: "succeeded",
        model: "gpt-4o-2024-08-06",
        prompt_version: "v1",
        source_answers: answers,
        plan_json: completePlan,
        tokens_used: completion.usage?.total_tokens || 0,
      });

    if (versionError) {
      console.error("Failed to save life_plan_version:", versionError);
      throw versionError;
    }

    // 11. UPDATE life_plans TABLE (current version pointer)
    const { data: existingPlan } = await supabase
      .from("life_plans")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingPlan) {
      const { error: insertError } = await supabase
        .from("life_plans")
        .insert({ user_id: userId, current_version_id: versionId });

      if (insertError) {
        console.error("Failed to create life_plan:", insertError);
        throw insertError;
      }
    } else {
      const { error: updateError } = await supabase
        .from("life_plans")
        .update({ current_version_id: versionId })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Failed to update life_plan:", updateError);
        throw updateError;
      }
    }

    // 12. EXTRACT AND SAVE DERIVED PROFILES
    try {
      await extractAndSaveProfiles(
        supabase,
        userId,
        versionId,
        completePlan,
        answers
      );
      console.log(
        `[Life Plan Regeneration] Profiles extracted for user ${userId}`
      );
    } catch (extractError) {
      console.error("Failed to extract profiles:", extractError);
      // Don't fail the whole generation if profile extraction fails
    }

    // 13. INCREMENT USAGE COUNTER (CRITICAL - TIER ENFORCEMENT)
    await incrementUsage(supabase, userId, "lifeplan_regen", {
      version_id: versionId,
      tokens_used: completion.usage?.total_tokens || 0,
      model: "gpt-4o-2024-08-06",
    });

    // 14. LOG GENERATION EVENT (audit trail)
    await supabase.from("plan_generation_events").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      event_type: "regeneration",
      tier_at_time: quotaCheck.tier,
      metadata: {
        source: "user_requested",
        version_id: versionId,
        tokens: completion.usage?.total_tokens || 0,
        model: "gpt-4o-2024-08-06",
        tier: quotaCheck.tier,
        usage_before: quotaCheck.used,
        usage_after: quotaCheck.used + 1,
        limit: quotaCheck.limit,
      },
    });

    console.log(
      `[Life Plan Regeneration] Success for user ${userId}, version ${versionId}`
    );

    // 15. RETURN SUCCESS RESPONSE
    return NextResponse.json(
      {
        status: "complete",
        version_id: versionId,
        plan_preview: {
          headline: completePlan.overview?.headline || "Your Life Plan",
          primary_goal: completePlan.overview?.primary_goal || "",
        },
        usage: {
          tier: quotaCheck.tier,
          used: quotaCheck.used + 1,
          limit: quotaCheck.limit,
          remaining: quotaCheck.remaining - 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Life Plan Regeneration] Error:", error);

    // Log failed generation for debugging
    await supabase.from("plan_generation_events").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      event_type: "regeneration_failed",
      tier_at_time: quotaCheck.tier,
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        error: "Failed to regenerate Life Plan. Please try again.",
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
