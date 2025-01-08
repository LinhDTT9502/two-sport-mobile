import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const LogoScreen = ({ navigation }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // Navigate to splash screen after animation
      navigation.replace('Splash');
    });
  }, []);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return ( 
    <View style={styles.container}>
      <Animated.Image
        source={require('./2sport_logo.png')} // Your logo image path
        style={[styles.logo, { transform: [{ scale }], opacity }]} // Apply both scale and opacity
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
 
});

export default LogoScreen;
