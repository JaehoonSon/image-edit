import { ActivityIndicator, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import { router } from "expo-router";

const messages = [
  "Curating your plan...",
  "Analyzing your results...",
  "Personalizing recommendations...",
  "Finalizing details...",
  "Almost done!",
];

export default function Spinner() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Change message every 2 seconds, total 10 seconds
    if (step < messages.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 2000);
      return () => clearTimeout(timer);
    } else {
      // After 10 seconds, redirect
      const timer = setTimeout(() => {
        router.push("/(unauthenticated)/Paywall");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-6 text-lg font-semibold text-gray-700 text-center">
        {messages[step]}
      </Text>
    </View>
  );
}
