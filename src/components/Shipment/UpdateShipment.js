import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUserShipmentDetail } from '../../services/shipmentService';
import { updateShipment } from '../../redux/slices/shipmentSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressForm from './AddressForm';

export default function UpdateShipment({ shipment, onClose }) {
  const [formData, setFormData] = useState({ ...shipment });
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateShipment = async () => {
    if (!validateForm()) return; // Validate form trước khi thực hiện update

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      const updatedShipment = await updateUserShipmentDetail(
        shipment.id,
        token,
        formData
      );
      dispatch(updateShipment(updatedShipment.data));
      onClose();
    } catch (error) {
      console.error('Error updating shipment details:', error);
      Alert.alert('Error', 'Failed to update shipment');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const openAddressModal = () => {
    setAddressModalVisible(true);
  };

  const closeAddressModal = () => {
    setAddressModalVisible(false);
  };

  const handleAddressChange = (fullAddress) => {
    setFormData({ ...formData, address: fullAddress });
    closeAddressModal();
  };

  // Hàm validate toàn bộ các trường
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (!formData.address) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ');
      return false;
    }

    return true;
  };

  // Hàm kiểm tra số điện thoại
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10,11}$/; // Số điện thoại hợp lệ từ 10-11 chữ số
    return phoneRegex.test(phoneNumber);
  };

  // Hàm kiểm tra email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật địa chỉ</Text>
          <TextInput
            placeholder="Họ và tên"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            style={styles.input}
          />
          <TouchableOpacity onPress={openAddressModal} style={styles.addressInput}>
            <Text style={styles.addressText}>
              {formData.address ? formData.address : 'Chọn địa chỉ'}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateShipment} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal cho AddressForm */}
      <Modal visible={addressModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
            <AddressForm onAddressChange={handleAddressChange} />
            <TouchableOpacity onPress={closeAddressModal} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
