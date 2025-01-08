import React, { useEffect, useRef, useState } from "react";
import { View, Image, Animated, Easing, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getBrands } from "../../services/brandService";

const { width } = Dimensions.get("window");

const ScrollingLogos = () => {
  const [brands, setBrands] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBrands = async () => {
      const brandData = await getBrands();
      setBrands(brandData);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 0) {
      const totalWidth = brands.length * 100;
      const animatedWidth = totalWidth * 2;

      const infiniteScroll = () => {
        scrollX.setValue(0);
        Animated.timing(scrollX, {
          toValue: -totalWidth,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          infiniteScroll();
        });
      };

      infiniteScroll(); 
    }
  }, [brands]);

  const handleBrandPress = (brandName) => {
    navigation.navigate("BrandProduct", { brandName });
  };

  return (
    <View style={styles.logoContainer}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ translateX: scrollX }],
            width: brands.length * 200,
          },
        ]}
      >
        {[...brands, ...brands].map((brand, index) => (
          <TouchableOpacity
            key={index}
            style={styles.logo}
            onPress={() => handleBrandPress(brand.brandName)}
          >
            <Image
              source={{ uri: brand.logo }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    height: 60,
    overflow: "hidden",
    marginVertical: 20,
  },
  logoWrapper: {
    flexDirection: "row",
  },
  logo: {
    width: 100,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  brandLogo: {
    width: 80,
    height: 40,
  },
});

export default ScrollingLogos;
