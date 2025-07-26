import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// --- Icon Configuration ---
// Define your icons and their positions here
const icons = [
  { src: require("~/assets/solana.png"), size: 60, top: 100, right: 40 },
  { src: require("~/assets/solana.png"), size: 50, top: 180, right: 20 },
  { src: require("~/assets/solana.png"), size: 45, top: 80, left: 30 },
  { src: require("~/assets/solana.png"), size: 55, top: 160, left: 25 },
  { src: require("~/assets/solana.png"), size: 65, bottom: 150, left: 40 },
  { src: require("~/assets/solana.png"), size: 30, bottom: 220, right: 50 },
  { src: require("~/assets/solana.png"), size: 50, bottom: 120, right: 60 },
];

const WelcomeScreen = () => {
  // Create an array of Animated.Value, one for each icon, initialized to 0
  const animatedValues = useRef(icons.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Define the animation sequence for each icon
    const animations = animatedValues.map((value) => {
      return Animated.spring(value, {
        toValue: 1,
        friction: 4, // Controls "bounciness"
        tension: 20, // Controls speed
        useNativeDriver: true, // Use native driver for better performance
      });
    });

    // Use Animated.stagger to run the animations with a 100ms delay between each
    Animated.stagger(100, animations).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Render each icon using its animation values */}
        {icons.map((icon, index) => {
          // Interpolate the animated value (0 to 1) to styles
          const scale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1], // Animate scale from 0.5 to 1
          });

          const opacity = animatedValues[index].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.7, 1], // Fade in
          });

          return (
            <Animated.Image
              key={index}
              source={icon.src}
              style={[
                styles.icon,
                {
                  width: icon.size,
                  height: icon.size,
                  top: icon.top,
                  bottom: icon.bottom,
                  left: icon.left,
                  right: icon.right,
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}

        {/* Main Content Card */}
        <LinearGradient
          colors={["#8A2BE2", "#4B0082", "#00BFFF"]} // Purple to blue gradient
          style={styles.card}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("~/assets/solana.png")} // Replace with your logo
              style={styles.logo}
            />
          </View>
        </LinearGradient>

        <View style={styles.bottomContent}>
          <Text style={styles.title}>Welcome to Coinbase Wallet</Text>
          <Text style={styles.subtitle}>
            By using Coinbase Wallet, you agree to the{" "}
            <Text style={styles.link}>terms</Text> and{" "}
            <Text style={styles.link}>privacy policy</Text>
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create new wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  icon: {
    position: "absolute", // This is crucial for floating icons
    resizeMode: "contain",
  },
  card: {
    width: 200,
    height: 300,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  bottomContent: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#A9A9A9",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  link: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
