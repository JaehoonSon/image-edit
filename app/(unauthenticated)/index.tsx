import { Link, router } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  useWindowDimensions,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, P } from "~/components/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { onboardingSlide } from "~/config";
import { useRef, useState, useEffect } from "react";
import { VideoView, useVideoPlayer } from "expo-video";
import GradientText from "~/components/GradientText";

export default function IndexUnauthenticatedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width, height } = useWindowDimensions();

  const player = useVideoPlayer(
    require("~/assets/onboarding/hero.mp4"),
    (player) => {
      player.loop = true;
      player.play();
      player.muted = true;
    }
  );

  return (
    <View className="flex-1 bg-[#F9EDD9] items-center justify-center">
      {/* Footer — its own height decides how much the gradient gets */}
      <GradientText text="Elysia - Photo Glow" fontSize={38}></GradientText>
      <View className="bg-transparent w-full gap-y-2 pt-6 pb-12">
        <View className="w-[90%] mx-auto rounded-full">
          <VideoView
            style={{
              width: width * 0.9,
              height: height * 0.4,
              alignSelf: "center",
              marginBottom: 20,
            }}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
            focusable={false}
          />
          <Button
            variant="default"
            className="shadow shadow-foreground/5 rounded-full"
            size="xl"
            onPress={() => {
              router.push("/(unauthenticated)/SignUp");
            }}
          >
            <Text className="font-bold tracking-widest">Let's Start</Text>
          </Button>
          <Button
            variant="link"
            className="mt-2"
            onPress={() => {
              router.push("/(unauthenticated)/login");
            }}
          >
            <P className="text-primary text-center text-lg">
              I already have an account
            </P>
          </Button>
        </View>
      </View>
    </View>
  );
}
