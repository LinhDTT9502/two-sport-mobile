import React from "react";
import { TouchableOpacity, Text, Alert, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { signOutUser } from "../../services/authService";
import { signOut } from "../../api/apiAuth";

const LogoutButton = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Thiếu thông tin đăng xuất');
      }
      navigation.navigate('LandingPage', { initialScreen: 'HomeController' });
      // const response = await signOut({
      //   token,
      //   refreshToken,
      //   userId: parseInt(userId),
      // });
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      dispatch(logout())
      Alert.alert("Thành công", "Đăng xuất thành công!");
      // if (response.status === 200) {
      //   await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userId']);
      //   navigation.navigate('Login');
      //   Alert.alert('Thành công', 'Đăng xuất thành công!');
      // } else {
      //   throw new Error('Đăng xuất thất bại');
      // }
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const refreshToken = await AsyncStorage.getItem('refreshToken');
      
  //     if (!token || !refreshToken) {
  //       console.error('Token or RefreshToken is missing!');
  //       return;
  //     }

  //     const data = { token, refreshToken };

  //     // You would send `data` to your API logout endpoint here if needed.
  //     const response = await signOut(data);

  //     Alert.alert("Thành công", "Đăng xuất thành công!");
  //     dispatch(logout());
  //     await AsyncStorage.clear();
  //     navigation.navigate('LandingPage', { initialScreen: 'HomeController' });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
  //   }
  // };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Đăng xuất</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    margin: 16,
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LogoutButton;
