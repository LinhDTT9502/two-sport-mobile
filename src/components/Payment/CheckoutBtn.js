import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { placedOrder } from "../../services/Checkout/checkoutService";
import { rental } from "../../services/rentServices";
import {
  addGuestOrder,
  addGuestRentalOrder,
} from "../../redux/slices/guestOrderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  white: "#FFFFFF",
};

const CheckoutBtn = ({
  selectedOption,
  dateSelected,
  selectedBranchId,
  selectedCartItems,
  userData,
  discountCode,
  note,
  tranSportFee = 0,
  type,
}) => {
  // console.log("selectedCartItems:", selectedCartItems)
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (
      type === "rent" &&
      !selectedCartItems.every(
        (item) =>
          item?.dateSelected &&
          item?.dateSelected?.start &&
          item?.dateSelected?.end
      )
    ) {
      Alert.alert("Thông tin", "Chọn ngày giao và ngày kết thúc");
      setIsLoading(false);
      return;
    }

    if (selectedOption === "HOME_DELIVERY") {
      if (token && !userData?.shipmentDetailID) {
        Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
        setIsLoading(false);
        return;
      }

      if (!token) {
        if (!userData?.fullName) {
          Alert.alert("Lỗi", "Vui lòng nhập tên.");
          setIsLoading(false);
          return;
        }

        if (!userData?.address) {
          Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
          setIsLoading(false);
          return;
        }

        if (!userData?.phoneNumber) {
          Alert.alert("Lỗi", "Vui lòng nhập số điện thoại.");
          setIsLoading(false);
          return;
        } else {
          const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

          if (!phoneRegex.test(userData.phoneNumber)) {
            Alert.alert(
              "Lỗi",
              "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."
            );
            setIsLoading(false);
            return;
          }
        }
      }
    }

    const _selectedCartItems = JSON.parse(JSON.stringify(selectedCartItems));
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateOfReceipt = new Date(today);
    dateOfReceipt.setDate(today.getDate() + 3);

    console.log("check", selectedCartItems);

    const totalAmount = _selectedCartItems.reduce(
      (acc, item) =>
        acc +
        (type === "buy"
          ? item.price * item.quantity
          : item.rentPrice * item.quantity * (item?.dateSelected?.count || 1)),
      0
    );
    console.log(_selectedCartItems);
    const orderData = {
      customerInformation: {
        ...userData,
        userId: token
          ? userData.userId
            ? parseInt(userData.userId)
            : 0
          : null,
        contactPhone: userData.phoneNumber,
        gender: userData?.gender || "male",
      },
      deliveryMethod: selectedOption,
      branchId: selectedBranchId || null,
      dateOfReceipt: dateOfReceipt,
      note: note || "",
      productInformations: selectedCartItems
        ? selectedCartItems?.map((item) => ({
            ...item,
            unitPrice: item.price,
            productId: item?.id || item?.productId,
            ...(type === "rent"
              ? {
                  rentalCosts: {
                    subTotal:
                      item.rentPrice *
                      item.quantity *
                      (item?.dateSelected?.count || 1),
                    tranSportFee,
                    totalAmount:
                      item.rentPrice *
                        item.quantity *
                        (item?.dateSelected?.count || 1) +
                      tranSportFee,
                  },
                  rentalDates: {
                    dateOfReceipt: item?.dateSelected?.start,
                    rentalStartDate: item?.dateSelected?.start,
                    rentalEndDate: item?.dateSelected?.end,
                    rentalDays: item?.dateSelected?.count,
                  },
                }
              : {}),
          }))
        : [],
      ...(type === "rent"
        ? {}
        : {
            saleCosts: {
              subTotal: totalAmount,
              tranSportFee,
              totalAmount: totalAmount + tranSportFee,
            },
          }),
    };
    console.log(orderData);

    try {
      const response =
        type === "rent"
          ? await rental(orderData)
          : await placedOrder(orderData);

      if (response) {
        if (!token) {
          type === "rent"
            ? dispatch(addGuestOrder(response.data))
            : dispatch(addGuestRentalOrder(response.data));
        }
        // console.log(" handleCheckout ~ response:", response)

        // Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
        navigation.navigate("OrderSuccess", {
          id: response.data.id,
          saleOrderCode:
            response.data.saleOrderCode || response.data.rentalOrderCode,
          ...response.data, // Truyền toàn bộ dữ liệu của đơn hàng
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Lỗi", error.message || "Không thể hoàn tất đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.checkoutButton}
      onPress={handleCheckout}
      disabled={isLoading}
    >
      <Text style={styles.checkoutButtonText}>
        {isLoading ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkoutButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 2,
    alignSelf: "flex-end",

    padding: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default CheckoutBtn;
