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
    if (step < messages.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        router.replace("/(unauthenticated)/Paywall");
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#f66763" />
      <Text className="mt-6 text-lg font-semibold text-gray-700 text-center">
        {messages[step]}
      </Text>
    </View>
  );
}
