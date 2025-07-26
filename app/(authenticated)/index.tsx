import {
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { H1, Large } from "~/components/ui/typography";
import { useState } from "react";
import { Text } from "~/components/ui/text";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Card } from "~/components/ui/card";
import LottieView from "lottie-react-native";
import { Button } from "~/components/ui/button";
import { playHaptic } from "~/lib/hapticSound";
import { router } from "expo-router";

const DEMO_IMAGES: { uri: string }[] = [
  { uri: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d" },
  { uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
  // { uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c" },
  // { uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
  // { uri: "https://images.unsplash.com/photo-1465101178521-cb6e1f6b7a47" },
  // { uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
  // { uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
  // { uri: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c" },
  // { uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  // { uri: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d" },
  // { uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
];

export default function IndexAuthenticatedScreen() {
  // For demo, use demo images. Replace with your own state logic as needed.
  const [images, setImages] = useState<{ uri: string }[]>(DEMO_IMAGES);

  const clicked_saved = () => {
    playHaptic("soft");
    router.push("/settings");
  };

  const clicked_setting = () => {
    playHaptic("soft");
    router.push("/settings");
  };

  const clicked_reform = () => {
    playHaptic("soft");
    router.push("/(authenticated)/main");
    // router.push("/(authenticated)/show-results");
  };

  // Gallery component
  const renderGallery = () => {
    if (!images || images.length === 0) {
      return (
        <View className="flex-1 items-center justify-center gap-4">
          <LottieView
            source={require("../../assets/icons/image_not_preview.json")}
            loop
            autoPlay
            style={{ width: 180, height: 180 }}
          />
          <Text className="text-lg text-muted-foreground text-center">
            No images yet. Upload a photo to get started!
          </Text>
        </View>
      );
    }
    if (images.length <= 3) {
      // 1-3 images: each is full width, stacked vertically, scrollable
      return (
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {images.map((img, idx) => (
            <Card key={idx} className="w-full mb-0">
              <AspectRatio ratio={1} className="w-full">
                <Image
                  source={{ uri: img.uri }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              </AspectRatio>
            </Card>
          ))}
        </ScrollView>
      );
    }
    // 4 or more images: grid
    return (
      <FlatList
        data={images}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 4, paddingBottom: 16 }}
        columnWrapperStyle={{ gap: 4 }}
        className="flex-1"
        renderItem={({ item }) => (
          <Card className="flex-1">
            <AspectRatio ratio={1} className="w-full">
              <Image
                source={{ uri: item.uri }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </AspectRatio>
          </Card>
        )}
      />
    );
  };
  return (
    <View className="flex-1 gap-5 p-2 bg-secondary/30">
      <SafeAreaView className="flex-1 items-center" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between w-full">
          <View>
            <H1>Reform AI</H1>
          </View>

          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={clicked_saved}>
              <Feather name="bookmark" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clicked_setting}>
              <Feather name="settings" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Main app */}
        <View className="flex-1 w-full pt-4">{renderGallery()}</View>
      </SafeAreaView>
      {/* Fixed Reform! button */}
      <View className="absolute bottom-6 left-0 right-0 items-center z-50">
        <Button
          className="w-[80%] rounded-full hover:opacity-95 active:opacity-95"
          size={"xl"}
          onPress={clicked_reform}
        >
          <H1 className="text-primary-foreground">Reform</H1>
        </Button>
      </View>
    </View>
  );
}
