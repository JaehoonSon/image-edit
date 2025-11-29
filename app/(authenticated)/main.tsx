import {
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, Large } from "~/components/ui/typography";
import { playHaptic } from "~/lib/hapticSound";
import { openGallery } from "~/lib/media";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useFaceEditPresets } from "~/hooks/useFaceEditsPreset";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import {
  Camera,
  Trash2,
  AlertCircle,
  Plus,
  ChevronLeft,
} from "lucide-react-native";
import { showErrorToast } from "~/components/ui/toast";
import GradientText from "~/components/GradientText";
import LoadingIndicator from "~/components/LoadingIndicator";
import SpinningImage from "~/components/SpinningImage";
import { useCreateCollection } from "~/hooks/useCreateCollection";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function MainApp() {
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string>("");

  const { data, loading, error, runCollection } = useCreateCollection();

  const clicked_find_photo = async () => {
    playHaptic("soft");
    try {
      const result = await openGallery();
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        await Image.prefetch(uri);
        setImageUri(uri);
      }
    } catch (err) {
      console.warn(err);
      showErrorToast("Error selecting photo");
    }
  };

  const click_reform = async () => {
    playHaptic("soft");
    await runCollection(imageUri);
  };

  const resetImage = () => {
    playHaptic("soft");
    setImageUri("");
  };
  const handleBack = () => {
    playHaptic("soft");
    router.back();
  };

  useEffect(() => {
    if (data) {
      console.log("Data arrived: ", data);
      router.replace({
        pathname: "/(authenticated)/poll-data",
        params: {
          human_image: imageUri,
          data: JSON.stringify(data), // serialize data to string
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) showErrorToast("Please try again or select a different image");
  }, [error]);

  // Image placeholder content
  const renderImageContent = () => {
    if (imageUri) {
      return (
        <View className="w-full h-full">
          <View className="relative">
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
              }}
              placeholder={{ blurhash }}
              contentFit="contain"
              transition={300}
              onError={(error) => console.log("Image Error:", error)}
              onLoad={() => console.log("Image loaded successfully")}
            />
            <Pressable
              onPress={resetImage}
              className="absolute top-3 right-3 bg-black/50 rounded-full p-2"
              disabled={loading}
            >
              <Trash2 color="#ffffff" size={20} />
            </Pressable>
          </View>
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
    <View className="flex-1 relative gap-5 p-2 bg-background">
      <SafeAreaView
        className="flex-1 items-center justify-center"
        edges={["top", "bottom"]}
      >
        <View className="w-[97%] mb-4 flex flex-row items-center">
          <TouchableOpacity
            className="rounded-full p-1 mr-3"
            onPress={handleBack}
          >
            <ChevronLeft />
          </TouchableOpacity>
          <H1 className="">Select Your Photo</H1>
        </View>
        {/* Image Container */}
        <TouchableOpacity
          onPress={clicked_find_photo}
          disabled={loading}
          className={`w-[98%] ${loading ? "opacity-50" : ""}`}
        >
          <AspectRatio ratio={9 / 15} className="relative rounded-xl">
            {renderImageContent()}
            {/* Loading overlay */}
          </AspectRatio>
        </TouchableOpacity>

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
              <Text className="text-3xl font-extrabold tracking-widest">
                {imageUri ? "Reform this image!" : "Find Your Photo"}
              </Text>
            )}
          </Button>

          {/* Helper text */}
        </View>
      </SafeAreaView>
      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          {/* dark overlay */}
          <View className="absolute inset-0 bg-background/30" />
          {/* spinner + text */}
          <View className="flex-1 items-center justify-center">
            <SpinningImage
              src={require("~/assets/images/ThemedLoadingTransparent.png")}
              size={120}
            />
            <LoadingIndicator />
          </View>
        </View>
      )}
    </View>
  );
}
