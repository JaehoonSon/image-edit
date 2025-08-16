import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
// import { Skeleton } from "react-native-reusables";
import { Skeleton } from "./ui/skeleton";

function SkeletonImage({ uri }: { uri: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <View className="w-full h-full rounded-lg overflow-hidden">
      {loading && <Skeleton className="w-full h-full rounded-xl bg-gray-100" />}
      <Image
        source={{ uri }}
        className={`w-full h-full rounded-lg ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  );
}
export default SkeletonImage;
