"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/browser";
import { getOrCreateProfile } from "@/lib/profiles";

type Profile = {
  name?: string;
  zip?: string;
  onboardingStep?: number;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  hydrated: boolean;
  profile: Profile;
  updateProfile: (data: Partial<Profile>) => void;
  resetProfile: () => void;
  reloadProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultProfile: Profile = {};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const supabase = useMemo(() => createClient(), []);
  const lastUserIdRef = useRef<string | null>(null);
  const loadingProfileRef = useRef(false);

  const loadProfile = useCallback(
    async (user: User | null) => {
      if (!user) {
        lastUserIdRef.current = null;
        setProfile(defaultProfile);
        return;
      }

      if (loadingProfileRef.current) return;
      if (lastUserIdRef.current === user.id) return;

      try {
        loadingProfileRef.current = true;
        const profileRow = await getOrCreateProfile(supabase, user);
        setProfile({
          name: profileRow.preferred_name ?? "",
          zip: profileRow.zip_code ?? "",
          onboardingStep: profileRow.onboarding_step ?? 0,
        });
        lastUserIdRef.current = user.id;
      } catch {
        setProfile(defaultProfile);
      } finally {
        loadingProfileRef.current = false;
      }
    },
    [supabase],
  );

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
            // Invalid/expired session - clear it
            await supabase.auth.signOut();
            if (!isMounted) return;
            setSession(null);
            setProfile(defaultProfile);
            setHydrated(true);
            return;
          }
          setSession(nextSession);
          await loadProfile(userData.user);
        } else {
          setSession(null);
          setProfile(defaultProfile);
        }

        if (!isMounted) return;
        setHydrated(true);
      } catch (error) {
        // Handle corrupted session data
        console.warn('Session restoration failed, clearing auth state:', error);
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
        lastUserIdRef.current = null;
        setProfile(defaultProfile);
        return;
      }

      void loadProfile(nextSession.user);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile, supabase]);

  useEffect(() => {
    if (profile.onboardingStep === undefined) return;
    if (profile.onboardingStep < 4) return;
    try {
      localStorage.setItem("fe_onboarding_done", "1");
      localStorage.setItem("fe_onboarding_done_at", String(Date.now()));
    } catch {
      // Ignore storage errors (privacy mode / denied access).
    }
  }, [profile.onboardingStep]);

  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      if (!session?.user) return;
      const updates: Record<string, string> = {};
      if (data.name !== undefined) {
        updates.preferred_name = data.name;
      }
      if (data.zip !== undefined) {
        updates.zip_code = data.zip;
      }
      if (!Object.keys(updates).length) return;

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", session.user.id);

      if (!error) {
        setProfile((prev) => ({
          ...prev,
          ...data,
        }));
      }
    },
    [session, supabase],
  );

  const resetProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(defaultProfile);
      return;
    }
    await supabase
      .from("profiles")
      .update({ onboarding_step: 0 })
      .eq("user_id", session.user.id);
    setProfile((prev) => ({
      ...prev,
      onboardingStep: 0,
    }));
  }, [session, supabase]);

  const reloadProfile = useCallback(async () => {
    if (!session?.user) return;
    lastUserIdRef.current = null;
    await loadProfile(session.user);
  }, [session, loadProfile]);

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
      updateProfile,
      resetProfile,
      reloadProfile,
      signOut,
    }),
    [session, hydrated, profile, updateProfile, resetProfile, reloadProfile, signOut],
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
