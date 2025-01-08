import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from './OrderStatusStyle';

const OrderSection = () => {
  const navigation = useNavigation();

  const statuses = [
    { label: "Chờ xác nhận", icon: "time-outline", value: "pending", color: "#FF9900" },
    { label: "Chờ lấy hàng", icon: "cube-outline", value: "pickup", color: "#4CAF50" },
    { label: "Đang giao", icon: "bicycle-outline", value: "shipping", color: "#2196F3" },
    { label: "Đánh giá", icon: "star-outline", value: "review", color: "#9C27B0" },
  ];

  const handleStatusClick = (status) => {
    navigation.navigate("MyOrder", { status });
  };

  return (
    <View style={styles.orderSection}>
      <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
      <View style={styles.statusMenu}>
        {statuses.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.statusButton}
            onPress={() => handleStatusClick(item.value)}
          >
            <Animated.View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons
                name={item.icon}
                size={28}
                color="#FFF"
                style={styles.statusIcon}
              />
            </Animated.View>
            <Text style={styles.statusText} numberOfLines={2} ellipsizeMode="tail">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.viewAllOrders}
        onPress={() => navigation.navigate("MyOrder", { status: "all", type: 'buy' })}
      >
        <Text style={styles.viewAllOrdersText}>Xem tất cả đơn hàng</Text>
        <Ionicons name="chevron-forward" size={20} color="#FF9900" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewAllOrders}
        onPress={() => navigation.navigate("MyOrder", { status: "all", type: 'rent' })}
      >
        <Text style={styles.viewAllOrdersText}>Xem tất cả đơn thuê</Text>
        <Ionicons name="chevron-forward" size={20} color="#FF9900" />
      </TouchableOpacity>
    </View>
  );
};

export default OrderSection;

