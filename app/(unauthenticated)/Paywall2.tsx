import { router } from "expo-router";
import { CheckCheck, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { showErrorToast } from "~/components/ui/toast";
import { H1, H3, P } from "~/components/ui/typography";
import { useAuth } from "~/contexts/AuthProvider";
import { playHaptic } from "~/lib/hapticSound";
import { makePayment } from "~/lib/payment";
import Purchases from "react-native-purchases";
import { posthog } from "~/lib/posthog";

const PLANS = [
  { key: "weekly", label: "Weekly", price: "$4.99/mo" },
  { key: "monthly", label: "Monthly", price: "$7.99/mo" },
];

// const FEATURES = [
//   {
//     icon: "🚀",
//     title: "Access to broadcast",
//     desc: "All premium articles & videos",
//   },
//   {
//     icon: "📊",
//     title: "Advanced Analytics",
//     desc: "In-depth performance metrics",
//   },
//   { icon: "⚡", title: "Priority Support", desc: "24/7 customer service" },
//   {
//     icon: "✨",
//     title: "Exclusive Tools",
//     desc: "Early access to new features",
//   },
// ];
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

const PRODUCT_IDS = ["subscription_monthly_1", "subscription_weekly_1"];

export default function Paywall() {
  const [plan, setPlan] = useState("weekly");
  const { refreshEntitlements } = useAuth();

  const select_plan = async () => {
    // await makePayment("postureai.theblucks.com_weekly");
    // console.log(plan);
  };

  const clicked_continue = async () => {
    try {
      // if (plan == "weekly") makePayment("subscription_weekly_1");
      // else makePayment("subscription_monthly_1");
      const product_id =
        plan == "weekly" ? "subscription_weekly_1" : "subscription_monthly_1";
      const info = await makePayment(product_id);
      if (!info) throw "Error purchasing";
      await refreshEntitlements();
      try {
        posthog.capture("Payment successful");
      } catch (e) {}
      playHaptic("success");

      router.replace("/(authenticated)");
    } catch (err) {
      showErrorToast("Error purchasing");
    }
  };

  const handle_restore_purchase = async () => {
    try {
      playHaptic("soft");
      const info = await Purchases.restorePurchases();
      console.log(info);

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
    (async () => {
      await select_plan();
    })();
  }, [plan]);

  useEffect(() => {
    try {
      posthog.capture("Reached Paywall");
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background text-foreground px-4">
      <ScrollView className="flex-1">
        {/* Header */}

        {/* Plan Selector */}

        {/* Features List */}

        {/* Actions */}
        <View className="w-full mb-auto">
          <View className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-2">
            <Image
              source={require("~/assets/images/splash-transparent.png")}
              className="w-full h-full"
              resizeMode="cover" // or "contain" if you need aspect ratio
            />
          </View>

          <View className="items-center mb-4">
            <H1 className="text-3xl font-bold">Reveal Your True Glow</H1>
            <P className="mt-1 text-lg">
              Upgrade to unlock every pro filter and tool
            </P>
          </View>

          {/* <View className="">
          <View className="space-y-4 bg-secondary rounded-xl"></View>
        </View> */}
          {/* <Card className="shadow-none border-none ring-0"> */}
          <View className="">
            {FEATURES.map(({ icon, title, desc }, idx) => (
              <View key={idx} className="flex-row p-4 rounded-lg items-center">
                <View className="w-8 h-8 rounded-full bg-secondary p-1 items-center justify-center mr-3">
                  <Check />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-card-foreground text-lg">
                    {title}
                  </Text>
                  <P className="mt-1 text-base text-muted-foreground">{desc}</P>
                </View>
              </View>
            ))}
          </View>
          {/* </Card> */}

          <View className="flex-row justify-center space-x-4 mt-6 mb-6 gap-x-4">
            {PLANS.map(({ key, label, price }) => {
              const selected = plan === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setPlan(key)}
                  className={`flex-1 rounded-xl p-3 items-center border border-border shadow-sm shadow-foreground/1 ${
                    selected
                      ? "bg-primary border-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  <Text
                    className={`text-lg font-semibold ${
                      selected ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {label}
                  </Text>
                  <Text
                    className={`mt-1 text-base font-medium ${
                      selected ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            className="w-full rounded-full bg-primary"
            size="lg"
            onPress={clicked_continue}
          >
            <Text className="font-semibold text-primary-foreground">
              Continue
            </Text>
          </Button>
          <TouchableOpacity className="mt-3" onPress={handle_restore_purchase}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
