import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function InstagramButton() {
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <LinearGradient
        colors={["#f58529", "#dd2a7b", "#8134af", "#515bd4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-8 py-3 rounded-xl"
      >
        <Text className="text-white text-lg font-bold text-center">
          Instagram
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
