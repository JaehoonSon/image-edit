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
import GradientText from "~/components/GradientText";

export default function SignUp() {
  const { signInApple } = useAuth();
  const handleLogin = async () => {
    try {
      await signInApple();
      router.replace("/onboarding/onboarding");
    } catch (err) {
      showErrorToast("Error Signing in");
    }
  };
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 px-10 bg-background">
      {/* <H1 className="text-center">Let's Start</H1> */}
      <GradientText text="Let's Start" fontSize={50}></GradientText>

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
