import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { verifyAccountMobileAPI } from '../../api/apiAuth';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { userName, email } = route.params;
  const [otpCode, setOtpCode] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyAccountMobileAPI({ userName, email, otpCode });
      if (response === 200) {
        Alert.alert("Xác nhận thành công", "Tài khoản của bạn đã được xác nhận.");
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert("Xác nhận thất bại", response.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Xác nhận OTP không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <View>
      <Text>Nhập mã OTP đã gửi tới email của bạn:</Text>
      <TextInput
        placeholder="Mã OTP"
        value={otpCode}
        onChangeText={setOtpCode}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleVerifyOtp}>
        <Text>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOtpScreen;
