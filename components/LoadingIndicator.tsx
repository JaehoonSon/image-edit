import React, { useState, useEffect } from "react";
import { View } from "react-native";
import GradientText from "./GradientText";

const LoadingIndicator = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400); // adjust speed here

    return () => clearInterval(interval);
  }, []);

  return <GradientText text={`Loading${dots}`} />;
};

export default LoadingIndicator;
