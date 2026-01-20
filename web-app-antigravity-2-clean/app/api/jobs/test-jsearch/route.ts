import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * JSearch API Test Endpoint
 *
 * Purpose: Verify JSearch API credentials are working correctly
 * This endpoint makes a simple test call to JSearch API
 *
 * Auth: Requires authenticated user (admin check recommended in production)
 */
export async function GET() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check environment variables
  const apiKey = process.env.JSEARCH_API_KEY;
  const apiHost = process.env.JSEARCH_API_HOST;

  if (!apiKey || !apiHost) {
    return NextResponse.json(
      {
        error: "JSearch API credentials not configured",
        details: "Missing JSEARCH_API_KEY or JSEARCH_API_HOST environment variables"
      },
      { status: 500 }
    );
  }

  try {
    // Test with a simple job-details endpoint call
    // Using a known test job ID from JSearch documentation
    const testJobId = "gcnkkB1_QjIlxbV9AAAAAA%3D%3D";
    const url = `https://${apiHost}/job-details?job_id=${testJobId}&country=us`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": apiHost,
        "x-rapidapi-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "JSearch API request failed",
          status: response.status,
          statusText: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "JSearch API connection successful",
      testJobId,
      sampleData: {
        hasData: !!data.data,
        jobTitle: data.data?.[0]?.job_title || "N/A",
        employer: data.data?.[0]?.employer_name || "N/A",
      },
      rawResponse: data, // Full response for debugging
    });

  } catch (error) {
    console.error("JSearch API test failed:", error);
    return NextResponse.json(
      {
        error: "JSearch API test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
