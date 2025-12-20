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
import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
} from "react-native-purchases";
import { posthog } from "~/lib/posthog";
import { ImageBackground } from "expo-image";
import GradientText from "~/components/GradientText";

type PlanKey = "weekly" | "monthly";

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
  const [plan, setPlan] = useState<PlanKey | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [packages, setPackages] = useState<{
    weekly?: PurchasesPackage;
    monthly?: PurchasesPackage;
  }>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { refreshEntitlements } = useAuth();

  // Load offerings and map to weekly/monthly
  useEffect(() => {
    (async () => {
      try {
        setLoadingPrices(true);
        const res = await Purchases.getOfferings();

        console.log("RC getOfferings():", JSON.stringify(res, null, 2));

        const target = res.current ?? null;
        setOffering(target);

        const avail = target?.availablePackages ?? [];

        const monthly =
          target?.monthly ??
          avail.find((p) => p.packageType === "MONTHLY") ??
          avail.find((p) => /month/i.test(p.identifier));

        const weekly =
          target?.weekly ??
          avail.find((p) => p.packageType === "WEEKLY") ??
          avail.find((p) => /week/i.test(p.identifier));

        setPackages({ weekly, monthly });

        // Set initial plan to monthly if available, else weekly
        setPlan(monthly ? "monthly" : weekly ? "weekly" : null);
      } catch (e) {
        console.log("offerings fetch failed", e);
      } finally {
        setLoadingPrices(false);
      }
    })();
  }, []);

  // Get available plans dynamically based on fetched packages
  const availablePlans = useMemo(() => {
    const plans: {
      key: PlanKey;
      label: string;
      price: string | undefined;
      pkg: PurchasesPackage;
    }[] = [];
    if (packages.monthly) {
      plans.push({
        key: "monthly",
        label: "Monthly",
        price: packages.monthly.product.priceString,
        pkg: packages.monthly,
      });
    }
    if (packages.weekly) {
      plans.push({
        key: "weekly",
        label: "Weekly",
        price: packages.weekly.product.priceString,
        pkg: packages.weekly,
      });
    }
    return plans;
  }, [packages]);

  const clicked_continue = async () => {
    try {
      playHaptic("soft");
      setPurchasing(true);

      const selectedPkg = availablePlans.find((p) => p.key === plan)?.pkg;

      if (!selectedPkg) {
        showErrorToast("No package available. Try again later.");
        return;
      }

      const purchaseResult = await Purchases.purchasePackage(selectedPkg);

      const active = purchaseResult?.customerInfo?.entitlements?.active;
      if (!active || !Object.keys(active).length) {
        throw new Error("No active entitlement after purchase");
      }

      await refreshEntitlements();
      try {
        posthog.capture("Payment successful", { plan });
      } catch {}

      playHaptic("success");
      router.replace("/(authenticated)");
    } catch (err: any) {
      console.log("purchase error", err?.message ?? err);
      showErrorToast("Error purchasing");
    } finally {
      setPurchasing(false);
    }
  };

  const handle_restore_purchase = async () => {
    try {
      playHaptic("soft");
      const info = await Purchases.restorePurchases();
      if (info?.entitlements?.active?.Pro) {
        Alert.alert("Purchase Restored", "Your Pro access has been restored.");
      } else {
        Alert.alert(
          "No Purchase Found",
          "We couldn't find an active Pro subscription."
        );
      }
    } catch (error) {
      Alert.alert(
        "Restore Failed",
        "An error occurred while restoring your purchase."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      posthog.capture("Reached Paywall");
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (!loadingPrices && availablePlans.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>No plans available. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("~/assets/images/mesh_background.png")}
      resizeMode="cover"
      imageStyle={{
        opacity: 0.3,
        transform: [{ rotate: "-6deg" }, { scale: 1.2 }],
      }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 text-foreground px-4">
        <ScrollView className="flex-1">
          <View className="w-full mb-auto">
            <View className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-2">
              <Image
                source={require("~/assets/images/splash-transparent.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="items-center mb-4">
              <GradientText text="Reveal Your True Glow" />
              <P className="mt-1 text-lg">
                Upgrade to unlock every pro filter and tool
              </P>
            </View>

            <View>
              {FEATURES.map(({ title, desc }, idx) => (
                <View
                  key={idx}
                  className="flex-row p-4 rounded-lg items-center"
                >
                  <View className="w-8 h-8 rounded-full bg-secondary p-1 items-center justify-center mr-3">
                    <Check />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-card-foreground text-lg">
                      {title}
                    </Text>
                    <P className="mt-1 text-base text-muted-foreground">
                      {desc}
                    </P>
                  </View>
                </View>
              ))}
            </View>

            {availablePlans.length > 0 && (
              <View className="flex-row justify-center space-x-4 mt-6 mb-6 gap-x-4">
                {availablePlans.map(({ key, label, price }) => {
                  const selected = plan === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setPlan(key)}
                      disabled={loadingPrices}
                      className={`flex-1 rounded-xl p-3 items-center border border-border shadow-sm shadow-foreground/1 ${
                        selected
                          ? "bg-primary border-primary"
                          : "bg-muted border-border"
                      } ${loadingPrices ? "opacity-70" : ""}`}
                    >
                      <Text
                        className={`text-lg font-semibold ${
                          selected
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {label}
                      </Text>
                      <Text
                        className={`mt-1 text-base font-medium ${
                          selected
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {loadingPrices ? "Loading…" : price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Button
              className="w-full rounded-full bg-primary"
              size="lg"
              onPress={clicked_continue}
              disabled={
                purchasing ||
                loadingPrices ||
                !plan ||
                !availablePlans.find((p) => p.key === plan)
              }
            >
              {purchasing ? (
                <ActivityIndicator />
              ) : (
                <Text className="font-semibold text-primary-foreground">
                  Continue
                </Text>
              )}
            </Button>

            <TouchableOpacity
              className="mt-3"
              onPress={handle_restore_purchase}
            >
              <Text className="text-center text-muted-foreground text-sm">
                Restore Purchase
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center space-x-4 mt-4">
              <View className="flex-row items-center">
                <Text className="text-green-500 mr-1 text-sm">✓</Text>
                <Text className="text-xs text-muted-foreground">
                  Cancel anytime
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-green-500 mr-1 text-sm">✓</Text>
                <Text className="text-xs text-muted-foreground">
                  Auto-renew subscription
                </Text>
              </View>
            </View>

            {!!offering?.identifier && (
              <Text className="text-center text-muted-foreground text-xs mt-4">
                Offering: {offering.identifier}
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
