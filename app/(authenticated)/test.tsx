import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { H1 } from "~/components/ui/typography";

const ReformButton = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleClick = () => {
    // Your existing clicked_reform logic here
    // clicked_reform();
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable onPress={handleClick} className="w-full">
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={["#1E90FF", "#00B7EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <H1 style={styles.text}>Reform</H1>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: "80%",
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // For Android depth
  },
  text: {
    color: "black",
    fontWeight: "bold",
  },
});

export default ReformButton;
