import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentMethod from "../../components/Payment/PaymentMethod";
import CheckoutButton from "../../components/Payment/CheckoutBtn";
import AddShipment from "../../components/Shipment/AddShipment";
import { fetchBranchs } from "../../services/branchService";
import { getUserShipmentDetails } from "../../services/shipmentService";
import { selectCartItems, loadCartState } from "../../redux/slices/cartSlice";
import {
  selectedShipment,
  setShipment,
} from "../../redux/slices/shipmentSlice";

const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  dark: "#2C3E50",
  white: "#FFFFFF",
  gray: "#BDC3C7",
  lightGray: "#F0F0F0",
};

export default function Checkout({ route }) {
  const { selectedCartItems } = route.params || { selectedCartItems: [] };
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const shipment = useSelector(selectedShipment);

  const [branches, setBranches] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedOption, setSelectedOption] = useState("HOME_DELIVERY");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [note, setNote] = useState("");
  const [gender, setGender] = useState("");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const loadCart = async () => {
      await dispatch(loadCartState());
    };
    loadCart();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCartItems || selectedCartItems.length === 0) {
      Alert.alert("Lỗi", "Không có sản phẩm nào được chọn để thanh toán.");
      navigation.goBack();
    }
  }, [selectedCartItems]);

  useEffect(() => {
    const fetchBranchesAndShipments = async () => {
      try {
        const branchData = await fetchBranchs();
        setBranches(branchData);
        const token = await AsyncStorage.getItem("token");
        const shipmentData = await getUserShipmentDetails(token);
        setShipments(shipmentData);
        dispatch(setShipment(shipmentData[0]));
      } catch (error) {
        console.error("Error fetching branches or shipments:", error);
        Alert.alert("Error", "Unable to fetch delivery data.");
      }
    };
    fetchBranchesAndShipments();
  }, [dispatch]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const renderProductSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tóm tắt sản phẩm</Text>
      {selectedCartItems.map((item) => (
        <View key={item.id} style={styles.productItem}>
          <Image source={{ uri: item.imgAvatarPath }} style={styles.image} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productQuantity}>
              Số lượng: {item.quantity}
            </Text>
            <Text style={styles.productPrice}>
              Giá: {formatCurrency(item.price)}
            </Text>
            <Text style={styles.productTotal}>
              Tổng: {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng:</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(
            selectedCartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )
          )}
        </Text>
      </View>
    </View>
  );

const renderDeliveryOptions = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
    <TouchableOpacity
      style={[
        styles.radioOption,
        selectedOption === "HOME_DELIVERY" && styles.selectedOption,
      ]}
      onPress={() => handleOptionChange("HOME_DELIVERY")}
    >
      <Ionicons
        name={
          selectedOption === "HOME_DELIVERY"
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={24}
        color={COLORS.primary}
      />
      <Text style={styles.optionText}>Giao tận nhà</Text>
    </TouchableOpacity>
    {selectedOption === "HOME_DELIVERY" && (
      <View style={styles.deliveryDetails}>
        {/* Nút mở modal chọn địa chỉ */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setIsAddressModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>
            {shipment
              ? `Địa chỉ đã chọn: ${shipment.address}`
              : "Chọn địa chỉ của bạn"}
          </Text>
        </TouchableOpacity>

        {/* Nút thêm địa chỉ mới */}
        <AddShipment />
      </View>
    )}
    <TouchableOpacity
      style={[
        styles.radioOption,
        selectedOption === "STORE_PICKUP" && styles.selectedOption,
      ]}
      onPress={() => handleOptionChange("STORE_PICKUP")}
    >
      <Ionicons
        name={
          selectedOption === "STORE_PICKUP"
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={24}
        color={COLORS.primary}
      />
      <Text style={styles.optionText}>Nhận tại cửa hàng</Text>
    </TouchableOpacity>
    {selectedOption === "STORE_PICKUP" && (
      <View>
        {branches.map((branch) => (
          <TouchableOpacity
            key={branch.id}
            style={[
              styles.radioOption,
              selectedBranchId === branch.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedBranchId(branch.id)}
          >
            <Text>{branch.branchName}</Text>
            <Text>{branch.location}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);


const renderAddressModal = () => (
  <Modal
    visible={isAddressModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setIsAddressModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
        <ScrollView>
          {shipments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.addressOption,
                shipment?.id === item.id && styles.selectedAddressOption,
              ]}
              onPress={() => {
                // console.log("Selected Address:", item);
                dispatch(setShipment(item));
                setIsAddressModalVisible(false);
              }}
            >
              <Text style={styles.addressText}>{item.fullName}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsAddressModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

  

  const renderGenderModal = () => (
    <Modal
      visible={isGenderModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsGenderModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn giới tính</Text>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Anh" && styles.selectedGenderOption,
            ]}
            onPress={() => {
              setGender("Anh");
              setIsGenderModalVisible(false);
            }}
          >
            <Text style={styles.genderText}>Anh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Chị" && styles.selectedGenderOption,
            ]}
            onPress={() => {
              setGender("Chị");
              setIsGenderModalVisible(false);
            }}
          >
            <Text style={styles.genderText}>Chị</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsGenderModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Thanh toán</Text>
        </View>
        {renderProductSummary()}
        {renderDeliveryOptions()}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mã giảm giá</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã giảm giá"
            value={discountCode}
            onChangeText={setDiscountCode}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Thêm ghi chú"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <PaymentMethod
          selectedOption={selectedPaymentMethod}
          handleOptionChange={setSelectedPaymentMethod}
        />
        <CheckoutButton
          selectedOption={selectedOption}
          shipment={shipment}
          selectedBranchId={selectedBranchId}
          selectedPaymentMethod={selectedPaymentMethod}
          discountCode={discountCode}
          note={note}
          selectedCartItems={cartItems}
        />
      </ScrollView>
      {renderAddressModal()}
      {renderGenderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productQuantity: {
    color: COLORS.gray,
  },
  productPrice: {
    color: COLORS.gray,
  },
  productTotal: {
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },

  selectButtonGender: {
    border: "1px solid COLORS.primary",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  selectButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedAddress: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addressOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedAddressOption: {
    backgroundColor: COLORS.lightGray,
  },
  genderOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedGenderOption: {
    backgroundColor: COLORS.lightGray,
  },
  genderText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryDetails: {
    marginTop: 8,
  },
});
