import {
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { H1, Large, P } from "~/components/ui/typography";
import { useCallback, useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Card } from "~/components/ui/card";
import LottieView from "lottie-react-native";
import { Button } from "~/components/ui/button";
import { playHaptic } from "~/lib/hapticSound";
import { router } from "expo-router";
import ReformButton from "./test";
import { useGetCollectionDetails } from "~/hooks/useGetCollectionDetails";
import GradientText from "~/components/GradientText";
import { Pressable, RefreshControl } from "react-native-gesture-handler";
import GradientH1 from "~/components/GradientH1";
import { useGetCollection } from "~/hooks/useGetCollection";
import { supabase } from "~/lib/supabase";
import { FaceEditResult } from "~/hooks/useFaceEditsPreset";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import InstagramButton from "./reform";
import LoadingIndicator from "~/components/LoadingIndicator";
import SkeletonImage from "~/components/SkeletonImage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCE_KEY = "PREFERENCE_KEY";
type DisplayMode = "grid" | "full";

export default function IndexAuthenticatedScreen() {
  const {
    data: image_data,
    loading,
    error,
    getCollectionData,
    clearData,
    refreshData,
  } = useGetCollection();

  const { getCollectionDetail } = useGetCollectionDetails();

  const [refreshing, setRefreshing] = useState(false);

  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        // getCollectionData(new Date().toISOString()),
        refreshData(new Date().toISOString()),
        new Promise((res) => setTimeout(res, 1000)),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const displayMode: DisplayMode =
        ((await AsyncStorage.getItem(PREFERENCE_KEY)) as DisplayMode) || "grid";
      setDisplayMode(displayMode);
      await getCollectionData();
    })();
  }, []);

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => {
      const next: DisplayMode = prev === "grid" ? "full" : "grid";
      AsyncStorage.setItem(PREFERENCE_KEY, next).catch(() => {});
      return next;
    });
  };

  const clicked_setting = () => {
    playHaptic("soft");
    router.push("/settings");
  };

  const clicked_reform = () => {
    playHaptic("soft");
    router.push("/(authenticated)/main");
  };

  const clicked_collection = async (img) => {
    playHaptic("soft");
    console.log(img);
    if (img.status == "processing") {
      router.push({
        pathname: "/(authenticated)/poll-data",
        params: {
          human_image:
            image_data.find((e) => e.collection_id === img.collection_id)
              ?.human_image ?? "",
          data: JSON.stringify({ collection_id: img.collection_id }), // serialize data to string
        },
      });
    } else if (img.status == "success") {
      const result = await getCollectionDetail(img.collection_id);

      const faceEditResult: FaceEditResult[] = result.map((e) => ({
        job_id: e.job_id,
      }));
      router.push({
        pathname: "/(authenticated)/show-results",
        params: {
          human_image:
            image_data.find((e) => e.collection_id === img.collection_id)
              ?.human_image ?? "",
          data: JSON.stringify(faceEditResult), // serialize data to string
        },
      });
    }
  };

  const load_more_data = async () => {
    await getCollectionData(image_data[image_data.length - 1].created_at);
  };

  // Gallery component
  const renderGallery = () => {
    if ((loading || refreshing) && image_data.length == 0) return <View></View>;
    if (!image_data || image_data.length === 0) {
      return (
        <View className="flex-1 items-center justify-center gap-4">
          <TouchableOpacity onPress={clicked_reform} activeOpacity={0.95}>
            <LottieView
              source={require("../../assets/icons/image_not_preview.json")}
              loop
              autoPlay
              style={{ width: 180, height: 180 }}
              speed={0.5}
            />
          </TouchableOpacity>
          {/* <Text className="text-lg text-muted-foreground text-center">
            No images yet. Upload a photo to get started!
          </Text> */}
          <GradientText
            text="No images yet. Upload to get started!"
            fontSize={15}
          />
        </View>
      );
    }
    const isGrid = displayMode === "grid";
    const data = image_data.filter(
      (img) => img.status && img.status !== "error"
    );

    return (
      // <ScrollView
      //   className="flex-1 w-full"
      //   contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
      //   showsVerticalScrollIndicator={false}
      //   key={isGrid ? "grid" : "full"}
      //   refreshControl={
      //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      //   }
      // >
      //   {image_data.map((img, idx) => {
      //     if (img.status == "error" || img.status == null) return null;
      //     return (
      //       <Card key={img.collection_id} className="w-full mb-0 relative">
      //         <TouchableOpacity
      //           onPress={() => clicked_collection(img)}
      //           activeOpacity={0.95}
      //           className={
      //             img.status == "success" ? "opacity-100" : "opacity-20"
      //           }
      //         >
      //           <AspectRatio
      //             ratio={img.status == "success" ? 9 / 16 : 16 / 9}
      //             className="w-full"
      //           >
      //             <SkeletonImage uri={img.human_image ?? ""} />
      //           </AspectRatio>
      //         </TouchableOpacity>
      //         {img.status == "processing" && (
      //           <View className="absolute top-5 left-5 p-2 bg-primary rounded-xl">
      //             <P className="font-semibold text-white">Check if it's done</P>
      //           </View>
      //         )}
      //       </Card>
      //     );
      //   })}

      //   {loading ? (
      //     <ActivityIndicator size={20} color={"#0000ff"} />
      //   ) : (
      //     <Button variant={"link"} onPress={load_more_data}>
      //       <Text>Load More Data</Text>
      //     </Button>
      //   )}
      //   <View className="h-24" />
      // </ScrollView>
      <FlatList
        className="flex-1 w-full"
        data={data}
        keyExtractor={(img) => img.collection_id}
        key={isGrid ? "grid" : "full"}
        numColumns={isGrid ? 2 : 1}
        contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        columnWrapperStyle={isGrid ? { gap: 8 } : undefined}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item: img }) => (
          <Card className={`${isGrid ? "flex-1" : "w-full"} mb-0 relative`}>
            <TouchableOpacity
              onPress={() => clicked_collection(img)}
              activeOpacity={0.95}
              className={
                img.status === "success" ? "opacity-100" : "opacity-20"
              }
            >
              <AspectRatio
                ratio={isGrid ? 1 : img.status === "success" ? 9 / 16 : 16 / 9}
                className="w-full"
              >
                <SkeletonImage
                  uri={img.human_image ?? ""}
                  invalidateKey={displayMode}
                />
              </AspectRatio>
            </TouchableOpacity>

            {img.status === "processing" && (
              <View className="absolute top-5 left-5 p-2 rounded-xl">
                {isGrid ? (
                  <ActivityIndicator size="large" color="black" />
                ) : (
                  <P className="font-semibold text-white">Check if it's done</P>
                )}
              </View>
            )}
          </Card>
        )}
        ListFooterComponent={() => (
          <View className="items-center">
            {loading ? (
              <ActivityIndicator size={20} color={"#0000ff"} />
            ) : (
              <Button variant="link" onPress={load_more_data}>
                <Text>Load More Data</Text>
              </Button>
            )}
            <View className="h-24" />
          </View>
        )}
      />
    );
  };

  return (
    <View className="flex-1 gap-5 p-2 bg-background">
      <SafeAreaView className="flex-1 items-center" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between w-full">
          <View className="relative items-center justify-center rounded-full">
            <Text className="text-4xl font-bold opacity-0">Elysia AI </Text>

            <View className="absolute inset-0 items-center justify-center mt-6">
              <GradientText text="Elysia AI" fontSize={32} />
            </View>
          </View>

          <View className="flex-row items-center gap-x-5">
            <TouchableOpacity onPress={toggleDisplayMode}>
              <FontAwesome5
                name={displayMode === "grid" ? "expand" : "th-large"}
                size={24}
                color="black"
                accessibilityLabel={
                  displayMode === "grid"
                    ? "Switch to full view"
                    : "Switch to grid view"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={clicked_reform}>
              <FontAwesome5 name="plus" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clicked_setting}>
              <Feather name="settings" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Main app */}
        <View className="flex-1 w-full pt-4">{renderGallery()}</View>
      </SafeAreaView>
      <View className="absolute w-full bottom-6 left-0 right-0 items-center z-50">
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
