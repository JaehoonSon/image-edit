import { Image, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { H1, P } from "~/components/ui/typography";
import * as StoreReview from "expo-store-review";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "review_last_prompt_at";
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

// Transparent badge that says most innovative app of the week
const IMAGE_BADGE = require("~/assets/hero/badge.png");

function Stars({ total = 5, sizeClass = "text-3xl" }) {
  return (
    <View
      className="flex-row items-center justify-center"
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${total} out of ${total} stars`}
      testID="rating-stars"
    >
      {Array.from({ length: total }).map((_, i) => (
        <Animated.Text
          key={i}
          entering={FadeInDown.delay(i * 80)
            .duration(350)
            .springify()
            .damping(12)
            .stiffness(220)}
          className={`mx-0.5 ${sizeClass} text-yellow-400`}
        >
          ★
        </Animated.Text>
      ))}
    </View>
  );
}

export default function SocialProof({ allAnswers, currentIndex }) {
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        // if (__DEV__) return;
        // if (__DEV__) await AsyncStorage.removeItem(KEY);
        const last = Number(await AsyncStorage.getItem(KEY)) || 0;
        const now = Date.now();
        if (now - last < TWELVE_HOURS) return;

        if (await StoreReview.hasAction()) {
          await StoreReview.requestReview();
          await AsyncStorage.setItem(KEY, String(now));
        }
      } catch {}
    }, 2500);

    return () => clearTimeout(t);
  }, []);
  return (
    <Animated.View className="flex-1 bg-background p-4 items-center">
      <Animated.View
        entering={FadeInRight.duration(350)
          .springify()
          .damping(10)
          .stiffness(200)}
      >
        <H1 className="font-extrabold text-5xl tracking-widest">
          Looks like you're in good hands
        </H1>
      </Animated.View>

      <Animated.View
        className="mx-auto w-[90%] h-full mt-24"
        entering={FadeInDown.duration(1000)}
      >
        <Image source={IMAGE_BADGE} className="w-full" resizeMode="contain" />
        <View className="mt-3 items-center">
          <Stars />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
