import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientText = ({ text = "Loading", fontSize = 32 }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <MaskedView
        style={{ flexDirection: "row", height: 60 }}
        maskElement={
          <View
            style={{
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "transparent",
                fontSize,
              }}
            >
              {text}
            </Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#D946EF", "#EC4899", "#F97316", "#FBBF24"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );
};

export default GradientText;
