import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserCart } from "../services/cartService";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";

const { width } = Dimensions.get("window");

const logoImage = require("../screens/Logo/2sport_logo.png");

export default function Header() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-width * 0.7));
  const [cartItems, setCartItems] = useState([])
  const user = useSelector(selectUser)
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    loadCart()
  }, []);

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userCart = await getUserCart(token);
        setCartItems(userCart || []);
      } else {
        const guestCart =
          JSON.parse(await AsyncStorage.getItem("guestCart")) || [];
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const MenuItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} />
      </View>
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("ProductList")}
        >
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}
          onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View>
            {cartItems?.length > 0 && <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>}
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={toggleMenu}
        >
          <Animated.View
            style={[
              styles.menuContent,
              { transform: [{ translateX: menuAnimation }] },
            ]}
          >
            <MenuItem
              title="Trang chủ"
              onPress={() => {
                toggleMenu();
                navigation.navigate("HomeController");
              }}
            />
            <MenuItem
              title="Sản phẩm"
              onPress={() => {
                toggleMenu();
                navigation.navigate('ProductList', { initialScreen: 'HomeController' });
              }}
            />
            <MenuItem
              title="Đơn hàng bạn đã mua"
              onPress={() => {
                toggleMenu();
                navigation.navigate("MyOrder", { status: "all", type: 'buy' })
              }}
            />
            <MenuItem
              title="Đơn hàng bạn đã thuê"
              onPress={() => {
                toggleMenu();
                navigation.navigate("MyOrder", { status: "all", type: 'rent' })
              }}
            />
            <MenuItem
              title="Về chúng tôi"
              onPress={() => {
                toggleMenu();
                navigation.navigate("Introduction");
              }}
            />
            <MenuItem
              title="Liên hệ"
              onPress={() => {
                toggleMenu();
                navigation.navigate("ContactUs");
              }}
            />
            <MenuItem
              title="Chính sách"
              onPress={() => {
                toggleMenu();
                navigation.navigate("Policy");
              }}
            />
            <MenuItem
              title="Hệ thống cửa hàng"
              onPress={() => {
                toggleMenu();
                navigation.navigate("BranchList");
              }}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuButton: {
    padding: 5,
    width: 40,
  },
  logoContainer: {
    marginLeft: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
  rightIcons: {
    flexDirection: "row",
    width: 80,
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
    position: 'relative'
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
    position: 'relative'
  },
  cartBadge: {
    position: "absolute",
    top: -30,
    right: -10,
    backgroundColor: "#FA7D0B",
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  menuContent: {
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemText: {
    fontSize: 18,
    color: "#333",
  },
});
