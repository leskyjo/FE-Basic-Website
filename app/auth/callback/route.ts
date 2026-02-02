import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("Auth callback: No code provided");
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // After successful email verification, redirect to welcome page
    return NextResponse.redirect(`${origin}/welcome`);
  } catch (err) {
    console.error("Auth callback exception:", err);
    // Return a proper error page instead of crashing
    return new NextResponse(
      `<html><body style="background:#1a1a1a;color:#fff;font-family:sans-serif;padding:40px;">
        <h1>Authentication Error</h1>
        <p>Something went wrong during verification. Please try signing up again.</p>
        <a href="/signup" style="color:#ef4444;">Return to Sign Up</a>
      </body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
