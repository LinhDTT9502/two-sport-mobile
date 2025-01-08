import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { requestPasswordReset, performPasswordReset } from '../../services/authService';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const otpInputs = useRef([]);

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn.');
      return;
    }
    try {
      await requestPasswordReset(email);
      setOtpModalVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleResetPassword = async () => {
    const otpString = otpCode.join('');
    if (!otpString || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      await performPasswordReset({ otpCode: otpString, email, newPassword });
      Alert.alert('Thành công', 'Mật khẩu của bạn đã được đặt lại!');
      closeOtpModal();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể đặt lại mật khẩu.');
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Feather name="lock" size={64} color="#FFA500" style={styles.icon} />
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>Đừng lo lắng! Chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu.</Text>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={24} color="#FFA500" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
          <Text style={styles.buttonText}>Gửi mã OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* OTP and Password Modal */}
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
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContainer}>
              <Feather name="check-circle" size={64} color="#4CAF50" style={styles.modalIcon} />
              <Text style={styles.modalText}>Nhập mã OTP và mật khẩu mới</Text>
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
              <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color="#FFA500" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu mới"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color="#FFA500" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu mới"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              <TouchableOpacity style={styles.modalButton} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeOtpModal}>
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: width * 0.9,
    maxWidth: 400,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
  },
  backButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
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
  modalButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  modalCloseButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
});