import React from 'react';
import { Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { deleteUserShipmentDetail } from '../../services/shipmentService';
import { useDispatch } from 'react-redux';
import { deleteShipment } from '../../redux/slices/shipmentSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteShipment({ id, refreshShipments }) {
  const dispatch = useDispatch();

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Xóa", 
          onPress: handleDeleteShipment,
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteShipment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      await deleteUserShipmentDetail(id, token);
      dispatch(deleteShipment(id));
      refreshShipments(); 
      Alert.alert('Success', 'Shipment deleted successfully');
    } catch (error) {
      console.error('Error deleting shipment:', error);
      Alert.alert('Error', 'Failed to delete shipment');
    }
  };

  return (
    <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={20} color="#FFF" />
      {/* <Text style={styles.deleteButtonText}>Xóa</Text> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});