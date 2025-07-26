import { useLocalSearchParams } from "expo-router";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function EditPhotoScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  if (!uri) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No image selected.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary/30">
      <SafeAreaView className="flex-1 items-center" edges={["top", "bottom"]}>
        <View className="w-full items-center mt-4">
          <AspectRatio
            ratio={9 / 16}
            className="w-[90%] bg-secondary relative rounded-xl"
          >
            <Image
              source={{ uri }}
              className="w-full h-full rounded-xl border border-gray-300"
              resizeMode="contain"
            />
          </AspectRatio>
        </View>
        {/* Editing bar */}
        <View className="absolute bottom-0 left-0 right-0 pb-6 bg-white/80 flex-row justify-center items-center space-x-4 border-t border-gray-200">
          <Button variant="ghost" className="mx-2">
            <Text>Lighting</Text>
          </Button>
          <Button variant="ghost" className="mx-2">
            <Text>Vision</Text>
          </Button>
          <Button variant="ghost" className="mx-2">
            <Text>Crop</Text>
          </Button>
          <Button variant="ghost" className="mx-2">
            <Text>Filters</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
