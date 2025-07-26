import { CheckCheck, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H1, H3, P } from "~/components/ui/typography";
import { makePayment } from "~/lib/payment";

const PLANS = [
  { key: "weekly", label: "Weekly", price: "$4.99/mo" },
  { key: "lifetime", label: "Lifetime", price: "$14.99" },
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
    icon: "👀",
    title: "All Shifts at a Glance",
    desc: "View every available school-work shift.",
  },
  {
    icon: "🖱️",
    title: "One-Click Pickup",
    desc: "Claim any shift instantly with a single click.",
  },
  {
    icon: "🔔",
    title: "Instant Notifications",
    desc: "Receive real-time alerts for new shifts.",
  },
  {
    icon: "📆",
    title: "Auto-Pickup & Calendar Sync",
    desc: "Automatically pick up based on your calendar",
  },
];

export default function Paywall() {
  const [plan, setPlan] = useState("weekly");

  const get_plan = async () => {
    await makePayment("postureai.theblucks.com_weekly", "Weekly");
  };

  useEffect(() => {
    (async () => {
      await get_plan();
    })();
  }, [plan]);

  return (
    <SafeAreaView className="flex-1 bg-background text-foreground px-4 pt-6">
      <ScrollView className="flex-1">
        {/* Header */}

        {/* Plan Selector */}

        {/* Features List */}

        {/* Actions */}
        <View className="w-full mb-auto">
          <View className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-2">
            <Image
              source={require("~/assets/hero/hero.png")}
              className="w-full h-full"
              resizeMode="cover" // or "contain" if you need aspect ratio
            />
          </View>

          <View className="items-center mb-4">
            <H1 className="text-3xl font-bold">Pick-Up Shifts Faster</H1>
            <P className="mt-1 text-lg">Unlock premium features today</P>
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

          <Button className="w-full rounded-full bg-primary" size="lg">
            <Text className="font-semibold text-primary-foreground">
              Continue
            </Text>
          </Button>
          <TouchableOpacity className="mt-3">
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
