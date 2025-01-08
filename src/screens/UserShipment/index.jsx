import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import {
  selectShipment,
  // selectShipments,
  setShipment,
} from "../../redux/slices/shipmentSlice";
import { getUserShipmentDetails } from "../../services/shipmentService";
import AddShipment from "../../components/Shipment/AddShipment";
import UpdateShipment from "../../components/Shipment/UpdateShipment";
import DeleteShipment from "../../components/Shipment/DeleteShipment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserShipment({ navigation }) {
  const dispatch = useDispatch();
  const shipment = useSelector(selectShipment);
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  // const SM = useSelector(selectShipments);

  // const fetchShipments = async () => {
  //   const token = await AsyncStorage.getItem('token');
  //     console.log(token);
  //   try {
  //     if (!token) {
  //       Alert.alert('Error', 'No token found');
  //       return;
  //     }
  //     const shipmentData = await getUserShipmentDetails(token);
  //     console.log(shipmentData);

  //     // dispatch(setShipment(shipmentData.$values));
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching shipments:', error);
  //     Alert.alert('Error', 'Failed to fetch shipments');
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchShipments();
  // }, [dispatch]);

  const fetchShipments = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }
      const shipmentData = await getUserShipmentDetails(token);
      dispatch(setShipment(shipmentData));
      setShipments(shipmentData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      Alert.alert("Error", "Failed to fetch shipments");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [dispatch]);

  useEffect(() => {
    const getShipment = async () => {
      const token = await AsyncStorage.getItem("token");
      // console.log(token);
      try {
        if (token) {
          const shipmentData = await getUserShipmentDetails(token);
          // console.log(shipmentData);

          dispatch(setShipment(shipmentData));
          setShipments(shipmentData);
          setIsLoading(false);
          // console.log(shipments);
        }
      } catch (error) {
        console.error("Error fetching shipment:", error);
        setIsLoading(false);
      }
    };

    getShipment();
  }, [dispatch]);

  useEffect(() => {}, [shipments, dispatch]);

  const handleUpdateShipment = (shipment) => {
    setCurrentShipment(shipment);
    setIsUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setCurrentShipment(null);
  };

  const renderShipmentItem = ({ item }) => (
    <View style={styles.shipmentItem}>
      <View style={styles.shipmentInfo}>
        <Text style={styles.shipmentName}>{item.fullName}</Text>
        <View style={styles.shipmentDetails}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.shipmentDetailsText}>{item.phoneNumber}</Text>
        </View>
        <View style={styles.shipmentDetails}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.shipmentDetailsText}>{item.address}</Text>
        </View>
        <View style={styles.shipmentDetails}>
        <Ionicons name="mail-outline" size={16} color="#666" />
        <Text style={styles.shipmentDetailsText}>{item.email}</Text>
      </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleUpdateShipment(item)}
          style={styles.updateButton}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" />
        </TouchableOpacity>
        <DeleteShipment
          id={item.id}
          refreshShipments={fetchShipments}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Loading shipments...</Text>
        </View>
      ) : shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={50} color="#CCC" />
          <Text style={styles.emptyText}>No shipment details available</Text>
        </View>
      ) : (
        <FlatList
          data={shipments}
          renderItem={renderShipmentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <AddShipment refreshShipments={fetchShipments} />
      {isUpdateModalVisible && (
        <UpdateShipment shipment={currentShipment} onClose={closeUpdateModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40, // Adjust for status bar
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
  },
  shipmentItem: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  shipmentDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    width: "85%",
  },
  shipmentDetailsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
});