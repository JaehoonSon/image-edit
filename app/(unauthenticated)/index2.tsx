import { Link } from "expo-router";
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
import { useRef, useState } from "react";

export default function IndexUnauthenticatedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width, height } = useWindowDimensions();

  return (
    // <WelcomeScreen />
    <View className="flex-1 bg-background">
      {/* Grows to fill whatever space the footer doesn’t use */}
      <LinearGradient
        colors={["#feb47b", "#ff7e5f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <FlatList
          ref={flatListRef}
          data={onboardingSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={({
            nativeEvent,
          }: NativeSyntheticEvent<NativeScrollEvent>) =>
            setCurrentIndex(Math.round(nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View
              style={{ width }}
              className="flex-1 justify-center items-center px-5"
            >
              <Image
                source={item.image}
                className="w-full mt-12"
                resizeMode="contain"
              />
            </View>
          )}
        />
      </LinearGradient>

      {/* Footer — its own height decides how much the gradient gets */}
      <View className="bg-secondary w-full gap-y-2 pt-6 pb-12">
        <View className="w-[90%] mx-auto">
          <View className="gap-y-2">
            <H1 className="text-center">
              {onboardingSlide[currentIndex].title}
            </H1>
            <P className="text-center">
              {onboardingSlide[currentIndex].description}
            </P>
          </View>
          <View className="flex-row items-center justify-center mb-4 mt-4">
            {Array.from({ length: onboardingSlide.length }).map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: i,
                    animated: true,
                  });
                  setCurrentIndex(i);
                }}
                className={
                  i === currentIndex
                    ? "w-7 h-3 mx-1 rounded-full bg-primary scale-105"
                    : "w-3 h-3 mx-1 rounded-full bg-primary/40 scale-100"
                }
              />
            ))}
          </View>

          <Link href="/(unauthenticated)/SignUp" asChild>
            <Button
              variant="default"
              className="shadow shadow-foreground/5 rounded-full"
              size="xl"
            >
              <Text className="font-bold tracking-widest">Let's Start</Text>
            </Button>
          </Link>

          <Link href="/(unauthenticated)/login" className="mt-2">
            <P className="text-primary text-center text-lg">
              I already have an account
            </P>
          </Link>
        </View>
      </View>
    </View>
  );
}
