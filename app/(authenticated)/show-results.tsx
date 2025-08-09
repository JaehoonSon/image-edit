// ShowResults.tsx

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import { FaceEditResult } from "~/hooks/useFaceEditsPreset";
import { useGetFaceEdit } from "~/hooks/useGetFaceEdit";
import {
  ChevronLeft,
  // ChevronRight,
  AlertCircle,
  Clock,
  Download,
  Heart,
} from "lucide-react-native";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Button } from "~/components/ui/button";

// 👇 NEW: gesture-handler / reanimated
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import GradientText from "~/components/GradientText";
import { downloadImageToLibrary } from "~/lib/media";
import { showErrorToast, showSuccessToast } from "~/components/ui/toast";
import { send_like } from "~/hooks/useLikes";

const screenWidth = Dimensions.get("window").width;
const thumbnailSize = 80;
const thumbnailSpacing = 8;

const faceEditResult: FaceEditResult[] = [
  { job_id: "cmdni5sv301y0370zl9mc2lxj", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5te309l82z0zteonkqiq", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5tsa09y14b0zqznohdev", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5u7501y1370zgqq4deeb", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5uke09l92z0z7vluboww", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5uxs09y24b0znrgvyia8", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5vdk09y34b0z67xn6okv", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5vun01y2370z75j6j1j8", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5w7g01y3370zr5ikcf3m", frame_cost: 1, credits_charged: 1 },
  { job_id: "cmdni5wkw09la2z0zuod914vl", frame_cost: 1, credits_charged: 1 },
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
  // const faceEdits: FaceEditResult[] = faceEditResult;
  const faceEdits = data
    ? (JSON.parse(
        data
      ) as import("~/hooks/useFaceEditsPreset").FaceEditResult[])
    : [];

  const scrollViewRef = useRef<ScrollView>(null);
  const thumbnailScrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: editResults, loading, error, getEdit } = useGetFaceEdit();

  // UI visibility (Photos-like)
  const [uiVisible, setUiVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      await getEdit(faceEdits);
    })();
    // Start visible and then auto-hide
    scheduleAutoHide();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle_download = async () => {
    try {
      await downloadImageToLibrary(editResults[currentIndex].downloads[0].url);
      showSuccessToast("Success! Saved to Photo!");
      await send_like(editResults[currentIndex].id);
    } catch (err) {
      showErrorToast("Error downloading image");
    }
  };

  const handle_like = async () => {
    try {
      await send_like(editResults[currentIndex].id);
      showSuccessToast("Liked!");
    } catch (err) {}
  };

  const hideUI = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setUiVisible(false));
  };

  const showUI = () => {
    setUiVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
    scheduleAutoHide();
  };

  const toggleUI = () => {
    if (uiVisible) hideUI();
    else showUI();
  };

  const scheduleAutoHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => hideUI(), 3000);
  };

  // Get completed results for display
  const completedResults = editResults.filter(
    (result) => result.status === "complete" && result.downloads?.length > 0
  );

  // Function to scroll thumbnail preview to show current item
  const scrollThumbnailToIndex = (index: number) => {
    if (thumbnailScrollViewRef.current && editResults.length > 0) {
      const completedResult = completedResults[index];
      const actualIndex = editResults.findIndex(
        (result) => result.id === completedResult?.id
      );

      if (actualIndex !== -1) {
        const scrollPosition = actualIndex * (thumbnailSize + thumbnailSpacing);
        const centerOffset = (screenWidth - thumbnailSize) / 2;
        const finalScrollPosition = Math.max(0, scrollPosition - centerOffset);

        thumbnailScrollViewRef.current.scrollTo({
          x: finalScrollPosition,
          animated: true,
        });
      }
    }
  };

  // Handle navigation to specific image
  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current && completedResults.length > 0) {
      if (index >= 0 && index < completedResults.length) {
        scrollViewRef.current.scrollTo({
          x: index * screenWidth,
          animated: true,
        });
        setCurrentIndex(index);
        scrollThumbnailToIndex(index);
        showUI(); // keep UI visible when navigating via buttons
      }
    }
  };

  // Handle scroll end to update current index
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      scrollThumbnailToIndex(index);
    }
  };
  const handle_back = () => {
    router.replace("/(authenticated)");
  };

  const handleScrollBeginDrag = () => {
    showUI();
  };

  // 👇 NEW: A tap gesture that runs simultaneously with the native scroll.
  // If the user taps (without moving > ~8px), we toggle the UI.
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(8)
    .onEnd((_e, success) => {
      if (success) {
        // ensure state updates on JS thread even with Reanimated worklets
        runOnJS(toggleUI)();
      }
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, Gesture.Native());

  // Show loading state
  if (loading && editResults.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#D946EF" />
        <View className="w-full mt-4">
          <GradientText text="Loading" fontSize={32} />
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-4">
        <View className="w-[70%] mx-auto">
          <Image
            source={require("~/assets/images/item_not_found.png")}
            className="w-full h-full rounded-2xl"
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        className="flex-1 relative items-center"
        edges={["top", "bottom"]}
      >
        <TouchableOpacity
          className="absolute top-20 left-4 bg-primary z-20 rounded-full p-1.5 items-center"
          onPress={handle_back}
        >
          <ChevronLeft />
        </TouchableOpacity>
        {/* Status Summary (optional) */}
        {editResults.length > 0 &&
          editResults.length !== completedResults.length && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-8, 0],
                    }),
                  },
                ],
              }}
              pointerEvents={uiVisible ? "auto" : "none"}
              className="absolute top-20 right-4 bg-white rounded-lg px-3 py-1 shadow z-20"
            >
              <Text className="text-sm text-gray-600">
                {completedResults.length} of {editResults.length} edits complete
                {loading && " • Processing..."}
              </Text>
            </Animated.View>
          )}

        {/* Main Image Carousel */}
        {completedResults.length > 0 && (
          <GestureDetector gesture={composedGesture}>
            <View style={{ flex: 1, width: "100%" }}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onScroll={handleScroll}
                onScrollBeginDrag={handleScrollBeginDrag}
                scrollEventThrottle={16}
                contentContainerStyle={{ alignItems: "center" }}
              >
                {completedResults.map((result) => (
                  <View
                    key={result.id}
                    style={{ width: screenWidth, alignItems: "center" }}
                    className="px-2 rounded-2xl"
                  >
                    <AspectRatio
                      ratio={6 / 19}
                      className="bg-background w-full rounded-2xl"
                    >
                      <Image
                        source={{ uri: result.downloads[0].url }}
                        className="w-full h-full rounded-2xl items-start"
                        resizeMode="contain"
                      />
                    </AspectRatio>
                  </View>
                ))}
              </ScrollView>
            </View>
          </GestureDetector>
        )}

        {/* Navigation Buttons - tap-to-toggle visibility */}
        {completedResults.length > 1 && (
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 24,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            }}
            pointerEvents={uiVisible ? "auto" : "none"}
          >
            <View className="flex flex-row justify-center w-full px-4 gap-x-4">
              <Button
                onPressIn={showUI}
                onPress={() => scrollToIndex(currentIndex - 1)}
                className={`${
                  currentIndex === 0 ? "opacity-50" : "opacity-100"
                }`}
              >
                <ChevronLeft
                  color={currentIndex === 0 ? "#a0aec0" : "#ffffff"}
                  size={24}
                />
              </Button>

              <Button
                variant={"secondary"}
                onPressIn={showUI}
                onPress={handle_download}
              >
                <Download strokeWidth={2} />
              </Button>

              <Button
                variant={"destructive"}
                onPressIn={showUI}
                onPress={handle_like}
              >
                <Heart fill="white" strokeWidth={0} />
              </Button>

              <Button
                onPressIn={showUI}
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
          </Animated.View>
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
