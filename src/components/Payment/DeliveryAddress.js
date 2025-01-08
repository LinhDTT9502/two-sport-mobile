import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { getUserShipmentDetails } from "../../services/shipmentService";
import { selectedShipment, setShipment } from "../../redux/slices/shipmentSlice";

const DeliveryAddress = ({ userData, setUserData }) => {
  const dispatch = useDispatch();
  const shipments = useSelector((state) => state.shipment.shipments);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: "", address: "", phoneNumber: "" });

  useEffect(() => {
    const fetchShipments = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const shipmentData = await getUserShipmentDetails(token);
          dispatch(setShipment(shipmentData.$values));
        } catch (error) {
          Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ");
        }
      }
    };
    fetchShipments();
  }, [dispatch]);

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!newAddress.fullName || !newAddress.address || !newAddress.phoneNumber) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    // Giả sử có API để lưu địa chỉ mới
    // Lưu địa chỉ vào danh sách hoặc gọi API
    const updatedShipments = [...shipments, { ...newAddress, id: Date.now() }];
    dispatch(setShipment(updatedShipments));
    setIsAddingAddress(false);
    setNewAddress({ fullName: "", address: "", phoneNumber: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Địa chỉ giao hàng</Text>
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.addressItem}>
            <Text style={styles.addressText}>{item.fullName}</Text>
            <Text style={styles.addressText}>{item.address}</Text>
            <Text style={styles.addressText}>{item.phoneNumber}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có địa chỉ giao hàng</Text>}
      />
      {!isAddingAddress && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
      )}
      {isAddingAddress && (
        <View style={styles.addAddressForm}>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={newAddress.fullName}
            onChangeText={(text) => setNewAddress((prev) => ({ ...prev, fullName: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={newAddress.address}
            onChangeText={(text) => setNewAddress((prev) => ({ ...prev, address: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={newAddress.phoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) => setNewAddress((prev) => ({ ...prev, phoneNumber: text }))}
          />
          <View style={styles.buttonContainer}>
            <Button title="Lưu" onPress={handleSaveAddress} />
            <Button title="Hủy" color="red" onPress={() => setIsAddingAddress(false)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addressText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addAddressForm: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DeliveryAddress;
