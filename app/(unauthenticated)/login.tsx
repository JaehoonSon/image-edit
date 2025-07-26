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

export default function Login() {
  const handleSignIn = async () => {
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("credentials: ", cred);

      if (!cred.identityToken) throw new Error("No identityToken.");

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: cred.identityToken,
      });

      if (error) throw error;
    } catch (e: any) {
      console.log("Error signing in: ", e);
      showErrorToast("Something went wrong signing in");
      router.push("/(unauthenticated)/onboarding/onboarding");
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 px-10 bg-secondary/30">
      <H1 className="text-center">Already have an account?</H1>

      <TouchableOpacity
        className="w-full"
        activeOpacity={0.5}
        onPress={handleSignIn}
      >
        <Card className="w-full bg-secondary/30">
          <CardHeader className="flex flex-row gap-x-4">
            <AntDesign name="apple1" size={24} color="black" />
            <P className="text-xl font-semibold">Sign in with Apple</P>
          </CardHeader>
        </Card>
      </TouchableOpacity>

      {/* 
      <Card className="w-full bg-secondary/30">
        <CardHeader className="flex flex-row gap-x-4">
          <FontAwesome name="google" size={24} color="black" />
          <P className="text-xl font-semibold">Sign in with Google</P>
        </CardHeader>
      </Card> */}

      {/* <Card className="w-full bg-secondary/30">
        <CardHeader className="flex flex-row gap-x-4">
          <Mail size={24} color="black" />
          <P className="text-xl font-semibold">Sign in with Email</P>
        </CardHeader>
      </Card> */}

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
