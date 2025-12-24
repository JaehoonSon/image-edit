import React from "react";
import { View, Image, Pressable, ImageSourcePropType } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { H2, P } from "~/components/ui/typography";
import { Check } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { playHaptic } from "~/lib/hapticSound";

interface PlatformOption {
  id: string;
  label: string;
  icon: ImageSourcePropType;
  color: string;
  tip: string;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: require("~/assets/icons/instagram.png"),
    color: "#E1306C",
    tip: "Best for 4:5 photos",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: require("~/assets/icons/tiktok.png"),
    color: "#000000",
    tip: "1080×1920 video",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    icon: require("~/assets/icons/pinterest.png"),
    color: "#E60023",
    tip: "Tall pins pop",
  },
  {
    id: "other",
    label: "Other",
    icon: require("~/assets/images/icon.png"),
    color: "#8E8E93",
    tip: "We auto‑optimize",
  },
];

interface TileProps {
  platform: PlatformOption;
  selected: boolean;
  onPress: () => void;
  index: number;
}

const Tile = ({ platform, selected, onPress, index }: TileProps) => {
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
        onPress={() => {
          playHaptic("selection");
          onPress();
        }}
        className={[
          "rounded-3xl p-5 border-2 h-48 justify-between",
          selected
            ? "bg-primary/5 border-primary shadow-sm"
            : "bg-card border-border/60",
        ].join(" ")}
      >
        <View className="flex-row items-start justify-between">
          <View
            className={[
              "h-16 w-16 rounded-2xl items-center justify-center",
              selected ? "bg-white shadow-sm" : "bg-muted/30",
            ].join(" ")}
          >
            <Image
              source={platform.icon}
              className="h-10 w-10"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
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

        <View>
          <Text
            className={[
              "text-xl leading-tight font-medium",
              selected ? "font-bold text-primary" : "text-card-foreground/80",
            ].join(" ")}
          >
            {platform.label}
          </Text>
          <Text className="text-xs text-muted-foreground mt-1 opacity-80 font-medium">
            {platform.tip}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

interface PlatformStepProps {
  onAnswer: (answer: string) => void;
  currentAnswer: string;
}

const PlatformStep = ({ onAnswer, currentAnswer }: PlatformStepProps) => (
  <View className="flex-1 w-[90%] mx-auto">
    <View className="gap-y-3 mb-8">
      <H2 className="text-3xl">Where do you post the most?</H2>
      <P className="text-muted-foreground text-lg">
        We'll optimize your photos for your favorite platform.
      </P>
    </View>

    <View className="flex-row flex-wrap justify-between">
      {PLATFORMS.map((pf, idx) => (
        <Tile
          key={pf.id}
          platform={pf}
          index={idx}
          selected={currentAnswer === pf.id}
          onPress={() => onAnswer(pf.id)}
        />
      ))}
    </View>
  </View>
);

export default PlatformStep;
