import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet, Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LandingPage from "../screens/HomeScreen/index";
import ProductList from "../screens/ProductList/index";
import Cart from "../screens/CartList/index";
import Account from "../screens/Profile/index";
import Blog from "../screens/Blog/index";
import { getUserCart } from "../services/cartService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, color, size, name, badge }) => {
  const animatedSize = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(animatedSize, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: animatedSize }] }}>
      <View>
        <Ionicons name={name} size={size} color={color} />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const fetchCartCount = async (setCartBadge) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      const userCart = await getUserCart(token);
      setCartBadge(userCart.length || 0);
    } else {
      const guestCart =
        JSON.parse(await AsyncStorage.getItem("guestCart")) || [];
      setCartBadge(guestCart.length);
    }
  } catch (error) {
    // console.error("Error fetching cart count:", error);
  }
};

export default function HomeController() {
  const [cartBadge, setCartBadge] = useState(0);

  useEffect(() => {
    loadCart()
  });

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userCart = await getUserCart(token);
        setCartBadge(userCart?.length);
      } else {
        const guestCart =
          JSON.parse(await AsyncStorage.getItem("guestCart")) || [];
          setCartBadge(guestCart?.length);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let badge;

          if (route.name === "LandingPage") {
            iconName = "home";
          } else if (route.name === "ProductList") {
            iconName = "search";
          } else if (route.name === "Cart") {
            iconName = "cart";
            badge = cartBadge;
          } else if (route.name === "Blog") {
            iconName = "newspaper";
          } else if (route.name === "Account") {
            iconName = "person";
          }

          return (
            <TabBarIcon
              focused={focused}
              name={iconName}
              size={22}
              color={color}
              badge={badge}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
            {route.name === "LandingPage"
              ? "Trang chủ"
              : route.name === "ProductList"
              ? "Sản phẩm"
              : route.name === "Cart"
              ? "Giỏ hàng"
              : route.name === "Blog"
              ? "Blog"
              : "Thông tin"}
          </Text>
        ),
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="LandingPage" component={LandingPage} />
      <Tab.Screen name="ProductList" component={ProductList} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Blog" component={Blog} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    paddingBottom: 8,
    marginTop: 30,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    position: "relative",
    bottom: 16,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666666",
    marginTop: 4,
  },
  activeTabLabel: {
    color: "#000000",
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});
