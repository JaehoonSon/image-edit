import { Link, router } from "expo-router";
import { Mail } from "lucide-react-native";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Card, CardHeader } from "~/components/ui/card";
import { BlockQuote, H1, Large, Muted, P } from "~/components/ui/typography";
import { appMetadata } from "~/config";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { showErrorToast } from "~/components/ui/toast";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/contexts/AuthProvider";

export default function Login() {
  const { signInApple } = useAuth();

  const handleLogin = async () => {
    try {
      await signInApple();
      // Don't manually navigate here!
      // Stack.Protected guards in _layout.tsx will automatically route based on:
      // - isAuthenticated && hasEntitlement → authenticated routes
      // - Otherwise → unauthenticated routes (paywall/onboarding)
      // 
      // After signInApple completes, the auth state updates, which triggers
      // a re-render of _layout.tsx and the guards handle navigation.
    } catch (err) {
      showErrorToast("Error logging in");
    }
  };
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 px-10 bg-background">
      <H1 className="text-center">Already have an account?</H1>

      <TouchableOpacity
        className="w-full"
        activeOpacity={0.5}
        onPress={handleLogin}
      >
        <Card className="w-full bg-secondary/30">
          <CardHeader className="flex flex-row gap-x-4">
            <AntDesign name="apple1" size={24} color="black" />
            <P className="text-xl font-semibold">Sign in with Apple</P>
          </CardHeader>
        </Card>
      </TouchableOpacity>

      <Muted className="text-center px-3 mb-2">
        By continuing, you agree to our{" "}
        <Link
          href={appMetadata.privacyPolicyUrl}
          className="underline text-primary"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href={appMetadata.endUserLicenseAgreementUrl}
          className="underline text-primary"
        >
          Terms and Conditions
        </Link>
      </Muted>
    </View>
  );
}
