import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { sendOtpRequest, verifyAccountMobile } from "../../../services/authService";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VerifyAccountScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const otpInputs = useRef([]);

//   useEffect(() => {
//     console.log("isOtpModalVisible State Changed:", isOtpModalVisible);
//   }, [isOtpModalVisible]);

  const handleSendOtp = async () => {
    if (!userName || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ username và email.");
      return;
    }

    try {
      setLoading(true);
      const response = await sendOtpRequest({ userName, email });
      // console.log("API Response in handleSendOtp:", response);

      if (response.message === "Reset password OTP email sent successfully.") {
        setLoading(false);
        setOtpModalVisible(true);
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn!");
      } else {
        setLoading(false);
        Alert.alert("Lỗi", "Username hoặc email không khớp với dữ liệu. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      setLoading(false);
    //   console.error("Error sending OTP:", error);
      Alert.alert("Lỗi", "Không thể gửi OTP. Vui lòng kiểm tra thông tin và thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await verifyAccountMobile({
        username: userName,
        email,
        OtpCode: otpString,
      });
  
      // console.log("OTP Verification Response:", response);
  
      if (response === 200) {
        setLoading(false);
        setOtpModalVisible(false);
        Alert.alert("Thành công", "Tài khoản đã được xác minh!");
        navigation.navigate("Login");
      } else {
        setLoading(false);
        Alert.alert("Lỗi",  response?.message || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch (error) {
      setLoading(false);
    //   console.error("Verification error:", error);
      Alert.alert("Lỗi", "Không thể xác minh OTP. Vui lòng thử lại.");
    }
  };
  

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpCode];
    newOtp[index] = value.replace(/\D/, "");
    setOtpCode(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const closeOtpModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setOtpModalVisible(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>Xác minh tài khoản</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập username"
                value={userName}
                onChangeText={setUserName}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="none"
        transparent={true}
        visible={isOtpModalVisible}
        onRequestClose={closeOtpModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.1, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP</Text>
            <View style={styles.otpContainer}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(input) => (otpInputs.current[index] = input)}
                />
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.verifyButton]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Đang xác minh..." : "Xác minh"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closeOtpModal}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: "#FFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFA500",
    height: 55,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
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
    marginBottom: 20,
    color: "#333",
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    marginTop: 20,
  },
  verifyButton: {
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#FF3B30",
  },
});

export default VerifyAccountScreen;

