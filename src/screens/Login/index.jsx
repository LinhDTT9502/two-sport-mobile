import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux"
import { login, selectUser } from "../../redux/slices/authSlice";
import { authenticateUser } from "../../services/authService";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          navigation.navigate("HomeController");
        }
      } catch (error) {
        // console.error("Error checking login status:", error);
      }
    };

    checkLoggedIn();
  }, [navigation]);

  // const handleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     if (username && password) {
  //       // Gọi API authenticateUser
  //       const decoded = await authenticateUser(username, password);

  //       // console.log("Decoded user data:", decoded);

  //       // Kiểm tra nếu email chưa được xác minh
  //       if (decoded.EmailConfirmed === "False" || decoded.EmailConfirmed === false) {
  //         if (!decoded.UserName || !decoded.Email) {
  //           throw new Error("UserName hoặc Email bị thiếu trong phản hồi.");
  //         }

  //         // Gửi OTP nếu email chưa được xác minh
  //         await resendOtpRequest({
  //           userName: decoded.UserName,
  //           email: decoded.Email,
  //         });

  //         Alert.prompt(
  //           "Xác minh tài khoản",
  //           "Nhập mã OTP đã được gửi đến email của bạn:",
  //           [
  //             {
  //               text: "Hủy",
  //               onPress: () => console.log("Hủy xác minh OTP"),
  //               style: "cancel",
  //             },
  //             {
  //               text: "Xác nhận",
  //               onPress: async (otpCode) => {
  //                 try {
  //                   // Gọi API để xác minh OTP
  //                   await verifyAccountMobile({
  //                     username: decoded.UserName,
  //                     email: decoded.Email,
  //                     OtpCode: otpCode,
  //                   });
  //                   Alert.alert("Thành công", "Tài khoản đã được xác minh!");
  //                   navigation.navigate("HomeController");
  //                 } catch (error) {
  //                   console.error("OTP Verification Error:", error);
  //                   Alert.alert("Lỗi", "Mã OTP không hợp lệ. Vui lòng thử lại.");
  //                 }
  //               },
  //             },
  //           ],
  //           "plain-text"
  //         );
  //       } else {
  //         // Email đã được xác minh, tiếp tục đăng nhập
  //         dispatch(login(decoded));
  //         navigation.navigate("HomeController");
  //       }
  //     } else {
  //       Alert.alert("Đăng nhập thất bại", "Vui lòng nhập tên đăng nhập và mật khẩu.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error.message || error.response?.data || error);
  //     Alert.alert("Lỗi", error.message || "Thông tin đăng nhập không hợp lệ.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await authenticateUser(username, password);

      if (response.isUnconfirmed) {
        Alert.alert(
          "Tài khoản chưa xác thực",
          "Bạn có muốn xác thực ngay bây giờ không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Xác thực",
              onPress: () => {
                navigation.navigate("VerifyAccount", { userName: username });
              },
            },
          ]
        );
        return;
      }
  

      // Đăng nhập thành công
      const decoded = await authenticateUser(username, password);
      dispatch(login(decoded));
      navigation.navigate("HomeController");
    } catch (error) {
      // console.error("Login error:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Đăng nhập thất bại."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSocialLogin = (platform) => {
    Alert.alert(
      `Đăng nhập bằng ${platform}`,
      "Chức năng này chưa được triển khai."
    );
  };

  const handleGuestLogin = () => {
    Alert.alert("Đăng nhập khách", "Chức năng này chưa được triển khai.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.shape1} />
      <View style={styles.shape2} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập vào Goods Exchange</Text>
        <Text style={styles.subtitle}>
          Chào mừng bạn trở lại! Đăng nhập bằng tài khoản xã hội hoặc email để
          tiếp tục
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại, email hoặc tên người dùng"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.socialLoginContainer}>
          
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Google")}
          >
            <Ionicons name="logo-google" size={24} color="#FFA500" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Facebook")}
          >
            <Ionicons name="logo-facebook" size={24} color="#FFA500" />
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => navigation.navigate("LandingPage")}
        >
          <Text style={styles.guestButtonText}>Xem với vai trò là khách</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIconContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: "#FFA500",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#FFA500",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestButton: {
    backgroundColor: "#FFF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  guestButtonText: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#888",
    fontSize: 14,
  },
  registerLink: {
    color: "#FFA500",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  shape1: {
    position: "absolute",
    width: 250,
    height: 250,
    backgroundColor: "#FFA500",
    borderRadius: 125,
    top: -100,
    right: -50,
    opacity: 0.5,
  },
  shape2: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#FFA500",
    borderRadius: 150,
    bottom: -150,
    left: -50,
    opacity: 0.7,
  },
});

export default LoginScreen;
