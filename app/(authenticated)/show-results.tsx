import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import { FaceEditResult } from "~/hooks/useFaceEditsPreset";
import { useGetFaceEdit } from "~/hooks/useGetFaceEdit";
import { Dimensions } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react-native";
import { Button } from "~/components/ui/button";

const screenWidth = Dimensions.get("window").width;
const thumbnailSize = 80; // Size for thumbnail previews

const faceEditResult: FaceEditResult[] = [
  {
    preset_id: "1",
    preset_name: "Subtle Radiance",
    job_id: "cmdkg1o8k003w1x0z3qr0efd6",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "2",
    preset_name: "Gentle Lift",
    job_id: "cmdkg1okr0asc2q0znqteblq1",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "3",
    preset_name: "Cheerful Gaze",
    job_id: "cmdkg1ow60asd2q0zt5xkjiui",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "4",
    preset_name: "Balanced Harmony",
    job_id: "cmdkg1p6t003x1x0zmv6ekl2z",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "5",
    preset_name: "Natural Glow",
    job_id: "cmdkg1pgy0ase2q0zbkp7r3ew",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "6",
    preset_name: "Confident Smile",
    job_id: "cmdkg1prg003y1x0zc78smy3g",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "7",
    preset_name: "Expressive Eyes",
    job_id: "cmdkg1q1m0asg2q0z8dlokwn1",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "8",
    preset_name: "Subtle Refinement",
    job_id: "cmdkg1qct08lw3h0zkxf1ld9a",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "9",
    preset_name: "Joyful Expression",
    job_id: "cmdkg1qmz0ash2q0zxsggockf",
    frame_cost: 1,
    credits_charged: 1,
  },
  {
    preset_id: "10",
    preset_name: "Polished Look",
    job_id: "cmdkg1qx00asi2q0zmkbj3aeu",
    frame_cost: 1,
    credits_charged: 1,
  },
];

// Component to show status for individual items
const StatusOverlay = ({ status }: { status: string }) => {
  if (status === "complete") return null;

  const getStatusInfo = () => {
    switch (status) {
      case "queued":
      case "rendering":
        return { icon: Clock, color: "#f59e0b", text: "Processing..." };
      case "error":
        return { icon: AlertCircle, color: "#ef4444", text: "Error" };
      case "canceled":
        return { icon: AlertCircle, color: "#6b7280", text: "Canceled" };
      default:
        return { icon: Clock, color: "#6b7280", text: "Pending..." };
    }
  };

  const { icon: Icon, color, text } = getStatusInfo();

  return (
    <View className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
      <Icon color={color} size={32} />
      <Text className="text-white mt-2 text-sm font-medium">{text}</Text>
      {(status === "queued" || status === "rendering") && (
        <ActivityIndicator
          color={color}
          size="small"
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
};

export default function ShowResults() {
  const { uri, data } = useLocalSearchParams<{ uri: string; data: string }>();
  //   const faceEdits: FaceEditResult[] = faceEditResult;
  const faceEdits = data
    ? (JSON.parse(
        data
      ) as import("~/hooks/useFaceEditsPreset").FaceEditResult[])
    : [];
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: editResults, loading, error, getEdit } = useGetFaceEdit();

  useEffect(() => {
    (async () => {
      await getEdit(faceEdits);
    })();
  }, []); // Remove faceEdits dependency to avoid re-triggering

  // Get completed results for display
  const completedResults = editResults.filter(
    (result) => result.status === "complete" && result.downloads?.length > 0
  );

  // Handle navigation to specific image
  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current && completedResults.length > 0) {
      if (index >= 0 && index < completedResults.length) {
        scrollViewRef.current.scrollTo({
          x: index * screenWidth,
          animated: true,
        });
        setCurrentIndex(index);
      }
    }
  };

  // Handle scroll end to update current index
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  // Handle thumbnail press
  const handleThumbnailPress = (index: number) => {
    // Find the index in completedResults
    const completedIndex = completedResults.findIndex(
      (result) => result.id === editResults[index]?.id
    );
    if (completedIndex !== -1) {
      scrollToIndex(completedIndex);
    }
  };

  // Show loading state
  if (loading && editResults.length === 0) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading your face edits...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center px-4">
        <AlertCircle color="#ef4444" size={48} />
        <Text className="mt-4 text-red-600 text-center font-medium">
          Failed to load results
        </Text>
        <Text className="mt-2 text-gray-600 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1 items-center" edges={["top", "bottom"]}>
        {/* Status Summary */}
        {editResults.length > 0 && (
          <View className="px-4 py-2 bg-white rounded-lg mx-4 mb-4">
            <Text className="text-center text-sm text-gray-600">
              {completedResults.length} of {editResults.length} edits complete
              {loading && " • Processing..."}
            </Text>
          </View>
        )}

        {/* Main Image Carousel - Only show completed results */}
        {completedResults.length > 0 && (
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {completedResults.map((result, index) => (
              <View
                key={result.id}
                style={{
                  width: screenWidth,
                  alignItems: "center",
                }}
                className="px-2 rounded-2xl"
              >
                <AspectRatio
                  ratio={6 / 19}
                  className="bg-secondary w-full rounded-2xl"
                >
                  <Image
                    source={{ uri: result.downloads[0].url }}
                    className="w-full h-full rounded-2xl"
                    resizeMode="contain"
                  />
                </AspectRatio>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Thumbnail Previews - Show all results with status overlays */}
        {editResults.length > 0 && (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="py-4 px-4 gap-x-1"
          >
            {editResults.map((result, index) => {
              const isCompleted =
                result.status === "complete" && result.downloads?.length > 0;
              const completedIndex = completedResults.findIndex(
                (r) => r.id === result.id
              );
              const isCurrentlySelected = completedIndex === currentIndex;

              return (
                <Pressable
                  key={result.id}
                  onPress={() => isCompleted && handleThumbnailPress(index)}
                  style={{
                    width: thumbnailSize,
                    height: thumbnailSize,
                    borderRadius: 8,
                    borderWidth: isCurrentlySelected ? 2 : 1,
                    borderColor: isCurrentlySelected ? "#3b82f6" : "#d1d5db",
                    overflow: "hidden",
                    opacity: isCompleted ? 1 : 0.7,
                  }}
                >
                  {isCompleted ? (
                    <Image
                      source={{ uri: result.downloads[0].url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-gray-200" />
                  )}
                  <StatusOverlay status={result.status} />
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Navigation Buttons - Only show if we have completed results */}
        {completedResults.length > 1 && (
          <View className="flex flex-row justify-center w-full px-4 mt-4 gap-x-4">
            <Button
              onPress={() => scrollToIndex(currentIndex - 1)}
              className={`${currentIndex === 0 ? "opacity-50" : "opacity-100"}`}
            >
              <ChevronLeft
                color={
                  currentIndex === completedResults.length - 1
                    ? "#a0aec0"
                    : "#ffffff"
                }
                size={24}
              />
            </Button>

            <Button
              onPress={() => scrollToIndex(currentIndex + 1)}
              className={`${
                currentIndex === completedResults.length - 1
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              <ChevronRight
                color={
                  currentIndex === completedResults.length - 1
                    ? "#a0aec0"
                    : "#ffffff"
                }
                size={24}
              />
            </Button>
          </View>
        )}

        {/* Empty state when no results */}
        {!loading && editResults.length === 0 && (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-gray-600 text-center">
              No results available
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
