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
    return NextResponse.json({ status: "queued" });
  }

  const { data: version, error: versionError } = await supabase
    .from("life_plan_versions")
    .select("status")
    .eq("id", lifePlan.current_version_id)
    .maybeSingle();

  if (versionError) {
    return NextResponse.json({ error: versionError.message }, { status: 500 });
  }

  if (!version) {
    return NextResponse.json({ status: "queued" });
  }

  if (version.status === "failed") {
    return NextResponse.json({ status: "error" });
  }

  if (version.status === "queued" || version.status === "processing") {
    return NextResponse.json({ status: version.status });
  }

  // For now we treat any non-error, non-queued status as complete.
  return NextResponse.json({ status: "complete" });
}
