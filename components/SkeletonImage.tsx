import { useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { Skeleton } from "./ui/skeleton";

type Props = { uri: string; invalidateKey?: string };

function SkeletonImage({ uri, invalidateKey }: Props) {
  const [loading, setLoading] = useState(true);

  // Reset when URI or layout mode changes
  useEffect(() => {
    setLoading(true);
  }, [uri, invalidateKey]);

  return (
    <View className="w-full h-full rounded-lg overflow-hidden">
      {loading && <Skeleton className="w-full h-full rounded-xl bg-gray-100" />}
      <Image
        key={`${uri}-${invalidateKey ?? ""}`} // force remount
        source={{ uri }}
        className={`w-full h-full rounded-lg ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        resizeMode="cover"
        progressiveRenderingEnabled // Android
        defaultSource={
          Platform.OS === "ios"
            ? require("~/assets/images/icon.png")
            : undefined
        }
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  );
}
export default SkeletonImage;
