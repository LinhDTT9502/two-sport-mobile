import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { fetchBranchs } from "../../services/branchService";
import { fetchProductsbyBranch } from "../../services/warehouseService";
import DeliveryAddress from "../Payment/DeliveryAddress";
import AddressForm from "../Shipment/AddressForm";
import { Ionicons } from "@expo/vector-icons";
import { selectUser } from "../../redux/slices/authSlice";

const OrderMethod = ({
  userData,
  setUserData,
  selectedOption,
  handleOptionChange,
  selectedBranchId,
  setSelectedBranchId,
}) => {
  const [branches, setBranches] = useState([]);
  const [branchStatus, setBranchStatus] = useState({});
  const user = useSelector(selectUser);

  useEffect(() => {
    const loadBranchesWithStatus = async () => {
      try {
        const branchData = await fetchBranchs();
        setBranches(branchData);

        const statusPromises = branchData.map(async (branch) => {
          const products = await fetchProductsbyBranch(branch.id);

          const isAvailable = products.some(
            (product) => product.availableQuantity > 0
          );
          return {
            branchId: branch.id,
            status: isAvailable ? "Còn hàng" : "Hết hàng",
          };
        });

        const statuses = await Promise.all(statusPromises);

        const statusMap = {};
        statuses.forEach(({ branchId, status }) => {
          statusMap[branchId] = status;
        });
        setBranchStatus(statusMap);
      } catch (error) {
        console.error("Error loading branches or availability:", error);
        Alert.alert("Error", "Unable to load branch data.");
      }
    };

    loadBranchesWithStatus();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
  };

  const handleAddressChange = (address) => {
    setUserData((prev) => ({
      ...prev,
      address: address,
    }));
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Phương thức nhận hàng</Text> */}
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("HOME_DELIVERY")}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === "HOME_DELIVERY" && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioLabel}>Giao tận nơi</Text>
        </TouchableOpacity>

        {selectedOption === "HOME_DELIVERY" && (
          user ? <View></View> : <View style={styles.deliveryContainer}>
            <AddressForm onAddressChange={handleAddressChange} />
          </View>
        )}

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("STORE_PICKUP")}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === "STORE_PICKUP" && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioLabel}>Nhận tại cửa hàng</Text>
        </TouchableOpacity>

        {selectedOption === "STORE_PICKUP" && (
          <FlatList
            data={branches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.branchItem,
                  selectedBranchId === item.id && styles.selectedBranchItem,
                  branchStatus[item.id] === "Hết hàng" &&
                  styles.disabledBranchItem,
                ]}
                onPress={() =>
                  branchStatus[item.id] !== "Hết hàng" &&
                  handleBranchChange(item.id)
                }
                disabled={branchStatus[item.id] === "Hết hàng"}
              >
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName}>{item.branchName}</Text>
                  <Text style={styles.branchLocation}>{item.location}</Text>
                  <Text
                    style={[
                      styles.branchStatus,
                      branchStatus[item.id] === "Còn hàng"
                        ? styles.available
                        : styles.unavailable,
                    ]}
                  >
                    {branchStatus[item.id]}
                  </Text>
                </View>
                {selectedBranchId === item.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const COLORS = {
  primary: "#3366FF",
  danger: "#E74C3C",
  gray: "#BDC3C7",
  lightGray: "#F0F0F0",
  white: "#FFFFFF",
  black: "#000000",
  success: "#2ECC71",
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.primary,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  deliveryContainer: {
    marginTop: 16,
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 8,
  },
  branchItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedBranchItem: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  disabledBranchItem: {
    opacity: 0.5,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  branchLocation: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  branchStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.danger,
  },
});

export default OrderMethod;

