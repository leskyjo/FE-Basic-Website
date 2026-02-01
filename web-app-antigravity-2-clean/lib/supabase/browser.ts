import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Automatically refresh tokens before they expire
      autoRefreshToken: true,
      // Persist session to localStorage
      persistSession: true,
      // Detect session from URL (for magic links, etc.)
      detectSessionInUrl: true,
      // Store session in cookies for SSR compatibility
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      // Flow type for auth
      flowType: 'pkce',
    },
    // Longer timeout for slow networks
    global: {
      headers: {
        'x-application-name': 'felon-entrepreneur',
      },
    },
  });
}
