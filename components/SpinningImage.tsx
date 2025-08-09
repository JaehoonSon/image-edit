import React, { useRef, useEffect } from "react";
import { Animated, Easing, StyleProp, ImageStyle } from "react-native";

interface SpinningImageProps {
  src: number;
  size?: number;
  duration?: number;
  style?: StyleProp<ImageStyle>;
}

const SpinningImage: React.FC<SpinningImageProps> = ({
  src,
  size = 100,
  duration = 1000,
  style,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim, duration]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Image
      source={src}
      style={[
        { width: size, height: size, transform: [{ rotate: spin }] },
        style,
      ]}
      resizeMode="contain"
    />
  );
};

export default SpinningImage;
