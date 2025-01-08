import React, { useRef, useEffect } from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";

export default function AnimatedAddToCart({ productImage, onAnimationComplete }) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: 200, y: -400 }, // Change to match your layout
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      position.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      onAnimationComplete(); // Notify parent of completion
    });
  }, []);

  return (
    <Animated.Image
      source={{ uri: productImage }}
      style={[
        styles.animatedImage,
        {
          transform: position.getTranslateTransform(),
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  animatedImage: {
    width: 80,
    height: 80,
    position: "absolute",
    left: 20, // Adjust based on where the animation starts
    top: 20,  // Adjust based on where the animation starts
  },
});
