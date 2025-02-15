import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const OrderCard = ({ order, onPress, renderOrderStatusButton, type }) => {
  // console.log("Rendering OrderCard with order:", order);
//   console.log("Order data:", order);
console.log("Total Amount Calculated:", order.totalAmount);
// console.log("Transport Fee:", order.transportFee);

  if (type === "rent" && order?.parentOrderCode) return <View></View>;

  const calculateTotalAmount = (order) => {
    if (type === "rent") {
      if (order.children && order.children.length > 0) {
        return order.children.reduce((total, child) => {
          const rentalDays = Math.ceil(
            (new Date(child.rentalEndDate) - new Date(child.rentalStartDate)) /
              (1000 * 60 * 60 * 24)
          );
          return total + child.rentPrice * child.quantity * rentalDays;
        }, 0);
      } else {
        const rentalDays = Math.ceil(
          (new Date(order.rentalEndDate) - new Date(order.rentalStartDate)) /
            (1000 * 60 * 60 * 24)
        );
        return order.rentPrice * order.quantity * rentalDays;
      }
    } else {
      return order.totalAmount || 0;
    }
  };

  const totalAmount = calculateTotalAmount(order);

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderInfo}>
        <Image
          source={{
            uri:
              type === "rent" &&
              Array.isArray(order.children) &&
              order.children.length > 0
                ? order.children[0]?.imgAvatarPath // Lấy ảnh từ đơn con đầu tiên
                : order.saleOrderDetailVMs?.["$values"][0]?.imgAvatarPath ||
                  order?.imgAvatarPath ||
                  "https://via.placeholder.com/100",
          }}
          style={styles.orderImage}
        />

        <View style={styles.orderDetails}>
          <Text style={styles.orderCode}>
            Mã đơn hàng: {order?.rentalOrderCode || order.saleOrderCode}
          </Text>
          <Text style={styles.orderStatus}>
            Hình thức nhận hàng: {order?.deliveryMethod}
          </Text>
          <Text style={styles.orderStatus}>
            Trạng thái: {order.orderStatus}
          </Text>
          <Text style={styles.orderStatus}>
            Trạng thái thanh toán: {order.paymentStatus}
          </Text>
          <Text style={styles.orderTotal}>
          Tổng tiền: {totalAmount.toLocaleString("vi-VN")} đ

          </Text>
        </View>
      </View>
      {renderOrderStatusButton(order)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  orderCode: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF9900",
  },
});

export default OrderCard;
