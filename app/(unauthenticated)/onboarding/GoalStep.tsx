import React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  LayoutAnimationConfig,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { H2, P } from "~/components/ui/typography";
import {
  Camera,
  Sparkles,
  Wand2,
  SlidersHorizontal,
  Check,
  LucideIcon,
} from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { playHaptic } from "~/lib/hapticSound";

interface OptionCardProps {
  selected: boolean;
  label: string;
  Icon: LucideIcon;
  onPress: () => void;
  index: number;
}

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

const OptionCard = ({
  selected,
  label,
  Icon,
  onPress,
  index,
}: OptionCardProps) => {
  const aStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(selected ? 1.02 : 1, {
          mass: 0.5,
          damping: 12,
          stiffness: 100,
        }),
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100 * index)
        .springify()
        .damping(16)}
      style={aStyle}
      className="w-[48%] mb-4"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        className={[
          "rounded-3xl p-5 border-2 h-44 justify-between",
          selected
            ? "bg-primary/5 border-primary shadow-sm"
            : "bg-card border-border/60",
        ].join(" ")}
      >
        <View className="flex-row items-start justify-between">
          <View
            className={[
              "h-12 w-12 rounded-2xl items-center justify-center",
              selected ? "bg-primary" : "bg-muted/50",
            ].join(" ")}
          >
            <Icon
              size={22}
              color={selected ? "white" : "gray"}
              strokeWidth={2.5}
            />
          </View>
          {selected && (
            <Animated.View
              entering={FadeInDown.duration(200)}
              className="h-6 w-6 rounded-full bg-primary items-center justify-center"
            >
              <Check size={14} color="white" strokeWidth={3} />
            </Animated.View>
          )}
        </View>
        <Text
          className={[
            "text-lg leading-tight font-medium",
            selected ? "text-primary font-bold" : "text-card-foreground/80",
          ].join(" ")}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

interface GoalStepProps {
  onAnswer: (
    updater: (prev: string[]) => string[]
  ) => void;
  currentAnswer: string[];
}

const GoalStep = ({ onAnswer, currentAnswer = [] }: GoalStepProps) => {
  const toggle = (val: string) => {
    playHaptic("selection");
    onAnswer((prev: string[] = []) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };
  const isSelected = (val: string) => currentAnswer?.includes?.(val);

  return (
    <View className="flex-1 w-[90%] mx-auto">
      <View className="gap-y-3 mb-8">
        <H2 className="text-3xl">How do you want to use the app?</H2>
        <P className="text-muted-foreground text-lg">
          Select all that apply to personalize your experience.
        </P>
      </View>

      <LayoutAnimationConfig>
        <View className="flex-row flex-wrap justify-between">
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
