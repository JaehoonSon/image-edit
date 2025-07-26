import { View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, Large } from "~/components/ui/typography";
import { playHaptic } from "~/lib/hapticSound";
import { openGallery } from "~/lib/media";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { useFaceEditPresets } from "~/hooks/useFaceEditsPreset";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Camera, Trash2, AlertCircle, Plus } from "lucide-react-native";

export default function MainApp() {
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string>("");

  const { data, loading, error, runPresets } = useFaceEditPresets();

  const clicked_find_photo = async () => {
    playHaptic("soft");
    try {
      const result = await openGallery();
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        setImageUri(uri);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const click_reform = async () => {
    playHaptic("soft");
    await runPresets(imageUri);
  };

  const resetImage = () => {
    playHaptic("soft");
    setImageUri("");
  };

  useEffect(() => {
    if (data) {
      router.push({
        pathname: "/(authenticated)/show-results",
        params: {
          uri: imageUri,
          data: JSON.stringify(data), // serialize data to string
        },
      });
    }
  }, [data]);

  // Image placeholder content
  const renderImageContent = () => {
    if (imageUri) {
      return (
        <View>
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full rounded-xl"
            resizeMode="contain"
          />
          {/* Trash icon overlay */}
          <Pressable
            onPress={resetImage}
            className="absolute top-3 right-3 bg-black/50 rounded-full p-2"
            disabled={loading}
          >
            <Trash2 color="#ffffff" size={20} />
          </Pressable>
        </View>
      );
    }

    // Empty state
    return (
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <View className="bg-gray-300 rounded-full p-4 mb-4">
            <Camera color="#6b7280" size={32} />
          </View>
          <Text className="text-gray-600 text-center font-medium mb-2">
            Tap to select a photo
          </Text>
          <Text className="text-gray-500 text-center text-sm">
            Choose an image to enhance
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 gap-5 p-2 bg-secondary/30">
      <SafeAreaView className="flex-1 items-center" edges={["top", "bottom"]}>
        {/* Image Container */}
        <Pressable
          onPress={clicked_find_photo}
          disabled={loading}
          className={`w-[98%] ${loading ? "opacity-50" : ""}`}
        >
          <AspectRatio
            ratio={9 / 16}
            className="bg-secondary relative rounded-xl border border-gray-300"
          >
            {renderImageContent()}
            {/* Loading overlay */}
            {loading && imageUri && (
              <View className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white mt-3 font-medium">
                  Processing your image...
                </Text>
              </View>
            )}
          </AspectRatio>
        </Pressable>

        {/* Error State */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mt-4">
            <View className="flex-row items-center">
              <AlertCircle color="#ef4444" size={20} />
              <Text className="text-red-800 font-medium ml-2">
                Processing Failed
              </Text>
            </View>
            <Text className="text-red-700 mt-2 text-sm">{error}</Text>
            <Text className="text-red-600 mt-1 text-xs">
              Please try again or select a different image.
            </Text>
          </View>
        )}

        {/* Action Button */}
        <View className="w-full items-center mt-auto">
          <Button
            className={`w-[90%] rounded-xl hover:opacity-95 active:opacity-95 ${
              loading ? "opacity-50" : ""
            }`}
            size={"xl"}
            onPress={imageUri ? click_reform : clicked_find_photo}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="ml-2">Processing...</Text>
              </View>
            ) : (
              <Text>{imageUri ? "Reform this image!" : "Find Your Photo"}</Text>
            )}
          </Button>

          {/* Helper text */}
          {imageUri && !loading && (
            <Text className="text-gray-600 text-center text-sm mt-3">
              Tap the image to change it, or the trash icon to remove it
            </Text>
          )}
        </View>

        {/* Progress indicator */}
        {loading && (
          <View className="absolute bottom-20 left-0 right-0 items-center">
            <View className="bg-white/90 backdrop-blur rounded-full px-4 py-2">
              <Text className="text-gray-700 text-sm font-medium">
                Creating enhanced versions...
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
