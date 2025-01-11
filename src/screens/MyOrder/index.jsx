import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserOrders } from "../../services/userOrderService";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import OrderCard from "../../components/Profile/OrderCard";
import StatusTabs from "../../components/Profile/StatusTabs";
import {
  selectGuestOrders,
  selectGuestRentalOrders,
} from "../../redux/slices/guestOrderSlice";
import { getListRent } from "../../api/apiRent";
import { selectUser } from "../../redux/slices/authSlice";

const MyOrder = ({ route }) => {
  const { type } = route.params;
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const guestOrders = useSelector(selectGuestOrders) || [];
  const guestRentals = useSelector(selectGuestRentalOrders) || [];
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState("asc");
  const statusList = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Chờ xử lý", value: "Chờ xử lý" },
    { label: "Đã xác nhận", value: "Đã xác nhận" },
    { label: "Đã giao cho ĐVVC", value: "Đã giao cho ĐVVC" },
    { label: "Đã giao hàng", value: "Đã giao hàng" },

    { label: "Đã hoàn thành", value: "Đã hoàn thành" },

    { label: "Đã hủy", value: "Đã hủy" },
  ];

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrders();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể làm mới danh sách đơn hàng.");
    } finally {
      setRefreshing(false);
    }
  };

  const openProductModal = (product) => {
    // setSelectedProduct(product);
    // setProductModalOpen(true);
    navigation.navigate("SelectPayment", {
      order: {
        ...product,
        children: orders?.filter(
          (item) => item?.parentOrderCode === product.rentalOrderCode
        ),
      },
    });
  };

  const closeProductModal = () => setProductModalOpen(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        const ordersData = type === "rent" ? guestRentals : guestOrders;
        setOrders(
          type === "rent"
            ? ordersData?.data?.data?.["$values"]?.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }) || []
            : ordersData
        );
        console.log(ordersData);
      } else {
        let userId = user?.UserId;
        if (!userId) {
          userId = await AsyncStorage.getItem("userId");
        }

        if (!userId) {
          throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
        }

        const ordersData =
          type === "rent"
            ? await getListRent(userId, token)
            : await fetchUserOrders(userId, token);
        setOrders(
          type === "rent"
            ? ordersData?.data?.data?.["$values"]?.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }) || []
            : ordersData
        );
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message || "Không thể tải đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [type]);

  const filteredOrders =
    selectedStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.orderStatus === selectedStatus);

  const renderOrderStatusButton = (order) => {
    if (
      order.paymentStatus === "IsWating" &&
      order.deliveryMethod !== "HOME_DELIVERY"
    ) {
      return (
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            navigation.navigate("PlacedOrder", { selectedOrder: order })
          }
        >
          <Text style={styles.checkoutText}>Thanh Toán</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderOrderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => openProductModal(item)}
      renderOrderStatusButton={renderOrderStatusButton}
      type={type}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Text style={styles.headerTitle}>Trạng thái đơn hàng</Text>
          <TouchableOpacity
            onPress={() => setSort((pre) => (pre === "asc" ? "desc" : "asc"))}
            style={styles.backButton}
          >
            <Text style={styles.headerTitle}>
              {sort === "asc" ? "Mới nhất" : "Cũ nhất"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusTabs
        statusList={statusList}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9900" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : orders?.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: "#333", fontSize: 16 }}>Không có sản phẩm</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders?.sort((a, b) => {
            if (sort === "asc") {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
          })}
          keyExtractor={(item) =>
            item?.orderId?.toString() ||
            item?.cartItemId?.toString() ||
            item?.id
          }
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <Modal visible={isProductModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={closeProductModal}
              style={styles.closeIcon}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.productName}>
              {selectedProduct?.productName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SelectPayment", {
                  order: selectedProduct,
                });
                closeProductModal();
              }}
              style={styles.closeIcon}
            >
              Thanh toán
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderList: {
    paddingVertical: 12,
  },
  checkoutButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyOrder;
