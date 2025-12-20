import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { showErrorToast } from "~/components/ui/toast";
import { P } from "~/components/ui/typography";
import { useAuth } from "~/contexts/AuthProvider";
import { playHaptic } from "~/lib/hapticSound";
import { posthog } from "~/lib/posthog";
import { ImageBackground } from "expo-image";
import GradientText from "~/components/GradientText";
import { usePlacement, useUser } from "expo-superwall";

const FEATURES = [
  {
    icon: "📸",
    title: "Ten Enhanced Photos",
    desc: "Upload one picture and receive 10 pro edits.",
  },
  {
    icon: "🔄",
    title: "Unlimited Remakes",
    desc: "Regenerate your favorite edits as often as you like.",
  },
  {
    icon: "🎨",
    title: "Custom Filter Library",
    desc: "Explore curated filters tailored to your style.",
  },
  {
    icon: "🚀",
    title: "HD Export & Share",
    desc: "Get high-quality photos and post them immediately.",
  },
];

export default function Paywall() {
  const { refresh } = useUser();

  const { registerPlacement, state } = usePlacement({
    onError: (err: any) => console.error("Placement Error:", err),
    onPresent: (info: any) => console.log("Paywall Presented:", info),
    onDismiss: async (info: any, result: any) => {
      console.log("Paywall Dismissed:", info, "Result:", result);

      // Refresh subscription status after paywall closes
      // This will update hasEntitlement in AuthProvider, which triggers routing
      await refresh();
    },
    onSkip: (reason: any) => {
      console.log("Paywall Skipped:", reason);
    },
  });

  const { refreshEntitlements, hasEntitlement } = useAuth();

  useEffect(() => {
    (async () => {
      console.log("Triggering campaign");
      await registerPlacement({
        placement: "showpaywall",
      });
    })();
  }, [registerPlacement]);

  //   const clicked_continue = async () => {
  //     try {
  //       playHaptic("soft");
  //       setPurchasing(true);

  //       const selectedPkg = availablePlans.find((p) => p.key === plan)?.pkg;

  //       if (!selectedPkg) {
  //         showErrorToast("No package available. Try again later.");
  //         return;
  //       }

  //       const purchaseResult = await Purchases.purchasePackage(selectedPkg);

  //       const active = purchaseResult?.customerInfo?.entitlements?.active;
  //       if (!active || !Object.keys(active).length) {
  //         throw new Error("No active entitlement after purchase");
  //       }

  //       await refreshEntitlements();
  //       try {
  //         posthog.capture("Payment successful", { plan });
  //       } catch {}

  //       playHaptic("success");
  //       router.replace("/(authenticated)");
  //     } catch (err: any) {
  //       console.log("purchase error", err?.message ?? err);
  //       showErrorToast("Error purchasing");
  //     } finally {
  //       setPurchasing(false);
  //     }
  //   };

  //   const handle_restore_purchase = async () => {
  //     try {
  //       playHaptic("soft");
  //       const info = await Purchases.restorePurchases();
  //       if (info?.entitlements?.active?.Pro) {
  //         Alert.alert("Purchase Restored", "Your Pro access has been restored.");
  //       } else {
  //         Alert.alert(
  //           "No Purchase Found",
  //           "We couldn't find an active Pro subscription."
  //         );
  //       }
  //     } catch (error) {
  //       Alert.alert(
  //         "Restore Failed",
  //         "An error occurred while restoring your purchase."
  //       );
  //       console.error(error);
  //     }
  //   };

  useEffect(() => {
    try {
      posthog.capture("Reached Paywall");
    } catch (err) {
      console.error(err);
    }
  }, []);

  // For dismissed state, immediately re-trigger the paywall
  if (state.status === "dismissed") {
    setTimeout(() => {
      registerPlacement({
        placement: "showpaywall",
      });
    }, 100);
  }

  // For skipped state, try again after a brief delay
  if (state.status === "skipped") {
    setTimeout(() => {
      registerPlacement({
        placement: "showpaywall",
      });
    }, 500);
  }

  // Only show fallback UI for errors
  if (state.status === "error") {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <P className="text-white text-center mb-8 text-lg">
          We couldn't load the special offers right now.
        </P>

        <Button
          onPress={async () => {
            await registerPlacement({
              placement: "showpaywall",
            });
          }}
          className="w-full mb-4"
        >
          <Text>Try Again</Text>
        </Button>

        <TouchableOpacity
          onPress={async () => {
            try {
              await refreshEntitlements();
              Alert.alert(
                "Status Refreshed",
                "Please try unlocking again if needed."
              );
            } catch (e) {
              Alert.alert("Error", "Failed to refresh status.");
            }
          }}
        >
          <P className="text-gray-400 text-center">
            Restore Purchases / Refresh Status
          </P>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // For all other states (idle, presented, dismissed, skipped), show nothing
  // The native paywall will cover the screen when presented
  return <View style={{ flex: 1, backgroundColor: "#000" }} />;
}
