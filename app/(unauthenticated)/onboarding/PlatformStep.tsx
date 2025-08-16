import React from "react";
import { View, Image, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { H2, P, Muted } from "~/components/ui/typography";
import { Check } from "lucide-react-native";
import { Text } from "~/components/ui/text";

const PLATFORMS = [
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
    color: "#25F4EE",
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

const Tile = ({ platform, selected, onPress, index }) => {
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(selected ? 1.02 : 1, { duration: 120 }) }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(70 * index).duration(500)}
      style={aStyle}
      className="w-[48%]"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        className={[
          "rounded-2xl p-4 border-2",
          selected ? "bg-primary/10" : "bg-card",
        ].join(" ")}
        style={{ borderColor: selected ? platform.color : "#E5E7EB" }}
      >
        <View className="flex-row items-center justify-between">
          <View
            className="h-12 w-12 rounded-full items-center justify-center bg-white border"
            style={{ borderColor: platform.color }}
          >
            <Image
              source={platform.icon}
              className="h-8 w-8"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
          {selected ? (
            <View
              className="h-6 w-6 rounded-full items-center justify-center"
              style={{ backgroundColor: platform.color }}
            >
              <Check size={14} color="white" />
            </View>
          ) : null}
        </View>
        <Text className="mt-3 font-medium">{platform.label}</Text>
        {/* <Muted>{platform.tip}</Muted> */}
      </Pressable>
    </Animated.View>
  );
};

const PlatformStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-5">
    <View className="gap-y-2">
      <H2>Where do you post the most?</H2>
      <P>Pick your playground.</P>
    </View>

    <View className="flex-row flex-wrap justify-between gap-y-4">
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
