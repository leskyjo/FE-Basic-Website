"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/browser";

type Profile = {
  email?: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  hydrated: boolean;
  profile: Profile;
  signOut: () => Promise<void>;
};

const defaultProfile: Profile = {};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        const nextSession = data.session ?? null;

        if (nextSession?.user) {
          const { data: userData, error } = await supabase.auth.getUser();
          if (error || !userData.user) {
            await supabase.auth.signOut();
            if (!isMounted) return;
            setSession(null);
            setProfile(defaultProfile);
            setHydrated(true);
            return;
          }
          setSession(nextSession);
          setProfile({ email: userData.user.email });
        } else {
          setSession(null);
          setProfile(defaultProfile);
        }

        if (!isMounted) return;
        setHydrated(true);
      } catch (error) {
        console.warn('Session restoration failed:', error);
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore signOut errors
        }
        if (!isMounted) return;
        setSession(null);
        setProfile(defaultProfile);
        setHydrated(true);
      }
    };

    void initialize();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);

      if (!nextSession?.user) {
        setProfile(defaultProfile);
        return;
      }

      setProfile({ email: nextSession.user.email });
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(defaultProfile);
  }, [supabase]);

  const value: AuthContextValue = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoggedIn: Boolean(session),
      hydrated,
      profile,
      signOut,
    }),
    [session, hydrated, profile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
