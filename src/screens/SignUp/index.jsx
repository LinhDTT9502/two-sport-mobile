import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUpUser, verifyAccountMobile } from "../../services/authService";
import { Feather } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const navigation = useNavigation();
  const otpInputs = useRef([]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const userData = { fullName, username, email, password };
      await signUpUser(userData);
      setOtpModalVisible(true);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        `Lỗi từ máy chủ: ${error.message || "Vui lòng thử lại sau."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số OTP!");
      return;
    }
  
    setLoading(true);
  
    try {
      await verifyAccountMobile({ username, email, OtpCode: otpString });
      Alert.alert(
        "Thành công",
        "Tài khoản đã được xác thực. Vui lòng đăng nhập."
      );
      setOtpModalVisible(false);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", `Mã OTP không chính xác hoặc đã hết hạn.`);
      // console.error("Error in verifyAccountMobile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.shape1} />
        <View style={styles.shape2} />

        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.eyeIconContainer}
          >
            <Feather name={secureTextEntry ? "eye-off" : "eye"} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={confirmSecureTextEntry}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
            style={styles.eyeIconContainer}
          >
            <Feather name={confirmSecureTextEntry ? "eye-off" : "eye"} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.signupButtonText}>Tạo tài khoản</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInLink}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>

        <Modal visible={otpModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác thực tài khoản</Text>
              <Text style={styles.modalText}>Chúng tôi đã gửi một mã OTP đến email của bạn. Vui lòng nhập mã 6 số bên dưới:</Text>
              <View style={styles.otpContainer}>
                {otpCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(input) => (otpInputs.current[index] = input)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.signupButtonText}>Xác nhận</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
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
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
    color: "#888",
    marginBottom: 30,
  },
  input: {
    height: 55,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
    backgroundColor: "#F8F8F8",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    height: 55,
  },
  eyeIconContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: "#FFA500",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInLink: {
    color: "#FFA500",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#F8F8F8',
  },
  verifyButton: {
    backgroundColor: "#FFA500",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
});