import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { H1 } from "./ui/typography";

const GradientH1 = ({ children }) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <MaskedView
      maskElement={
        <View style={{ backgroundColor: "transparent" }}>
          <H1>{children}</H1>
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

export default GradientH1;
