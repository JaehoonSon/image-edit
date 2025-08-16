import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Image, View } from "react-native";
import Animated, { FadeInDown, Layout, ZoomIn } from "react-native-reanimated";
import GradientText from "~/components/GradientText";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import { H1, Muted, P } from "~/components/ui/typography";

const IMAGES = [
  require("~/assets/hero/model_1.png"),
  require("~/assets/hero/model_2.png"),
  require("~/assets/hero/model_3.png"),
  require("~/assets/hero/model_4.png"),
  require("~/assets/hero/model_5.png"),
];

type HeroMosaicProps = {
  className?: string; // width, padding, centering controlled by parent
  gap?: number;
};

const Tile = ({
  ratio,
  src,
  delay = 0,
}: {
  ratio: number;
  src: any;
  delay?: number;
}) => (
  <Animated.View
    entering={ZoomIn.delay(delay).springify().stiffness(340).damping(16)}
    className="rounded-3xl overflow-hidden"
  >
    <AspectRatio ratio={ratio}>
      <Image source={src} resizeMode="cover" className="w-full h-full" />
    </AspectRatio>
  </Animated.View>
);

function HeroMosaic({ className, gap = 12 }: HeroMosaicProps) {
  const [colW, setColW] = useState(0);

  return (
    <View className={className}>
      <Animated.View
        entering={FadeInDown.springify().stiffness(280).damping(18)}
        layout={Layout.springify()}
        className="rounded-3xl overflow-hidden"
      >
        <View className="p-3">
          <View
            className="w-full"
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setColW((w - gap) / 2);
            }}
          >
            {colW > 0 && (
              <View style={{ flexDirection: "row" }}>
                {/* Left column */}
                <View style={{ width: colW, marginRight: gap }}>
                  <Tile ratio={1} src={IMAGES[0]} delay={0} />
                  <View className="h-3" />
                  <Tile ratio={1} src={IMAGES[2]} delay={120} />
                </View>

                {/* Right column */}
                <View style={{ width: colW }}>
                  <Tile ratio={4 / 3} src={IMAGES[1]} delay={60} />
                  <View className="h-3" />
                  <Tile ratio={4 / 5} src={IMAGES[3]} delay={180} />
                  {/* <View className="h-3" /> */}
                  {/* <Tile ratio={21 / 14} src={IMAGES[4]} delay={240} /> */}
                </View>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function HeroScreen() {
  return (
    <Animated.View
      className="flex-1 bg-background"
      entering={ZoomIn.duration(500)}
    >
      <Animated.View className="w-full">
        {/* Parent controls width, centering, padding */}
        <HeroMosaic className="mx-auto w-full max-w-[760px] px-4" gap={12} />
      </Animated.View>
      <Animated.View className="mt-6 px-4">
        <H1 className="text-center">Upload one photo</H1>
        <Animated.View>
          <GradientText text="get 10 variations" />
        </Animated.View>
        <Muted className="text-center mt-2 font-semibold text-md px-12">
          Enhance photos with <P className="underline">AI Magic</P>. Upload a
          single photo to get 10 subtle and drastic enhancements
        </Muted>
      </Animated.View>
    </Animated.View>
  );
}
