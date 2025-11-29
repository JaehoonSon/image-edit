import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import LoadingIndicator from "~/components/LoadingIndicator";
import SkeletonImage from "~/components/SkeletonImage";
import SpinningImage from "~/components/SpinningImage";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { CreateCollectionResult } from "~/hooks/useCreateCollection";
import { useGetCollection } from "~/hooks/useGetCollection";
import { useGetCollectionDetails } from "~/hooks/useGetCollectionDetails";
import { useGetFaceEditCollection } from "~/hooks/useGetFaceEditCollection";

const PopShake = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.92 }, { translateX: 0 }] },
  60: { opacity: 1, transform: [{ scale: 1.04 }, { translateX: -3 }] },
  72: { transform: [{ scale: 1.04 }, { translateX: 3 }] },
  84: { transform: [{ scale: 1.02 }, { translateX: -2 }] },
  92: { transform: [{ scale: 1.0 }, { translateX: 1 }] },
  100: { transform: [{ scale: 1.0 }, { translateX: 0 }] },
}).duration(520);

export default function PollData() {
  const { human_image, data } = useLocalSearchParams<{
    human_image: string | string[];
    data: string;
  }>();

  const humanImage =
    typeof human_image === "string"
      ? decodeURIComponent(human_image)
      : Array.isArray(human_image)
      ? decodeURIComponent(human_image[0] ?? "")
      : "";

  const collection_data = data
    ? (JSON.parse(data) as CreateCollectionResult)
    : [];

  const { data: image_detail_data, runCollection } = useGetFaceEditCollection();

  useEffect(() => {
    console.log("this is human image", humanImage);
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      const imageDetailData = await runCollection(
        collection_data.collection_id
      );
      console.log("image detail data", imageDetailData);
      const some = imageDetailData.items.map((item) => ({
        job_id: item.job_id,
      }));
      console.log("some", some);
      if (cancelled) return;

      if (
        imageDetailData.items.map((item) => ({ job_id: item.job_id })).length >
        1
      ) {
        router.replace({
          pathname: "/(authenticated)/show-results",
          params: {
            human_image: humanImage,
            data: JSON.stringify(
              imageDetailData.items.map((item) => ({ job_id: item.job_id }))
            ),
          },
        });
        return; // stop polling
      }

      tid = setTimeout(poll, 5000);
    };

    poll();

    return () => {
      cancelled = true;
      if (tid) clearTimeout(tid);
    };
  }, [collection_data.collection_id, human_image, router]);

  return (
    <View className="flex-1">
      {true && (
        <View className="absolute inset-0 items-center justify-center">
          {/* dark overlay */}
          <View className="absolute inset-0 bg-background/30" />
          {/* spinner + text */}
          <View className="flex-1 items-center justify-center">
            <Animated.View
              className="w-[90%] aspect-square"
              entering={PopShake}
            >
              <SkeletonImage uri={humanImage} />
            </Animated.View>
            <SpinningImage
              src={require("~/assets/images/ThemedLoadingTransparent.png")}
              size={120}
            />
            <P className="px-24 text-center">
              The picture will be ready in a moment, feel free to leave the app!
            </P>
          </View>
        </View>
      )}
    </View>
  );
}
