import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

const { data: lifePlan, error: lifePlanError } = await supabase
    .from("life_plans")
    .select("current_version_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (lifePlanError) {
    return NextResponse.json({ error: lifePlanError.message }, { status: 500 });
  }

  if (!lifePlan || !lifePlan.current_version_id) {
    return NextResponse.json({ status: "none" });
  }

  const { data: version, error: versionError } = await supabase
    .from("life_plan_versions")
    .select("status, plan_json")
    .eq("id", lifePlan.current_version_id)
    .maybeSingle();

  if (versionError) {
    return NextResponse.json({ error: versionError.message }, { status: 500 });
  }

  if (!version) {
    return NextResponse.json({ status: "queued" });
  }

  const rawStatus = (version.status ?? "").toLowerCase();
  let status: "queued" | "processing" | "complete" | "error";

  if (rawStatus === "failed") {
    status = "error";
  } else if (rawStatus === "queued" || rawStatus === "processing") {
    status = rawStatus as "queued" | "processing";
  } else {
    status = "complete";
  }

  const planJson = (version.plan_json ?? {}) as {
    plan_title?: string;
    overview?: { summary?: string };
  };

  return NextResponse.json({
    status,
    title: planJson.plan_title ?? "Your Life Goal Plan",
    summary:
      planJson.overview?.summary ??
      "Your Life Plan is ready. You can review it and keep improving it over time.",
  });
}
