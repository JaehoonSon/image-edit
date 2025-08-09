import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { supabase } from "~/lib/supabase";
import type { User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import Purchases, { LOG_LEVEL, CustomerInfo } from "react-native-purchases";

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

  // Optional: expose full RC info if you ever need billing dates, etc.
  customerInfo: CustomerInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO: set this to your RevenueCat entitlement identifier
const ENTITLEMENT_ID = "Pro";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // RevenueCat state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isEntitlementLoading, setIsEntitlementLoading] = useState(true);

  const hasEntitlement = !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

  // ----- RevenueCat configure + listener -----
  useEffect(() => {
    // Configure once on app mount
    // Purchases.setLogLevel(LOG_LEVEL.DEBUG); // or DEBUG during development
    // Purchases.configure({
    //   apiKey: "appl_JsYQxXXawrBgZjjxoWIGnSZZXUP",
    // });

    // Initial fetch for anonymous/boot state
    (async () => {
      await refreshEntitlements();
    })();

    // Keep in sync on any purchase/restore/cancellation
    const onUpdate = (info: CustomerInfo) => {
      setCustomerInfo(info);
      setIsEntitlementLoading(false);
    };
    // Some versions return an unsubscribe function; others require explicit remove.
    const maybeUnsubscribe = Purchases.addCustomerInfoUpdateListener(
      onUpdate
    ) as (() => void) | void;

    return () => {
      if (typeof maybeUnsubscribe === "function") {
        maybeUnsubscribe();
      }
      // If your version exposes a remove API, you could instead:
      // Purchases.removeCustomerInfoUpdateListener?.(onUpdate);
    };
  }, []);

  // Helper to fetch current entitlements on demand
  const refreshEntitlements = useCallback(async () => {
    try {
      setIsEntitlementLoading(true);
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      console.warn("Failed to fetch RevenueCat customer info", err);
    } finally {
      setIsEntitlementLoading(false);
    }
  }, []);

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

  // Link/unlink RevenueCat identity whenever the app user changes
  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          console.log("Logging in");
          await Purchases.logIn(user.id);
        } else {
        }
      } catch (err) {
        console.warn("RevenueCat logIn/logOut failed", err);
      } finally {
        // Always refresh after identity change
        await refreshEntitlements();
      }
    })();
  }, [user?.id, refreshEntitlements]);

  useEffect(() => {
    const id = setInterval(() => {
      // console.log("--AUTH--", user, customerInfo, hasEntitlement);
      // console.log("--AUTH--");
      // console.log("Has user, ", !!user);
      // console.log("Customer info", customerInfo);
      // console.log("hasEntitlement", hasEntitlement);
    }, 5000);
    return () => clearInterval(id);
  }, [user, customerInfo, hasEntitlement]);

  // ----- Auth actions -----
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    await Purchases.logOut();
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
    await Purchases.logIn(id);
    await refreshEntitlements();

    // RC identity will be linked by the user effect above
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
      refreshEntitlements,

      customerInfo,
    }),
    [
      user,
      isLoading,
      hasEntitlement,
      isEntitlementLoading,
      customerInfo,
      logout,
      signInApple,
      refreshEntitlements,
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
