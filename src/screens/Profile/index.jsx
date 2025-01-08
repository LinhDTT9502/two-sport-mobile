import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectUser } from "../../redux/slices/authSlice";
import LogoutButton from "../../components/Auth/LogoutButton";
import styles from "./css/AcouuntStyles";
import OrderStatus from "../../components/Profile/OrderStatus";
import LoyalPoint from "../../components/Profile/LoyalPoint";

export default function Account() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [noTokenModalVisible, setNoTokenModalVisible] = useState(false);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleChangePassword = () => {
    if (user?.Email) {
      navigation.navigate("AccountResetPassword", { email: user.Email });
    } else {
      Alert.alert("Lỗi", "Không tìm thấy email của bạn.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setNoTokenModalVisible(true);
          }
        } catch (error) {
          console.error("Error checking token:", error);
        }
      };

      checkToken();
    }, [])
  );

  const handleLogin = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("Login");
  };

  const handleCancel = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("LandingPage");
  };
  
  if (!user || noTokenModalVisible) {
    return (
      <View style={[styles.container, styles.modalOverlay]}>
        <Modal
          visible={noTokenModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setNoTokenModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bạn chưa có tài khoản</Text>
              <Text style={styles.modalText}>
                Vui lòng đăng nhập để tiếp tục.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, styles.whiteBackground]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý tài khoản</Text>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.profileName}>{user.FullName}</Text>
          {/* <Text style={styles.profileId}>Mã tài khoản: {user.UserId}</Text> */}
          <LoyalPoint userId={user.UserId} />
        </View>
      
        <OrderStatus />

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Bookmark")}
          >
            <Ionicons name="bookmark-outline" size={24} color="red" />
            <Text style={styles.settingText}>Bookmark</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="person-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("UserShipment")}
          >
            <Ionicons name="location-outline" size={24} color="#FF9900" />
            <Text style={styles.settingText}>Địa chỉ của tôi</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={24} color="#4CAF50" />
            <Text style={styles.settingText}>Thay đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={noTokenModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setNoTokenModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bạn chưa có tài khoản</Text>
              <Text style={styles.modalText}>
                Vui lòng đăng nhập để tiếp tục.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.loginButton]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {user && <LogoutButton />}
      </ScrollView>
    </SafeAreaView>
  );
}

