import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { checkSubscription } from "~/lib/payment";
import { supabase } from "~/lib/supabase";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            if (!credential.identityToken) throw new Error("No identityToken.");
            const {
              error,
              data: { user },
            } = await supabase.auth.signInWithIdToken({
              provider: "apple",
              token: credential.identityToken,
            });
            if (error) throw error;
            const checkAccess = await checkSubscription();
            // if (checkAccess) router.replace("/(authenticated)");
            // else {
            //   router.replace("/(unauthenticated)/onboarding/onboarding");
            // }
          } catch (e) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});
