import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";
import {
  LIFE_PLAN_SYSTEM_PROMPT,
  buildLifePlanUserPrompt,
} from "@/lib/ai/life-plan-prompts";
import { extractAndSaveProfiles } from "@/lib/ai/extract-profiles";
import type { LifePlan } from "@/lib/types/life-plan";

type QuestionnaireAnswerRow = {
  question_id: string;
  group_id: string;
  answer_value: unknown;
};

/**
 * POST /api/life-plan/generate
 *
 * Generates a personalized Life Plan using OpenAI GPT-4 based on
 * the user's questionnaire answers.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Load questionnaire answers
 * 3. Call OpenAI to generate Life Plan
 * 4. Save Life Plan to database
 * 5. Extract and save derived profiles (jobs, learning, wellness, financial)
 * 6. Extract and save next actions
 * 7. Update onboarding step
 *
 * Security:
 * - Server-side only (API key never exposed to client)
 * - Requires authentication
 * - Logs all generations for audit
 */
export async function POST() {
  const startTime = Date.now();
  console.log("[Life Plan Generation] ========== POST request received ==========");
  console.log("[Life Plan Generation] Timestamp:", new Date().toISOString());

  try {
    const supabase = createClient();

    // 1. AUTHENTICATE
    console.log("[Life Plan Generation] Step 1: Authenticating...");
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("[Life Plan Generation] Auth error:", authError);
      return NextResponse.json({ error: "Authentication failed", details: authError.message }, { status: 401 });
    }

    if (!userData.user) {
      console.log("[Life Plan Generation] No user data - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;
    console.log("[Life Plan Generation] User ID:", userId);

    // 2. CHECK FOR CONCURRENT GENERATION (Prevent duplicates)
    // Look for any version created in the last 2 minutes (typical generation time)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: recentVersion } = await supabase
      .from("life_plan_versions")
      .select("id, created_at, status")
      .eq("user_id", userId)
      .gte("created_at", twoMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentVersion) {
      console.log("[Life Plan Generation] Recent generation detected, returning existing version:", recentVersion.id);
      // Return success with existing version to prevent duplicate
      return NextResponse.json(
        {
          status: "complete",
          version_id: recentVersion.id,
          message: "Using recently generated plan",
        },
        { status: 200 }
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
    console.log("[Life Plan Generation] OpenAI API key verified");

    // 3. CHECK IF THIS IS INITIAL GENERATION OR REGENERATION
    const { data: existingPlanCheck } = await supabase
      .from("life_plans")
      .select("user_id, current_version_id")
      .eq("user_id", userId)
      .maybeSingle();

    const isInitialGeneration = !existingPlanCheck;

    console.log("[Life Plan Generation] Generation type:",
      isInitialGeneration ? "INITIAL (always allowed)" : "REGENERATION (tier-limited)"
    );

    // 4. IF REGENERATION, CHECK TIER LIMITS
    if (!isInitialGeneration) {
      // Load user's tier
      const { data: tierProfile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("user_id", userId)
        .single();

      const userTier = tierProfile?.tier || "starter";

      // Check if tier allows regeneration
      if (userTier === "starter") {
        return NextResponse.json(
          {
            error: "QUOTA_EXCEEDED",
            message: "Free tier does not include Life Plan regenerations. Please upgrade to Plus or purchase a one-time regeneration for $2.99.",
            upgradeUrl: "/pricing",
            purchaseUrl: "/api/purchase/lifeplan-regen"
          },
          { status: 403 }
        );
      }

      // For Trial/Plus/Pro, check usage limits
      // TODO: Implement usage period checking when usage tracking is fully implemented
      // For now, allow regeneration for Trial/Plus/Pro users
      console.log(`[Life Plan Generation] Tier ${userTier} - regeneration allowed`);
    }

    // 5. LOAD USER PROFILE (for personalization)
    console.log("[Life Plan Generation] Loading user profile...");
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("preferred_name, zip_code")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("[Life Plan Generation] Profile error:", profileError);
      return NextResponse.json(
        { error: "User profile not found", details: profileError.message },
        { status: 500 }
      );
    }

    if (!userProfile) {
      console.error("[Life Plan Generation] No profile data returned");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 500 }
      );
    }

    console.log("[Life Plan Generation] Profile loaded:", {
      preferred_name: userProfile.preferred_name,
      has_zip: !!userProfile.zip_code,
    });

    // City/state columns don't exist yet - AI prompts will use zip_code and handle missing data
    const profileForPrompts = {
      preferred_name: userProfile.preferred_name || "there",
      zip_code: userProfile.zip_code || "",
      city: "", // Not yet in database
      state: "", // Not yet in database
    };
    console.log("[Life Plan Generation] Profile prepared for prompts");

    // 6. LOAD PATH QUESTIONNAIRE ANSWERS
    const { data: pathAnswers, error: answersError } = await supabase
      .from("path_questionnaire_answers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (answersError) {
      console.error("[Life Plan Generation] Error loading questionnaire:", answersError);
      return NextResponse.json({ error: answersError.message }, { status: 500 });
    }

    if (!pathAnswers) {
      console.log("[Life Plan Generation] No questionnaire answers found");
      return NextResponse.json(
        {
          error:
            "Questionnaire not complete. Please complete all questions first.",
        },
        { status: 400 }
      );
    }

    // Convert path questionnaire to format expected by AI prompts
    // The new structure has path-specific fields instead of generic question_id/answer_value pairs
    const answers: Record<string, any> = {
      path: pathAnswers.path,
    };

    // Add entrepreneur or professional specific answers
    if (pathAnswers.path === "entrepreneur") {
      answers.business_stage = pathAnswers.business_stage;
      answers.business_story = pathAnswers.business_story;
      answers.entrepreneur_challenge = pathAnswers.entrepreneur_challenge;
    } else if (pathAnswers.path === "professional") {
      answers.employment_status = pathAnswers.employment_status;
      answers.interests_skills = pathAnswers.interests_skills;
      answers.work_concern = pathAnswers.work_concern;
    }

    console.log("[Life Plan Generation] Questionnaire loaded:", {
      path: pathAnswers.path,
      hasAnswers: true,
    });

    // 7. INITIALIZE OPENAI CLIENT
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 8. BUILD AI PROMPTS
    const systemPrompt = LIFE_PLAN_SYSTEM_PROMPT;
    const userPrompt = buildLifePlanUserPrompt(answers, profileForPrompts);

    // 9. CALL OPENAI API
    console.log(`[Life Plan Generation] Step 9: Calling OpenAI API for user ${userId}...`);
    console.log(`[Life Plan Generation] Model: gpt-4o-2024-08-06`);
    console.log(`[Life Plan Generation] Prompt length: ${userPrompt.length} characters`);

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

    console.log(`[Life Plan Generation] OpenAI call completed successfully`);
    console.log(`[Life Plan Generation] Tokens used: ${completion.usage?.total_tokens || 0}`);

    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      throw new Error("Empty response from AI");
    }

    // 10. PARSE AND VALIDATE AI RESPONSE
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

    // 11. STORE IN DATABASE
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

    // 12. UPDATE life_plans TABLE (current version pointer)
    // Use upsert to handle race conditions where multiple requests might try to create the same record
    const { error: upsertError } = await supabase
      .from("life_plans")
      .upsert(
        { user_id: userId, current_version_id: versionId },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Failed to upsert life_plan:", upsertError);
      throw upsertError;
    }

    // 13. EXTRACT AND SAVE DERIVED PROFILES
    // This populates: user_jobs_profiles, user_learning_profiles,
    // user_wellness_profiles, user_financial_profiles, user_next_actions
    try {
      await extractAndSaveProfiles(
        supabase,
        userId,
        versionId,
        completePlan,
        answers
      );
      console.log(`[Life Plan Generation] Profiles extracted for user ${userId}`);
    } catch (extractError) {
      console.error("Failed to extract profiles:", extractError);
      // Don't fail the whole generation if profile extraction fails
      // The Life Plan is still saved, profiles can be re-extracted later
    }

    // 14. LOG GENERATION EVENT (audit trail)
    const { data: tierProfileForLog } = await supabase
      .from("profiles")
      .select("tier")
      .eq("user_id", userId)
      .single();

    await supabase.from("plan_generation_events").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      event_type: isInitialGeneration ? "initial_generation" : "regeneration",
      tier_at_time: tierProfileForLog?.tier || "starter",
      metadata: {
        source: isInitialGeneration ? "onboarding" : "app_regeneration",
        version_id: versionId,
        tokens: completion.usage?.total_tokens || 0,
        model: "gpt-4o-2024-08-06",
      },
    });

    // 15. UPDATE ONBOARDING STEP (only if this is initial generation)
    if (isInitialGeneration) {
      await supabase
        .from("profiles")
        .update({ onboarding_step: 5 })
        .eq("user_id", userId);
    }

    console.log(
      `[Life Plan Generation] Success for user ${userId}, version ${versionId}`
    );

    // 16. RETURN SUCCESS RESPONSE
    return NextResponse.json(
      {
        status: "complete",
        version_id: versionId,
        plan_preview: {
          headline: completePlan.overview?.headline || "Your Life Plan",
          primary_goal: completePlan.overview?.primary_goal || "",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const duration = Date.now() - startTime;

    console.error("[Life Plan Generation] ========== FATAL ERROR ==========");
    console.error("[Life Plan Generation] Error:", errorMessage);
    console.error("[Life Plan Generation] Stack:", errorStack);
    console.error("[Life Plan Generation] Duration:", duration, "ms");
    console.error("[Life Plan Generation] ==========================================");

    return NextResponse.json(
      {
        error: "Failed to generate Life Plan. Please try again.",
        message: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? { message: errorMessage, stack: errorStack, duration }
            : undefined,
      },
      { status: 500 }
    );
  }
}
