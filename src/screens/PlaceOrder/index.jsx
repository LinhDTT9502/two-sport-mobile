import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  SectionList,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentMethod from "../../components/Payment/PaymentMethod";
import CheckoutButton from "../../components/Payment/CheckoutBtn";
import { fetchBranchs } from "../../services/branchService";
import { getUserShipmentDetails } from "../../services/shipmentService";
import { selectCartItems } from "../../redux/slices/cartSlice";
import {
  selectedShipment,
  setShipment,
} from "../../redux/slices/shipmentSlice";
import OrderMethod from "../../components/Payment/OrderMethod";
import { useFocusEffect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { selectUser } from "../../redux/slices/authSlice";
const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  dark: "#2C3E50",
  white: "#FFFFFF",
  gray: "#BDC3C7",
  lightGray: "#F0F0F0",
};

export default function PlaceOrderScreen({ route }) {
  const { selectedCartItems, type } = route.params || { selectedCartItems: [] };
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState(
    selectedCartItems || useSelector(selectCartItems)
  );
  const userLogin = useSelector(selectUser);
  const shipment = useSelector((state) => state.shipment || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [branches, setBranches] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedOption, setSelectedOption] = useState("HOME_DELIVERY");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [dateSelected, setDateSelected] = useState({
    start: null,
    end: null,
    count: 0,
  });
  const [note, setNote] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    gender: "male",
    email: "",
    phoneNumber: "",
    address: "",
    shipmentDetailID: "",
    userId: userLogin?.UserId || 0,
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     Alert.alert("Cảnh báo", "Bạn không thể quay lại để đặt hàng lại.", [
  //       { text: "OK", onPress: () => navigation.navigate("LandingPage") },
  //     ]);
  //     return true;
  //   }, [])
  // );

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsGuest(true);
      } else {
        setIsGuest(false);
        fetchShipments(token);
      }
    };

    const fetchShipments = async (token) => {
      try {
        const shipmentData = await getUserShipmentDetails(token);
        setShipments(shipmentData.$values || []);
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        Alert.alert("Error", "Unable to fetch delivery data.");
      }
    };

    checkLoginStatus();
  }, []);

  const handleSelectShipment = (item) => {
    if (!item || !item.id) {
      Alert.alert("Lỗi", "Không thể chọn địa chỉ giao hàng.");
      return;
    }

    dispatch(setShipment(item));
    setUserData((prev) => ({
      ...prev,
      shipmentDetailID: item.id,
      fullName: item.fullName || prev.fullName,
      email: item.email || prev.email,
      phoneNumber: item.phoneNumber || prev.phoneNumber,
      address: item.address || prev.address,
    }));
    setIsModalVisible(false);
  };

  const handleGuestInput = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (type === "buy"
        ? item.price * item.quantity
        : item.rentPrice * item.quantity * (item?.dateSelected?.count || 1)),
    0
  );

  useEffect(() => {
    const loadCart = async () => {};
    loadCart();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCartItems || selectedCartItems.length === 0) {
      Alert.alert("Lỗi", "Không có sản phẩm nào được chọn để thanh toán.");
      navigation.goBack();
    }
  }, [selectedCartItems, navigation]);

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
        // console.error("Error fetching branches or shipments:", error);
        // Alert.alert("Error", "Unable to fetch delivery data.");
      }
    };
    fetchBranchesAndShipments();
  }, [dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAddressChange = (address) => {
    // console.log("Address received from AddressForm:", address);
    setUserData((prev) => ({
      ...prev,
      address,
    }));
  };

  const handleConfirm = (_, val) => {
    const data = JSON.parse(JSON.stringify(cartItems));

    const [key, index] = isDatePickerVisible.split("-");
    if (!data?.[index]?.["dateSelected"]) {
      data[index]["dateSelected"] = {};
    }
    if (key === "start") {
      data[index]["dateSelected"]["end"] = null;
    }
    data[index]["dateSelected"][key] = val;
    if (
      data?.[index]?.["dateSelected"]?.start &&
      data?.[index]?.["dateSelected"]?.end
    ) {
      data[index]["dateSelected"].count = dayjs(
        data?.[index]?.["dateSelected"]?.end
      ).diff(dayjs(data?.[index]?.["dateSelected"]?.start), "day");
    }
    setCartItems(data);
    setDatePickerVisibility(false);
  };

  const renderCustomerInfo = () => {
    if (isGuest) {
      return (
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
            {[
              { title: "Anh", value: "male" },
              { title: "Chị", value: "female" },
            ].map((item) => {
              const isSelected = userData?.gender === item.value;
              return (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      setUserData((pre) => ({ ...pre, gender: item.value }))
                    }
                    style={[
                      styles.optionContainer,
                      isSelected && styles.selectedOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.selectedRadioButton,
                      ]}
                    >
                      {isSelected && <View style={styles.selectedDot} />}
                    </View>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={userData.fullName}
            onChangeText={(value) => handleGuestInput("fullName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={userData.phoneNumber}
            maxLength={10}
            onChangeText={(value) => handleGuestInput("phoneNumber", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={userData.email}
            onChangeText={(value) => handleGuestInput("email", value)}
          />
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.lightGray }]}
            placeholder="Địa chỉ"
            editable={false}
            value={userData.address}
            onChangeText={(value) => handleGuestInput("address", value)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
            {[
              { title: "Anh", value: "male" },
              { title: "Chị", value: "female" },
            ].map((item) => {
              const isSelected = userData?.gender === item.value;
              return (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      setUserData((pre) => ({ ...pre, gender: item.value }))
                    }
                    style={[
                      styles.optionContainer,
                      isSelected && styles.selectedOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.selectedRadioButton,
                      ]}
                    >
                      {isSelected && <View style={styles.selectedDot} />}
                    </View>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          {selectedOption !== "STORE_PICKUP" ? (
            <View>
              {userData.shipmentDetailID ? (
                <View style={styles.selectedShipment}>
                  <Text style={styles.selectedTitle}>Địa chỉ đã chọn:</Text>
                  <Text style={styles.selectedText}>{userData.fullName}</Text>
                  <Text style={styles.selectedText}>
                    {userData.phoneNumber}
                  </Text>
                  <Text style={styles.selectedText}>{userData.address}</Text>
                  <Text style={styles.selectedText}>{userData.email}</Text>
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  Chưa có địa chỉ nào được chọn.
                </Text>
              )}
              <TouchableOpacity
                style={styles.changeAddressButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.changeAddressText}>
                  {userData.shipmentDetailID
                    ? "Chọn địa chỉ khác"
                    : "Chọn địa chỉ giao hàng"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      );
    }
  };

  const sections = [
    {
      title: "Tóm tắt đơn hàng",
      data: cartItems,
      renderItem: ({ item, index }) => {
        return (
          <View style={styles.productItem}>
            <Image source={{ uri: item.imgAvatarPath }} style={styles.image} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>
                {item.productName} - {item.color} - {item.condition}%
              </Text>
              <Text style={styles.productQuantity}>
                Kích thước: {item.size}
              </Text>
              <Text style={styles.productQuantity}>
                Số lượng: {item.quantity}
              </Text>
              <Text style={styles.productPrice}>
                {formatCurrency(type === "buy" ? item.price : item.rentPrice)}
              </Text>
              {type === "rent" ? (
                <View>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() =>
                      setDatePickerVisibility("start" + "-" + index)
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#3366FF"
                    />
                    <Text style={styles.dateText}>
                      Ngày bắt đầu:{" "}
                      {item?.dateSelected?.start
                        ? dayjs(item?.dateSelected?.start).format("DD/MM/YYYY")
                        : "Chọn ngày"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setDatePickerVisibility("end" + "-" + index)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#3366FF"
                    />
                    <Text style={styles.dateText}>
                      Ngày kết thúc:{" "}
                      {item?.dateSelected?.end
                        ? dayjs(item?.dateSelected?.end).format("DD/MM/YYYY")
                        : "Chọn ngày"}
                    </Text>
                  </TouchableOpacity>
                  {item?.dateSelected?.start && item?.dateSelected?.end && (
                    <View style={styles.totalDaysContainer}>
                      <Ionicons name="time-outline" size={20} color="#4A5568" />
                      <Text style={styles.totalDaysText}>
                        Tổng số ngày thuê: {item?.dateSelected?.count}
                      </Text>
                    </View>
                  )}
                </View>
              ) : null}
              <Text style={styles.productTotal}>
                Tổng:{" "}
                {formatCurrency(
                  type === "buy"
                    ? item.price * item.quantity
                    : item.rentPrice *
                        item.quantity *
                        (item?.dateSelected?.count || 1)
                )}
              </Text>
            </View>
          </View>
        );
      },
    },
    {
      title: "Thông tin giao hàng",
      data: [{ key: "customerInfo" }],
      renderItem: () => renderCustomerInfo(),
    },
    {
      title: "Phương thức giao hàng",
      data: [{ key: "orderMethod" }],
      renderItem: () => (
        <View>
          <OrderMethod
            selectedProducts={selectedCartItems}
            userData={userData}
            setUserData={setUserData}
            selectedOption={selectedOption}
            handleOptionChange={handleOptionChange}
            selectedBranchId={selectedBranchId}
            setSelectedBranchId={setSelectedBranchId}
            onAddressChange={handleAddressChange}
          />
        </View>
      ),
    },
    // {
    //   title: "Phương thức thanh toán",
    //   data: [{ key: "paymentMethod" }],
    //   renderItem: () => (
    //     <PaymentMethod
    //       selectedOption={selectedPaymentMethod}
    //       handleOptionChange={setSelectedPaymentMethod}
    //     />
    //   ),
    // },

    {
      title: "Ghi chú",
      data: [{ key: "note" }],
      renderItem: () => (
        <View style={styles.sectionContainer}>
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
      ),
    },
  ];

  const renderDataSelect = (show) => {
    if (show) {
      const [key, index] = isDatePickerVisible.split("-");
      const val = cartItems[index]?.dateSelected?.[key];
      const start = cartItems[index]?.dateSelected?.start
        ? new Date(cartItems[index]?.dateSelected?.start)
        : null;
      const end = cartItems[index]?.dateSelected?.end
        ? new Date(cartItems[index]?.dateSelected?.end)
        : null;
      const today = new Date();
      const minStart =
        key === "end"
          ? start
            ? new Date(start.setDate(start.getDate() + 1))
            : new Date(today.setDate(today.getDate() + 1))
          : new Date(today.setDate(today.getDate() + 1));
      return (
        <DateTimePicker
          mode={"date"}
          onChange={handleConfirm}
          locale={"vi"}
          headerTextIOS={"Vui lòng chọn ngày"}
          value={val ? new Date(val) : new Date()}
          minimumDate={minStart}
          maximumDate={key === "start" && end ? end : null}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh toán</Text>
      </View>
      {renderDataSelect(isDatePickerVisible)}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          item.id?.toString() || item.key || index.toString()
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        renderSectionFooter={({ section }) => (
          <View style={styles.sectionSeparator} />
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(totalPrice)}
              </Text>
            </View>
            <CheckoutButton
              selectedOption={selectedOption}
              shipment={shipment}
              selectedBranchId={selectedBranchId}
              selectedPaymentMethod={selectedPaymentMethod}
              note={note}
              selectedCartItems={cartItems}
              userData={userData}
              type={type}
              dateSelected={dateSelected}
            />
          </>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.sectionListContent}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn địa chỉ giao hàng</Text>
            <FlatList
              data={shipments}
              keyExtractor={(item) => item.id?.toString() || ""}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.addressItem,
                    shipment?.id === item.id && styles.selectedAddress,
                  ]}
                  onPress={() => handleSelectShipment(item)}
                >
                  <Text style={styles.addressName}>{item.fullName}</Text>
                  <Text style={styles.addressText}>{item.address}</Text>
                  <Text style={styles.addressText}>{item.phoneNumber}</Text>
                  <Text style={styles.selectedText}>{item.email}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: COLORS.dark,
  },
  sectionListContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  sectionSeparator: {
    height: 8,
  },
  productItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  productQuantity: {
    color: COLORS.gray,
  },
  productPrice: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  productTotal: {
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.dark,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.primary,
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedAddress: {
    backgroundColor: COLORS.lightGray,
  },
  addressName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  addressText: {
    color: COLORS.gray,
    marginBottom: 2,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    marginTop: 16,
    fontSize: 16,
  },
  selectedShipment: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  selectedText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 4,
  },
  changeAddressButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  changeAddressText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  optionContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  selectedOption: {},
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#3366FF",
    fontWeight: "600",
  },
  disabledOptionText: {
    color: "#BBBBBB",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3366FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#3366FF",
    backgroundColor: "#3366FF",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  disabledRadioButton: {
    borderColor: "#BBBBBB",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4A5568",
  },
  totalDaysContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  totalDaysText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D3748",
  },
});
