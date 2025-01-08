import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedShipment,
  setShipment,
  selectShipment,
} from "../../redux/slices/shipmentSlice";
import { getUserShipmentDetails } from "../../services/shipmentService";
import AddShipment from "../Shipment/AddShipment";
import UpdateShipment from "../Shipment/UpdateShipment";

const ShipmentList = ({ onSelectShipment }) => {
  const dispatch = useDispatch();
  const shipments = useSelector(selectShipment);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const shipmentData = await getUserShipmentDetails(token);
          dispatch(setShipment(shipmentData?.$values || []));
        }
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        Alert.alert("Error", "Failed to fetch shipment details.");
      }
    };

    fetchShipments();
  }, [dispatch]);

  const handleSelectShipment = (shipment) => {
    dispatch(selectedShipment(shipment));
    onSelectShipment(shipment);
    setIsModalVisible(false);
  };

  const openUpdateModal = (shipment) => {
    setCurrentShipment(shipment);
    setIsUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Địa chỉ đã lưu trữ</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Địa chỉ của tôi</Text>
          <FlatList
            data={shipments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.shipmentItem}>
                <TouchableOpacity
                  onPress={() => handleSelectShipment(item)}
                  style={styles.shipmentInfo}
                >
                  <Text style={styles.shipmentName}>{item.fullName}</Text>
                  <Text style={styles.shipmentPhone}>{item.phoneNumber}</Text>
                  <Text style={styles.shipmentAddress}>{item.address}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openUpdateModal(item)}
                  style={styles.updateButton}
                >
                  <Text style={styles.updateButtonText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <AddShipment refreshShipments={async () => await fetchShipments()} />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal UpdateShipment */}
      {isUpdateModalVisible && (
        <UpdateShipment
          shipment={currentShipment}
          onClose={() => {
            closeUpdateModal();
            closeModal(); // Đóng cả danh sách địa chỉ sau khi cập nhật
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF8800",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  shipmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEE",
    paddingVertical: 8,
  },
  shipmentInfo: {
    flex: 1,
    marginRight: 8,
  },
  shipmentName: {
    fontWeight: "bold",
  },
  shipmentPhone: {
    color: "#555",
  },
  shipmentAddress: {
    color: "#888",
  },
  updateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFA500",
  },
  updateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShipmentList;
