import React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { H2, P } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Check } from "lucide-react-native";

const SKIN_LEVELS = [
  { id: "light", label: "Light", hex: "#F2D6C8" },
  { id: "medium", label: "Medium", hex: "#C58F6A" },
  { id: "dark", label: "Dark", hex: "#5A3A2A" },
];

const Swatch = ({ item, selected, onPress }) => {
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(selected ? 1.06 : 1, { duration: 120 }) }],
  }));

  return (
    <Animated.View style={aStyle} className="w-[30%] items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.label} skin tone`}
        accessibilityState={{ selected }}
        onPress={onPress}
        className="rounded-2xl aspect-square w-full items-center justify-center border"
        style={{
          backgroundColor: item.hex,
          borderColor: selected ? "#111827" : "#E5E7EB",
        }}
      >
        {selected ? (
          <View className="h-7 w-7 rounded-full items-center justify-center bg-black/70">
            <Check size={14} color="white" />
          </View>
        ) : null}
      </Pressable>
      <Text className="mt-2 text-xs">{item.label}</Text>
    </Animated.View>
  );
};

const SkinStep = ({ onAnswer, currentAnswer }) => {
  const selected = currentAnswer || null; // "light" | "medium" | "dark"

  return (
    <View className="mx-auto w-[90%] gap-y-5">
      <View className="gap-y-1">
        <H2>What’s your skin tone?</H2>
        <P>Tap one.</P>
      </View>

      {/* Compact palette bar for quick visual context */}
      <View className="h-3 rounded-full overflow-hidden flex-row">
        {SKIN_LEVELS.map((s) => (
          <View
            key={s.id}
            className="flex-1"
            style={{ backgroundColor: s.hex }}
          />
        ))}
      </View>

      {/* Three simple swatches */}
      <View className="flex-row flex-wrap justify-between">
        {SKIN_LEVELS.map((item) => (
          <Swatch
            key={item.id}
            item={item}
            selected={selected === item.id}
            onPress={() => onAnswer(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

export default SkinStep;
