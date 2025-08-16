import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  LayoutAnimationConfig,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { H2, P, Muted } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
// import { LayoutAnimationConfig } from "@/components/ui/animation";
import {
  Camera,
  Sparkles,
  Wand2,
  SlidersHorizontal,
  Check,
} from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { playHaptic } from "~/lib/hapticSound";
// import { H2 } from "~/components/ui/typography";

const GOAL_OPTIONS = [
  { id: "touch", label: "Touch up my selfies for Instagram", Icon: Camera },
  {
    id: "experiment",
    label: "Experiment with different looks",
    Icon: Sparkles,
  },
  { id: "smooth", label: "Smooth skin and brighten eyes", Icon: Wand2 },
  {
    id: "customize",
    label: "Customize facial features",
    Icon: SlidersHorizontal,
  },
];

const OptionCard = ({ selected, label, Icon, onPress, index }) => {
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(selected ? 1.02 : 1, { duration: 120 }) }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(80 * index).duration(500)}
      style={aStyle}
      className="w-[48%]"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        className={[
          "rounded-2xl p-4 border",
          selected ? "bg-primary/10 border-primary" : "bg-card border-border",
        ].join(" ")}
      >
        <View className="flex-row items-center justify-between">
          <View className="h-10 w-10 rounded-full items-center justify-center bg-background border border-border">
            <Icon size={20} />
          </View>
          {selected ? (
            <View className="h-6 w-6 rounded-full items-center justify-center bg-primary">
              <Check size={14} color="white" />
            </View>
          ) : null}
        </View>
        <Text className="mt-3 leading-snug">{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const GoalStep = ({ onAnswer, currentAnswer = [] }) => {
  const toggle = (val) => {
    playHaptic("light");
    onAnswer((prev = []) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };
  const isSelected = (val) => currentAnswer?.includes?.(val);
  const selectedCount = currentAnswer?.length || 0;

  const progressText = useMemo(() => {
    if (selectedCount === 0) return "Select one or more";
    if (selectedCount === 1) return "1 selected";
    return `${selectedCount} selected`;
  }, [selectedCount]);

  return (
    <View className="mx-auto w-[90%] gap-y-5">
      <View className="gap-y-2">
        <H2>How do you want to use the app?</H2>
        <P>Select all that apply.</P>
        {/* <Muted>{progressText}</Muted> */}
      </View>

      <LayoutAnimationConfig>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {GOAL_OPTIONS.map((opt, idx) => (
            <OptionCard
              key={opt.id}
              index={idx}
              selected={isSelected(opt.id)}
              label={opt.label}
              Icon={opt.Icon}
              onPress={() => toggle(opt.id)}
            />
          ))}
        </View>
      </LayoutAnimationConfig>
    </View>
  );
};

export default GoalStep;
