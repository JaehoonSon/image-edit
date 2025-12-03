import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "~/lib/supabase";
import type { User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  useUser,
  useSuperwallEvents,
  SubscriptionStatus,
} from "expo-superwall";
import { posthog } from "~/lib/posthog";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // auth loading (Supabase)
  user: User | null;
  logout: () => Promise<void>;
  signInApple: () => Promise<void>;

  // Entitlements
  hasEntitlement: boolean;
  isEntitlementLoading: boolean;
  refreshEntitlements: () => Promise<void>;
  refresh: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Superwall hooks
  const {
    identify,
    signOut,
    subscriptionStatus,
    refresh,
    setSubscriptionStatus,
  } = useUser();

  // We can use local state to track entitlement if we want to react to events,
  // but subscriptionStatus from useUser is already reactive.
  // However, the user asked to use useSuperwallEvents.onSubscriptionStatusChange.
  // We can use that to log or trigger side effects, or update a local state if subscriptionStatus isn't enough.
  // But typically subscriptionStatus from useUser is the source of truth.
  // Let's rely on subscriptionStatus for the value, and use the event for logging/side-effects as requested.

  useSuperwallEvents({
    onLog: (log) => {
      console.log("Superwall log:", log);
    },
    onSubscriptionStatusChange: async (status) => {
      console.log("Superwall subscription status changed:", status);

      // If status changed to ACTIVE, payment was successful
      if (status.status === "ACTIVE") {
        try {
          posthog.capture("Payment successful");
        } catch (e) {
          console.error("Failed to capture posthog event:", e);
        }
        // Navigation is handled in the Paywall component via useEffect
      }

      // Ensure we have the latest data
      await refresh();
    },
  });

  const hasEntitlement = subscriptionStatus?.status === "ACTIVE";
  const isEntitlementLoading =
    subscriptionStatus?.status === "UNKNOWN" ||
    subscriptionStatus === undefined;

  // Debug: Log subscription status changes
  useEffect(() => {
    console.log("=== Subscription Status Changed ===");
    console.log("subscriptionStatus:", subscriptionStatus);
    console.log("hasEntitlement:", subscriptionStatus?.status === "ACTIVE");
  }, [subscriptionStatus]);

  // ----- Supabase session boot + listener -----
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Link/unlink Superwall identity whenever the app user changes
  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          console.log("Identifying with Superwall:", user.id);
          await identify(user.id);

          // Refresh to get latest subscription status from Superwall/Apple
          // refresh() is the proper way - it queries StoreKit and updates status
          const refreshedStatus = await refresh();
          console.log("Refreshed subscription status:", refreshedStatus);
          
          // After refresh, if status is still UNKNOWN, set to INACTIVE
          // This allows paywalls to show for users without subscriptions
          // 
          // Why this is safe:
          // - refresh() queries Apple's StoreKit for current entitlements
          // - If user has active subscription, refresh() will set status to ACTIVE
          // - If refresh() completes and status is still UNKNOWN, user has no subscription
          // - Setting INACTIVE allows paywalls to be presented
          if (refreshedStatus?.status === "UNKNOWN" || refreshedStatus === undefined) {
            console.log("Status still UNKNOWN after refresh, setting to INACTIVE");
            await setSubscriptionStatus({ status: "INACTIVE" });
          }
        }
      } catch (err) {
        console.warn("Superwall identify failed", err);
      }
    })();
  }, [user?.id, identify, refresh, setSubscriptionStatus]);

  // ----- Auth actions -----
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    await signOut();
    posthog.reset();
    if (error) throw error;
  };

  const signInApple = async () => {
    const cred = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!cred.identityToken) throw new Error("No identityToken.");

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: cred.identityToken,
    });
    if (error) throw error;
    const id = await data.user.id;
    posthog.identify(id, { email: data.user.email ?? "" });

    // Identify with Superwall and refresh to get latest subscription status
    // The useEffect will also run when user changes, but this ensures
    // immediate identification during the sign-in flow
    await identify(id);
    await refresh();
  };

  // ----- Memoized context value -----
  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated: !!user,
      isLoading,
      user,
      logout,
      signInApple,

      hasEntitlement,
      isEntitlementLoading,
      // Superwall handles refreshing automatically, but we can expose a no-op or actual refresh if available
      refreshEntitlements: async () => {
        try {
          await refresh();
        } catch (e) {
          console.warn("Failed to refresh Superwall user", e);
        }
      },
      refresh, // Expose refresh directly
    }),
    [
      user,
      isLoading,
      hasEntitlement,
      isEntitlementLoading,
      logout,
      signInApple,
      refresh, // Add refresh to dependency array
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
